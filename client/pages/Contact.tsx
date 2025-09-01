import { useState } from 'react';
import { Send, Phone, Mail, MapPin, UserPlus, Upload, Camera, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showRiderSignup, setShowRiderSignup] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      alert('Error sending message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="py-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-rocs-green rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-white text-3xl">✓</span>
          </div>
          <h2 className="text-3xl font-bold text-rocs-green mb-4">Message Sent Successfully!</h2>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for contacting us. We'll get back to you within 24 hours.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Send Another Message
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-rocs-green mb-4">
              Get In Touch
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Have questions about our delivery services? We're here to help!
            </p>
            
            {/* Rider Signup Button */}
            <div className="mb-8">
              <Button
                onClick={() => setShowRiderSignup(!showRiderSignup)}
                className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 font-semibold"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                {showRiderSignup ? 'Hide Rider Signup' : 'Join Our Riders Team'}
              </Button>
            </div>
          </div>

          {/* Rider Signup Form */}
          {showRiderSignup && <RiderSignupForm />}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-rocs-green mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-rocs-yellow p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Phone</h4>
                      <p className="text-gray-600">+254 700 898 950</p>
                      <p className="text-sm text-gray-500">Available 24/7 for emergency deliveries</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-rocs-yellow p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Email</h4>
                      <p className="text-gray-600">Kuriajoe85@gmail.com</p>
                      <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="bg-rocs-yellow p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-gray-800" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Service Area</h4>
                      <p className="text-gray-600">Nairobi & Surrounding Areas</p>
                      <p className="text-sm text-gray-500">Same-day delivery available</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="bg-rocs-green-light p-6 rounded-xl">
                <h4 className="font-semibold text-rocs-green mb-4">Business Hours</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>6:00 AM - 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span>7:00 AM - 9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span>8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-rocs-green text-rocs-green font-medium">
                    Emergency deliveries available 24/7
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-rocs-green mb-6">
                Send Us a Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 border-gray-300 focus:border-rocs-green"
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
                      className="mt-1 border-gray-300 focus:border-rocs-green"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-gray-700 font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="mt-1 border-gray-300 focus:border-rocs-green"
                      placeholder="+254 7XX XXX XXX"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject" className="text-gray-700 font-medium">
                      Subject *
                    </Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="mt-1 border-gray-300 focus:border-rocs-green"
                      placeholder="What's this about?"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="message" className="text-gray-700 font-medium">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={5}
                    className="mt-1 border-gray-300 focus:border-rocs-green resize-none"
                    placeholder="Tell us about your delivery needs or ask any questions..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 font-semibold py-3"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-800 mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Rider Signup Form Component
function RiderSignupForm() {
  const [riderData, setRiderData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nationalId: '',
    motorcycle: '',
    experience: '',
    area: '',
    motivation: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRiderData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/riders/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...riderData,
          timestamp: new Date().toISOString(),
          status: 'pending'
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        throw new Error('Failed to submit rider application');
      }
    } catch (error) {
      alert('Error submitting application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
        <div className="text-center">
          <div className="w-16 h-16 bg-rocs-green rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✓</span>
          </div>
          <h3 className="text-2xl font-bold text-rocs-green mb-2">Application Submitted!</h3>
          <p className="text-gray-600">
            Thank you for your interest in joining our riders team. We'll review your application and get back to you within 48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
      <h3 className="text-2xl font-semibold text-rocs-green mb-6">
        Join Our Riders Team
      </h3>
      <p className="text-gray-600 mb-6">
        Become a part of Rocs Crew and start earning money delivering packages across Nairobi. 
        We offer flexible schedules, competitive rates, and full support.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
              value={riderData.fullName}
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
              value={riderData.email}
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
              value={riderData.phone}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="+254 7XX XXX XXX"
            />
          </div>
          
          <div>
            <Label htmlFor="nationalId" className="text-gray-700 font-medium">
              National ID Number *
            </Label>
            <Input
              id="nationalId"
              name="nationalId"
              type="text"
              required
              value={riderData.nationalId}
              onChange={handleInputChange}
              className="mt-1"
              placeholder="Your ID number"
            />
          </div>
        </div>

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
              value={riderData.motorcycle}
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
              value={riderData.experience}
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
            value={riderData.area}
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
          <Textarea
            id="motivation"
            name="motivation"
            required
            value={riderData.motivation}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 resize-none"
            placeholder="Tell us why you want to be part of our team..."
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-rocs-green hover:bg-rocs-green-dark text-white font-semibold py-3"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting Application...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <UserPlus className="w-4 h-4 mr-2" />
              Submit Application
            </span>
          )}
        </Button>
      </form>
    </div>
  );
}
