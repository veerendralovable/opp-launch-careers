
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, Zap, AlertCircle } from 'lucide-react';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  memoryUsage?: number;
  connectionType?: string;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collectMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const paint = performance.getEntriesByType('paint');
      
      const newMetrics: PerformanceMetrics = {
        pageLoadTime: navigation.loadEventEnd - navigation.navigationStart,
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
      };

      // First Contentful Paint
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) {
        newMetrics.firstContentfulPaint = fcp.startTime;
      }

      // Memory usage (if available)
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        newMetrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
      }

      // Connection info (if available)
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        newMetrics.connectionType = connection.effectiveType;
      }

      setMetrics(newMetrics);
      setLoading(false);
    };

    // Wait for page to fully load
    if (document.readyState === 'complete') {
      collectMetrics();
    } else {
      window.addEventListener('load', collectMetrics);
    }

    return () => {
      window.removeEventListener('load', collectMetrics);
    };
  }, []);

  const getPerformanceScore = (metric: number, thresholds: [number, number]) => {
    if (metric <= thresholds[0]) return { score: 'good', color: 'text-green-600' };
    if (metric <= thresholds[1]) return { score: 'needs-improvement', color: 'text-yellow-600' };
    return { score: 'poor', color: 'text-red-600' };
  };

  const formatTime = (milliseconds: number) => {
    if (milliseconds < 1000) return `${Math.round(milliseconds)}ms`;
    return `${(milliseconds / 1000).toFixed(2)}s`;
  };

  if (loading || !metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Collecting performance metrics...</div>
        </CardContent>
      </Card>
    );
  }

  const loadTimeScore = getPerformanceScore(metrics.pageLoadTime, [2000, 4000]);
  const fcpScore = metrics.firstContentfulPaint 
    ? getPerformanceScore(metrics.firstContentfulPaint, [1800, 3000])
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Page Load Time</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-sm ${loadTimeScore.color}`}>
                  {formatTime(metrics.pageLoadTime)}
                </span>
                <Badge variant={loadTimeScore.score === 'good' ? 'default' : 'secondary'}>
                  {loadTimeScore.score === 'good' ? 'Good' : 
                   loadTimeScore.score === 'needs-improvement' ? 'Fair' : 'Poor'}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">DOM Ready</span>
              </div>
              <span className="text-sm">{formatTime(metrics.domContentLoaded)}</span>
            </div>

            {metrics.firstContentfulPaint && fcpScore && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">First Paint</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${fcpScore.color}`}>
                    {formatTime(metrics.firstContentfulPaint)}
                  </span>
                  <Badge variant={fcpScore.score === 'good' ? 'default' : 'secondary'}>
                    {fcpScore.score === 'good' ? 'Good' : 
                     fcpScore.score === 'needs-improvement' ? 'Fair' : 'Poor'}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            {metrics.memoryUsage && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Memory Usage</span>
                <span className="text-sm">{metrics.memoryUsage.toFixed(1)} MB</span>
              </div>
            )}

            {metrics.connectionType && (
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection</span>
                <Badge variant="outline">{metrics.connectionType}</Badge>
              </div>
            )}

            <div className="flex items-center justify-between">
              <span className="text-sm">Protocol</span>
              <Badge variant="outline">
                {window.location.protocol === 'https:' ? 'HTTPS' : 'HTTP'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
          <strong>Performance Tips:</strong>
          <ul className="mt-1 space-y-1 text-xs">
            <li>• Page load time should be under 2 seconds</li>
            <li>• First Contentful Paint should be under 1.8 seconds</li>
            <li>• Monitor memory usage on complex pages</li>
            <li>• Use HTTPS for security and performance benefits</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;
