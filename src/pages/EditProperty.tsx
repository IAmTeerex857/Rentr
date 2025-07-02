import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchPropertyById, updateProperty, Property } from '../supabase/propertiesService';

const EditProperty = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Property state
  const [property, setProperty] = useState({
    title: '',
    description: '',
    location: '',
    price: 0,
    currency: 'USD',
    purpose: 'rent' as 'rent' | 'sale',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    area_unit: 'sqm',
    property_type: 'apartment',
    amenities: [] as string[],
    images: [] as string[],
    status: 'active' as 'active' | 'pending' | 'sold' | 'rented'
  });
  
  // Fetch property data
  useEffect(() => {
    const loadProperty = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await fetchPropertyById(id);
        
        // Check if user is the owner
        if (data.owner_id !== user?.id) {
          setError("You don't have permission to edit this property");
          setLoading(false);
          return;
        }
        
        setProperty({
          title: data.title,
          description: data.description,
          location: data.location,
          price: data.price,
          currency: data.currency,
          purpose: data.purpose,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          area: data.area,
          area_unit: data.area_unit,
          property_type: data.property_type,
          amenities: data.amenities || [],
          images: data.images || [],
          status: data.status
        });
        
        setLoading(false);
      } catch (err: any) {
        console.error('Error loading property:', err);
        setError(err.message || 'Failed to load property');
        setLoading(false);
      }
    };
    
    loadProperty();
  }, [id, user?.id]);
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user?.id) {
      setError('Missing property ID or user not authenticated');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      await updateProperty(id, {
        ...property,
        updated_at: new Date().toISOString(),
        purpose: property.purpose as 'rent' | 'sale',
        status: property.status as 'active' | 'pending' | 'sold' | 'rented'
      });
      
      setSuccess('Property updated successfully');
      setSaving(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating property:', err);
      setError(err.message || 'Failed to update property');
      setSaving(false);
    }
  };
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle number input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProperty(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };
  
  // Handle checkbox changes for amenities
  const handleAmenityChange = (amenity: string) => {
    setProperty(prev => {
      const amenities = [...prev.amenities];
      
      if (amenities.includes(amenity)) {
        return {
          ...prev,
          amenities: amenities.filter(item => item !== amenity)
        };
      } else {
        return {
          ...prev,
          amenities: [...amenities, amenity]
        };
      }
    });
  };
  
  // Handle image removal
  const handleRemoveImage = (index: number) => {
    setProperty(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };
  
  // Available amenities
  const availableAmenities = [
    'Wi-Fi', 'Air Conditioning', 'Heating', 'Kitchen', 'TV', 
    'Washing Machine', 'Free Parking', 'Pool', 'Hot Tub', 'Gym',
    'Elevator', 'Wheelchair Accessible', 'Smoke Alarm', 'Carbon Monoxide Alarm',
    'Private Entrance', 'Workspace', 'Sea View', 'Mountain View', 'Garden',
    'Balcony', 'BBQ', 'Beach Access'
  ];
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="mr-4 p-2 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5 text-gray-500" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Property</h1>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => navigate(`/properties/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 flex items-center"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
                Saving
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-700 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          <p>{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md text-green-700 flex items-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          <p>{success}</p>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={property.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="property_type" className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  id="property_type"
                  name="property_type"
                  value={property.property_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={property.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={property.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={property.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Property Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price
                </label>
                <div className="flex">
                  <select
                    id="currency"
                    name="currency"
                    value={property.currency}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                    <option value="GBP">£</option>
                    <option value="TRY">₺</option>
                  </select>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={property.price}
                    onChange={handleNumberChange}
                    className="flex-1 border border-l-0 border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <select
                  id="purpose"
                  name="purpose"
                  value={property.purpose}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="rent">For Rent</option>
                  <option value="sale">For Sale</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                  Area
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="area"
                    name="area"
                    value={property.area}
                    onChange={handleNumberChange}
                    className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                    min="0"
                  />
                  <select
                    id="area_unit"
                    name="area_unit"
                    value={property.area_unit}
                    onChange={handleChange}
                    className="border border-l-0 border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="sqm">m²</option>
                    <option value="sqft">ft²</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={property.bedrooms}
                  onChange={handleNumberChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                  min="0"
                />
              </div>
              
              <div>
                <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={property.bathrooms}
                  onChange={handleNumberChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                  min="0"
                  step="0.5"
                />
              </div>
            </div>
          </div>
          
          {/* Amenities */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenities</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {availableAmenities.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={property.amenities.includes(amenity)}
                    onChange={() => handleAmenityChange(amenity)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="ml-2 text-sm text-gray-700">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Images */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Images</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {property.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Property ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4 text-gray-700" />
                  </button>
                </div>
              ))}
              
              <div className="border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h-32 bg-gray-50">
                <div className="text-center p-4">
                  <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                  <p className="mt-1 text-xs text-gray-500">Upload Image</p>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              Image upload functionality would be implemented with Supabase Storage in a complete application.
            </p>
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(`/properties/${id}`)}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-rose-600 text-white rounded-md hover:bg-rose-700 flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white mr-2" />
                  Saving Changes
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditProperty;
