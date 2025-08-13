import { useState } from 'react';
import { MapPin, Calculator, Package, User, Phone, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

const PRICE_PER_KM = 30;

interface OrderFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickup: string;
  delivery: string;
  packageDetails: string;
  notes?: string;
}

export default function OrderForm() {
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    pickup: '',
    delivery: '',
    packageDetails: '',
    notes: ''
  });
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCreated, setOrderCreated] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculatePrice = () => {
    if (formData.pickup && formData.delivery) {
      // Simulate distance calculation (in real app, use Google Maps API)
      const estimatedDistance = Math.floor(Math.random() * 20) + 5; // Random 5-25 km
      const price = estimatedDistance * PRICE_PER_KM;
      
      setDistance(estimatedDistance);
      setEstimatedPrice(price);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!distance || !estimatedPrice) {
      alert('Please calculate the price first');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        ...formData,
        distance,
        cost: estimatedPrice,
        timestamp: new Date().toISOString()
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        setOrderCreated(result.order.id);
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          pickup: '',
          delivery: '',
          packageDetails: '',
          notes: ''
        });
        setDistance(null);
        setEstimatedPrice(null);
      } else {
        throw new Error('Failed to create order');
      }
    } catch (error) {
      alert('Error creating order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-600 mb-4">Order Created Successfully!</h3>
        <p className="text-gray-600 mb-4">
          Your order has been created with ID: <strong>{orderCreated}</strong>
        </p>
        <p className="text-gray-600 mb-6">
          You can track your order using this ID on our tracking page.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.location.href = `/tracking?id=${orderCreated}`}
            className="bg-rocs-green hover:bg-rocs-green-dark"
          >
            Track Order
          </Button>
          <Button 
            onClick={() => setOrderCreated(null)}
            variant="outline"
            className="border-rocs-green text-rocs-green hover:bg-rocs-green hover:text-white"
          >
            Create Another Order
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-rocs-green mb-4">Book Your Delivery</h2>
        <p className="text-gray-600">
          Fill in the details below to create your delivery order
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Customer Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="customerName" className="text-gray-700">Full Name *</Label>
              <Input
                id="customerName"
                name="customerName"
                type="text"
                required
                value={formData.customerName}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="customerEmail" className="text-gray-700">Email Address *</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                required
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="customerPhone" className="text-gray-700">Phone Number *</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="+254 7XX XXX XXX"
              />
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Delivery Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pickup" className="text-gray-700">Pickup Location *</Label>
              <Input
                id="pickup"
                name="pickup"
                type="text"
                required
                value={formData.pickup}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Enter pickup address in Nairobi"
              />
            </div>
            <div>
              <Label htmlFor="delivery" className="text-gray-700">Delivery Location *</Label>
              <Input
                id="delivery"
                name="delivery"
                type="text"
                required
                value={formData.delivery}
                onChange={handleInputChange}
                className="mt-1"
                placeholder="Enter delivery address in Nairobi"
              />
            </div>
          </div>
        </div>

        {/* Package Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Package Information
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="packageDetails" className="text-gray-700">Package Details *</Label>
              <Textarea
                id="packageDetails"
                name="packageDetails"
                required
                value={formData.packageDetails}
                onChange={handleInputChange}
                rows={3}
                className="mt-1"
                placeholder="Describe your package (type, size, weight, etc.)"
              />
            </div>
            <div>
              <Label htmlFor="notes" className="text-gray-700">Special Instructions (Optional)</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="mt-1"
                placeholder="Any special handling instructions"
              />
            </div>
          </div>
        </div>

        {/* Price Calculation */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Calculator className="w-5 h-5 mr-2" />
            Price Calculation
          </h3>
          
          {!estimatedPrice ? (
            <div className="text-center">
              <p className="text-gray-600 mb-4">Calculate delivery cost before placing order</p>
              <Button
                type="button"
                onClick={calculatePrice}
                disabled={!formData.pickup || !formData.delivery}
                className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800"
              >
                Calculate Price
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-rocs-green">{distance} km</div>
                <div className="text-sm text-gray-600">Distance</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-rocs-green">KES 30</div>
                <div className="text-sm text-gray-600">Per Kilometer</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-rocs-yellow">KES {estimatedPrice}</div>
                <div className="text-sm text-gray-600">Total Cost</div>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="text-center pt-6">
          <Button
            type="submit"
            disabled={isSubmitting || !estimatedPrice}
            className="bg-rocs-green hover:bg-rocs-green-dark text-white px-8 py-3 text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Order...
              </span>
            ) : (
              'Create Order'
            )}
          </Button>
          
          {estimatedPrice && (
            <p className="text-sm text-gray-600 mt-4">
              By placing this order, you agree to pay KES {estimatedPrice} upon delivery
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
