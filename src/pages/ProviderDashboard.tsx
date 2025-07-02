import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, Calendar, MessageSquare, Settings, 
  PlusCircle, BarChart2, LogOut, Menu, X, 
  ChevronRight, Bell, ChevronDown
} from 'lucide-react';

// Dashboard components
import PropertyListingCard from '../components/dashboard/PropertyListingCard';
import DashboardStats from '../components/dashboard/DashboardStats';
import BookingManagement from '../components/dashboard/BookingManagement';
import MessageCenter from '../components/dashboard/MessageCenter';

// Supabase client
import { supabase } from '../supabase/client';
import { useAuth } from '../context/AuthContext';

const ProviderDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Stats derived from real data
  const stats = {
    totalListings: properties.length,
    activeListings: properties.filter(p => p.status === 'active').length,
    pendingListings: properties.filter(p => p.status === 'pending').length,
    totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
    totalInquiries: properties.reduce((sum, p) => sum + (p.inquiries || 0), 0),
    revenueGenerated: 1200 // This would need to come from a real revenue tracking system
  };
  
  // Mock data for recent inquiries (would be replaced with real data in a full implementation)
  const recentInquiries = [
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 234 567 8901',
      message: 'I am interested in viewing this property. Is it still available for viewing this weekend?',
      propertyId: properties[0]?.id || '',
      propertyTitle: properties[0]?.title || 'Property',
      date: '2023-11-15'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 987 654 3210',
      message: 'Hello, I would like to know if the price is negotiable. Thanks!',
      propertyId: properties[1]?.id || '',
      propertyTitle: properties[1]?.title || 'Property',
      date: '2023-11-14'
    },
    {
      id: 3,
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '+1 567 890 1234',
      message: 'I am looking for a long-term rental. Is this property available for a 12-month lease?',
      propertyId: properties[2]?.id || '',
      propertyTitle: properties[2]?.title || 'Property',
      date: '2023-11-12'
    }
  ];
  
  // Fetch properties from Supabase
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        if (!user?.id) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }
        
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('owner_id', user.id);
          
        if (error) throw error;
        
        // Transform the data to match the expected format for the UI
        const transformedData = data.map(property => ({
          id: property.id,
          title: property.title,
          location: property.location,
          price: property.price,
          type: property.property_type,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          size: property.area,
          status: property.status,
          purpose: property.purpose,
          image: property.images && property.images.length > 0 ? property.images[0] : 'https://via.placeholder.com/800x600?text=No+Image',
          views: 0, // These would come from analytics in a real app
          inquiries: 0, // These would come from a real inquiries system
          lastUpdated: new Date(property.updated_at).toLocaleDateString()
        }));
        
        setProperties(transformedData);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch properties');
        console.error('Error fetching properties:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperties();
  }, [user?.id]);
  
  // Handler for property deletion
  const handleDeleteProperty = async (id: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update the UI by removing the deleted property
      setProperties(properties.filter(p => p.id !== id));
    } catch (err: any) {
      console.error('Error deleting property:', err);
      alert('Failed to delete property: ' + err.message);
    }
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-airbnb-red">Rentr</h1>
          <button 
            className="p-1 rounded-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-600 font-bold">JD</span>
            </div>
            <div>
              <h3 className="font-medium">John Doe</h3>
              <p className="text-sm text-gray-500">Property Provider</p>
            </div>
          </div>
          
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                activeTab === 'overview'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              Dashboard
            </button>
            
            <button
              onClick={() => setActiveTab('properties')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                activeTab === 'properties'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="h-5 w-5 mr-3" />
              My Properties
            </button>
            
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                activeTab === 'bookings'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="h-5 w-5 mr-3" />
              Bookings
            </button>
            
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                activeTab === 'analytics'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="h-5 w-5 mr-3" />
              Analytics
            </button>
            
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center w-full px-4 py-3 rounded-lg text-left ${
                activeTab === 'settings'
                  ? 'bg-rose-50 text-rose-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Settings className="h-5 w-5 mr-3" />
              Settings
            </button>
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button className="flex items-center w-full px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100">
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <button
              className="p-1 rounded-md lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6 text-gray-500" />
            </button>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/list-property"
                className="hidden sm:flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Add New Property
              </Link>
              
              <button className="relative p-1">
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500"></span>
                <MessageSquare className="h-6 w-6 text-gray-500" />
              </button>
              
              <button className="relative p-1">
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-rose-500"></span>
                <Bell className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </div>
        </header>
        
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gray-50">
          {activeTab === 'overview' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <div className="mt-3 md:mt-0">
                  <Link
                    to="/list-property"
                    className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 sm:hidden"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Property
                  </Link>
                </div>
              </div>
              
              {/* Stats */}
              <DashboardStats stats={stats} />
              
              {/* Recent Properties */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Recent Properties</h2>
                  <Link
                    to="#"
                    onClick={() => setActiveTab('properties')}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.slice(0, 3).map((property) => (
                    <PropertyListingCard 
                      key={property.id} 
                      property={property} 
                      onDelete={handleDeleteProperty} 
                    />
                  ))}
                </div>
              </div>
              
              {/* Recent Inquiries */}
              <div className="mt-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Recent Inquiries</h2>
                  <Link
                    to="#"
                    onClick={() => setActiveTab('inquiries')}
                    className="text-sm font-medium text-rose-600 hover:text-rose-700 flex items-center"
                  >
                    View All
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </div>
                
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {recentInquiries.map((inquiry) => (
                          <tr key={inquiry.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <span className="text-gray-600 font-medium">
                                    {inquiry.name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="ml-3">
                                  <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                                  <div className="text-sm text-gray-500">{inquiry.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{inquiry.propertyTitle}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{inquiry.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button className="text-rose-600 hover:text-rose-900 mr-3">
                                View
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                Reply
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'properties' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                <div className="mt-3 md:mt-0 flex items-center space-x-2">
                  <div className="relative">
                    <select className="appearance-none pl-3 pr-10 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm">
                      <option>All Properties</option>
                      <option>For Sale</option>
                      <option>For Rent</option>
                      <option>Active</option>
                      <option>Pending</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <ChevronDown className="h-4 w-4" />
                    </div>
                  </div>
                  
                  <Link
                    to="/list-property"
                    className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add New Property
                  </Link>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              ) : properties.length === 0 ? (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                  <p className="text-gray-500 mb-6">You haven't listed any properties yet.</p>
                  <Link
                    to="/list-property"
                    className="inline-flex items-center px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
                  >
                    <PlusCircle className="h-5 w-5 mr-2" />
                    Add Your First Property
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <PropertyListingCard 
                      key={property.id} 
                      property={property} 
                      onDelete={handleDeleteProperty} 
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'bookings' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
              </div>
              <BookingManagement />
            </div>
          )}
          
          {activeTab === 'messages' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Message Center</h1>
              </div>
              <MessageCenter />
            </div>
          )}
          
          {/* Other tabs would be implemented similarly */}
          {activeTab !== 'overview' && activeTab !== 'properties' && activeTab !== 'bookings' && activeTab !== 'messages' && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-xl font-bold text-gray-700 mb-2">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                </h2>
                <p className="text-gray-500">
                  This section is under development. Check back soon!
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProviderDashboard;
