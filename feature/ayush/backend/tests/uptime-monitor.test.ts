/**
 * CON-9: Uptime Monitor Tests
 */

import { UptimeMonitor } from '../src/health/uptime-monitor';

describe('UptimeMonitor', () => {
  let monitor: UptimeMonitor;

  beforeEach(() => {
    monitor = new UptimeMonitor();
  });

  test('should initialize with start time', () => {
    const stats = monitor.getStats();
    expect(stats.startTime).toBeDefined();
    expect(typeof stats.startTime).toBe('string');
    expect(new Date(stats.startTime).getTime()).toBeGreaterThan(0);
  });

  test('should record health checks', () => {
    monitor.recordCheck(true);
    monitor.recordCheck(true);
    monitor.recordCheck(false);

    const stats = monitor.getStats();
    expect(stats.totalChecks).toBe(3);
    expect(stats.failures).toBe(1);
  });

  test('should calculate uptime percentage', () => {
    monitor.recordCheck(true);
    monitor.recordCheck(true);
    monitor.recordCheck(true);

    const percentage = monitor.getUptimePercentage();
    expect(percentage).toBe(100);
  });

  test('should calculate uptime in seconds', () => {
    const uptime = monitor.getUptime();
    expect(uptime).toBeGreaterThanOrEqual(0);
    expect(typeof uptime).toBe('number');
  });

  test('should reset statistics', () => {
    monitor.recordCheck(true);
    monitor.recordCheck(false);
    monitor.reset();

    const stats = monitor.getStats();
    expect(stats.totalChecks).toBe(0);
    expect(stats.failures).toBe(0);
  });
});

