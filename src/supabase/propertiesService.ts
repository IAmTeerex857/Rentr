import { supabase } from './client';

export interface Property {
  id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  currency: string;
  purpose: 'rent' | 'sale';
  bedrooms: number;
  bathrooms: number;
  area: number;
  area_unit: string;
  property_type: string;
  amenities: string[];
  images: string[];
  owner_id: string;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  is_featured?: boolean;
  status: 'active' | 'pending' | 'sold' | 'rented';
  rating?: number;
  review_count?: number;
}

export interface PropertySearchFilters {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  minArea?: number;
  maxArea?: number;
  purpose?: 'rent' | 'sale';
  amenities?: string[];
  limit?: number;
  offset?: number;
}

/**
 * Fetch all properties with optional filtering
 */
export const fetchProperties = async (filters: PropertySearchFilters = {}) => {
  try {
    let query = supabase
      .from('properties')
      .select('*');
    
    // Apply filters
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }
    
    if (filters.propertyType) {
      query = query.eq('property_type', filters.propertyType);
    }
    
    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }
    
    if (filters.bedrooms !== undefined) {
      query = query.gte('bedrooms', filters.bedrooms);
    }
    
    if (filters.bathrooms !== undefined) {
      query = query.gte('bathrooms', filters.bathrooms);
    }
    
    if (filters.minArea !== undefined) {
      query = query.gte('area', filters.minArea);
    }
    
    if (filters.maxArea !== undefined) {
      query = query.lte('area', filters.maxArea);
    }
    
    if (filters.purpose) {
      query = query.eq('purpose', filters.purpose);
    }
    
    if (filters.amenities && filters.amenities.length > 0) {
      // This assumes amenities are stored as an array in Supabase
      query = query.contains('amenities', filters.amenities);
    }
    
    // Add pagination
    if (filters.limit) {
      query = query.limit(filters.limit);
    }
    
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as Property[];
  } catch (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
};

/**
 * Fetch a single property by ID
 */
export const fetchPropertyById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Property;
  } catch (error) {
    console.error(`Error fetching property with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Fetch featured properties
 */
export const fetchFeaturedProperties = async (limit = 3) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .limit(limit);
    
    if (error) throw error;
    
    return data as Property[];
  } catch (error) {
    console.error('Error fetching featured properties:', error);
    throw error;
  }
};

/**
 * Fetch properties by owner ID
 */
export const fetchPropertiesByOwnerId = async (ownerId: string) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('owner_id', ownerId);
    
    if (error) throw error;
    
    return data as Property[];
  } catch (error) {
    console.error(`Error fetching properties for owner ${ownerId}:`, error);
    throw error;
  }
};

/**
 * Update a property by ID
 */
export const updateProperty = async (id: string, propertyData: Partial<Property>) => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .update(propertyData)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    
    return data[0] as Property;
  } catch (error) {
    console.error(`Error updating property with ID ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a property by ID
 */
export const deleteProperty = async (id: string) => {
  try {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting property with ID ${id}:`, error);
    throw error;
  }
};
