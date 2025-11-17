/**
 * CON-8: Home Page with Fast Conversion UX
 */

import React, { useState } from 'react';
import { FileUpload } from '../../components/file-upload/FileUpload';
import { Downloader } from '../../components/downloader/Downloader';
import { ProgressLoader } from '../../components/progress-loader/ProgressLoader';

export const HomePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'download'>('upload');
  const [converting, setConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);

  // Simulate conversion progress (CON-8: Fast UX)
  const simulateConversion = () => {
    setConverting(true);
    setConversionProgress(0);

    const interval = setInterval(() => {
      setConversionProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setConverting(false);
            setConversionProgress(0);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200); // Fast updates for better UX
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">File Converter</h1>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-6 py-2 rounded ${
                activeTab === 'upload'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab('download')}
              className={`px-6 py-2 rounded ${
                activeTab === 'download'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Download
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'upload' && (
            <div>
              <FileUpload />
              {converting && (
                <div className="mt-6">
                  <ProgressLoader
                    progress={conversionProgress}
                    message="Converting file..."
                  />
                </div>
              )}
              {!converting && (
                <button
                  onClick={simulateConversion}
                  className="mt-4 w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
                >
                  Start Conversion (Demo)
                </button>
              )}
            </div>
          )}

          {activeTab === 'download' && <Downloader />}
        </div>
      </div>
    </div>
  );
};

