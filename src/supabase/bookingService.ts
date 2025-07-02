import { supabase } from './client';
import { Tables } from './database.types';
import { RealtimeChannel } from '@supabase/supabase-js';

export type Booking = Tables<'bookings'> & {
  property_title?: string;
  property_image?: string | null;
  guest_name?: string;
  guest_email?: string;
};

export type BookingRequest = {
  property_id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  guests: number;
  special_requests?: string;
  total_price: number;
};

/**
 * Create a new booking for a property
 */
export const createBooking = async (bookingData: BookingRequest): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      ...bookingData,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error creating booking:', error);
    throw new Error(error.message);
  }

  return data as Booking;
};

/**
 * Get all bookings for a property
 */
export const getPropertyBookings = async (propertyId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching property bookings:', error);
    throw new Error(error.message);
  }

  return data as Booking[];
};

/**
 * Get all bookings for a user
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, properties(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user bookings:', error);
    throw new Error(error.message);
  }

  return data as unknown as Booking[];
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (
  bookingId: string, 
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ 
      status,
      updated_at: new Date().toISOString()
    })
    .eq('id', bookingId)
    .select('*')
    .single();

  if (error) {
    console.error('Error updating booking status:', error);
    throw new Error(error.message);
  }

  return data as Booking;
};

/**
 * Check if dates are available for booking
 */
export const checkAvailability = async (
  propertyId: string,
  startDate: string,
  endDate: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('property_id', propertyId)
    .eq('status', 'confirmed')
    .or(`start_date.lte.${endDate},end_date.gte.${startDate}`);

  if (error) {
    console.error('Error checking availability:', error);
    throw new Error(error.message);
  }

  // If no bookings found for this date range, it's available
  return data.length === 0;
};

/**
 * Get available dates for a property (next 90 days)
 */
export const getAvailableDates = async (propertyId: string): Promise<{start: string, end: string}[]> => {
  // In a real implementation, this would check the database for all confirmed bookings
  // and return available date ranges. For now, we'll return mock data.
  
  // Get all confirmed bookings for this property
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('start_date, end_date')
    .eq('property_id', propertyId)
    .eq('status', 'confirmed');
  
  if (error) {
    console.error('Error fetching bookings for availability:', error);
    throw new Error(error.message);
  }
  
  // Generate available dates (this is simplified - a real implementation would be more complex)
  const today = new Date();
  const availableDates = [];
  
  // If no bookings, return the next 3 months as available
  if (bookings.length === 0) {
    const nextMonth = new Date(today);
    nextMonth.setMonth(today.getMonth() + 1);
    
    const twoMonthsLater = new Date(today);
    twoMonthsLater.setMonth(today.getMonth() + 2);
    
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    availableDates.push({
      start: today.toISOString().split('T')[0],
      end: nextMonth.toISOString().split('T')[0]
    });
    
    availableDates.push({
      start: nextMonth.toISOString().split('T')[0],
      end: twoMonthsLater.toISOString().split('T')[0]
    });
    
    availableDates.push({
      start: twoMonthsLater.toISOString().split('T')[0],
      end: threeMonthsLater.toISOString().split('T')[0]
    });
  } else {
    // In a real implementation, we would find gaps between bookings
    // This is simplified for demonstration purposes
    const bookedDates = bookings.map(b => ({
      start: new Date(b.start_date),
      end: new Date(b.end_date)
    }));
    
    // Sort bookings by start date
    bookedDates.sort((a, b) => a.start.getTime() - b.start.getTime());
    
    // Find gaps between bookings
    let lastEnd = today;
    for (const booking of bookedDates) {
      if (booking.start > lastEnd) {
        availableDates.push({
          start: lastEnd.toISOString().split('T')[0],
          end: booking.start.toISOString().split('T')[0]
        });
      }
      if (booking.end > lastEnd) {
        lastEnd = booking.end;
      }
    }
    
    // Add period after last booking
    const threeMonthsLater = new Date(today);
    threeMonthsLater.setMonth(today.getMonth() + 3);
    
    if (lastEnd < threeMonthsLater) {
      availableDates.push({
        start: lastEnd.toISOString().split('T')[0],
        end: threeMonthsLater.toISOString().split('T')[0]
      });
    }
  }
  
  return availableDates;
};

/**
 * Fetch bookings for properties owned by a specific user
 */
export const fetchBookingsByPropertyOwner = async (ownerId: string): Promise<any[]> => {
  // First get all properties owned by this user
  const { data: properties, error: propertiesError } = await supabase
    .from('properties')
    .select('id, title, images')
    .eq('owner_id', ownerId);

  if (propertiesError) {
    console.error('Error fetching owner properties:', propertiesError);
    throw new Error(propertiesError.message);
  }

  if (!properties || properties.length === 0) {
    return [];
  }

  // Get property IDs
  const propertyIds = properties.map(p => p.id);

  // Fetch all bookings for these properties
  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select(`
      id,
      property_id,
      user_id,
      start_date,
      end_date,
      guests,
      total_price,
      status,
      special_requests,
      created_at
    `)
    .in('property_id', propertyIds)
    .order('created_at', { ascending: false });

  if (bookingsError) {
    console.error('Error fetching property bookings:', bookingsError);
    throw new Error(bookingsError.message);
  }

  // Enhance bookings with property and guest details
  const enhancedBookings = await Promise.all(bookings.map(async (booking) => {
    // Find property details
    const property = properties.find(p => p.id === booking.property_id);
    
    // Get guest details
    const { data: guest, error: guestError } = await supabase
      .from('profiles')
      .select('first_name, last_name, email')
      .eq('id', booking.user_id)
      .single();
      
    if (guestError) {
      console.error('Error fetching guest details:', guestError);
    }
    
    return {
      ...booking,
      property_title: property?.title || 'Unknown Property',
      property_image: property?.images?.[0] || null,
      guest_name: guest ? `${guest.first_name} ${guest.last_name}` : 'Unknown Guest',
      guest_email: guest?.email || 'No email provided'
    };
  }));

  return enhancedBookings;
};

/**
 * Subscribe to booking updates for a property owner
 */
export const subscribeToOwnerBookings = (ownerId: string, callback: (booking: Booking) => void): RealtimeChannel => {
  // First get all property IDs owned by this user
  const fetchPropertyIds = async () => {
    const { data } = await supabase
      .from('properties')
      .select('id')
      .eq('owner_id', ownerId);
    
    return data?.map(p => p.id) || [];
  };
  
  // Create a channel to listen for booking changes
  const channel = supabase.channel(`owner-bookings-${ownerId}`);
  
  // When the channel is joined, set up the subscription
  channel.on('system', { event: 'CHANNEL_JOINED' }, async () => {
    const propertyIds = await fetchPropertyIds();
    
    if (propertyIds.length > 0) {
      // For each property, listen for booking changes
      propertyIds.forEach(propertyId => {
        channel.on(
          'postgres_changes',
          {
            event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'bookings',
            filter: `property_id=eq.${propertyId}`
          },
          (payload) => {
            // Get the updated booking
            const updatedBooking = payload.new as Booking;
            
            // Call the callback with the updated booking
            callback(updatedBooking);
          }
        );
      });
    }
  }).subscribe();
  
  return channel;
};

/**
 * Subscribe to booking updates for a guest
 */
export const subscribeToGuestBookings = (userId: string, callback: (booking: Booking) => void): RealtimeChannel => {
  const channel = supabase
    .channel(`guest-bookings-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'bookings',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        // Get the updated booking
        const updatedBooking = payload.new as Booking;
        
        // Call the callback with the updated booking
        callback(updatedBooking);
      }
    )
    .subscribe();
    
  return channel;
};

/**
 * Unsubscribe from a channel when no longer needed
 */
export const unsubscribeFromChannel = (channel: RealtimeChannel): void => {
  supabase.removeChannel(channel);
};
