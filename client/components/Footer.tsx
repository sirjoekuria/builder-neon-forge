import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-rocs-green text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-rocs-yellow rounded-full flex items-center justify-center">
                <span className="text-gray-800 font-bold text-lg">RC</span>
              </div>
              <span className="text-2xl font-bold">Rocs Crew</span>
            </div>
            <p className="text-rocs-green-light mb-6">
              Nairobi's premier motorcycle delivery service. Fast, reliable, and affordable parcel delivery across the city.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-rocs-yellow transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-rocs-yellow transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-rocs-yellow transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-rocs-yellow transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-rocs-green-light hover:text-rocs-yellow transition-all duration-200 hover:translate-x-1 hover:underline active:scale-95">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-rocs-green-light hover:text-rocs-yellow transition-all duration-200 hover:translate-x-1 hover:underline active:scale-95">
                  Track Order
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-rocs-green-light hover:text-rocs-yellow transition-all duration-200 hover:translate-x-1 hover:underline active:scale-95">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-rocs-green-light hover:text-rocs-yellow transition-all duration-200 hover:translate-x-1 hover:underline active:scale-95">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-rocs-green-light hover:text-rocs-yellow transition-all duration-200 hover:translate-x-1 hover:underline active:scale-95">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-rocs-green-light hover:text-rocs-yellow transition-all duration-200 hover:translate-x-1 hover:underline active:scale-95">
                  Join as Rider
                </Link>
              </li>
              <li>
                <Link to="/rider-login" className="text-rocs-green-light hover:text-rocs-yellow transition-all duration-200 hover:translate-x-1 hover:underline active:scale-95">
                  Rider Sign In
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Our Services</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                  Same-day Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                  Express Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                  Document Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                  Package Delivery
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                  Food Delivery
                </Link>
              </li>
              <li>
                <Link to="/tracking" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                  Real-time Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-rocs-yellow mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Phone</div>
                  <div className="text-rocs-green-light">+254 700 898 950</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-rocs-yellow mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Email</div>
                  <div className="text-rocs-green-light">Kuriajoe85@gmail.com</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-rocs-yellow mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Service Area</div>
                  <div className="text-rocs-green-light">Nairobi & Surrounding Areas</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-rocs-yellow mt-1 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Operating Hours</div>
                  <div className="text-rocs-green-light">24/7 Service Available</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-rocs-green-dark mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-rocs-green-light text-sm mb-4 md:mb-0">
              © 2024 Rocs Crew. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/contact" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                Privacy Policy
              </Link>
              <Link to="/contact" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-rocs-green-light hover:text-rocs-yellow transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
