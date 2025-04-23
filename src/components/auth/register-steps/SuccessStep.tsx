import React from 'react';
import { CheckCircle, User, Building, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

interface SuccessStepProps {
  userType: string;
  formData?: any;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ userType, formData }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleStartExploring = () => {
    if (userType === 'seeker') {
      navigate('/search');
    } else {
      navigate('/list-property');
    }
  };
  return (
    <div className="text-center py-6">
      <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      
      <h3 className="text-xl font-medium text-gray-900 mb-2">Registration Complete!</h3>
      <p className="text-gray-500 mb-6">
        Your account has been successfully created.
      </p>
      
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-center mb-2">
          {userType === 'seeker' ? (
            <User className="h-6 w-6 text-rose-600" />
          ) : (
            <Building className="h-6 w-6 text-rose-600" />
          )}
          <span className="ml-2 font-medium">
            {userType === 'seeker' ? 'Property Seeker' : 'Property Provider'}
          </span>
        </div>
        
        <p className="text-sm text-gray-600">
          {userType === 'seeker' 
            ? 'You can now search for properties, save favorites, and contact property owners.'
            : 'You can now list your properties, manage bookings, and connect with potential clients.'}
        </p>
      </div>
      
      <div className="space-y-3">
        <button 
          onClick={handleStartExploring}
          className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
        >
          {userType === 'seeker' 
            ? 'Start Exploring Properties' 
            : 'List Your First Property'}
          <ArrowRight className="ml-2 h-4 w-4" />
        </button>
        
        <Link to="/login">
          <button 
            className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Go to Login
          </button>
        </Link>
      </div>
    </div>
  );
};

export default SuccessStep;
