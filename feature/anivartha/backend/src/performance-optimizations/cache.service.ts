/**
 * CON-6: Conversion Cache Service
 * Implements file hash-based caching to reduce redundant conversions
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { logger } from '../utils/logger';

export interface CacheEntry {
  hash: string;
  outputPath: string;
  createdAt: number;
  lastAccessed: number;
  accessCount: number;
  fileSize: number;
}

export class CacheService {
  private cacheDir: string;
  private cacheIndex: Map<string, CacheEntry> = new Map();
  private maxCacheSize: number; // in bytes
  private maxCacheAge: number; // in milliseconds (default: 24 hours)

  constructor(
    cacheDir: string = './cache',
    maxCacheSize: number = 1024 * 1024 * 1024, // 1GB
    maxCacheAge: number = 24 * 60 * 60 * 1000 // 24 hours
  ) {
    this.cacheDir = cacheDir;
    this.maxCacheSize = maxCacheSize;
    this.maxCacheAge = maxCacheAge;
  }

  /**
   * Initialize cache directory
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
      await this.loadCacheIndex();
      logger.info('Cache service initialized', { cacheDir: this.cacheDir });
    } catch (error) {
      logger.error('Failed to initialize cache', { error });
      throw error;
    }
  }

  /**
   * Generate file hash for cache key
   * Uses file hash-based caching to identify identical files
   */
  async generateFileHash(filePath: string): Promise<string> {
    try {
      const fileBuffer = await fs.readFile(filePath);
      const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
      return hash;
    } catch (error) {
      logger.error('Failed to generate file hash', { filePath, error });
      throw error;
    }
  }

  /**
   * Generate cache key from conversion parameters
   */
  generateCacheKey(fileHash: string, sourceFormat: string, targetFormat: string): string {
    return `${fileHash}_${sourceFormat}_${targetFormat}`;
  }

  /**
   * Get cached conversion result
   * Returns cached output path if available and valid
   */
  async getCached(fileHash: string, sourceFormat: string, targetFormat: string): Promise<string | null> {
    const cacheKey = this.generateCacheKey(fileHash, sourceFormat, targetFormat);
    const entry = this.cacheIndex.get(cacheKey);

    if (!entry) {
      return null;
    }

    // Check if cache entry is expired
    const age = Date.now() - entry.createdAt;
    if (age > this.maxCacheAge) {
      await this.invalidateCache(cacheKey);
      return null;
    }

    // Check if cached file still exists
    try {
      await fs.access(entry.outputPath);
      
      // Update access statistics
      entry.lastAccessed = Date.now();
      entry.accessCount++;
      this.cacheIndex.set(cacheKey, entry);
      
      logger.debug('Cache hit', { cacheKey, accessCount: entry.accessCount });
      return entry.outputPath;
    } catch {
      // File doesn't exist, remove from cache
      await this.invalidateCache(cacheKey);
      return null;
    }
  }

  /**
   * Store conversion result in cache
   */
  async setCached(
    fileHash: string,
    sourceFormat: string,
    targetFormat: string,
    outputPath: string
  ): Promise<void> {
    const cacheKey = this.generateCacheKey(fileHash, sourceFormat, targetFormat);
    
    try {
      const stats = await fs.stat(outputPath);
      const entry: CacheEntry = {
        hash: fileHash,
        outputPath,
        createdAt: Date.now(),
        lastAccessed: Date.now(),
        accessCount: 1,
        fileSize: stats.size,
      };

      this.cacheIndex.set(cacheKey, entry);
      await this.saveCacheIndex();
      
      // Check cache size and evict if necessary
      await this.evictIfNeeded();
      
      logger.info('Cached conversion result', { cacheKey, fileSize: stats.size });
    } catch (error) {
      logger.error('Failed to cache conversion result', { cacheKey, error });
    }
  }

  /**
   * Invalidate cache entry
   */
  async invalidateCache(cacheKey: string): Promise<void> {
    const entry = this.cacheIndex.get(cacheKey);
    if (entry) {
      try {
        await fs.unlink(entry.outputPath).catch(() => {
          // Ignore if file doesn't exist
        });
      } catch (error) {
        logger.warn('Failed to delete cached file', { cacheKey, error });
      }
      this.cacheIndex.delete(cacheKey);
      await this.saveCacheIndex();
      logger.debug('Cache invalidated', { cacheKey });
    }
  }

  /**
   * Evict old cache entries if cache size exceeds limit
   */
  private async evictIfNeeded(): Promise<void> {
    let totalSize = 0;
    const entries = Array.from(this.cacheIndex.values());
    
    for (const entry of entries) {
      totalSize += entry.fileSize;
    }

    if (totalSize > this.maxCacheSize) {
      // Sort by last accessed time (LRU)
      entries.sort((a, b) => a.lastAccessed - b.lastAccessed);
      
      // Evict oldest entries until under limit
      for (const entry of entries) {
        if (totalSize <= this.maxCacheSize) {
          break;
        }
        
        const cacheKey = this.generateCacheKey(entry.hash, '', '');
        await this.invalidateCache(cacheKey);
        totalSize -= entry.fileSize;
      }
      
      logger.info('Cache eviction completed', { 
        remainingSize: totalSize,
        maxSize: this.maxCacheSize 
      });
    }
  }

  /**
   * Load cache index from disk
   */
  private async loadCacheIndex(): Promise<void> {
    const indexPath = path.join(this.cacheDir, 'index.json');
    try {
      const data = await fs.readFile(indexPath, 'utf-8');
      const index = JSON.parse(data);
      this.cacheIndex = new Map(Object.entries(index));
      logger.debug('Cache index loaded', { entries: this.cacheIndex.size });
    } catch {
      // Index doesn't exist yet, start fresh
      this.cacheIndex = new Map();
    }
  }

  /**
   * Save cache index to disk
   */
  private async saveCacheIndex(): Promise<void> {
    const indexPath = path.join(this.cacheDir, 'index.json');
    const index = Object.fromEntries(this.cacheIndex);
    await fs.writeFile(indexPath, JSON.stringify(index, null, 2), 'utf-8');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    let totalSize = 0;
    let totalEntries = 0;
    
    for (const entry of this.cacheIndex.values()) {
      totalSize += entry.fileSize;
      totalEntries++;
    }

    return {
      totalEntries,
      totalSize,
      maxSize: this.maxCacheSize,
      utilization: (totalSize / this.maxCacheSize * 100).toFixed(2) + '%',
    };
  }

  /**
   * Clear all cache
   */
  async clearCache(): Promise<void> {
    for (const cacheKey of this.cacheIndex.keys()) {
      await this.invalidateCache(cacheKey);
    }
    logger.info('Cache cleared');
  }
}

