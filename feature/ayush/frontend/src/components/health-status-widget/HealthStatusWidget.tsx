/**
 * CON-9: Health Status Widget
 * 
 * Features:
 * - Build health status indicator component
 * - Add real-time health checking
 * - Display service status with color coding
 * - Show uptime information
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  uptime?: number;
  timestamp?: string;
  services?: {
    database?: 'ok' | 'degraded' | 'down';
    storage?: 'ok' | 'degraded' | 'down';
  };
}

export const HealthStatusWidget: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  useEffect(() => {
    fetchHealth();
    // Add real-time health checking - check every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await axios.get<HealthStatus>(`${API_URL}/api/health/detailed`);
      setHealth(response.data);
      setLastCheck(new Date());
    } catch (error) {
      setHealth({ status: 'down' });
      setLastCheck(new Date());
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500';
      case 'degraded':
        return 'bg-yellow-500';
      case 'down':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatUptime = (seconds?: number) => {
    if (!seconds) return 'N/A';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="w-3 h-3 rounded-full bg-gray-300 animate-pulse"></div>
        <span>Checking health...</span>
      </div>
    );
  }

  // Display service status with color coding
  return (
    <div className="bg-white rounded-lg shadow-sm border p-3">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor(health?.status)} animate-pulse`}></div>
        <span className="font-semibold capitalize text-gray-800">
          {health?.status || 'Unknown'}
        </span>
      </div>
      
      {/* Show uptime information */}
      {health?.uptime && (
        <div className="text-xs text-gray-600">
          Uptime: {formatUptime(health.uptime)}
        </div>
      )}
      
      {/* Service-level status indicators */}
      {health?.services && Object.keys(health.services).length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Services:</div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(health.services).map(([service, status]) => (
              <div key={service} className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}></div>
                <span className="text-xs text-gray-600 capitalize">{service}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {lastCheck && (
        <div className="text-xs text-gray-400 mt-2">
          Last check: {lastCheck.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

