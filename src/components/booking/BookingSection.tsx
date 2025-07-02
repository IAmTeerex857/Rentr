import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, MessageSquare } from 'lucide-react';
import BookingForm from './BookingForm';
import { Property } from '../../supabase/propertiesService';
import { useAuth } from '../../context/AuthContext';
import { createConversation, sendMessage } from '../../supabase/messageService';

interface BookingSectionProps {
  property: Property;
  availability?: {
    startDate: string;
    endDate: string;
    unavailableDates?: string[];
  };
}

const BookingSection = ({ property, availability }: BookingSectionProps) => {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/properties/${property.id}` } });
      return;
    }
    setShowBookingForm(true);
    setShowContactForm(false);
  };

  const handleContactOwner = () => {
    if (!user) {
      navigate('/login', { state: { from: `/properties/${property.id}` } });
      return;
    }
    setShowContactForm(true);
    setShowBookingForm(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !message.trim()) return;
    
    try {
      setSending(true);
      
      // Create a conversation if it doesn't exist
      const conversation = await createConversation(user.id, property.owner_id, property.id, message);
      
      // Send the message
      await sendMessage(conversation.id, user.id, property.owner_id, message);
      
      setMessage('');
      setSent(true);
      setSending(false);
      
      // Reset the sent status after 3 seconds
      setTimeout(() => {
        setSent(false);
        setShowContactForm(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      setSending(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {!showBookingForm && !showContactForm && (
        <>
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {property.purpose === 'rent' ? (
                <>${property.price} <span className="text-gray-500 text-base font-normal">/ month</span></>
              ) : (
                <>${property.price.toLocaleString()}</>
              )}
            </h3>
            
            {availability && (
              <div className="flex items-center text-sm text-gray-600 mb-1">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Available: {new Date(availability.startDate).toLocaleDateString()} - {new Date(availability.endDate).toLocaleDateString()}</span>
              </div>
            )}
            
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              <span>Max {property.bedrooms * 2} guests</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleBookNow}
              className="w-full py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
            >
              Book Now
            </button>
            
            <button
              onClick={handleContactOwner}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact Owner
            </button>
          </div>
        </>
      )}
      
      {showBookingForm && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Book this property</h3>
            <button 
              onClick={() => setShowBookingForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          <BookingForm 
            propertyId={property.id} 
            propertyTitle={property.title}
            pricePerNight={property.price} 
            currency={property.currency || '$'}
            availableDates={[{ start: availability?.startDate || '', end: availability?.endDate || '' }]}
            onSuccess={() => setShowBookingForm(false)}
            onError={(error) => console.error(error)}
          />
        </div>
      )}
      
      {showContactForm && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Contact Owner</h3>
            <button 
              onClick={() => setShowContactForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          {sent ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              Your message has been sent successfully!
            </div>
          ) : (
            <form onSubmit={handleSendMessage}>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Hi, I'm interested in this property..."
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={sending || !message.trim()}
                className="w-full py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors disabled:bg-rose-300"
              >
                {sending ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingSection;
