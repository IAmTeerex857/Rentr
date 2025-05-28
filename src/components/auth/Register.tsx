import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, User, Building, CheckCircle, Mail, Lock, UserCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

// Step components
import UserTypeStep from './register-steps/UserTypeStep';
import CredentialsStep from './register-steps/CredentialsStep';
import ProfileInfoStep from './register-steps/ProfileInfoStep';
import TermsStep from './register-steps/TermsStep';
import SuccessStep from './register-steps/SuccessStep';

const Register = () => {
  const { register } = useAuth();
  // State to track current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // Form data state
  const [formData, setFormData] = useState({
    userType: '', // 'seeker' or 'provider'
    providerType: '', // 'agent' or 'homeowner', only if userType is 'provider'
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: '',
    city: '',
    avatar: null,
    agreeToTerms: false,
  });

  // Update form data
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Go to next step
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  // Go to previous step
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Render progress bar
  const renderProgressBar = () => {
    return (
      <div className="w-full mb-8">
        <div className="flex justify-between mb-2">
          {['User Type', 'Account', 'Profile', 'Terms'].map((step, index) => (
            <div 
              key={index} 
              className={`text-xs font-medium ${
                currentStep > index + 1 
                  ? 'text-rose-600' 
                  : currentStep === index + 1 
                  ? 'text-gray-800' 
                  : 'text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-rose-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${(currentStep - 1) * 33.33}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // Render current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UserTypeStep 
            formData={formData} 
            updateFormData={updateFormData} 
            nextStep={nextStep} 
          />
        );
      case 2:
        return (
          <CredentialsStep 
            formData={formData} 
            updateFormData={updateFormData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        );
      case 3:
        return (
          <ProfileInfoStep 
            formData={formData} 
            updateFormData={updateFormData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        );
      case 4:
        return (
          <TermsStep 
            formData={formData} 
            updateFormData={updateFormData} 
            nextStep={nextStep} 
            prevStep={prevStep} 
          />
        );
      case 5:
        return <SuccessStep userType={formData.userType} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">

      
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {currentStep === 5 ? 'Registration Complete!' : 'Create your account'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {currentStep === 5 
              ? 'You can now access all features. ' 
              : 'Join North Cyprus AirBnB to find or list properties. '}
            {currentStep === 5 && (
              <Link to="/login" className="font-medium text-rose-600 hover:text-rose-500">
                Sign in to your account
              </Link>
            )}
          </p>
        </div>
        
        {currentStep < 5 && renderProgressBar()}
        
        {renderStep()}
      </div>
    </div>
  );
};

export default Register;
