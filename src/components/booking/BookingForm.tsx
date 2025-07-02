import { useState } from 'react';
import { Calendar, Users, CreditCard, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { createBooking, BookingRequest } from '../../supabase/bookingService';

interface BookingFormProps {
  propertyId: string;
  propertyTitle: string;
  pricePerNight: number;
  currency: string;
  availableDates: { start: string; end: string }[];
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const BookingForm = ({
  propertyId,
  propertyTitle,
  pricePerNight,
  currency,
  availableDates,
  onSuccess,
  onError
}: BookingFormProps) => {
  const { user } = useAuth();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  
  // Calculate number of nights and total price
  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
  
  const nights = calculateNights();
  const subtotal = nights * pricePerNight;
  const serviceFee = subtotal * 0.12; // 12% service fee
  const totalPrice = subtotal + serviceFee;
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Check if selected dates are valid
  const areDatesValid = () => {
    if (!startDate || !endDate) return false;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Check if end date is after start date
    if (end <= start) return false;
    
    // Check if dates are within available ranges
    return availableDates.some(range => {
      const rangeStart = new Date(range.start);
      const rangeEnd = new Date(range.end);
      return start >= rangeStart && end <= rangeEnd;
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to book a property');
      onError?.('You must be logged in to book a property');
      return;
    }
    
    if (!areDatesValid()) {
      setError('Please select valid dates within the available ranges');
      onError?.('Please select valid dates within the available ranges');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const bookingData: BookingRequest = {
        property_id: propertyId,
        user_id: user.id,
        start_date: startDate,
        end_date: endDate,
        guests,
        special_requests: specialRequests,
        total_price: totalPrice
      };
      
      // In a real application, this is where you would process payment
      // For now, we'll just create the booking
      await createBooking(bookingData);
      
      // Clear form and show success
      setStartDate('');
      setEndDate('');
      setGuests(1);
      setSpecialRequests('');
      setShowPaymentForm(false);
      
      // Call success callback
      onSuccess?.();
    } catch (err: any) {
      console.error('Error creating booking:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
      onError?.(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle "Book Now" button click
  const handleBookNowClick = () => {
    if (!areDatesValid()) {
      setError('Please select valid dates within the available ranges');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to book a property');
      return;
    }
    
    setShowPaymentForm(true);
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <Calendar className="h-5 w-5 text-gray-500 mr-2" />
        Book Your Stay
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}
      
      {!showPaymentForm ? (
        <form>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-in Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={availableDates[0]?.start || ''}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Check-out Date
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate || availableDates[0]?.start || ''}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Guests
              </label>
              <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => setGuests(Math.max(1, guests - 1))}
                >
                  -
                </button>
                <div className="flex-1 text-center py-2">
                  <div className="flex items-center justify-center">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{guests} {guests === 1 ? 'guest' : 'guests'}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200"
                  onClick={() => setGuests(Math.min(10, guests + 1))}
                >
                  +
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Requests (Optional)
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                rows={3}
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Any special requests or requirements?"
              />
            </div>
          </div>
          
          {startDate && endDate && nights > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  {currency} {pricePerNight} x {nights} nights
                </span>
                <span className="font-medium">
                  {currency} {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service fee</span>
                <span className="font-medium">
                  {currency} {serviceFee.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-100 mt-2">
                <span className="font-bold">Total</span>
                <span className="font-bold">
                  {currency} {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          )}
          
          <button
            type="button"
            className="w-full mt-6 bg-rose-600 text-white py-3 rounded-md font-medium hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
            onClick={handleBookNowClick}
            disabled={!areDatesValid() || isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Book Now'}
          </button>
        </form>
      ) : (
        <div>
          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium text-gray-900 mb-1">{propertyTitle}</p>
              <p className="text-gray-600 text-sm mb-2">
                {formatDate(startDate)} - {formatDate(endDate)} · {nights} nights
              </p>
              <p className="text-gray-600 text-sm">
                {guests} {guests === 1 ? 'guest' : 'guests'}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{currency} {totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <h3 className="font-medium text-gray-900 mb-3 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-gray-500" />
              Payment Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVC
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name on Card
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="John Smith"
                  required
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                type="button"
                className="flex-1 py-3 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setShowPaymentForm(false)}
              >
                Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-rose-600 text-white py-3 rounded-md font-medium hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p>You won't be charged yet. Payment will be processed upon confirmation.</p>
      </div>
    </div>
  );
};

export default BookingForm;
