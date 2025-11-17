/**
 * CON-4: Log Table Component
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface LogEntry {
  timestamp?: string;
  level?: string;
  message?: string;
  service?: string;
  [key: string]: any;
}

interface LogTableProps {
  filename: string;
}

export const LogTable: React.FC<LogTableProps> = ({ filename }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [levelFilter, setLevelFilter] = useState<string>('all');

  useEffect(() => {
    fetchLogs();
  }, [filename, levelFilter]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const params: any = { lines: 100 };
      if (levelFilter !== 'all') {
        params.level = levelFilter;
      }
      const response = await axios.get(`${API_URL}/api/logs/${filename}`, { params });
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (err) {
      setError('Failed to fetch logs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800';
      case 'info':
        return 'bg-blue-100 text-blue-800';
      case 'debug':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <div className="p-4">Loading logs...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        <h3 className="text-lg font-semibold">Log Entries: {filename}</h3>
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="border rounded px-3 py-1"
        >
          <option value="all">All Levels</option>
          <option value="error">Error</option>
          <option value="warn">Warning</option>
          <option value="info">Info</option>
          <option value="debug">Debug</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Service
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {logs.map((log, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.timestamp || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(
                      log.level
                    )}`}
                  >
                    {log.level || 'N/A'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {log.message || JSON.stringify(log)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {log.service || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {logs.length === 0 && (
        <div className="p-4 text-center text-gray-500">No logs found</div>
      )}
    </div>
  );
};

