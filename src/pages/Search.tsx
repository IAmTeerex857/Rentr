import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search as SearchIcon, MapPin, Calendar, Home, 
  DollarSign, Bed, Bath, Maximize, Filter, 
  ChevronDown, X
} from 'lucide-react';

const Search = () => {
  const navigate = useNavigate();
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    propertyType: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    minArea: '',
    maxArea: '',
    purpose: 'rent', // 'rent' or 'sale'
    amenities: [] as string[]
  });
  
  // Popular locations
  const popularLocations = [
    { name: 'Kyrenia', image: 'https://images.unsplash.com/photo-1620735692151-26a7e0748429?auto=format&fit=crop&w=300&q=80' },
    { name: 'Famagusta', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=300&q=80' },
    { name: 'Nicosia', image: 'https://images.unsplash.com/photo-1596005554384-d293674c91d7?auto=format&fit=crop&w=300&q=80' },
    { name: 'Bellapais', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=300&q=80' }
  ];
  
  // Available amenities
  const availableAmenities = [
    'Swimming Pool', 'Sea View', 'Garden', 'Balcony', 'Parking',
    'Air Conditioning', 'Wi-Fi', 'Gym', 'Security System', 'Elevator',
    'Furnished', 'Pet Friendly', 'Beach Access'
  ];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };
  
  const toggleAmenity = (amenity: string) => {
    setSearchForm(prev => {
      const amenities = [...prev.amenities];
      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...amenities, amenity] };
      }
    });
  };
  
  const handlePurposeChange = (purpose: 'rent' | 'sale') => {
    setSearchForm(prev => ({ ...prev, purpose }));
  };
  
  const handleLocationSelect = (location: string) => {
    setSearchForm(prev => ({ ...prev, location }));
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Build query parameters
    const params = new URLSearchParams();
    
    if (searchForm.location) params.append('location', searchForm.location);
    if (searchForm.checkIn) params.append('checkIn', searchForm.checkIn);
    if (searchForm.checkOut) params.append('checkOut', searchForm.checkOut);
    if (searchForm.propertyType) params.append('type', searchForm.propertyType);
    if (searchForm.minPrice) params.append('minPrice', searchForm.minPrice);
    if (searchForm.maxPrice) params.append('maxPrice', searchForm.maxPrice);
    if (searchForm.bedrooms) params.append('bedrooms', searchForm.bedrooms);
    if (searchForm.bathrooms) params.append('bathrooms', searchForm.bathrooms);
    if (searchForm.minArea) params.append('minArea', searchForm.minArea);
    if (searchForm.maxArea) params.append('maxArea', searchForm.maxArea);
    params.append('purpose', searchForm.purpose);
    
    if (searchForm.amenities.length > 0) {
      params.append('amenities', searchForm.amenities.join(','));
    }
    
    // Navigate to search results with query parameters
    navigate(`/properties?${params.toString()}`);
  };
  
  const clearFilters = () => {
    setSearchForm({
      location: '',
      checkIn: '',
      checkOut: '',
      propertyType: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      minArea: '',
      maxArea: '',
      purpose: 'rent',
      amenities: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-rose-900/70 z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1620735692151-26a7e0748429?auto=format&fit=crop&w=2000"
            alt="North Cyprus"
            className="w-full h-full object-cover"
          />
          <div className="relative z-20 py-16 px-6 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Find Your Perfect Property in North Cyprus
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Search through thousands of properties for rent or sale across North Cyprus
            </p>
          </div>
        </div>
        
        {/* Search Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={searchForm.location}
                    onChange={handleInputChange}
                    placeholder="City, area, or landmark"
                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Check In */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check In
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="checkIn"
                    value={searchForm.checkIn}
                    onChange={handleInputChange}
                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Check Out */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Check Out
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    name="checkOut"
                    value={searchForm.checkOut}
                    onChange={handleInputChange}
                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <select
                    name="propertyType"
                    value={searchForm.propertyType}
                    onChange={handleInputChange}
                    className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="studio">Studio</option>
                  </select>
                </div>
              </div>
            </div>
            
            {/* Purpose Toggle */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                I'm looking to:
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handlePurposeChange('rent')}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    searchForm.purpose === 'rent'
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Rent a Property
                </button>
                <button
                  type="button"
                  onClick={() => handlePurposeChange('sale')}
                  className={`px-6 py-3 rounded-lg font-medium ${
                    searchForm.purpose === 'sale'
                      ? 'bg-rose-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Buy a Property
                </button>
              </div>
            </div>
            
            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center text-gray-700 hover:text-gray-900"
              >
                <Filter className="h-5 w-5 mr-2" />
                Advanced Filters
                <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
              </button>
              
              {(searchForm.minPrice || 
                searchForm.maxPrice || 
                searchForm.bedrooms || 
                searchForm.bathrooms || 
                searchForm.minArea || 
                searchForm.maxArea || 
                searchForm.amenities.length > 0) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-rose-600 text-sm font-medium hover:text-rose-700"
                >
                  Clear all filters
                </button>
              )}
            </div>
            
            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="minPrice"
                          value={searchForm.minPrice}
                          onChange={handleInputChange}
                          placeholder="Min"
                          className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="maxPrice"
                          value={searchForm.maxPrice}
                          onChange={handleInputChange}
                          placeholder="Max"
                          className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Bedrooms & Bathrooms */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bedrooms & Bathrooms
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="relative">
                        <Bed className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <select
                          name="bedrooms"
                          value={searchForm.bedrooms}
                          onChange={handleInputChange}
                          className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                          <option value="">Any Bedrooms</option>
                          <option value="1">1+ Bedrooms</option>
                          <option value="2">2+ Bedrooms</option>
                          <option value="3">3+ Bedrooms</option>
                          <option value="4">4+ Bedrooms</option>
                          <option value="5">5+ Bedrooms</option>
                        </select>
                      </div>
                      <div className="relative">
                        <Bath className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <select
                          name="bathrooms"
                          value={searchForm.bathrooms}
                          onChange={handleInputChange}
                          className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        >
                          <option value="">Any Bathrooms</option>
                          <option value="1">1+ Bathrooms</option>
                          <option value="2">2+ Bathrooms</option>
                          <option value="3">3+ Bathrooms</option>
                          <option value="4">4+ Bathrooms</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Area */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Area (m²)
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Maximize className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="minArea"
                          value={searchForm.minArea}
                          onChange={handleInputChange}
                          placeholder="Min"
                          className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                      <span className="text-gray-500">-</span>
                      <div className="relative flex-1">
                        <Maximize className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          type="number"
                          name="maxArea"
                          value={searchForm.maxArea}
                          onChange={handleInputChange}
                          placeholder="Max"
                          className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Amenities */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableAmenities.map((amenity) => (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`px-3 py-1 rounded-full text-sm ${
                          searchForm.amenities.includes(amenity)
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {amenity}
                        {searchForm.amenities.includes(amenity) && (
                          <X className="inline-block h-3 w-3 ml-1" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Search Button */}
            <button
              type="submit"
              className="w-full bg-rose-600 text-white h-12 rounded-lg font-bold shadow hover:bg-rose-700 transition-colors flex items-center justify-center"
            >
              <SearchIcon className="mr-2 h-5 w-5" />
              Search Properties
            </button>
          </form>
        </div>
        
        {/* Popular Locations */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Locations in North Cyprus</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {popularLocations.map((location) => (
              <div 
                key={location.name}
                className="relative rounded-xl overflow-hidden h-48 cursor-pointer group"
                onClick={() => handleLocationSelect(location.name)}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                <img 
                  src={location.image} 
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                  <h3 className="text-xl font-bold text-white">{location.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Search Tips */}
        <div className="bg-blue-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Search Tips</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-2">•</span>
              Use the location field to search for specific areas, cities, or landmarks in North Cyprus.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-2">•</span>
              For rental properties, specify your check-in and check-out dates to see availability.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-2">•</span>
              Use the advanced filters to narrow down your search by price, size, and amenities.
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 font-bold mr-2">•</span>
              Toggle between "Rent" and "Buy" to see properties available for short-term rental or purchase.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Search;
