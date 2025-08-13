import { useState } from 'react';

const ADMIN_PASSWORD = 'Admin432';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  timestamp: string;
  status: 'new' | 'read' | 'replied';
}

const sampleMessages: Message[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254 712 345 678',
    subject: 'Inquiry about delivery to Westlands',
    message: 'Hi, I need to send a package from CBD to Westlands. What would be the cost and how long would it take? Thank you.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'new'
  },
  {
    id: '2',
    name: 'Mary Smith',
    email: 'mary@example.com',
    phone: '+254 722 987 654',
    subject: 'Thank you for great service',
    message: 'Great service! Thank you for the quick delivery. The rider was very professional and my package arrived on time.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    status: 'read'
  },
  {
    id: '3',
    name: 'Peter Kamau',
    email: 'peter@business.com',
    phone: '+254 700 123 456',
    subject: 'Bulk delivery inquiry',
    message: 'We are a small business looking for a reliable delivery partner. Do you offer discounts for bulk deliveries?',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    status: 'new'
  }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<Message[]>(sampleMessages);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

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

  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    setReplyText('');
  };

  const sendReply = (messageId: string) => {
    // In a real app, this would send an email
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'replied' as const }
        : msg
    ));
    setReplyingTo(null);
    setReplyText('');
    
    // Show success message
    alert('Reply sent successfully!');
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'read' as const }
        : msg
    ));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-KE');
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
                <p className="text-2xl font-bold">{messages.length}</p>
              </div>
              <span className="text-3xl">📧</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Messages</p>
                <p className="text-2xl font-bold">{messages.filter(m => m.status === 'new').length}</p>
              </div>
              <span className="text-3xl">🔔</span>
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
        </div>

        {/* Messages Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Customer Messages</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{message.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        message.status === 'new' ? 'bg-blue-100 text-blue-800' :
                        message.status === 'read' ? 'bg-gray-100 text-gray-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {message.status === 'new' ? 'New' : message.status === 'read' ? 'Read' : 'Replied'}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        📧 {message.email}
                      </span>
                      {message.phone && (
                        <span className="flex items-center">
                          📞 {message.phone}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <h5 className="font-medium text-gray-800 mb-2">{message.subject}</h5>
                  <p className="text-gray-700 text-sm mb-4">{message.message}</p>
                  
                  <div className="flex space-x-2">
                    {message.status === 'new' && (
                      <button
                        onClick={() => markAsRead(message.id)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleReply(message.id)}
                      className="bg-rocs-green hover:bg-rocs-green-dark text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Reply
                    </button>
                    
                    <a
                      href={`mailto:${message.email}?subject=Re: ${message.subject}&body=Dear ${message.name},%0D%0A%0D%0AThank you for contacting Rocs Crew.%0D%0A%0D%0A`}
                      className="bg-rocs-yellow hover:bg-rocs-yellow-dark text-gray-800 px-3 py-1 rounded text-sm transition-colors"
                    >
                      Email Reply
                    </a>
                  </div>

                  {/* Reply Form */}
                  {replyingTo === message.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h6 className="font-medium text-gray-800 mb-2">Reply to {message.name}</h6>
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-rocs-green resize-none"
                        placeholder="Type your reply here..."
                      />
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => setReplyingTo(null)}
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded text-sm transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => sendReply(message.id)}
                          disabled={!replyText.trim()}
                          className="bg-rocs-green hover:bg-rocs-green-dark text-white px-4 py-2 rounded text-sm transition-colors disabled:opacity-50"
                        >
                          Send Reply
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
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
