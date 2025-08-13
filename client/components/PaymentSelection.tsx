import { useState } from 'react';
import { CreditCard, Banknote, Shield, ArrowRight } from 'lucide-react';
import PayPalPayment from './PayPalPayment';
import CashOnDelivery from './CashOnDelivery';

interface PaymentSelectionProps {
  amount: number;
  currency?: string;
  onPaymentSuccess: (paymentDetails: any) => void;
  onPaymentError: (error: any) => void;
  disabled?: boolean;
}

type PaymentMethod = 'paypal' | 'cash' | null;

export default function PaymentSelection({ 
  amount, 
  currency = "KES", 
  onPaymentSuccess, 
  onPaymentError,
  disabled = false 
}: PaymentSelectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayPalSuccess = (details: any) => {
    setIsProcessing(false);
    onPaymentSuccess({
      method: 'paypal',
      transactionId: details.id,
      status: 'completed',
      amount: amount,
      currency: currency,
      details: details
    });
  };

  const handlePayPalError = (error: any) => {
    setIsProcessing(false);
    onPaymentError({
      method: 'paypal',
      error: error,
      message: 'PayPal payment failed. Please try again.'
    });
  };

  const handleCashConfirm = () => {
    setIsProcessing(true);
    // Simulate confirmation process
    setTimeout(() => {
      setIsProcessing(false);
      onPaymentSuccess({
        method: 'cash',
        transactionId: `COD-${Date.now()}`,
        status: 'pending',
        amount: amount,
        currency: currency,
        details: {
          paymentMethod: 'Cash on Delivery',
          note: 'Payment will be collected upon delivery'
        }
      });
    }, 1000);
  };

  // Convert KES to USD for PayPal (approximate conversion)
  const paypalAmount = currency === 'KES' ? amount / 130 : amount; // Rough KES to USD conversion
  const paypalCurrency = currency === 'KES' ? 'USD' : currency;

  if (disabled) {
    return (
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-8 text-center">
        <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-500 mb-2">Payment Options</h3>
        <p className="text-gray-400">Complete your order details to see payment options</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      {!selectedMethod && (
        <div>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-rocs-green mb-2">Choose Payment Method</h3>
            <p className="text-gray-600">Select how you'd like to pay for your delivery</p>
            <div className="text-xl font-semibold text-gray-800 mt-4">
              Total: {currency} {amount.toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PayPal Option */}
            <div 
              onClick={() => setSelectedMethod('paypal')}
              className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">PayPal</h4>
                <p className="text-gray-600 mb-4">Pay securely with PayPal</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓</span>
                    <span>Instant payment confirmation</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓</span>
                    <span>Secure & encrypted</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓</span>
                    <span>International payment support</span>
                  </div>
                </div>
                <div className="mt-4 text-blue-600 font-medium">
                  Pay ~${paypalAmount.toFixed(2)} USD
                </div>
                <div className="mt-4 flex items-center justify-center text-rocs-green font-medium">
                  <span>Select PayPal</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>

            {/* Cash on Delivery Option */}
            <div 
              onClick={() => setSelectedMethod('cash')}
              className="border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-rocs-green hover:shadow-lg transition-all duration-300 group"
            >
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-rocs-green rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Banknote className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">Cash on Delivery</h4>
                <p className="text-gray-600 mb-4">Pay when you receive your package</p>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓</span>
                    <span>No advance payment required</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓</span>
                    <span>Pay in cash or M-Pesa</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <span>✓</span>
                    <span>Preferred by local customers</span>
                  </div>
                </div>
                <div className="mt-4 text-rocs-green font-medium">
                  Pay {currency} {amount.toLocaleString()} on delivery
                </div>
                <div className="mt-4 flex items-center justify-center text-rocs-green font-medium">
                  <span>Select Cash on Delivery</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Payment Method */}
      {selectedMethod && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-rocs-green">
              {selectedMethod === 'paypal' ? 'PayPal Payment' : 'Cash on Delivery'}
            </h3>
            <button
              onClick={() => setSelectedMethod(null)}
              className="text-gray-500 hover:text-gray-700 underline"
              disabled={isProcessing}
            >
              Change Payment Method
            </button>
          </div>

          {selectedMethod === 'paypal' && (
            <PayPalPayment
              amount={paypalAmount}
              currency={paypalCurrency}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
              onCancel={() => setSelectedMethod(null)}
              disabled={isProcessing}
            />
          )}

          {selectedMethod === 'cash' && (
            <CashOnDelivery
              amount={amount}
              currency={currency}
              onConfirm={handleCashConfirm}
              disabled={isProcessing}
            />
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 rounded-lg p-4 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <Shield className="w-4 h-4 text-green-500" />
          <span>All payments are secure and protected</span>
        </div>
      </div>
    </div>
  );
}
