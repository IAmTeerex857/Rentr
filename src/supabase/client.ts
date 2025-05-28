import { createClient } from '@supabase/supabase-js';

// Use hard-coded values for development to ensure valid URLs
// In production, these would come from environment variables
export const supabaseUrl = 'https://example.supabase.co';
export const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAwfQ.example';

// Create the Supabase client without type checking for development
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a flag to indicate we're in development mode
export const isDevelopmentMode = supabaseUrl.includes('example.supabase.co');
