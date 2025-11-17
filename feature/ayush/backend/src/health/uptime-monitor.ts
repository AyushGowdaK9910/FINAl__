/**
 * CON-9: Uptime Monitor
 * Tracks and monitors service uptime
 */

export class UptimeMonitor {
  private startTime: number;
  private lastCheck: number;
  private checks: number = 0;
  private failures: number = 0;

  constructor() {
    this.startTime = Date.now();
    this.lastCheck = Date.now();
  }

  /**
   * Record a health check
   */
  recordCheck(success: boolean): void {
    this.checks++;
    this.lastCheck = Date.now();
    if (!success) {
      this.failures++;
    }
  }

  /**
   * Get uptime in seconds
   */
  getUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Get uptime percentage
   */
  getUptimePercentage(): number {
    if (this.checks === 0) return 100;
    return ((this.checks - this.failures) / this.checks) * 100;
  }

  /**
   * Get statistics
   */
  getStats() {
    return {
      uptime: this.getUptime(),
      uptimePercentage: this.getUptimePercentage(),
      totalChecks: this.checks,
      failures: this.failures,
      successRate: this.checks > 0 ? ((this.checks - this.failures) / this.checks) * 100 : 100,
      startTime: new Date(this.startTime).toISOString(),
      lastCheck: new Date(this.lastCheck).toISOString(),
    };
  }

  /**
   * Reset monitor
   */
  reset(): void {
    this.startTime = Date.now();
    this.checks = 0;
    this.failures = 0;
  }
}

