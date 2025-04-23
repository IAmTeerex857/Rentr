import { useState } from 'react';
import { 
  Home, Upload, DollarSign, Calendar, Check, 
  ArrowLeft, ArrowRight, MapPin
} from 'lucide-react';

const ListProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Information
    propertyType: '',
    purpose: 'rent', // 'rent' or 'sale' or 'both'
    title: '',
    description: '',
    
    // Location
    address: '',
    city: '',
    postalCode: '',
    coordinates: { lat: 35.17, lng: 33.36 }, // Default to North Cyprus
    
    // Details
    bedrooms: '',
    bathrooms: '',
    size: '',
    amenities: [] as string[],
    features: [] as string[],
    
    // Media
    images: [] as File[],
    videos: [] as File[],
    
    // Pricing & Availability
    price: '',
    pricePeriod: 'night', // 'night', 'month', 'year', or 'sale'
    availableDates: [] as { start: Date, end: Date }[],
    
    // Rules & Policies
    houseRules: '',
    cancellationPolicy: 'flexible', // 'flexible', 'moderate', 'strict'
  });
  
  const totalSteps = 5;
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    
    if (name === 'amenities' || name === 'features') {
      setFormData(prev => {
        const currentArray = [...prev[name]];
        
        if (checked) {
          return { ...prev, [name]: [...currentArray, value] };
        } else {
          return { ...prev, [name]: currentArray.filter(item => item !== value) };
        }
      });
    }
  };
  
  const handlePurposeChange = (purpose: string) => {
    setFormData(prev => ({ ...prev, purpose }));
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would send the data to an API
    console.log('Submitting property data:', formData);
    // Redirect to success page or dashboard
    alert('Property submitted successfully! In a real app, you would be redirected to your dashboard.');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">List Your Property</h1>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {Array.from({ length: totalSteps }).map((_, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    idx + 1 === currentStep 
                      ? 'bg-rose-600 text-white' 
                      : idx + 1 < currentStep 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {idx + 1 < currentStep ? <Check className="h-5 w-5" /> : idx + 1}
                </div>
              ))}
            </div>
            <div className="relative w-full h-2 bg-gray-200 rounded-full">
              <div 
                className="absolute top-0 left-0 h-2 bg-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-500">
              <span>Basic Info</span>
              <span>Location</span>
              <span>Details</span>
              <span>Media</span>
              <span>Pricing</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Home className="mr-2 h-5 w-5 text-rose-600" />
                  Basic Information
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Property Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="condo">Condo</option>
                    <option value="studio">Studio</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handlePurposeChange('rent')}
                      className={`p-3 rounded-lg font-medium ${
                        formData.purpose === 'rent'
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      For Rent
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePurposeChange('sale')}
                      className={`p-3 rounded-lg font-medium ${
                        formData.purpose === 'sale'
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      For Sale
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePurposeChange('both')}
                      className={`p-3 rounded-lg font-medium ${
                        formData.purpose === 'both'
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Both
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Luxury Beachfront Villa"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your property in detail..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-32"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    Minimum 100 characters. Highlight key features, nearby attractions, and what makes your property special.
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 2: Location */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-rose-600" />
                  Location
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City/Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Kyrenia"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="Optional"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Map Location
                  </label>
                  <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                    <p className="text-gray-500">
                      Map component would go here (Google Maps or similar)
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Drag the pin to mark your property's exact location.
                  </p>
                </div>
              </div>
            )}
            
            {/* Step 3: Property Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Home className="mr-2 h-5 w-5 text-rose-600" />
                  Property Details
                </h2>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bedrooms *
                    </label>
                    <select
                      name="bedrooms"
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      <option value="0">Studio</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                      <option value="6+">6+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bathrooms *
                    </label>
                    <select
                      name="bathrooms"
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5+">5+</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Size (m²) *
                    </label>
                    <input
                      type="number"
                      name="size"
                      value={formData.size}
                      onChange={handleInputChange}
                      placeholder="e.g., 120"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Swimming Pool', 'Wi-Fi', 'Air Conditioning', 'Heating', 'Kitchen', 'Washing Machine', 
                      'TV', 'Parking', 'Elevator', 'Gym', 'Garden', 'Balcony'].map((amenity) => (
                      <div key={amenity} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`amenity-${amenity}`}
                          name="amenities"
                          value={amenity}
                          checked={formData.amenities.includes(amenity)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`amenity-${amenity}`} className="ml-2 block text-sm text-gray-700">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Sea View', 'Mountain View', 'City View', 'Beach Access', 'Waterfront', 
                      'Ski-in/Ski-out', 'Pet Friendly', 'Family Friendly', 'Suitable for Events'].map((feature) => (
                      <div key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`feature-${feature}`}
                          name="features"
                          value={feature}
                          checked={formData.features.includes(feature)}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`feature-${feature}`} className="ml-2 block text-sm text-gray-700">
                          {feature}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 4: Media */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Upload className="mr-2 h-5 w-5 text-rose-600" />
                  Photos & Videos
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Photos *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-500">
                      Drag and drop photos here, or click to select files
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload at least 5 high-quality photos. Maximum 20 photos (10MB each).
                    </p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    >
                      Select Files
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Videos (Optional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-1 text-sm text-gray-500">
                      Drag and drop videos here, or click to select files
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Upload up to 2 videos (100MB each). Supported formats: MP4, MOV.
                    </p>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                    >
                      Select Files
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 5: Pricing & Availability */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-rose-600" />
                  Pricing & Availability
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full pl-7 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price Period
                    </label>
                    <select
                      name="pricePeriod"
                      value={formData.pricePeriod}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      required
                    >
                      {formData.purpose === 'rent' || formData.purpose === 'both' ? (
                        <>
                          <option value="night">Per Night</option>
                          <option value="week">Per Week</option>
                          <option value="month">Per Month</option>
                          <option value="year">Per Year</option>
                        </>
                      ) : (
                        <option value="sale">Sale Price</option>
                      )}
                    </select>
                  </div>
                </div>
                
                {(formData.purpose === 'rent' || formData.purpose === 'both') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Availability Calendar
                    </label>
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">
                        Calendar component would go here to set available dates
                      </p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Mark the dates when your property is available for rent.
                    </p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    House Rules (Optional)
                  </label>
                  <textarea
                    name="houseRules"
                    value={formData.houseRules}
                    onChange={handleInputChange}
                    placeholder="Any specific rules for guests..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent h-24"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cancellation Policy
                  </label>
                  <select
                    name="cancellationPolicy"
                    value={formData.cancellationPolicy}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  >
                    <option value="flexible">Flexible (Full refund 1 day prior to arrival)</option>
                    <option value="moderate">Moderate (Full refund 5 days prior to arrival)</option>
                    <option value="strict">Strict (50% refund up to 1 week prior to arrival)</option>
                  </select>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Previous
                </button>
              ) : (
                <div></div>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-rose-700"
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex items-center px-4 py-2 bg-rose-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-rose-700"
                >
                  Submit Listing
                  <Check className="ml-2 h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListProperty;
