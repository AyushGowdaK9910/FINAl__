/**
 * CON-9: Uptime Monitoring Service
 * 
 * Features:
 * - Implement UptimeMonitor class
 * - Track service start time
 * - Calculate uptime statistics
 * - Record health check results
 */

interface HealthCheckResult {
  timestamp: number;
  status: 'ok' | 'degraded' | 'down';
  responseTime: number;
}

interface UptimeStatistics {
  totalUptime: number;
  formattedUptime: string;
  startTime: Date;
  currentTime: Date;
  uptimePercentage: number;
  totalChecks: number;
  successfulChecks: number;
  failedChecks: number;
  averageResponseTime: number;
}

/**
 * UptimeMonitor class
 * Tracks service start time and calculates uptime statistics
 */
export class UptimeMonitor {
  private startTime: number;
  private healthCheckHistory: HealthCheckResult[] = [];
  private readonly maxHistorySize: number = 1000;

  constructor() {
    // Track service start time
    this.startTime = Date.now();
  }

  /**
   * Record health check result
   * Record health check results for statistics
   */
  recordHealthCheck(status: 'ok' | 'degraded' | 'down', responseTime: number): void {
    const result: HealthCheckResult = {
      timestamp: Date.now(),
      status,
      responseTime,
    };

    this.healthCheckHistory.push(result);

    // Keep only recent history to prevent memory issues
    if (this.healthCheckHistory.length > this.maxHistorySize) {
      this.healthCheckHistory.shift();
    }
  }

  /**
   * Calculate uptime statistics
   * Calculate uptime statistics including percentage and formatted display
   */
  getStatistics(): UptimeStatistics {
    const currentTime = Date.now();
    const totalUptime = Math.floor((currentTime - this.startTime) / 1000);

    // Format uptime
    const hours = Math.floor(totalUptime / 3600);
    const minutes = Math.floor((totalUptime % 3600) / 60);
    const seconds = totalUptime % 60;
    const formattedUptime = `${hours}h ${minutes}m ${seconds}s`;

    // Calculate statistics from health check history
    const totalChecks = this.healthCheckHistory.length;
    const successfulChecks = this.healthCheckHistory.filter(
      (check) => check.status === 'ok'
    ).length;
    const failedChecks = totalChecks - successfulChecks;

    // Calculate uptime percentage (based on successful checks)
    const uptimePercentage =
      totalChecks > 0 ? (successfulChecks / totalChecks) * 100 : 100;

    // Calculate average response time
    const averageResponseTime =
      this.healthCheckHistory.length > 0
        ? this.healthCheckHistory.reduce((sum, check) => sum + check.responseTime, 0) /
          this.healthCheckHistory.length
        : 0;

    return {
      totalUptime,
      formattedUptime,
      startTime: new Date(this.startTime),
      currentTime: new Date(currentTime),
      uptimePercentage: Math.round(uptimePercentage * 100) / 100,
      totalChecks,
      successfulChecks,
      failedChecks,
      averageResponseTime: Math.round(averageResponseTime * 100) / 100,
    };
  }

  /**
   * Get service start time
   */
  getStartTime(): Date {
    return new Date(this.startTime);
  }

  /**
   * Get current uptime in seconds
   */
  getCurrentUptime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * Reset monitor (for testing purposes)
   */
  reset(): void {
    this.startTime = Date.now();
    this.healthCheckHistory = [];
  }
}

// Export singleton instance
export const uptimeMonitor = new UptimeMonitor();
