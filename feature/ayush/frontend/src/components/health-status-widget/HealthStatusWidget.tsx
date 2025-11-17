/**
 * CON-9, CON-12: Health Status Widget
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  uptime?: number;
  timestamp?: string;
}

export const HealthStatusWidget: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    try {
      const response = await axios.get<HealthStatus>(`${API_URL}/api/health/detailed`);
      setHealth(response.data);
    } catch (error) {
      setHealth({ status: 'down' });
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
    return <div className="text-sm text-gray-500">Checking health...</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${getStatusColor(health?.status)}`}></div>
      <div className="text-sm">
        <span className="font-semibold capitalize">{health?.status || 'Unknown'}</span>
        {health?.uptime && (
          <span className="text-gray-500 ml-2">({formatUptime(health.uptime)})</span>
        )}
      </div>
    </div>
  );
};

