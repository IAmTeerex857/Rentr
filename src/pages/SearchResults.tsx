import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search, Filter, Star, Grid, Map as MapIcon, 
  ChevronDown, Home, Heart
} from 'lucide-react';

// Mock data for property listings
const mockListings = [
  {
    id: 1,
    title: "Luxury Beachfront Villa",
    location: "Kyrenia, North Cyprus",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    price: "$250/night",
    priceValue: 250,
    rating: 4.9,
    type: "villa",
    bedrooms: 4,
    bathrooms: 3,
    size: "350 m²",
    features: ["Pool", "Sea View", "Garden", "Parking", "Air Conditioning"],
    purpose: "rent",
    coordinates: { lat: 35.341, lng: 33.319 }
  },
  {
    id: 2,
    title: "Modern City Apartment",
    location: "Nicosia, North Cyprus",
    image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    price: "$110/night",
    priceValue: 110,
    rating: 4.7,
    type: "apartment",
    bedrooms: 2,
    bathrooms: 1,
    size: "85 m²",
    features: ["Balcony", "City View", "Elevator", "Gym", "Security"],
    purpose: "rent",
    coordinates: { lat: 35.175, lng: 33.364 }
  },
  {
    id: 3,
    title: "Cozy Mountain Cottage",
    location: "Bellapais, North Cyprus",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80",
    price: "$90/night",
    priceValue: 90,
    rating: 4.8,
    type: "house",
    bedrooms: 3,
    bathrooms: 2,
    size: "120 m²",
    features: ["Mountain View", "Fireplace", "Terrace", "Hiking Trails", "BBQ"],
    purpose: "rent",
    coordinates: { lat: 35.305, lng: 33.355 }
  },
  {
    id: 4,
    title: "Seaside Studio Apartment",
    location: "Famagusta, North Cyprus",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    price: "$75/night",
    priceValue: 75,
    rating: 4.5,
    type: "studio",
    bedrooms: 1,
    bathrooms: 1,
    size: "45 m²",
    features: ["Beach Access", "Sea View", "Kitchenette", "Air Conditioning"],
    purpose: "rent",
    coordinates: { lat: 35.125, lng: 33.941 }
  },
  {
    id: 5,
    title: "Luxury Family Villa",
    location: "Esentepe, North Cyprus",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    price: "$195,000",
    priceValue: 195000,
    rating: 4.9,
    type: "villa",
    bedrooms: 5,
    bathrooms: 4,
    size: "420 m²",
    features: ["Pool", "Garden", "Garage", "Smart Home", "Security System"],
    purpose: "sale",
    coordinates: { lat: 35.352, lng: 33.579 }
  },
  {
    id: 6,
    title: "Modern Penthouse",
    location: "Kyrenia, North Cyprus",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    price: "$135,000",
    priceValue: 135000,
    rating: 4.6,
    type: "apartment",
    bedrooms: 3,
    bathrooms: 2,
    size: "150 m²",
    features: ["Rooftop Terrace", "Sea View", "Parking", "Elevator", "Gym"],
    purpose: "sale",
    coordinates: { lat: 35.338, lng: 33.317 }
  },
  {
    id: 7,
    title: "Traditional Cypriot House",
    location: "Lefke, North Cyprus",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
    price: "$85,000",
    priceValue: 85000,
    rating: 4.4,
    type: "house",
    bedrooms: 3,
    bathrooms: 1,
    size: "110 m²",
    features: ["Garden", "Traditional Architecture", "Fruit Trees", "Stone Walls"],
    purpose: "sale",
    coordinates: { lat: 35.117, lng: 32.847 }
  },
  {
    id: 8,
    title: "Beach Condo",
    location: "Bafra, North Cyprus",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    price: "$120,000",
    priceValue: 120000,
    rating: 4.7,
    type: "condo",
    bedrooms: 2,
    bathrooms: 2,
    size: "95 m²",
    features: ["Beach Access", "Sea View", "Balcony", "Community Pool", "24/7 Security"],
    purpose: "sale",
    coordinates: { lat: 35.295, lng: 34.038 }
  }
];

type SortOption = 'recommended' | 'price-low-high' | 'price-high-low' | 'rating';

interface Filters {
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  purpose: string;
  features: string[];
}

const SearchResults = () => {
  const location = useLocation();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [listings] = useState(mockListings);
  const [filteredListings, setFilteredListings] = useState(mockListings);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('recommended');
  const [filters, setFilters] = useState<Filters>({
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    purpose: '',
    features: []
  });

  // Get search query from URL params on initial load
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get('q');
    if (query) {
      setSearchQuery(query);
    }
  }, [location]);

  // Filter and sort listings
  useEffect(() => {
    let results = [...listings];
    
    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(listing => 
        listing.title.toLowerCase().includes(query) || 
        listing.location.toLowerCase().includes(query) ||
        listing.features.some(feature => feature.toLowerCase().includes(query))
      );
    }
    
    // Apply property type filter
    if (filters.propertyType) {
      results = results.filter(listing => listing.type === filters.propertyType);
    }
    
    // Apply price range filter
    if (filters.minPrice) {
      const minPrice = parseInt(filters.minPrice);
      results = results.filter(listing => listing.priceValue >= minPrice);
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseInt(filters.maxPrice);
      results = results.filter(listing => listing.priceValue <= maxPrice);
    }
    
    // Apply bedrooms filter
    if (filters.bedrooms) {
      const minBedrooms = parseInt(filters.bedrooms);
      results = results.filter(listing => listing.bedrooms >= minBedrooms);
    }
    
    // Apply purpose filter
    if (filters.purpose) {
      results = results.filter(listing => listing.purpose === filters.purpose);
    }
    
    // Apply features filter
    if (filters.features.length > 0) {
      results = results.filter(listing => 
        filters.features.every(feature => 
          listing.features.includes(feature)
        )
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low-high':
        results.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'price-high-low':
        results.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'rating':
        results.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // 'recommended' - no specific sorting, use default order
        break;
    }
    
    setFilteredListings(results);
  }, [listings, searchQuery, filters, sortOption]);
  
  // Handle filter changes
  const handleFilterChange = (name: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };
  
  const toggleFeature = (feature: string) => {
    setFilters(prev => {
      const features = [...prev.features];
      
      if (features.includes(feature)) {
        return {
          ...prev,
          features: features.filter(f => f !== feature)
        };
      } else {
        return {
          ...prev,
          features: [...features, feature]
        };
      }
    });
  };
  
  const clearFilters = () => {
    setFilters({
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      purpose: '',
      features: []
    });
    setSearchQuery('');
  };
  
  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search bar */}
        <div className="bg-white rounded-full shadow-md p-2 mb-6 flex flex-col md:flex-row gap-4 items-center border border-gray-200">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search destinations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-none rounded-full focus:outline-none"
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
            
            <div className="flex items-center border-l border-gray-200 pl-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-2 flex items-center rounded-l-full ${viewMode === 'grid' ? 'bg-gray-100' : 'bg-white'}`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 flex items-center rounded-r-full ${viewMode === 'map' ? 'bg-gray-100' : 'bg-white'}`}
              >
                <MapIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border border-gray-200">
            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Property Type
              </label>
              <select
                value={filters.propertyType}
                onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md focus:ring-airbnb-red focus:border-airbnb-red"
              >
                <option value="">Any Type</option>
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="villa">Villa</option>
                <option value="condo">Condo</option>
                <option value="studio">Studio</option>
              </select>
            </div>
            
            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md focus:ring-airbnb-red focus:border-airbnb-red"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="w-full h-10 border border-gray-300 rounded-md focus:ring-airbnb-red focus:border-airbnb-red"
                />
              </div>
            </div>
            
            {/* Bedrooms */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md focus:ring-airbnb-red focus:border-airbnb-red"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>
            
            {/* Purpose */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Purpose
              </label>
              <select
                value={filters.purpose}
                onChange={(e) => handleFilterChange('purpose', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-md focus:ring-airbnb-red focus:border-airbnb-red"
              >
                <option value="">Any</option>
                <option value="rent">For Rent</option>
                <option value="sale">For Sale</option>
              </select>
            </div>
            
            {/* Features */}
            <div className="md:col-span-2 lg:col-span-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Features
              </label>
              <div className="flex flex-wrap gap-2">
                {['Pool', 'Sea View', 'Garden', 'Parking', 'Air Conditioning', 'Balcony', 'Elevator', 'Gym', 'Security'].map((feature) => (
                  <button 
                    onClick={() => toggleFeature(feature)} 
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      filters.features.includes(feature) 
                        ? 'bg-airbnb-red text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`} 
                    key={feature}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Clear Filters */}
            <div className="md:col-span-2 lg:col-span-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-airbnb-red border border-airbnb-red rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
        
        {/* Results count and sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <p className="text-gray-700 font-medium mb-2 sm:mb-0">
            {filteredListings.length} properties found
          </p>
          
          <div className="flex items-center">
            <span className="text-gray-700 mr-2">Sort by:</span>
            <div className="relative">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none border border-gray-300 rounded-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-airbnb-red focus:border-transparent bg-white"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rating</option>
              </select>
              <ChevronDown className="absolute right-3 top-2.5 h-4 w-4 text-gray-500 pointer-events-none" />
            </div>
          </div>
        </div>
        
        {/* Results */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <div key={listing.id} className="group bg-white rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="relative">
                  <Link to={`/properties/${listing.id}`} className="block relative pb-[75%]">
                    <img 
                      src={listing.image} 
                      alt={listing.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-xl"
                    />
                  </Link>
                  
                  <button 
                    onClick={() => toggleFavorite(listing.id)} 
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors z-10"
                  >
                    <Heart className={`h-5 w-5 ${favorites.includes(listing.id) ? 'fill-airbnb-red text-airbnb-red' : 'text-gray-700'}`} />
                  </button>
                  
                  <div className="absolute bottom-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-md">
                    {listing.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center text-gray-800 text-sm mb-1">
                        <span className="font-semibold">{listing.location}</span>
                      </div>
                      <h3 className="text-base font-normal text-gray-600">{listing.title}</h3>
                    </div>
                    <div className="flex items-center text-gray-800 font-semibold">
                      <Star className="h-4 w-4 mr-1 fill-current text-black" />
                      {listing.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-gray-600 text-sm mt-1 mb-1">
                    <span>{listing.bedrooms} beds</span>
                    <span>•</span>
                    <span>{listing.bathrooms} baths</span>
                  </div>
                  
                  <div className="mt-2">
                    <span className="font-semibold text-gray-900">{listing.price}</span>
                    {listing.purpose === 'rent' && <span className="text-gray-600"> night</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-4 h-[600px] flex items-center justify-center">
            <div className="text-center">
              <MapIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Map View</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                The map view would display the {filteredListings.length} properties on an interactive map.
                <br />
                <span className="text-sm">(Map integration would be implemented with a library like Google Maps or Leaflet)</span>
              </p>
            </div>
          </div>
        )}
        
        {/* No Results */}
        {filteredListings.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              We couldn't find any properties matching your search criteria. Try adjusting your filters or search query.
            </p>
            <button 
              onClick={clearFilters}
              className="px-4 py-2 bg-airbnb-red text-white rounded-lg font-medium hover:bg-opacity-90 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
