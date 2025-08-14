import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Phone, MapPin, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';

export default function Signup() {
  const [userType, setUserType] = useState<'customer' | 'rider'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Rider specific fields
    nationalId: '',
    motorcycle: '',
    experience: '',
    area: '',
    motivation: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint = userType === 'rider' ? '/api/riders/signup' : '/api/users/signup';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userType,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        // Store user session
        localStorage.setItem('user', JSON.stringify({
          id: result.user?.id || result.rider?.id,
          name: formData.fullName,
          email: formData.email,
          userType,
          isAuthenticated: true
        }));
        
        // Redirect based on user type
        if (userType === 'rider') {
          alert('Rider application submitted successfully! You will be notified once approved.');
          window.location.href = '/';
        } else {
          alert('Account created successfully!');
          window.location.href = '/book-delivery';
        }
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create account');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error creating account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rocs-green rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-rocs-green mb-2">Join Rocs Crew</h1>
          <p className="text-gray-600">Create your account to get started</p>
        </div>

        {/* User Type Selection */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Choose Account Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUserType('customer')}
              className={`p-6 rounded-lg border-2 transition-all ${
                userType === 'customer'
                  ? 'border-rocs-green bg-rocs-green/5'
                  : 'border-gray-200 hover:border-rocs-green/50'
              }`}
            >
              <User className={`w-8 h-8 mx-auto mb-3 ${userType === 'customer' ? 'text-rocs-green' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-800 mb-2">Customer</h3>
              <p className="text-sm text-gray-600">Book and track deliveries</p>
            </button>
            
            <button
              onClick={() => setUserType('rider')}
              className={`p-6 rounded-lg border-2 transition-all ${
                userType === 'rider'
                  ? 'border-rocs-green bg-rocs-green/5'
                  : 'border-gray-200 hover:border-rocs-green/50'
              }`}
            >
              <MapPin className={`w-8 h-8 mx-auto mb-3 ${userType === 'rider' ? 'text-rocs-green' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-800 mb-2">Rider</h3>
              <p className="text-sm text-gray-600">Deliver packages and earn money</p>
            </button>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            {userType === 'rider' ? 'Rider Application' : 'Customer Registration'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-700 font-medium">
                  Full Name *
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone" className="text-gray-700 font-medium">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
              
              {userType === 'rider' && (
                <div>
                  <Label htmlFor="nationalId" className="text-gray-700 font-medium">
                    National ID Number *
                  </Label>
                  <Input
                    id="nationalId"
                    name="nationalId"
                    type="text"
                    required
                    value={formData.nationalId}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="Your ID number"
                  />
                </div>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="password" className="text-gray-700 font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="mt-1 pr-10"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">
                  Confirm Password *
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            {/* Rider Specific Fields */}
            {userType === 'rider' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="motorcycle" className="text-gray-700 font-medium">
                      Motorcycle Details *
                    </Label>
                    <Input
                      id="motorcycle"
                      name="motorcycle"
                      type="text"
                      required
                      value={formData.motorcycle}
                      onChange={handleInputChange}
                      className="mt-1"
                      placeholder="Make, model, and year"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="experience" className="text-gray-700 font-medium">
                      Riding Experience *
                    </Label>
                    <select
                      id="experience"
                      name="experience"
                      required
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rocs-green"
                    >
                      <option value="">Select experience</option>
                      <option value="1-2 years">1-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="area" className="text-gray-700 font-medium">
                    Preferred Working Area *
                  </Label>
                  <select
                    id="area"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleInputChange}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rocs-green"
                  >
                    <option value="">Select area</option>
                    <option value="CBD">CBD</option>
                    <option value="Westlands">Westlands</option>
                    <option value="Karen">Karen</option>
                    <option value="Eastleigh">Eastleigh</option>
                    <option value="Kasarani">Kasarani</option>
                    <option value="Embakasi">Embakasi</option>
                    <option value="All areas">All areas</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="motivation" className="text-gray-700 font-medium">
                    Why do you want to join Rocs Crew? *
                  </Label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    required
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rocs-green resize-none"
                    placeholder="Tell us why you want to be part of our team..."
                  />
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-rocs-green hover:bg-rocs-green-dark text-white font-semibold py-3"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <UserPlus className="w-4 h-4 mr-2" />
                  {userType === 'rider' ? 'Submit Application' : 'Create Account'}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-rocs-green hover:text-rocs-green-dark font-medium">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
