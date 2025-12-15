import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  UsersIcon, 
  DocumentTextIcon, 
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  UserGroupIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardInfo();
  }, []);

  const loadDashboardInfo = async () => {
    try {
      const [statsResponse, activitiesResponse] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getActivities(8)
      ]);

      setDashboardData(statsResponse.data.data);
      setRecentActivities(activitiesResponse.data.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statItems = [
    {
      title: 'Total Residents',
      value: dashboardData?.residents?.total || 0,
      icon: UsersIcon,
      bgColor: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgLight: 'bg-blue-50'
    },
    {
      title: 'Active Residents',
      value: dashboardData?.residents?.active || 0,
      icon: CheckCircleIcon,
      bgColor: 'bg-green-500',
      textColor: 'text-green-600',
      bgLight: 'bg-green-50'
    },
    {
      title: 'Registered Voters',
      value: dashboardData?.residents?.voters || 0,
      icon: IdentificationIcon,
      bgColor: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgLight: 'bg-purple-50'
    },
    {
      title: 'Senior Citizens',
      value: dashboardData?.residents?.seniors || 0,
      icon: UserGroupIcon,
      bgColor: 'bg-orange-500',
      textColor: 'text-orange-600',
      bgLight: 'bg-orange-50'
    },
    {
      title: 'Total Certificates',
      value: dashboardData?.certificates?.total || 0,
      icon: DocumentTextIcon,
      bgColor: 'bg-indigo-500',
      textColor: 'text-indigo-600',
      bgLight: 'bg-indigo-50'
    },
    {
      title: 'Pending Requests',
      value: dashboardData?.requests?.pending || 0,
      icon: ClipboardDocumentListIcon,
      bgColor: 'bg-red-500',
      textColor: 'text-red-600',
      bgLight: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statItems.map((stat, index) => (
          <div key={index} className="card hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                <p className="text-4xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgLight} p-4 rounded-xl`}>
                <stat.icon className={`h-8 w-8 ${stat.textColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
          <span className="text-sm text-gray-500">Last 8 activities</span>
        </div>
        
        {recentActivities.length > 0 ? (
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold text-sm">
                    {activity.user_full_name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action?.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-gray-600">{activity.user_full_name || 'System'}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No recent activities</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
