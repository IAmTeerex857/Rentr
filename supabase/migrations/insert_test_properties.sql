-- Insert test property data
-- Note: Replace 'your-user-id' with an actual user ID from your auth.users table

-- Property 1: Luxury Beachfront Villa
INSERT INTO public.properties (
  title, 
  description, 
  location, 
  price, 
  currency, 
  purpose, 
  bedrooms, 
  bathrooms, 
  area, 
  area_unit, 
  property_type, 
  amenities, 
  images, 
  owner_id, 
  latitude, 
  longitude, 
  is_featured, 
  status
) VALUES (
  'Luxury Beachfront Villa',
  'Experience the ultimate Mediterranean lifestyle in this stunning beachfront villa with panoramic sea views. This exclusive property offers spacious living areas, a private pool, and direct beach access. Perfect for families or as a holiday investment.',
  'Kyrenia, North Cyprus',
  250,
  'USD',
  'rent',
  4,
  3,
  350,
  'm²',
  'villa',
  ARRAY['Wi-Fi', 'TV', 'Kitchen', 'Washing Machine', 'Dishwasher', 'Coffee Machine', 'Microwave', 'Iron', 'Hair Dryer', 'Sea View', 'Private Pool', 'Garden', 'Air Conditioning', 'Parking', 'Balcony', 'Fully Furnished', 'Security System', 'BBQ Area', 'Outdoor Dining', 'Beach Access'],
  ARRAY['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'],
  (SELECT id FROM auth.users LIMIT 1), -- This gets the first user ID from your users table
  35.341,
  33.319,
  TRUE,
  'active'
);

-- Property 2: Modern City Apartment
INSERT INTO public.properties (
  title, 
  description, 
  location, 
  price, 
  currency, 
  purpose, 
  bedrooms, 
  bathrooms, 
  area, 
  area_unit, 
  property_type, 
  amenities, 
  images, 
  owner_id, 
  latitude, 
  longitude, 
  is_featured, 
  status
) VALUES (
  'Modern City Apartment',
  'Stylish and contemporary apartment in the heart of the city. Features high-end finishes, smart home technology, and stunning city views. Walking distance to restaurants, shops, and entertainment.',
  'Nicosia, North Cyprus',
  180,
  'USD',
  'rent',
  2,
  1,
  85,
  'm²',
  'apartment',
  ARRAY['Wi-Fi', 'TV', 'Kitchen', 'Washing Machine', 'Air Conditioning', 'Elevator', 'City View', 'Gym Access', 'Fully Furnished', 'Security System'],
  ARRAY['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80'],
  (SELECT id FROM auth.users LIMIT 1), -- This gets the first user ID from your users table
  35.185,
  33.382,
  TRUE,
  'active'
);

-- Property 3: Mountain View Villa
INSERT INTO public.properties (
  title, 
  description, 
  location, 
  price, 
  currency, 
  purpose, 
  bedrooms, 
  bathrooms, 
  area, 
  area_unit, 
  property_type, 
  amenities, 
  images, 
  owner_id, 
  latitude, 
  longitude, 
  is_featured, 
  status
) VALUES (
  'Mountain View Villa',
  'Escape to this tranquil mountain retreat with breathtaking views. This spacious villa features traditional architecture with modern amenities, a private garden, and outdoor entertaining areas.',
  'Bellapais, North Cyprus',
  320000,
  'USD',
  'sale',
  5,
  4,
  420,
  'm²',
  'villa',
  ARRAY['Wi-Fi', 'TV', 'Kitchen', 'Washing Machine', 'Dishwasher', 'Air Conditioning', 'Parking', 'Garden', 'Mountain View', 'Fireplace', 'BBQ Area', 'Outdoor Dining', 'Security System'],
  ARRAY['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
  (SELECT id FROM auth.users LIMIT 1), -- This gets the first user ID from your users table
  35.305,
  33.355,
  FALSE,
  'active'
);
