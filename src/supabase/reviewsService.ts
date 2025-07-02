import { supabase } from './client';
import { Tables } from './database.types';

export type PropertyReview = Tables<'property_reviews'> & {
  reviewer_name?: string;
  reviewer_email?: string;
};

export type HostReview = Tables<'host_reviews'> & {
  reviewer_name?: string;
  reviewer_email?: string;
};

export type GuestReview = Tables<'guest_reviews'> & {
  reviewer_name?: string;
  reviewer_email?: string;
};

export type PropertyRatingAverages = {
  property_id: string;
  review_count: number;
  avg_rating: number;
  avg_cleanliness: number;
  avg_location: number;
  avg_value: number;
  avg_communication: number;
};

export type HostRatingAverages = {
  host_id: string;
  review_count: number;
  avg_rating: number;
  avg_communication: number;
  avg_hospitality: number;
};

export type GuestRatingAverages = {
  guest_id: string;
  review_count: number;
  avg_rating: number;
  avg_cleanliness: number;
  avg_communication: number;
  avg_rule_following: number;
};

export type PropertyReviewInput = {
  property_id: string;
  booking_id?: string;
  rating: number;
  cleanliness_rating: number;
  location_rating: number;
  value_rating: number;
  communication_rating: number;
  comment: string;
};

export type HostReviewInput = {
  host_id: string;
  booking_id?: string;
  rating: number;
  communication_rating: number;
  hospitality_rating: number;
  comment: string;
};

export type GuestReviewInput = {
  guest_id: string;
  booking_id?: string;
  rating: number;
  cleanliness_rating: number;
  communication_rating: number;
  rule_following_rating: number;
  comment: string;
};

/**
 * Create a property review
 */
export const createPropertyReview = async (reviewData: PropertyReviewInput): Promise<PropertyReview> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  
  if (!userId) {
    throw new Error('User must be authenticated to create a review');
  }
  
  const { data, error } = await supabase
    .from('property_reviews')
    .insert({
      ...reviewData,
      reviewer_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating property review:', error);
    throw new Error(error.message);
  }

  return data as PropertyReview;
};

/**
 * Create a host review
 */
export const createHostReview = async (reviewData: HostReviewInput): Promise<HostReview> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  
  if (!userId) {
    throw new Error('User must be authenticated to create a review');
  }
  
  const { data, error } = await supabase
    .from('host_reviews')
    .insert({
      ...reviewData,
      reviewer_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating host review:', error);
    throw new Error(error.message);
  }

  return data as HostReview;
};

/**
 * Create a guest review
 */
export const createGuestReview = async (reviewData: GuestReviewInput): Promise<GuestReview> => {
  const user = await supabase.auth.getUser();
  const userId = user.data.user?.id;
  
  if (!userId) {
    throw new Error('User must be authenticated to create a review');
  }
  
  const { data, error } = await supabase
    .from('guest_reviews')
    .insert({
      ...reviewData,
      reviewer_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating guest review:', error);
    throw new Error(error.message);
  }

  return data as GuestReview;
};

/**
 * Get property reviews by property ID
 */
export const getPropertyReviews = async (propertyId: string): Promise<PropertyReview[]> => {
  const { data, error } = await supabase
    .from('property_reviews')
    .select(`
      *,
      reviewer:reviewer_id (first_name, last_name, email)
    `)
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching property reviews:', error);
    throw new Error(error.message);
  }

  // Enhance reviews with reviewer info
  const enhancedReviews = data.map(review => ({
    ...review,
    reviewer_name: `${review.reviewer?.first_name || ''} ${review.reviewer?.last_name || ''}`.trim() || 'Anonymous',
    reviewer_email: review.reviewer?.email
  }));

  return enhancedReviews as PropertyReview[];
};

/**
 * Get host reviews by host ID
 */
export const getHostReviews = async (hostId: string): Promise<HostReview[]> => {
  const { data, error } = await supabase
    .from('host_reviews')
    .select(`
      *,
      reviewer:reviewer_id (first_name, last_name, email)
    `)
    .eq('host_id', hostId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching host reviews:', error);
    throw new Error(error.message);
  }

  // Enhance reviews with reviewer info
  const enhancedReviews = data.map(review => ({
    ...review,
    reviewer_name: `${review.reviewer?.first_name || ''} ${review.reviewer?.last_name || ''}`.trim() || 'Anonymous',
    reviewer_email: review.reviewer?.email
  }));

  return enhancedReviews as HostReview[];
};

/**
 * Get guest reviews by guest ID
 */
export const getGuestReviews = async (guestId: string): Promise<GuestReview[]> => {
  const { data, error } = await supabase
    .from('guest_reviews')
    .select(`
      *,
      reviewer:reviewer_id (first_name, last_name, email)
    `)
    .eq('guest_id', guestId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching guest reviews:', error);
    throw new Error(error.message);
  }

  // Enhance reviews with reviewer info
  const enhancedReviews = data.map(review => ({
    ...review,
    reviewer_name: `${review.reviewer?.first_name || ''} ${review.reviewer?.last_name || ''}`.trim() || 'Anonymous',
    reviewer_email: review.reviewer?.email
  }));

  return enhancedReviews as GuestReview[];
};

/**
 * Get property rating averages
 */
export const getPropertyRatingAverages = async (propertyId: string): Promise<PropertyRatingAverages | null> => {
  const { data, error } = await supabase
    .from('property_rating_averages')
    .select('*')
    .eq('property_id', propertyId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
    console.error('Error fetching property rating averages:', error);
    throw new Error(error.message);
  }

  return data ? (data as PropertyRatingAverages) : null;
};

/**
 * Get host rating averages
 */
export const getHostRatingAverages = async (hostId: string): Promise<HostRatingAverages | null> => {
  const { data, error } = await supabase
    .from('host_rating_averages')
    .select('*')
    .eq('host_id', hostId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching host rating averages:', error);
    throw new Error(error.message);
  }

  return data ? (data as HostRatingAverages) : null;
};

/**
 * Get guest rating averages
 */
export const getGuestRatingAverages = async (guestId: string): Promise<GuestRatingAverages | null> => {
  const { data, error } = await supabase
    .from('guest_rating_averages')
    .select('*')
    .eq('guest_id', guestId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching guest rating averages:', error);
    throw new Error(error.message);
  }

  return data ? (data as GuestRatingAverages) : null;
};

/**
 * Respond to a property review (for property owners)
 */
export const respondToPropertyReview = async (reviewId: string, response: string): Promise<PropertyReview> => {
  const { data, error } = await supabase
    .from('property_reviews')
    .update({
      response,
      response_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .select('*')
    .single();

  if (error) {
    console.error('Error responding to property review:', error);
    throw new Error(error.message);
  }

  return data as PropertyReview;
};

/**
 * Respond to a host review (for hosts)
 */
export const respondToHostReview = async (reviewId: string, response: string): Promise<HostReview> => {
  const { data, error } = await supabase
    .from('host_reviews')
    .update({
      response,
      response_date: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', reviewId)
    .select('*')
    .single();

  if (error) {
    console.error('Error responding to host review:', error);
    throw new Error(error.message);
  }

  return data as HostReview;
};

/**
 * Check if user has already reviewed a property for a specific booking
 */
export const hasReviewedProperty = async (bookingId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('property_reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .eq('reviewer_id', (await supabase.auth.getUser()).data.user?.id || '')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking if property was reviewed:', error);
    throw new Error(error.message);
  }

  return !!data;
};

/**
 * Check if user has already reviewed a host for a specific booking
 */
export const hasReviewedHost = async (bookingId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('host_reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .eq('reviewer_id', (await supabase.auth.getUser()).data.user?.id || '')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking if host was reviewed:', error);
    throw new Error(error.message);
  }

  return !!data;
};

/**
 * Check if host has already reviewed a guest for a specific booking
 */
export const hasReviewedGuest = async (bookingId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('guest_reviews')
    .select('id')
    .eq('booking_id', bookingId)
    .eq('reviewer_id', (await supabase.auth.getUser()).data.user?.id || '')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error checking if guest was reviewed:', error);
    throw new Error(error.message);
  }

  return !!data;
};
