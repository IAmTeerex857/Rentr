import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Search as SearchIcon, Filter, Star, Grid, Map as MapIcon, 
  ChevronDown, Home, Heart
} from 'lucide-react';
import { fetchProperties, Property, PropertySearchFilters } from '../supabase/propertiesService';

// Define types
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
  const [favorites, setFavorites] = useState<string[]>([]);
  const [listings, setListings] = useState<Property[]>([]);
  const [filteredListings, setFilteredListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch properties from Supabase
  useEffect(() => {
    const loadProperties = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Convert filters to PropertySearchFilters
        const searchFilters: PropertySearchFilters = {
          location: searchQuery || undefined,
          propertyType: filters.propertyType || undefined,
          minPrice: filters.minPrice ? parseFloat(filters.minPrice) : undefined,
          maxPrice: filters.maxPrice ? parseFloat(filters.maxPrice) : undefined,
          bedrooms: filters.bedrooms ? parseInt(filters.bedrooms) : undefined,
          purpose: filters.purpose as 'rent' | 'sale' | undefined,
          amenities: filters.features.length > 0 ? filters.features : undefined,
        };
        
        const data = await fetchProperties(searchFilters);
        setListings(data);
        setFilteredListings(data);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProperties();
  }, [searchQuery, filters]);

  // Apply sorting to listings
  useEffect(() => {
    if (listings.length === 0) return;
    
    let sortedListings = [...listings];
    
    switch (sortOption) {
      case 'price-low-high':
        sortedListings.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        sortedListings.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sortedListings.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        // 'recommended' - no specific sorting, use default order
        break;
    }
    
    setFilteredListings(sortedListings);
  }, [listings, sortOption]);
  
  // Handle filter changes
  const handleFilterChange = (name: string, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id) 
        : [...prev, id]
    );
  };
  
  // Format price for display
  const formatPrice = (property: Property) => {
    if (property.purpose === 'rent') {
      return `${property.currency}${property.price}/night`;
    } else {
      return `${property.currency}${property.price.toLocaleString()}`;
    }
  };
  
  // Get property size for display
  const getPropertySize = (property: Property) => {
    return `${property.area} ${property.area_unit}`;
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for properties in North Cyprus..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            {/* View Toggle */}
            <div className="flex rounded-lg overflow-hidden border border-gray-300">
              <button 
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <Grid className="h-4 w-4" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1 px-3 py-2 ${viewMode === 'map' ? 'bg-blue-500 text-white' : 'bg-white'}`}
              >
                <MapIcon className="h-4 w-4" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
            
            {/* Sort Dropdown */}
            <div className="relative">
              <select 
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="appearance-none px-4 py-2 pr-8 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                  <select 
                    value={filters.propertyType}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
                
                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Price</label>
                  <input 
                    type="number" 
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    placeholder="Min Price"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Price</label>
                  <input 
                    type="number" 
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    placeholder="Max Price"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                  <select 
                    value={filters.bedrooms}
                    onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                  <select 
                    value={filters.purpose}
                    onChange={(e) => handleFilterChange('purpose', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Any</option>
                    <option value="rent">For Rent</option>
                    <option value="sale">For Sale</option>
                  </select>
                </div>
              </div>
              
              {/* Features */}
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Features</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {['Pool', 'Sea View', 'Garden', 'Parking', 'Air Conditioning', 'Balcony', 
                    'Elevator', 'Gym', 'Security', 'Fireplace', 'Terrace', 'BBQ'].map(feature => (
                    <label key={feature} className="flex items-center space-x-2">
                      <input 
                        type="checkbox"
                        checked={filters.features.includes(feature)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleFilterChange('features', [...filters.features, feature]);
                          } else {
                            handleFilterChange('features', 
                              filters.features.filter(f => f !== feature)
                            );
                          }
                        }}
                        className="rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            {isLoading 
              ? 'Loading properties...' 
              : `${filteredListings.length} ${filteredListings.length === 1 ? 'Property' : 'Properties'} Found`
            }
          </h2>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* No Results */}
        {!isLoading && filteredListings.length === 0 && !error && (
          <div className="text-center py-16">
            <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No properties found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search filters</p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilters({
                  propertyType: '',
                  minPrice: '',
                  maxPrice: '',
                  bedrooms: '',
                  purpose: '',
                  features: []
                });
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Clear All Filters
            </button>
          </div>
        )}
        
        {/* Grid View */}
        {viewMode === 'grid' && !isLoading && filteredListings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(property => (
              <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {/* Property Image */}
                <Link to={`/properties/${property.id}`} className="block relative h-48 overflow-hidden">
                  <img 
                    src={property.images[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(property.id);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100"
                  >
                    <Heart 
                      className={`h-5 w-5 ${favorites.includes(property.id) ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
                    />
                  </button>
                </Link>
                
                {/* Property Details */}
                <div className="p-4">
                  <Link to={`/properties/${property.id}`} className="block">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{property.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-medium ml-1">{property.rating || '—'}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{property.location}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {property.bedrooms} {property.bedrooms === 1 ? 'Bedroom' : 'Bedrooms'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {property.bathrooms} {property.bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {getPropertySize(property)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-blue-600">{formatPrice(property)}</p>
                      <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full capitalize">
                        For {property.purpose}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Map View */}
        {viewMode === 'map' && !isLoading && filteredListings.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-4 h-[600px] flex items-center justify-center">
            <p className="text-gray-500">Map view will be implemented in a future update.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
