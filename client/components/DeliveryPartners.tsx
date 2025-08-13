import { useState } from 'react';
import { Building2, Users, Award, TrendingUp, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';

const partners = [
  {
    id: 1,
    name: "Jumia Kenya",
    logo: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=200&h=100&fit=crop",
    category: "E-commerce",
    description: "Leading online marketplace in Kenya",
    deliveries: "2000+",
    partnership: "Premium Partner",
    website: "jumia.co.ke",
    services: ["Same-day delivery", "Express shipping", "Last-mile delivery"]
  },
  {
    id: 2,
    name: "Glovo Kenya",
    logo: "https://images.unsplash.com/photo-1565966892-8a3c1bb1a2f2?w=200&h=100&fit=crop",
    category: "Food Delivery",
    description: "On-demand delivery platform",
    deliveries: "1500+",
    partnership: "Strategic Partner",
    website: "glovoapp.com",
    services: ["Food delivery", "Grocery delivery", "Pharmacy delivery"]
  },
  {
    id: 3,
    name: "Uber Eats",
    logo: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=100&fit=crop",
    category: "Food Delivery",
    description: "Global food delivery service",
    deliveries: "1200+",
    partnership: "Technology Partner",
    website: "ubereats.com",
    services: ["Restaurant delivery", "Fast food", "Premium dining"]
  },
  {
    id: 4,
    name: "KCB Bank",
    logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=100&fit=crop",
    category: "Banking",
    description: "Leading bank in East Africa",
    deliveries: "800+",
    partnership: "Financial Partner",
    website: "kcbgroup.com",
    services: ["Document delivery", "Cheque collection", "Card delivery"]
  },
  {
    id: 5,
    name: "Naivas Supermarket",
    logo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=100&fit=crop",
    category: "Retail",
    description: "Major supermarket chain",
    deliveries: "1000+",
    partnership: "Retail Partner",
    website: "naivas.co.ke",
    services: ["Grocery delivery", "Bulk orders", "Same-day service"]
  },
  {
    id: 6,
    name: "Safaricom",
    logo: "https://images.unsplash.com/photo-1559526324-593bc054d8e4?w=200&h=100&fit=crop",
    category: "Telecommunications",
    description: "Leading telecom in Kenya",
    deliveries: "600+",
    partnership: "Tech Partner",
    website: "safaricom.co.ke",
    services: ["SIM card delivery", "Device delivery", "Business services"]
  }
];

const partnerStats = [
  {
    icon: Building2,
    number: "50+",
    label: "Trusted Partners",
    description: "From startups to enterprises"
  },
  {
    icon: Users,
    number: "10K+",
    label: "Partner Deliveries",
    description: "Monthly delivery volume"
  },
  {
    icon: Award,
    number: "99.5%",
    label: "Success Rate",
    description: "Partner delivery success"
  },
  {
    icon: TrendingUp,
    number: "25%",
    label: "Monthly Growth",
    description: "Partner network expansion"
  }
];

const partnerBenefits = [
  {
    title: "Reliable Network",
    description: "Access to our trained and professional motorcycle delivery fleet",
    icon: "🏍️"
  },
  {
    title: "Real-time Tracking",
    description: "Advanced GPS tracking for all deliveries with live updates",
    icon: "📍"
  },
  {
    title: "Competitive Rates",
    description: "Special pricing for partners starting from KES 25 per kilometer",
    icon: "💰"
  },
  {
    title: "API Integration",
    description: "Seamless integration with your existing systems and platforms",
    icon: "🔌"
  },
  {
    title: "24/7 Support",
    description: "Dedicated support team available round the clock",
    icon: "🕐"
  },
  {
    title: "Analytics Dashboard",
    description: "Detailed insights and reports on all your deliveries",
    icon: "📊"
  }
];

export default function DeliveryPartners() {
  const [activeTab, setActiveTab] = useState<'partners' | 'benefits' | 'join'>('partners');

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-rocs-green/10 border border-rocs-green/20 rounded-full px-4 py-2 mb-4">
            <Building2 className="w-4 h-4 text-rocs-green" />
            <span className="text-rocs-green font-medium">Trusted Network</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-rocs-green mb-6">
            Our Delivery Partners
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Rocs Crew partners with leading businesses across Kenya to provide reliable, 
            fast, and secure delivery services. Join our growing network of satisfied partners.
          </p>
        </div>

        {/* Partner Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {partnerStats.map((stat, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-rocs-green/5 transition-colors">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-rocs-green rounded-lg mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-rocs-green mb-2">{stat.number}</div>
              <div className="font-semibold text-gray-800 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-12">
          <div className="flex justify-center">
            <div className="inline-flex bg-gray-100 rounded-xl p-1">
              {[
                { key: 'partners', label: 'Our Partners' },
                { key: 'benefits', label: 'Partner Benefits' },
                { key: 'join', label: 'Join Us' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.key
                      ? 'bg-rocs-green text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {/* Partners Tab */}
          {activeTab === 'partners' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((partner) => (
                <div key={partner.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  {/* Partner Logo */}
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-12 w-24 object-cover rounded-lg"
                    />
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      partner.partnership === 'Premium Partner' ? 'bg-yellow-100 text-yellow-800' :
                      partner.partnership === 'Strategic Partner' ? 'bg-blue-100 text-blue-800' :
                      partner.partnership === 'Technology Partner' ? 'bg-purple-100 text-purple-800' :
                      partner.partnership === 'Financial Partner' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {partner.partnership}
                    </span>
                  </div>

                  {/* Partner Info */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{partner.name}</h3>
                  <p className="text-gray-600 mb-4">{partner.description}</p>
                  
                  {/* Category & Deliveries */}
                  <div className="flex justify-between items-center mb-4">
                    <span className="bg-rocs-green/10 text-rocs-green px-3 py-1 rounded-full text-sm font-medium">
                      {partner.category}
                    </span>
                    <span className="text-gray-600 text-sm font-medium">
                      {partner.deliveries} deliveries
                    </span>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Services:</h4>
                    <div className="flex flex-wrap gap-2">
                      {partner.services.map((service, idx) => (
                        <span key={idx} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Website Link */}
                  <a
                    href={`https://${partner.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 text-rocs-green hover:text-rocs-green-dark transition-colors"
                  >
                    <span className="text-sm">{partner.website}</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}

          {/* Benefits Tab */}
          {activeTab === 'benefits' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {partnerBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl hover:bg-rocs-green/5 transition-colors">
                    <div className="text-4xl mb-2">{benefit.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="text-center mt-12">
                <button
                  onClick={() => setActiveTab('join')}
                  className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Become a Partner Today
                </button>
              </div>
            </div>
          )}

          {/* Join Tab */}
          {activeTab === 'join' && (
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <div className="bg-gray-50 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-rocs-green mb-6">Partner with Rocs Crew</h3>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Company Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green"
                          placeholder="Your company name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Contact Person</label>
                        <input
                          type="text"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green"
                          placeholder="business@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green"
                          placeholder="+254 7XX XXX XXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Business Category</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green">
                        <option>Select category</option>
                        <option>E-commerce</option>
                        <option>Food & Beverage</option>
                        <option>Retail</option>
                        <option>Healthcare</option>
                        <option>Financial Services</option>
                        <option>Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Monthly Delivery Volume</label>
                      <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green">
                        <option>Select volume</option>
                        <option>1-50 deliveries</option>
                        <option>51-200 deliveries</option>
                        <option>201-500 deliveries</option>
                        <option>500+ deliveries</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Message</label>
                      <textarea
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green resize-none"
                        placeholder="Tell us about your delivery needs..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-rocs-green hover:bg-rocs-green-dark text-white font-bold py-4 rounded-lg transition-colors"
                    >
                      Submit Partnership Request
                    </button>
                  </form>
                </div>

                {/* Contact Information */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-rocs-green mb-6">Get in Touch</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                      Ready to partner with Rocs Crew? Contact our partnership team to discuss 
                      how we can help grow your business with reliable delivery solutions.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-rocs-yellow p-3 rounded-lg">
                        <Phone className="w-6 h-6 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Partnership Hotline</h4>
                        <p className="text-gray-600">+254 700 898 950</p>
                        <p className="text-sm text-gray-500">Available 9 AM - 6 PM, Mon-Fri</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-rocs-yellow p-3 rounded-lg">
                        <Mail className="w-6 h-6 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Partnership Email</h4>
                        <p className="text-gray-600">partners@rocscrew.co.ke</p>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-rocs-yellow p-3 rounded-lg">
                        <MapPin className="w-6 h-6 text-gray-800" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-1">Office Location</h4>
                        <p className="text-gray-600">Nairobi Business District</p>
                        <p className="text-sm text-gray-500">Schedule a meeting with our team</p>
                      </div>
                    </div>
                  </div>

                  {/* Partnership Process */}
                  <div className="bg-rocs-green/5 rounded-xl p-6">
                    <h4 className="font-bold text-rocs-green mb-4">Partnership Process</h4>
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-rocs-green text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                        <span>Submit partnership request</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-rocs-green text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                        <span>Initial consultation call</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-rocs-green text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                        <span>Customize solution & pricing</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-rocs-green text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                        <span>Integration & launch</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
