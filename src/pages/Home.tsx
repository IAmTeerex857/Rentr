import { Search, MapPin, Star, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { fetchFeaturedProperties, Property } from '../supabase/propertiesService';

interface Testimonial {
  name: string;
  text: string;
}

export default function Home() {
  const [featuredListings, setFeaturedListings] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch featured listings from Supabase
  useEffect(() => {
    const loadFeaturedProperties = async () => {
      try {
        const properties = await fetchFeaturedProperties(3);
        setFeaturedListings(properties);
      } catch (err) {
        console.error('Error loading featured properties:', err);
        setError('Failed to load featured properties');
        // Fallback to demo data if API fails
        setFeaturedListings([
          {
            id: '1',
            title: "Luxury Beachfront Villa",
            location: "Kyrenia, North Cyprus",
            images: ["https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"],
            price: 250,
            currency: "USD",
            purpose: "rent",
            bedrooms: 4,
            bathrooms: 3,
            area: 350,
            area_unit: "m²",
            property_type: "villa",
            amenities: ["Wi-Fi", "Pool", "Garden"],
            owner_id: "1",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "active",
            rating: 4.9,
            review_count: 28
          },
          {
            id: '2',
            title: "Modern City Apartment",
            location: "Nicosia, North Cyprus",
            images: ["https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80"],
            price: 110,
            currency: "USD",
            purpose: "rent",
            bedrooms: 2,
            bathrooms: 1,
            area: 85,
            area_unit: "m²",
            property_type: "apartment",
            amenities: ["Wi-Fi", "Air Conditioning", "Elevator"],
            owner_id: "2",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "active",
            rating: 4.7,
            review_count: 15
          },
          {
            id: '3',
            title: "Cozy Mountain Cottage",
            location: "Bellapais, North Cyprus",
            images: ["https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=800&q=80"],
            price: 90,
            currency: "USD",
            purpose: "rent",
            bedrooms: 3,
            bathrooms: 2,
            area: 120,
            area_unit: "m²",
            property_type: "cottage",
            amenities: ["Wi-Fi", "Fireplace", "Mountain View"],
            owner_id: "3",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            status: "active",
            rating: 4.8,
            review_count: 20
          }
        ] as Property[]);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedProperties();
  }, []);

  const testimonials: Testimonial[] = [
    {
      name: "Sara B.",
      text: "Found the perfect villa for our family vacation. The booking process was seamless and the property was exactly as described!"
    },
    {
      name: "Ahmed K.",
      text: "As a student, I needed a long-term rental. This platform made it easy to find a reliable, furnished apartment near my university."
    },
    {
      name: "Elena A.",
      text: "Listing and managing my properties has never been easier. The dashboard and analytics are top-notch!"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center min-h-[700px] overflow-hidden">
        {/* Background overlay */}
        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-900/70 to-rose-900/70 z-10"></div>
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://images.unsplash.com/photo-1620735692151-26a7e0748429?auto=format&fit=crop&w=2000"
            alt="North Cyprus Coastline"
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        {/* Content */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-6">
                Discover the Mediterranean's Hidden Gem
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                Find Your Dream <span className="text-airbnb-red">Property</span> in North Cyprus
              </h1>
              <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-8 max-w-xl">
                The perfect destination for your next home, vacation property, or investment opportunity
              </h2>
              
              <div className="flex flex-wrap gap-4 mt-8">
                <Link to="/properties" className="px-6 py-3 bg-rose-600 text-white rounded-lg font-bold shadow-lg hover:bg-rose-700 transition-colors flex items-center">
                  <Search className="mr-2 h-5 w-5" /> Browse Properties
                </Link>
                <Link to="/list-property" className="px-6 py-3 bg-white/20 backdrop-blur-sm text-white rounded-lg font-bold hover:bg-white/30 transition-colors">
                  List Your Property
                </Link>
              </div>
            </div>
            
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 lg:ml-auto">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Find Your Perfect Property</h3>
              <div className="space-y-4">
                {/* Location Search */}
                <div className="w-full">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Where to? (city, region, landmark)"
                      className="pl-10 w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-700 text-center"
                    />
                  </div>
                </div>
                
                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check In</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.value === '' ? e.target.type = 'text' : null}
                        className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-700 text-center"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Check Out</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="dd/mm/yyyy"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.value === '' ? e.target.type = 'text' : null}
                        className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-gray-700 text-center"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Property Type & Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Property Type</label>
                    <select className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent px-3 text-gray-700 appearance-none text-center">
                      <option value="">Any Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="house">House</option>
                      <option value="villa">Villa</option>
                      <option value="condo">Condo</option>
                      <option value="studio">Studio</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Budget</label>
                    <select className="w-full h-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent px-3 text-gray-700 appearance-none text-center">
                      <option value="">Any Price</option>
                      <option value="0-500">$0 - $500</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-2000">$1,000 - $2,000</option>
                      <option value="2000+">$2,000+</option>
                    </select>
                  </div>
                </div>
                
                {/* Purpose & Bedrooms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Purpose</label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-center h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-colors font-medium">
                        <span>For Rent</span>
                      </div>
                      <div className="flex items-center justify-center h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-colors font-medium">
                        <span>For Sale</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Bedrooms</label>
                    <div className="grid grid-cols-5 gap-2">
                      {["Any", "1", "2", "3", "4+"].map((num) => (
                        <div key={num} className="flex items-center justify-center h-12 border border-gray-300 rounded-lg cursor-pointer hover:border-rose-500 hover:bg-rose-50 transition-colors font-medium">
                          <span>{num}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Search Button */}
                <div className="pt-2">
                  <Link to="/properties">
                    <button className="w-full bg-rose-600 text-white h-12 px-8 rounded-lg font-bold shadow hover:bg-rose-700 transition-colors flex items-center justify-center">
                      <Search className="mr-2 h-5 w-5" />Search Properties
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <Star className="h-10 w-10 text-airbnb-red mb-2" />
          <h3 className="font-bold text-lg mb-2">Verified Listings</h3>
          <p className="text-gray-600">All properties are personally verified for quality, safety, and accuracy.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <User className="h-10 w-10 text-airbnb-red mb-2" />
          <h3 className="font-bold text-lg mb-2">Local Support</h3>
          <p className="text-gray-600">24/7 customer support in multiple languages to assist you at every step.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
          <MapPin className="h-10 w-10 text-airbnb-red mb-2" />
          <h3 className="font-bold text-lg mb-2">Best Price Guarantee</h3>
          <p className="text-gray-600">Find a better price elsewhere? We'll match it and offer exclusive deals.</p>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
              <Star className="h-8 w-8 text-airbnb-red mb-2" />
              <p className="text-gray-700 italic mb-4">"{t.text}"</p>
              <span className="font-bold text-airbnb-red">{t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12 flex flex-col items-center justify-center bg-white">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Ready to find your dream property or list your own?</h2>
        <div className="flex gap-4">
          <Link to="/register">
            <button className="bg-rose-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-rose-700">Start Searching</button>
          </Link>
          <Link to="/register">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold shadow hover:bg-blue-700">List Your Property</button>
          </Link>
        </div>
      </section>
    </div>
  );
}
