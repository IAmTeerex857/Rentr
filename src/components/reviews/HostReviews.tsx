import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  getHostReviews, 
  getHostRatingAverages, 
  createHostReview,
  HostReview,
  HostRatingAverages,
  HostReviewInput,
  hasReviewedHost
} from '../../supabase/reviewsService';
import { Star, StarHalf } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface HostReviewsProps {
  hostId: string;
  bookingId?: string;
}

const HostReviews: React.FC<HostReviewsProps> = ({ hostId, bookingId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<HostReview[]>([]);
  const [averages, setAverages] = useState<HostRatingAverages | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Review form state
  const [reviewData, setReviewData] = useState<HostReviewInput>({
    host_id: hostId,
    booking_id: bookingId,
    rating: 5,
    communication_rating: 5,
    hospitality_rating: 5,
    reliability_rating: 5,
    comment: ''
  });

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setLoading(true);
        const [reviewsData, averagesData] = await Promise.all([
          getHostReviews(hostId),
          getHostRatingAverages(hostId)
        ]);
        
        setReviews(reviewsData);
        setAverages(averagesData);
        
        // Check if user has already reviewed this host for this booking
        if (user && bookingId) {
          const reviewed = await hasReviewedHost(bookingId);
          setHasReviewed(reviewed);
        } else {
          // If no bookingId is provided, user can't leave a review directly
          setHasReviewed(false);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading host reviews:', err);
        setError('Failed to load host reviews. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadReviews();
  }, [hostId, bookingId, user]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewData(prev => ({
      ...prev,
      [name]: name.includes('rating') ? parseInt(value) : value
    }));
  };
  
  const handleRatingChange = (name: string, value: number) => {
    setReviewData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to submit a review');
      return;
    }
    
    try {
      setSubmitting(true);
      await createHostReview(reviewData);
      
      // Refresh reviews after submission
      const [reviewsData, averagesData] = await Promise.all([
        getHostReviews(hostId),
        getHostRatingAverages(hostId)
      ]);
      
      setReviews(reviewsData);
      setAverages(averagesData);
      setHasReviewed(true);
      setShowReviewForm(false);
      setError(null);
    } catch (err) {
      console.error('Error submitting host review:', err);
      setError('Failed to submit review. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };
  
  const renderRatingInput = (name: string, label: string, value: number) => {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className="flex items-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => handleRatingChange(name, star)}
              className="p-1 focus:outline-none"
            >
              <Star 
                className={`w-6 h-6 ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
              />
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-4">Host Reviews</h2>
      
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">{error}</div>
      ) : (
        <div className="mb-6">
          {averages && (
            <div className="flex flex-col md:flex-row md:items-center mb-6">
              <div className="flex items-center mb-2 md:mb-0 md:mr-6">
                <div className="text-2xl font-bold mr-2">{averages.avg_rating.toFixed(1)}</div>
                <div className="flex">{renderStars(averages.avg_rating)}</div>
              </div>
              
              <div className="text-sm text-gray-500">
                Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          )}
          
          {averages && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Communication:</span>
                <div className="flex">{renderStars(averages.avg_communication)}</div>
                <span className="ml-2">{averages.avg_communication}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Hospitality:</span>
                <div className="flex">{renderStars(averages.avg_hospitality)}</div>
                <span className="ml-2">{averages.avg_hospitality}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2">Reliability:</span>
                <div className="flex">{renderStars(averages.avg_reliability)}</div>
                <span className="ml-2">{averages.avg_reliability}</span>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Write a Review Button - Only show if user has a booking ID */}
      {user && bookingId && !hasReviewed && !showReviewForm && (
        <button
          onClick={() => setShowReviewForm(true)}
          className="mb-8 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Review Host
        </button>
      )}
      
      {/* Message when user is viewing without a booking */}
      {user && !bookingId && !hasReviewed && (
        <div className="text-sm text-gray-600 italic mb-6">
          You can review this host after completing a stay at their property.
        </div>
      )}
      
      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-xl font-semibold mb-4">Review Host</h3>
          
          {renderRatingInput('rating', 'Overall Rating', reviewData.rating)}
          {renderRatingInput('communication_rating', 'Communication', reviewData.communication_rating)}
          {renderRatingInput('hospitality_rating', 'Hospitality', reviewData.hospitality_rating)}
          {renderRatingInput('reliability_rating', 'Reliability', reviewData.reliability_rating)}
          
          <div className="mb-4">
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
              Your Review
            </label>
            <textarea
              id="comment"
              name="comment"
              value={reviewData.comment}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Share your experience with this host..."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowReviewForm(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}
      
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 pb-6">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="font-medium">{review.reviewer_name}</div>
                  <div className="text-gray-500 text-sm">
                    {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
                  </div>
                </div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{review.comment}</p>
              
              {review.response && (
                <div className="bg-gray-50 p-4 rounded-md mt-3">
                  <div className="font-medium mb-1">Response from host</div>
                  <p className="text-gray-700">{review.response}</p>
                  {review.response_date && (
                    <div className="text-gray-500 text-sm mt-1">
                      {formatDistanceToNow(new Date(review.response_date), { addSuffix: true })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 italic">No reviews yet for this host.</div>
      )}
    </div>
  );
};

export default HostReviews;
