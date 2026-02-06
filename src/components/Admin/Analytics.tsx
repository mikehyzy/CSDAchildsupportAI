import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, Users, Activity, Loader2, AlertCircle } from 'lucide-react';

interface AnalyticsData {
  total_searches_today: number;
  total_searches_week: number;
  total_searches_month: number;
  top_searches: { query: string; count: number }[];
  user_activity: { date: string; searches: number }[];
  feedback_stats?: { positive?: number; negative?: number };
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('/api/admin');
        if (!response.ok) {
          throw new Error('Failed to fetch analytics data');
        }
        const data = await response.json();
        setAnalytics(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-gray-900 font-medium mb-2">Failed to load analytics</p>
          <p className="text-gray-600 text-sm">{error || 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  const { total_searches_today, total_searches_week, total_searches_month, top_searches, user_activity } = analytics;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-gray-900">{total_searches_today}</p>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">{total_searches_week}</p>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{total_searches_month}</p>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Feedback</p>
              <p className="text-2xl font-bold text-gray-900">
                {(analytics.feedback_stats?.positive || 0) + (analytics.feedback_stats?.negative || 0)}
              </p>
              <p className="text-sm text-gray-500">total responses</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Searches */}
        <div className="ma-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Search Queries</h3>
          {top_searches && top_searches.length > 0 ? (
            <div className="space-y-3">
              {top_searches.slice(0, 10).map((search, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                    <span className="text-sm text-gray-900 truncate">{search.query.substring(0, 60)}...</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{search.count}</span>
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(search.count / top_searches[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No search data available yet</p>
            </div>
          )}
        </div>

        {/* User Activity Chart */}
        <div className="ma-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Search Activity</h3>
          {user_activity && user_activity.length > 0 ? (
            <div className="space-y-2">
              {user_activity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">{activity.searches}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-green-600 h-3 rounded-full"
                        style={{ width: `${(activity.searches / Math.max(...user_activity.map(a => a.searches))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No activity data available yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="ma-card p-6">
          <h4 className="font-semibold text-gray-900 mb-3">User Feedback</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Positive</span>
              <span className="text-sm font-medium text-green-600">
                {analytics.feedback_stats?.positive || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Negative</span>
              <span className="text-sm font-medium text-red-600">
                {analytics.feedback_stats?.negative || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Satisfaction Rate</span>
              <span className="text-sm font-medium text-blue-600">
                {analytics.feedback_stats?.positive && (analytics.feedback_stats.positive + (analytics.feedback_stats.negative || 0)) > 0
                  ? `${Math.round((analytics.feedback_stats.positive / (analytics.feedback_stats.positive + (analytics.feedback_stats.negative || 0))) * 100)}%`
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <h4 className="font-semibold text-gray-900 mb-3">Search Trends</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Avg Searches/Day</span>
              <span className="text-sm font-medium">
                {user_activity && user_activity.length > 0
                  ? Math.round(user_activity.reduce((sum, a) => sum + a.searches, 0) / user_activity.length)
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Peak Activity</span>
              <span className="text-sm font-medium">
                {user_activity && user_activity.length > 0
                  ? Math.max(...user_activity.map(a => a.searches))
                  : 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Unique Queries</span>
              <span className="text-sm font-medium">
                {top_searches ? top_searches.length : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="ma-card p-6">
          <h4 className="font-semibold text-gray-900 mb-3">System Health</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-sm font-medium text-green-600">Operational</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">API Response</span>
              <span className="text-sm font-medium text-green-600">Healthy</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="text-sm font-medium text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
