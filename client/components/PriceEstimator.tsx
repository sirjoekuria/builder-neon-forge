import { useState } from 'react';
import { MapPin, Calculator, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

const PRICE_PER_KM = 30;
const MINIMUM_PRICE = 200;

export default function PriceEstimator() {
  const [pickup, setPickup] = useState('');
  const [delivery, setDelivery] = useState('');
  const [distance, setDistance] = useState<number | null>(null);
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);

  const calculatePrice = () => {
    // In a real app, you'd use Mapbox API to calculate actual distance
    // For now, we'll use a simplified calculation
    if (pickup && delivery) {
      // Simulate distance calculation (in real app, use Mapbox API)
      const estimatedDistance = Math.floor(Math.random() * 20) + 5; // Random 5-25 km

      // Calculate base price
      const basePrice = estimatedDistance * PRICE_PER_KM;

      // Apply minimum price
      const priceWithMinimum = Math.max(basePrice, MINIMUM_PRICE);

      // Round to nearest 10
      const finalPrice = Math.round(priceWithMinimum / 10) * 10;

      setDistance(estimatedDistance);
      setEstimatedPrice(finalPrice);
    }
  };

  const resetCalculator = () => {
    setPickup('');
    setDelivery('');
    setDistance(null);
    setEstimatedPrice(null);
  };

  return (
    <section className="py-16 bg-rocs-green-light">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-rocs-green mb-4">
              Calculate Your Delivery Cost
            </h2>
            <p className="text-lg text-gray-600">
              Get an instant price estimate for your delivery in Nairobi
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Calculator Form */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="pickup" className="text-rocs-green font-semibold">
                    Pickup Location
                  </Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="pickup"
                      type="text"
                      placeholder="Enter pickup address in Nairobi"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-rocs-green"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="delivery" className="text-rocs-green font-semibold">
                    Delivery Location
                  </Label>
                  <div className="relative mt-2">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      id="delivery"
                      type="text"
                      placeholder="Enter delivery address in Nairobi"
                      value={delivery}
                      onChange={(e) => setDelivery(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-rocs-green"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button
                    onClick={calculatePrice}
                    disabled={!pickup || !delivery}
                    className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 flex-1"
                  >
                    <Calculator className="w-4 h-4 mr-2" />
                    Calculate Price
                  </Button>
                  <Button
                    onClick={resetCalculator}
                    variant="outline"
                    className="border-rocs-green text-rocs-green hover:bg-rocs-green hover:text-white"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              {/* Results */}
              <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center">
                {estimatedPrice ? (
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="text-sm text-gray-600 mb-2">Estimated Distance</div>
                      <div className="text-2xl font-bold text-rocs-green">{distance} km</div>
                    </div>
                    
                    <div className="mb-6">
                      <div className="text-sm text-gray-600 mb-2">Estimated Cost</div>
                      <div className="text-4xl font-bold text-rocs-yellow">
                        KES {estimatedPrice.toLocaleString()}
                      </div>
                    </div>

                    <Button className="bg-rocs-green hover:bg-rocs-green-dark text-white w-full">
                      Book This Delivery
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <Calculator className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Enter pickup and delivery locations to calculate price</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Info */}
            <div className="mt-8 bg-rocs-yellow-light rounded-lg p-6">
              <h3 className="text-lg font-semibold text-rocs-green mb-4">Service Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Service Area:</strong> Nairobi and surrounding areas
                </div>
                <div>
                  <strong>Payment:</strong> Cash or Mobile Money accepted
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
