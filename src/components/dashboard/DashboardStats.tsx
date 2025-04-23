import { Home, Eye, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';

interface StatsProps {
  stats: {
    totalListings: number;
    activeListings: number;
    pendingListings: number;
    totalViews: number;
    totalInquiries: number;
    revenueGenerated: number;
  };
}

const DashboardStats = ({ stats }: StatsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-rose-100 flex items-center justify-center">
            <Home className="h-6 w-6 text-rose-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Total Listings</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalListings}</p>
              <div className="ml-2 flex items-baseline text-sm font-medium">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {Math.round(stats.activeListings / stats.totalListings * 100)}% active
                </span>
              </div>
            </div>
            <div className="mt-1 flex space-x-4">
              <span className="text-sm text-gray-500">
                Active: <span className="font-medium text-gray-900">{stats.activeListings}</span>
              </span>
              <span className="text-sm text-gray-500">
                Pending: <span className="font-medium text-gray-900">{stats.pendingListings}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
            <Eye className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Total Views</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalViews}</p>
              <div className="ml-2 flex items-baseline text-sm font-medium">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  12% increase
                </span>
              </div>
            </div>
            <div className="mt-1">
              <span className="text-sm text-gray-500">
                Avg. {Math.round(stats.totalViews / stats.totalListings)} views per listing
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-green-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Total Inquiries</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalInquiries}</p>
              <div className="ml-2 flex items-baseline text-sm font-medium">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  8% increase
                </span>
              </div>
            </div>
            <div className="mt-1">
              <span className="text-sm text-gray-500">
                Conversion rate: {Math.round(stats.totalInquiries / stats.totalViews * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <DollarSign className="h-6 w-6 text-purple-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Generated</h3>
            <div className="mt-1 flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">${stats.revenueGenerated}</p>
              <div className="ml-2 flex items-baseline text-sm font-medium">
                <span className="text-green-600 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  15% increase
                </span>
              </div>
            </div>
            <div className="mt-1">
              <span className="text-sm text-gray-500">
                From bookings and premium listings
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
