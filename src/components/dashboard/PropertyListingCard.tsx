import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, MoreVertical, DollarSign } from 'lucide-react';

interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  status: string;
  purpose: string;
  image: string;
  views: number;
  inquiries: number;
  lastUpdated: string;
}

interface PropertyListingCardProps {
  property: Property;
  onDelete: (id: string) => void;
}

const PropertyListingCard = ({ property, onDelete }: PropertyListingCardProps) => {
  const [showActions, setShowActions] = useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={property.image} 
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.status === 'active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status === 'active' ? 'Active' : 'Pending'}
          </span>
        </div>
        <div className="absolute bottom-2 left-2">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            property.purpose === 'rent' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-purple-100 text-purple-800'
          }`}>
            {property.purpose === 'rent' ? 'For Rent' : 'For Sale'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">{property.title}</h3>
          <div className="relative">
            <button 
              className="p-1 rounded-full hover:bg-gray-100"
              onClick={() => setShowActions(!showActions)}
            >
              <MoreVertical className="h-5 w-5 text-gray-500" />
            </button>
            
            {showActions && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <Link 
                    to={`/properties/${property.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Property
                  </Link>
                  <Link 
                    to={`/edit-property/${property.id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Property
                  </Link>
                  <button 
                    onClick={() => {
                      onDelete(property.id);
                      setShowActions(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Property
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mb-3">{property.location}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center text-gray-700 text-sm mr-4">
            <span className="font-medium">{property.bedrooms}</span>
            <span className="mx-1">Bed</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm mr-4">
            <span className="font-medium">{property.bathrooms}</span>
            <span className="mx-1">Bath</span>
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <span className="font-medium">{property.size}</span>
            <span className="mx-1">m²</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <DollarSign className="h-5 w-5 text-gray-700" />
            <span className="text-lg font-bold text-gray-900">
              {property.purpose === 'rent' 
                ? `${property.price}/mo` 
                : property.price.toLocaleString()}
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            Last updated: {property.lastUpdated}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
          <div className="text-sm">
            <span className="text-gray-500">Views:</span>
            <span className="ml-1 font-medium text-gray-900">{property.views}</span>
          </div>
          <div className="text-sm">
            <span className="text-gray-500">Inquiries:</span>
            <span className="ml-1 font-medium text-gray-900">{property.inquiries}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingCard;
