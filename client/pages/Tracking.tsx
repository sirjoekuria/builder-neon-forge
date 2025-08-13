import { useState } from 'react';

export default function Tracking() {
  const [trackingId, setTrackingId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setIsLoading(true);
    setError('');
    setOrderData(null);

    // Simulate API call
    setTimeout(() => {
      if (trackingId === 'RC-2024-001') {
        setOrderData({
          id: 'RC-2024-001',
          customerName: 'John Doe',
          customerPhone: '+254 712 345 678',
          pickup: 'Westlands Shopping Mall, Nairobi',
          delivery: 'KICC, Nairobi CBD',
          distance: 5.2,
          cost: 156,
          currentStatus: 'in_transit',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          riderName: 'Peter Kimani',
          riderPhone: '+254 700 123 456'
        });
      } else {
        setError('Order not found. Please check your tracking ID and try again.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <section className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-rocs-green mb-4">
              Track Your Order
            </h1>
            <p className="text-lg text-gray-600">
              Enter your tracking ID to see real-time updates on your delivery
            </p>
          </div>

          {/* Search Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <form onSubmit={handleTrackOrder} className="space-y-4">
              <div>
                <label htmlFor="trackingId" className="block text-rocs-green font-semibold mb-2">
                  Tracking ID
                </label>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <input
                      id="trackingId"
                      type="text"
                      placeholder="Enter your tracking ID (e.g., RC-2024-001)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading || !trackingId.trim()}
                    className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Tracking...' : 'Track Order'}
                  </button>
                </div>
              </div>
            </form>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <div className="mt-6 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md">
              <strong>Try this sample tracking ID:</strong> RC-2024-001
            </div>
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="space-y-8">
              {/* Order Info Card */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-rocs-green mb-4">Order Details</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Order ID:</span>
                        <p className="text-gray-800">{orderData.id}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Customer:</span>
                        <p className="text-gray-800">{orderData.customerName}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Phone:</span>
                        <p className="text-gray-800">{orderData.customerPhone}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Distance:</span>
                        <p className="text-gray-800">{orderData.distance} km</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Cost:</span>
                        <p className="text-gray-800 font-semibold">KES {orderData.cost.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-rocs-green mb-4">Delivery Information</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-gray-600">Pickup Location:</span>
                        <p className="text-gray-800">{orderData.pickup}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Delivery Location:</span>
                        <p className="text-gray-800">{orderData.delivery}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Order Date:</span>
                        <p className="text-gray-800">{formatDate(orderData.createdAt)}</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">Estimated Delivery:</span>
                        <p className="text-gray-800">{formatDate(orderData.estimatedDelivery)}</p>
                      </div>
                      {orderData.riderName && (
                        <>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Rider:</span>
                            <p className="text-gray-800">{orderData.riderName}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Rider Phone:</span>
                            <p className="text-gray-800">{orderData.riderPhone}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Progress */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-semibold text-rocs-green mb-6">Delivery Progress</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rocs-green rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-800">Order Received</h4>
                      <p className="text-sm text-gray-600">Your order has been received and confirmed</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rocs-green rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-800">Order Confirmed</h4>
                      <p className="text-sm text-gray-600">Rider assigned: {orderData.riderName}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rocs-green rounded-full flex items-center justify-center text-white font-bold">
                      ✓
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-800">Package Picked Up</h4>
                      <p className="text-sm text-gray-600">Package collected from {orderData.pickup}</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-rocs-yellow rounded-full flex items-center justify-center text-gray-800 font-bold">
                      🚚
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-800">In Transit</h4>
                      <p className="text-sm text-rocs-yellow font-medium">Your package is on the way!</p>
                    </div>
                  </div>

                  <div className="flex items-center opacity-50">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-600">
                      📍
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="font-semibold text-gray-600">Delivered</h4>
                      <p className="text-sm text-gray-500">Package will be delivered soon</p>
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
