import { useState, useEffect, useRef } from 'react';
import { Calendar, Clock, Check, X, MessageSquare, Bell, User, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { 
  fetchBookingsByPropertyOwner, 
  updateBookingStatus, 
  subscribeToOwnerBookings,
  unsubscribeFromChannel
} from '../../supabase/bookingService';
import { createConversation, sendMessage } from '../../supabase/messageService';
import { RealtimeChannel } from '@supabase/supabase-js';

interface BookingDetails {
  id: string;
  property_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  total_price: number;
  created_at: string;
  guests: number;
  special_requests?: string;
  property_title: string;
  property_image: string | null;
  guest_name: string;
  guest_email: string;
  guest_id?: string;
  conversation_id?: string;
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<BookingDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasNewBooking, setHasNewBooking] = useState(false);
  const bookingChannelRef = useRef<RealtimeChannel | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed' | 'cancelled' | 'completed' | 'all'>('pending');
  const [selectedBooking, setSelectedBooking] = useState<BookingDetails | null>(null);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const { user } = useAuth();

  const loadBookings = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(true);
      const data = await fetchBookingsByPropertyOwner(user.id);
      setBookings(data);
      setHasNewBooking(false);
      setLoading(false);
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to load bookings. Please try again.');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadBookings();
      
      // Subscribe to booking updates
      const bookingChannel = subscribeToOwnerBookings(user.id, (updatedBooking) => {
        // Update the bookings list when a booking changes
        setBookings(prevBookings => {
          // Check if this booking already exists in our list
          const existingIndex = prevBookings.findIndex(b => b.id === updatedBooking.id);
          
          if (existingIndex >= 0) {
            // Update the existing booking
            const updatedBookings = [...prevBookings];
            updatedBookings[existingIndex] = {
              ...updatedBookings[existingIndex],
              ...updatedBooking,
            };
            return updatedBookings;
          } else {
            // This is a new booking, add it to the list
            // We'll need to reload to get the full booking details with guest info
            setHasNewBooking(true);
            loadBookings(); // Reload all bookings to get complete data
            return prevBookings;
          }
        });
      });
      
      bookingChannelRef.current = bookingChannel;
      
      return () => {
        // Clean up subscription when component unmounts
        if (bookingChannelRef.current) {
          unsubscribeFromChannel(bookingChannelRef.current);
        }
      };
    }
  }, [user?.id]);

  const handleStatusChange = async (bookingId: string, newStatus: 'confirmed' | 'cancelled' | 'completed') => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      
      // Update local state
      setBookings(prevBookings => 
        prevBookings.map(booking => 
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        )
      );
      
      // Close booking details if the status was changed for the selected booking
      if (selectedBooking?.id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus });
      }
    } catch (err: any) {
      console.error('Error updating booking status:', err);
      setError(err.message || 'Failed to update booking status');
    }
  };

  const handleSendMessage = async () => {
    if (!selectedBooking || !user || !messageText.trim()) return;
    
    try {
      setSendingMessage(true);
      
      // Create a new conversation
      const newConversation = await createConversation(
        user.id,
        selectedBooking.user_id,
        selectedBooking.property_id,
        selectedBooking.property_title || 'Property Booking'
      );
      
      // Send the message
      await sendMessage(
        newConversation.id,
        user.id,
        selectedBooking.user_id,
        messageText
      );
      
      // Clear the message input
      setMessageText('');
      setSendingMessage(false);
    } catch (err) {
      console.error('Error sending message:', err);
      setSendingMessage(false);
    }
  };

  const filteredBookings = activeTab === 'all' 
    ? bookings 
    : bookings.filter(booking => booking.status === activeTab);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Booking Management</h2>
        {hasNewBooking && (
          <div className="flex items-center text-sm text-blue-600">
            <Bell className="h-4 w-4 mr-1" />
            New booking request
          </div>
        )}
      </div>
      
      {/* Filter tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button 
          onClick={() => setActiveTab('all')} 
          className={`px-4 py-2 font-medium ${activeTab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          All Bookings
        </button>
        <button 
          onClick={() => setActiveTab('pending')} 
          className={`px-4 py-2 font-medium ${activeTab === 'pending' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Pending
          {bookings.filter(b => b.status === 'pending').length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {bookings.filter(b => b.status === 'pending').length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('confirmed')} 
          className={`px-4 py-2 font-medium ${activeTab === 'confirmed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Confirmed
        </button>
        <button 
          onClick={() => setActiveTab('cancelled')} 
          className={`px-4 py-2 font-medium ${activeTab === 'cancelled' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Cancelled
        </button>
        <button 
          onClick={() => setActiveTab('completed')} 
          className={`px-4 py-2 font-medium ${activeTab === 'completed' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
        >
          Completed
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : error ? (
        <div className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700">{error}</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="p-6 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-700">No {activeTab !== 'all' ? activeTab : ''} bookings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {filteredBookings.map((booking) => (
            <div 
              key={booking.id} 
              className={`border rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow ${
                selectedBooking?.id === booking.id ? 'ring-2 ring-rose-500' : ''
              }`}
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="relative">
                <img 
                  src={booking.property_image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                  alt={booking.property_title} 
                  className="w-full h-32 object-cover"
                />
                <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-1">{booking.property_title}</h3>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>{booking.guest_name} • {booking.guests} guests</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>Booked on {formatDate(booking.created_at)}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="font-medium text-gray-900">${booking.total_price.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-bold text-gray-900">Booking Details</h2>
                <button 
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedBooking.property_image || 'https://via.placeholder.com/300x200?text=No+Image'} 
                    alt={selectedBooking.property_title} 
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{selectedBooking.property_title}</h3>
                  
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Check-in: {formatDate(selectedBooking.start_date)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Check-out: {formatDate(selectedBooking.end_date)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      <span>{selectedBooking.guests} guests</span>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Booked on {formatDate(selectedBooking.created_at)}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                    selectedBooking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    selectedBooking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    selectedBooking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                  </div>
                  
                  <h4 className="font-medium text-gray-900 mb-2">Guest Information</h4>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p><strong>Name:</strong> {selectedBooking.guest_name}</p>
                    <p><strong>Email:</strong> {selectedBooking.guest_email}</p>
                  </div>
                  
                  {selectedBooking.special_requests && (
                    <>
                      <h4 className="font-medium text-gray-900 mb-2">Special Requests</h4>
                      <p className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
                        {selectedBooking.special_requests}
                      </p>
                    </>
                  )}
                  
                  <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                  <div className="text-sm text-gray-600 mb-6">
                    <p><strong>Total Amount:</strong> ${selectedBooking.total_price.toFixed(2)}</p>
                    <p><strong>Status:</strong> Paid</p>
                  </div>
                  
                  {/* Message Form */}
                  <h4 className="font-medium text-gray-900 mb-2">Contact Guest</h4>
                  <form onSubmit={(e) => e.preventDefault()} className="mb-6">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                      rows={3}
                      required
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={sendingMessage || !messageText.trim()}
                      className={`px-4 py-2 rounded-md ${sendingMessage ? 'bg-gray-400' : 'bg-blue-600'} text-white font-medium flex items-center justify-center`}
                    >
                      {sendingMessage ? 'Sending...' : (
                        <>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                  
                  {/* Action Buttons */}
                  {selectedBooking.status === 'pending' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'confirmed')}
                        className="flex-1 flex items-center justify-center py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Confirm
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                  
                  {selectedBooking.status === 'confirmed' && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'completed')}
                        className="flex-1 flex items-center justify-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark as Completed
                      </button>
                      <button
                        onClick={() => handleStatusChange(selectedBooking.id, 'cancelled')}
                        className="flex-1 flex items-center justify-center py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;
