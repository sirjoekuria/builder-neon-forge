import { useState } from 'react';

const ADMIN_PASSWORD = 'Admin432';

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-rocs-green rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">🔒</span>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-rocs-green">Admin Dashboard</h2>
            <p className="mt-2 text-gray-600">
              Enter your password to access the admin panel
            </p>
          </div>

          <div className="bg-white py-8 px-6 shadow-lg rounded-xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green"
                  placeholder="Enter admin password"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-rocs-green hover:bg-rocs-green-dark text-white font-semibold py-3 rounded-lg transition-colors"
              >
                Access Dashboard
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Authorized personnel only. All access attempts are logged.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-rocs-green rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">RC</span>
              </div>
              <h1 className="text-2xl font-bold text-rocs-green">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <span className="text-3xl">📧</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold">45</p>
              </div>
              <span className="text-3xl">📦</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">KES 13,500</p>
              </div>
              <span className="text-3xl">💰</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Orders</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <span className="text-3xl">⏰</span>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Messages</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">John Doe</h4>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">New</span>
                </div>
                <p className="text-sm text-gray-600">john@example.com</p>
                <p className="text-sm text-gray-700 mt-2">Inquiry about delivery to Westlands</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">Mary Smith</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Read</span>
                </div>
                <p className="text-sm text-gray-600">mary@example.com</p>
                <p className="text-sm text-gray-700 mt-2">Great service! Thank you for the quick delivery.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">RC-2024-001</h4>
                  <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">In Transit</span>
                </div>
                <p className="text-sm text-gray-600">Customer: John Doe | +254 712 345 678</p>
                <p className="text-sm text-gray-700">From: Westlands → To: CBD | 5.2km | KES 156</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-gray-900">RC-2024-002</h4>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">Delivered</span>
                </div>
                <p className="text-sm text-gray-600">Customer: Mary Wanjiku | +254 722 987 654</p>
                <p className="text-sm text-gray-700">From: Karen → To: Kilimani | 8.1km | KES 243</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
