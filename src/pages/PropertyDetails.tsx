import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Star, Heart, Share2, ArrowLeft, Check, 
  Phone, Mail, Calendar, ChevronLeft, ChevronRight,
  Bed, Bath, Maximize, Car, Wifi, Tv, Coffee, 
  UtensilsCrossed, Wind, Users, Loader2
} from 'lucide-react';
import { fetchPropertyById, Property } from '../supabase/propertiesService';
import PropertyReviews from '../components/reviews/PropertyReviews';

// Define interfaces for additional property data not in the database schema
interface PropertyAgent {
  name: string;
  phone: string;
  email: string;
  image: string;
  agency: string;
}

interface AvailabilityDate {
  start: string;
  end: string;
}

interface PropertyAvailability {
  available: boolean;
  availableDates: AvailabilityDate[];
}

interface PropertyExtras {
  agent: PropertyAgent;
  availability: PropertyAvailability;
  address: string;
  features: string[];
  garage: number;
  yearBuilt: number;
}
// Fallback data for when API fails
const fallbackAvailability: PropertyAvailability = {
  available: true,
  availableDates: [
    { start: "2025-05-01", end: "2025-05-15" },
    { start: "2025-06-01", end: "2025-06-30" },
    { start: "2025-08-15", end: "2025-09-15" }
  ]
};

// Fallback agent data
const fallbackAgent: PropertyAgent = {
  name: "Maria Christou",
  phone: "+90 533 123 4567",
  email: "maria@cyprusstays.com",
  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
  agency: "North Cyprus Luxury Properties"
};

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Additional property information not in the database schema
  const [propertyExtras, setPropertyExtras] = useState<PropertyExtras>({
    agent: fallbackAgent,
    availability: fallbackAvailability,
    address: "",
    features: [],
    garage: 0,
    yearBuilt: 0
  });
  
  useEffect(() => {
    const loadPropertyDetails = async () => {
      if (!id) {
        setError("Property ID is missing");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const propertyData = await fetchPropertyById(id);
        setProperty(propertyData);
        
        // Extract features from amenities or set defaults
        // In a real app, you might have a separate features field in the database
        const features = propertyData.amenities.filter(item => 
          ["Sea View", "Private Pool", "Garden", "Air Conditioning", "Parking", 
           "Balcony", "Fully Furnished", "Security System", "BBQ Area", 
           "Outdoor Dining", "Beach Access"].includes(item)
        );
        
        // Set property extras with some default values where needed
        setPropertyExtras({
          agent: fallbackAgent, // In a real app, you would fetch the agent data
          availability: fallbackAvailability, // In a real app, you would fetch availability
          address: propertyData.location, // Using location as address for now
          features,
          garage: 1, // Default value
          yearBuilt: new Date().getFullYear() - 2 // Default to 2 years old
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching property details:", err);
        setError("Failed to load property details. Please try again later.");
        setLoading(false);
      }
    };
    
    loadPropertyDetails();
  }, [id]);
  
  const nextImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev: number) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    if (!property?.images) return;
    setCurrentImageIndex((prev: number) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };
  
  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };
  
  const shareProperty = () => {
    // In a real app, this would open a share dialog
    alert('Share functionality would be implemented here');
  };

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-rose-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }
  
  // Handle error state
  if (error || !property) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error || "Property not found"}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button and actions */}
        <div className="flex justify-between items-center py-4">
          <Link to="/properties" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Search Results
          </Link>
          <div className="flex space-x-2">
            <button 
              onClick={toggleFavorite}
              className={`p-2 rounded-full ${isFavorite ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={shareProperty}
              className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Property Images */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="w-full h-[500px] overflow-hidden rounded-xl relative">
            <img 
              src={property.images && property.images.length > 0 
                ? property.images[currentImageIndex] 
                : 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80'} 
              alt={`Property image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
            />
            
            {/* Image navigation */}
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            
            {/* Image counter */}
            <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {property.images.length}
            </div>
            
            {/* Purpose tag */}
            <div className="absolute top-4 left-4 bg-rose-600 text-white px-3 py-1 rounded-md text-sm font-medium">
              {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
            </div>
          </div>
          
          {/* Thumbnail navigation */}
          <div className="flex mt-4 space-x-2 overflow-x-auto pb-2">
            {property.images && property.images.map((image, index) => (
              <div 
                key={index}
                className={`flex-shrink-0 w-20 h-20 mx-1 rounded-md overflow-hidden cursor-pointer border-2 ${
                  currentImageIndex === index ? 'border-rose-500' : 'border-transparent'
                }`}
                onClick={() => goToImage(index)}
              >
                <img 
                  src={image} 
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Property Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title and Rating */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="h-5 w-5 text-gray-400 mr-1" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="flex items-center mt-2 md:mt-0">
                  <div className="flex items-center bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                    <Star className="h-4 w-4 fill-current mr-1" />
                    <span className="font-bold text-gray-900">{property.rating || 4.5}</span>
                    <span className="text-gray-600">({property.review_count || 0} reviews)</span>
                  </div>
                </div>
              </div>
              
              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-b border-gray-200">
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Bed className="h-5 w-5 mr-1" />
                    <span className="font-medium">{property.bedrooms}</span>
                  </div>
                  <span className="text-xs text-gray-500">Bedrooms</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Bath className="h-5 w-5 mr-1" />
                    <span className="font-medium">{property.bathrooms}</span>
                  </div>
                  <span className="text-xs text-gray-500">Bathrooms</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Maximize className="h-5 w-5 mr-1" />
                    <span className="text-gray-900">{property.area} {property.area_unit || 'm²'}</span>
                  </div>
                  <span className="text-xs text-gray-500">Area</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Car className="h-5 w-5 mr-1" />
                    <span className="text-gray-900">{propertyExtras.garage}</span>
                  </div>
                  <span className="text-xs text-gray-500">Garage</span>
                </div>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                <span className="text-2xl font-bold text-gray-900">{property.currency} {property.price}{property.purpose === 'rent' ? '/night' : ''}</span>
                {property.purpose === 'rent' && (
                  <span className="text-gray-500 text-sm">per night</span>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{property.description}</p>
              <p className="text-gray-700 leading-relaxed">This property was built in {propertyExtras.yearBuilt} and offers a perfect blend of modern amenities and traditional Mediterranean architecture. The villa is situated in a prime location with easy access to local attractions, restaurants, and beaches.</p>
            </div>
            
            {/* Features and Amenities */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>

              <h3 className="font-medium text-gray-900 mb-2">Property Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                {property.amenities && property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{amenity}</span>
                  </div>
                ))}
              </div>

              <h3 className="font-medium text-gray-900 mb-2">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3">
                <div className="flex items-center">
                  <Wifi className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Wi-Fi</span>
                </div>
                <div className="flex items-center">
                  <Tv className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">TV</span>
                </div>
                <div className="flex items-center">
                  <Coffee className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Coffee Machine</span>
                </div>
                <div className="flex items-center">
                  <UtensilsCrossed className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Kitchen</span>
                </div>
                <div className="flex items-center">
                  <Wind className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Air Conditioning</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-2" />
                  <span className="text-gray-700">Family Friendly</span>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              <p className="text-gray-700">{propertyExtras.address}</p>

              {/* Map placeholder - in a real app, this would be an actual map */}
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Map would be displayed here</p>
                  <p className="text-sm text-gray-400">Using Google Maps or similar service</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Agent */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Agent</h2>

              <div className="flex items-center mb-4">
                <img
                  src={propertyExtras.agent.image}
                  alt={propertyExtras.agent.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{propertyExtras.agent.name}</h3>
                  <p className="text-gray-600">{propertyExtras.agent.agency}</p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 mb-4">
                <a href={`tel:${propertyExtras.agent.phone}`} className="flex items-center text-gray-800 hover:text-rose-600">
                  <Phone className="h-5 w-5 mr-2" />
                  {propertyExtras.agent.phone}
                </a>
                <a href={`mailto:${propertyExtras.agent.email}`} className="flex items-center text-gray-800 hover:text-rose-600">
                  <Mail className="h-5 w-5 mr-2" />
                  {propertyExtras.agent.email}
                </a>
              </div>

              {showContactForm ? (
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rose-500"
                      rows={4}
                      placeholder="Your message"
                      defaultValue={`Hi ${propertyExtras.agent.name}, I'm interested in the ${property.title} (ID: ${property.id}). Please contact me with more information.`}
                    ></textarea>
                  </div>
                  <button
                    type="button"
                    className="w-full bg-rose-600 text-white py-2 rounded-md font-medium hover:bg-rose-700"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <div className="flex justify-center mt-4">
                  <button 
                    onClick={() => setShowContactForm(!showContactForm)}
                    className="bg-rose-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-rose-700 transition-colors"
                  >
                    Contact {propertyExtras.agent.name}
                  </button>
                </div>
              )}
            </div>
            
            {/* Availability Calendar */}
            {property.purpose === 'rent' && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Availability</h2>
                  <Calendar className="h-5 w-5 text-gray-500" />
                </div>
                
                <div className="space-y-3">
                  {propertyExtras.availability.availableDates.map((date, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium text-gray-900">{date.start} - {date.end}</div>
                        <div className="text-sm text-gray-500">Available</div>
                      </div>
                      <button className="px-3 py-1 bg-rose-100 text-rose-700 rounded-md text-sm font-medium hover:bg-rose-200">
                        Book
                      </button>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50">
                  View Full Calendar
                </button>
              </div>
            )}
            
            {/* Property Reviews */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              {property && id && (
                <PropertyReviews propertyId={id} />
              )}
            </div>
            
            {/* Similar Properties */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Properties</h2>
              
              <div className="space-y-4">
                <div className="flex">
                  <img 
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=100&q=80" 
                    alt="Similar Property"
                    className="w-20 h-20 object-cover rounded-md mr-3"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">Modern Villa with Pool</h3>
                    <p className="text-gray-500 text-xs mb-1">Kyrenia, North Cyprus</p>
                    <p className="text-rose-600 font-medium text-sm">$220/night</p>
                  </div>
                </div>
                
                <div className="flex">
                  <img 
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=100&q=80" 
                    alt="Similar Property"
                    className="w-20 h-20 object-cover rounded-md mr-3"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">Beachfront Apartment</h3>
                    <p className="text-gray-500 text-xs mb-1">Famagusta, North Cyprus</p>
                    <p className="text-rose-600 font-medium text-sm">$180/night</p>
                  </div>
                </div>
                
                <div className="flex">
                  <img 
                    src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=100&q=80" 
                    alt="Similar Property"
                    className="w-20 h-20 object-cover rounded-md mr-3"
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">Luxury Mountain View Villa</h3>
                    <p className="text-gray-500 text-xs mb-1">Bellapais, North Cyprus</p>
                    <p className="text-rose-600 font-medium text-sm">$275/night</p>
                  </div>
                </div>
              </div>
              
              <Link to="/properties" className="block w-full text-center mt-4 text-rose-600 font-medium hover:text-rose-700">
                View More Properties
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;
