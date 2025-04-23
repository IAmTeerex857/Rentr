import React from 'react';
import { User, Building, ArrowRight } from 'lucide-react';

interface UserTypeStepProps {
  formData: {
    userType: string;
    providerType: string;
  };
  updateFormData: (data: Partial<{ userType: string; providerType: string }>) => void;
  nextStep: () => void;
}

const UserTypeStep: React.FC<UserTypeStepProps> = ({ formData, updateFormData, nextStep }) => {
  const handleContinue = () => {
    if (formData.userType) {
      nextStep();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">I am a...</h3>
        <p className="text-sm text-gray-500 mb-4">Select the option that best describes you</p>
        
        <div className="grid grid-cols-1 gap-4">
          {/* Property Seeker Option */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              formData.userType === 'seeker' 
                ? 'border-rose-500 bg-rose-50' 
                : 'border-gray-300 hover:border-rose-300'
            }`}
            onClick={() => updateFormData({ userType: 'seeker', providerType: '' })}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${formData.userType === 'seeker' ? 'bg-rose-100' : 'bg-gray-100'}`}>
                <User className={`h-6 w-6 ${formData.userType === 'seeker' ? 'text-rose-600' : 'text-gray-500'}`} />
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium">Property Seeker</h4>
                <p className="text-sm text-gray-500">I'm looking to rent or buy property</p>
              </div>
            </div>
          </div>
          
          {/* Property Provider Option */}
          <div 
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              formData.userType === 'provider' 
                ? 'border-rose-500 bg-rose-50' 
                : 'border-gray-300 hover:border-rose-300'
            }`}
            onClick={() => updateFormData({ userType: 'provider' })}
          >
            <div className="flex items-center">
              <div className={`p-2 rounded-full ${formData.userType === 'provider' ? 'bg-rose-100' : 'bg-gray-100'}`}>
                <Building className={`h-6 w-6 ${formData.userType === 'provider' ? 'text-rose-600' : 'text-gray-500'}`} />
              </div>
              <div className="ml-4">
                <h4 className="text-base font-medium">Property Provider</h4>
                <p className="text-sm text-gray-500">I want to list my property for rent or sale</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Provider Type Selection (only shown if Provider is selected) */}
        {formData.userType === 'provider' && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-2">I am a...</h4>
            <div className="grid grid-cols-2 gap-4">
              <div 
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  formData.providerType === 'agent' 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-gray-300 hover:border-rose-300'
                }`}
                onClick={() => updateFormData({ providerType: 'agent' })}
              >
                <div className="text-center">
                  <h5 className="text-sm font-medium">Real Estate Agent</h5>
                  <p className="text-xs text-gray-500">I represent multiple properties</p>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  formData.providerType === 'homeowner' 
                    ? 'border-rose-500 bg-rose-50' 
                    : 'border-gray-300 hover:border-rose-300'
                }`}
                onClick={() => updateFormData({ providerType: 'homeowner' })}
              >
                <div className="text-center">
                  <h5 className="text-sm font-medium">Homeowner</h5>
                  <p className="text-xs text-gray-500">I'm listing my own property</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="pt-4">
        <button
          type="button"
          onClick={handleContinue}
          disabled={!formData.userType || (formData.userType === 'provider' && !formData.providerType)}
          className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
            (!formData.userType || (formData.userType === 'provider' && !formData.providerType)) 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          Continue <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default UserTypeStep;
