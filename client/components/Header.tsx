import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-rocs-green rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">RC</span>
            </div>
            <span className="text-2xl font-bold text-rocs-green">Rocs Crew</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-rocs-green transition-colors">
              Home
            </Link>
            <Link to="/tracking" className="text-gray-700 hover:text-rocs-green transition-colors">
              Track Order
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-rocs-green transition-colors">
              Pricing
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-rocs-green transition-colors">
              Contact
            </Link>
          </nav>

          {/* Contact Info & CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Phone className="w-4 h-4" />
              <span>+254 700 898 950</span>
            </div>
            <Button className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-rocs-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/tracking"
                className="text-gray-700 hover:text-rocs-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                to="/pricing"
                className="text-gray-700 hover:text-rocs-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-rocs-green transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <Phone className="w-4 h-4" />
                <span>+254 700 898 950</span>
              </div>
              <Button className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 w-fit">
                Book Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
