export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen bg-gradient-to-br from-rocs-green to-rocs-green-dark flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Fast & Reliable
              <span className="block text-rocs-yellow">Motorcycle Delivery</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              Your parcels delivered safely across Nairobi at KES 30 per kilometer
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                Book Delivery Now
              </button>
              <button className="border-2 border-white text-white hover:bg-white hover:text-rocs-green font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
                Track Your Order
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-rocs-green mb-4">
              Why Choose Rocs Crew?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional motorcycle delivery service with real-time tracking and guaranteed safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rocs-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-rocs-green mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Same-day delivery across Nairobi with our network of professional riders.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rocs-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-rocs-green mb-2">Secure & Safe</h3>
              <p className="text-gray-600">Your parcels are insured and handled with the utmost care by our trained riders.</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rocs-yellow rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📱</span>
              </div>
              <h3 className="text-xl font-semibold text-rocs-green mb-2">Real-time Tracking</h3>
              <p className="text-gray-600">Track your delivery live with our advanced GPS tracking system.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-rocs-green text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl mb-8">Contact us today for fast, reliable delivery across Nairobi</p>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📞</span>
              <div>
                <div className="font-semibold">Call Us</div>
                <div className="text-rocs-yellow">+254 700 898 950</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📧</span>
              <div>
                <div className="font-semibold">Email Us</div>
                <div className="text-rocs-yellow">Kuriajoe85@gmail.com</div>
              </div>
            </div>
          </div>

          <button className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 font-semibold px-8 py-4 rounded-lg text-lg transition-colors">
            Contact Us Today
          </button>
        </div>
      </section>
    </div>
  );
}
