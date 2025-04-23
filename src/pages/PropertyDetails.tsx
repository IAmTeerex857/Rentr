import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, Star, Heart, Share2, ArrowLeft, Check, 
  Phone, Mail, Calendar, ChevronLeft, ChevronRight,
  Bed, Bath, Maximize, Car, Wifi, Tv, Coffee, 
  UtensilsCrossed, Wind, Users
} from 'lucide-react';

// Mock property data
const propertyData = {
  id: 1,
  title: "Luxury Beachfront Villa",
  description: "Experience the ultimate Mediterranean lifestyle in this stunning beachfront villa with panoramic sea views. This exclusive property offers spacious living areas, a private pool, and direct beach access. Perfect for families or as a holiday investment.",
  location: "Kyrenia, North Cyprus",
  images: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
  ],
  price: "$250/night",
  priceValue: 250,
  rating: 4.9,
  reviews: 28,
  type: "villa",
  purpose: "rent",
  bedrooms: 4,
  bathrooms: 3,
  size: "350 m²",
  garage: 2,
  yearBuilt: 2020,
  features: [
    "Sea View", 
    "Private Pool", 
    "Garden", 
    "Air Conditioning", 
    "Parking", 
    "Balcony", 
    "Fully Furnished", 
    "Security System",
    "BBQ Area",
    "Outdoor Dining",
    "Beach Access"
  ],
  amenities: [
    "Wi-Fi",
    "TV",
    "Kitchen",
    "Washing Machine",
    "Dishwasher",
    "Coffee Machine",
    "Microwave",
    "Iron",
    "Hair Dryer"
  ],
  address: "123 Coastal Road, Kyrenia, North Cyprus",
  coordinates: { lat: 35.341, lng: 33.319 },
  agent: {
    name: "Maria Christou",
    phone: "+90 533 123 4567",
    email: "maria@cyprusstays.com",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=200&q=80",
    agency: "North Cyprus Luxury Properties"
  },
  availability: {
    available: true,
    availableDates: [
      { start: "2025-05-01", end: "2025-05-15" },
      { start: "2025-06-01", end: "2025-06-30" },
      { start: "2025-08-15", end: "2025-09-15" }
    ]
  }
};

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  console.log(`Loading property details for ID: ${id}`); // In a real app, this would fetch data based on ID
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  
  // In a real app, you would fetch the property data based on the ID
  // For now, we'll just use our mock data
  const property = propertyData;
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => 
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
          <div className="relative h-[500px] bg-gray-200">
            <img 
              src={property.images[currentImageIndex]} 
              alt={`${property.title} - Image ${currentImageIndex + 1}`}
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
          <div className="flex overflow-x-auto py-2 px-1 bg-white">
            {property.images.map((image, index) => (
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
                    <span className="font-medium">{property.rating}</span>
                    <span className="text-gray-600 ml-1">({property.reviews} reviews)</span>
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
                    <span className="font-medium">{property.size}</span>
                  </div>
                  <span className="text-xs text-gray-500">Area</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex items-center text-gray-500 mb-1">
                    <Car className="h-5 w-5 mr-1" />
                    <span className="font-medium">{property.garage}</span>
                  </div>
                  <span className="text-xs text-gray-500">Garage</span>
                </div>
              </div>
              
              {/* Price */}
              <div className="mt-4">
                <div className="text-2xl font-bold text-rose-600">{property.price}</div>
                {property.purpose === 'rent' && (
                  <span className="text-gray-500 text-sm">per night</span>
                )}
              </div>
            </div>
            
            {/* Description */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">{property.description}</p>
              <p className="text-gray-700 leading-relaxed">
                This property was built in {property.yearBuilt} and offers a perfect blend of modern amenities and traditional Mediterranean architecture. The villa is situated in a prime location with easy access to local attractions, restaurants, and beaches.
              </p>
            </div>
            
            {/* Features and Amenities */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Features & Amenities</h2>
              
              <h3 className="font-medium text-gray-900 mb-2">Property Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 mb-6">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-gray-700">{feature}</span>
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
              <p className="text-gray-700 mb-4">{property.address}</p>
              
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
                  src={property.agent.image} 
                  alt={property.agent.name}
                  className="w-16 h-16 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{property.agent.name}</h3>
                  <p className="text-gray-500 text-sm">{property.agent.agency}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <a 
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <Phone className="h-5 w-5 text-gray-500 mr-2" />
                  {property.agent.phone}
                </a>
                <a 
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <Mail className="h-5 w-5 text-gray-500 mr-2" />
                  {property.agent.email}
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
                      rows={4}
                      className="w-full border border-gray-300 rounded-md py-2 px-3 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="I'm interested in this property..."
                      defaultValue={`Hi ${property.agent.name}, I'm interested in the ${property.title} (ID: ${property.id}). Please contact me with more information.`}
                    />
                  </div>
                  <button
                    type="button"
                    className="w-full bg-rose-600 text-white py-2 rounded-md font-medium hover:bg-rose-700"
                  >
                    Send Message
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-rose-600 text-white py-2 rounded-md font-medium hover:bg-rose-700"
                >
                  Contact Agent
                </button>
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
                  {property.availability.availableDates.map((date, index) => (
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
