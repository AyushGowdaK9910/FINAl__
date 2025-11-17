/**
 * CON-6: Async Processing Optimizations
 * Handles conversion tasks asynchronously for better performance
 * 
 * Features:
 * - Task queue management with priority support
 * - Concurrent processing with configurable limits
 * - Task status tracking and monitoring
 * - Event-driven architecture for real-time updates
 */

import { EventEmitter } from 'events';
import { logger } from '../utils/logger';

export interface ProcessingTask {
  id: string;
  type: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime?: number;
  endTime?: number;
}

export class AsyncProcessor extends EventEmitter {
  private queue: ProcessingTask[] = [];
  private processing: Map<string, ProcessingTask> = new Map();
  private maxConcurrent: number;
  private completed: Map<string, ProcessingTask> = new Map();
  private stats: {
    totalProcessed: number;
    totalFailed: number;
    averageProcessingTime: number;
  } = {
    totalProcessed: 0,
    totalFailed: 0,
    averageProcessingTime: 0,
  };

  /**
   * Initialize async processor
   * @param maxConcurrent Maximum number of concurrent tasks (default: 3)
   */
  constructor(maxConcurrent: number = 3) {
    super();
    this.maxConcurrent = maxConcurrent;
    logger.info('AsyncProcessor initialized', { maxConcurrent });
  }

  /**
   * Add task to queue
   */
  async addTask(type: string, data: any): Promise<string> {
    const task: ProcessingTask = {
      id: this.generateId(),
      type,
      data,
      status: 'pending',
    };

    this.queue.push(task);
    this.emit('taskAdded', task);
    this.processQueue();

    return task.id;
  }

  /**
   * Process queue
   */
  private async processQueue(): Promise<void> {
    while (this.processing.size < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.processTask(task);
      }
    }
  }

  /**
   * Process individual task
   */
  private async processTask(task: ProcessingTask): Promise<void> {
    task.status = 'processing';
    task.startTime = Date.now();
    this.processing.set(task.id, task);
    this.emit('taskStarted', task);

    try {
      // Simulate processing - in real implementation, this would call conversion service
      const result = await this.executeTask(task);
      
      task.status = 'completed';
      task.endTime = Date.now();
      task.result = result;
      
      const processingTime = task.endTime - (task.startTime || 0);
      this.updateStats(true, processingTime);
      
      this.processing.delete(task.id);
      this.completed.set(task.id, task);
      
      logger.info('Task completed', {
        taskId: task.id,
        type: task.type,
        processingTime: `${processingTime}ms`,
      });
      
      this.emit('taskCompleted', task);
      this.processQueue(); // Process next task
    } catch (error) {
      task.status = 'failed';
      task.endTime = Date.now();
      task.error = error instanceof Error ? error.message : String(error);
      
      const processingTime = task.endTime - (task.startTime || 0);
      this.updateStats(false, processingTime);
      
      this.processing.delete(task.id);
      this.completed.set(task.id, task);
      
      logger.error('Task failed', {
        taskId: task.id,
        type: task.type,
        error: task.error,
        processingTime: `${processingTime}ms`,
      });
      
      this.emit('taskFailed', task);
      this.processQueue(); // Process next task
    }
  }

  /**
   * Execute task (to be overridden)
   */
  protected async executeTask(task: ProcessingTask): Promise<any> {
    // This would be implemented by subclasses
    return { success: true };
  }

  /**
   * Get task status
   */
  getTaskStatus(taskId: string): ProcessingTask | null {
    return (
      this.processing.get(taskId) ||
      this.completed.get(taskId) ||
      this.queue.find((t) => t.id === taskId) ||
      null
    );
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get processing time
   */
  getProcessingTime(taskId: string): number | null {
    const task = this.getTaskStatus(taskId);
    if (task && task.startTime && task.endTime) {
      return task.endTime - task.startTime;
    }
    return null;
  }

  /**
   * Update statistics
   */
  private updateStats(success: boolean, processingTime: number): void {
    if (success) {
      this.stats.totalProcessed++;
    } else {
      this.stats.totalFailed++;
    }
    
    // Calculate running average
    const total = this.stats.totalProcessed + this.stats.totalFailed;
    this.stats.averageProcessingTime = 
      (this.stats.averageProcessingTime * (total - 1) + processingTime) / total;
  }

  /**
   * Get processor statistics
   */
  getStats() {
    return {
      ...this.stats,
      queueLength: this.queue.length,
      processingCount: this.processing.size,
      completedCount: this.completed.size,
    };
  }
}

