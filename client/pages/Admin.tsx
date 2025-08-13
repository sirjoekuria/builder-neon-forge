import { useState, useEffect } from 'react';
import {
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  LogOut,
  Eye,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  Bike,
  UserCheck,
  UserX,
  Star
} from 'lucide-react';

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

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  pickup: string;
  delivery: string;
  distance: number;
  cost: number;
  status: 'pending' | 'confirmed' | 'picked_up' | 'in_transit' | 'delivered' | 'cancelled';
  timestamp: string;
  riderName?: string;
  riderPhone?: string;
  notes?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
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

const sampleOrders: Order[] = [
  {
    id: 'RC-2024-001',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '+254 712 345 678',
    pickup: 'Westlands Shopping Mall, Nairobi',
    delivery: 'KICC, Nairobi CBD',
    distance: 5.2,
    cost: 156,
    status: 'in_transit',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    riderName: 'Peter Kimani',
    riderPhone: '+254 700 123 456',
    notes: 'Fragile package - handle with care'
  },
  {
    id: 'RC-2024-002',
    customerName: 'Mary Wanjiku',
    customerEmail: 'mary@example.com',
    customerPhone: '+254 722 987 654',
    pickup: 'Karen Shopping Centre',
    delivery: 'Yaya Centre, Kilimani',
    distance: 8.1,
    cost: 243,
    status: 'delivered',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    riderName: 'James Mwangi',
    riderPhone: '+254 701 987 654'
  },
  {
    id: 'RC-2024-003',
    customerName: 'Sarah Akinyi',
    customerEmail: 'sarah@fashion.com',
    customerPhone: '+254 733 456 789',
    pickup: 'Sarit Centre, Westlands',
    delivery: 'Village Market, Gigiri',
    distance: 12.5,
    cost: 375,
    status: 'pending',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    notes: 'Customer prefers delivery after 2 PM'
  }
];

const sampleUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+254 712 345 678',
    joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: 15,
    totalSpent: 2340,
    status: 'active'
  },
  {
    id: '2',
    name: 'Mary Wanjiku',
    email: 'mary@example.com',
    phone: '+254 722 987 654',
    joinDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: 22,
    totalSpent: 3456,
    status: 'active'
  },
  {
    id: '3',
    name: 'Sarah Akinyi',
    email: 'sarah@fashion.com',
    phone: '+254 733 456 789',
    joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: 8,
    totalSpent: 1240,
    status: 'active'
  },
  {
    id: '4',
    name: 'Peter Kamau',
    email: 'peter@business.com',
    phone: '+254 700 123 456',
    joinDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    totalOrders: 45,
    totalSpent: 8900,
    status: 'active'
  }
];

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'messages' | 'users' | 'riders'>('overview');
  
  // Data states
  const [messages, setMessages] = useState<Message[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [riders, setRiders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // UI states
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [editingOrder, setEditingOrder] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  // Fetch data from API
  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          const formattedOrders = data.orders.map((order: any) => ({
            id: order.id,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            customerPhone: order.customerPhone,
            pickup: order.pickup,
            delivery: order.delivery,
            distance: order.distance,
            cost: order.cost,
            status: order.currentStatus,
            timestamp: order.createdAt,
            riderName: order.riderName,
            riderPhone: order.riderPhone,
            notes: order.notes
          }));
          setOrders(formattedOrders);
        }
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/admin/messages');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(data.messages);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to sample data
      setMessages(sampleMessages);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchOrders(), fetchMessages()]);
    setIsLoading(false);
  };

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auto-refresh every 30 seconds when on orders tab
  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      const interval = setInterval(() => {
        fetchOrders();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, activeTab]);

  // Order management functions
  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        ));
        // Refresh orders to get latest data
        await fetchOrders();
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status');
    }
  };

  const assignRider = (orderId: string, riderName: string, riderPhone: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, riderName, riderPhone, status: 'confirmed' }
        : order
    ));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(orders.filter(order => order.id !== orderId));
  };

  // Message management functions
  const handleReply = (messageId: string) => {
    setReplyingTo(messageId);
    setReplyText('');
  };

  const sendReply = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'replied' as const }
        : msg
    ));
    setReplyingTo(null);
    setReplyText('');
    alert('Reply sent successfully!');
  };

  const markAsRead = (messageId: string) => {
    setMessages(messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, status: 'read' as const }
        : msg
    ));
  };

  const deleteMessage = (messageId: string) => {
    setMessages(messages.filter(msg => msg.id !== messageId));
  };

  // User management functions
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' }
        : user
    ));
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-KE');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'read': return 'bg-gray-100 text-gray-800';
      case 'replied': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'picked_up': return 'bg-purple-100 text-purple-800';
      case 'in_transit': return 'bg-orange-100 text-orange-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === 'active').length,
    totalOrders: orders.length,
    pendingOrders: orders.filter(o => o.status === 'pending').length,
    totalMessages: messages.length,
    unreadMessages: messages.filter(m => m.status === 'new').length,
    totalRevenue: orders.reduce((sum, order) => sum + order.cost, 0)
  };

  // Filter functions
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredMessages = messages.filter(message =>
    message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              className="flex items-center space-x-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'orders', label: 'Orders', icon: Package },
                { key: 'messages', label: 'Messages', icon: MessageSquare },
                { key: 'users', label: 'Users', icon: Users },
                { key: 'riders', label: 'Riders', icon: Bike }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-rocs-green text-rocs-green'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalUsers}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Package className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.totalOrders}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <MessageSquare className="h-8 w-8 text-yellow-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">New Messages</dt>
                      <dd className="text-lg font-medium text-gray-900">{stats.unreadMessages}</dd>
                    </dl>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">KES {stats.totalRevenue.toLocaleString()}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.customerName}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Recent Messages</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {messages.slice(0, 3).map((message) => (
                      <div key={message.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{message.name}</p>
                          <p className="text-sm text-gray-500">{message.subject}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(message.status)}`}>
                          {message.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Order Management</h2>
                <button
                  onClick={fetchOrders}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-rocs-green hover:bg-rocs-green-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isLoading ? 'Refreshing...' : 'Refresh Orders'}</span>
                </button>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rocs-green"
                    />
                  </div>
                </div>
                <div className="sm:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rocs-green"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="picked_up">Picked Up</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.id}</h3>
                      <p className="text-gray-600">{order.customerName} • {order.customerPhone}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <button
                        onClick={() => setEditingOrder(editingOrder === order.id ? null : order.id)}
                        className="p-2 text-gray-400 hover:text-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="p-2 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pickup</p>
                      <p className="text-sm text-gray-900">{order.pickup}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Delivery</p>
                      <p className="text-sm text-gray-900">{order.delivery}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Cost</p>
                      <p className="text-sm text-gray-900">KES {order.cost} ({order.distance}km)</p>
                    </div>
                  </div>

                  {order.riderName && (
                    <div className="mb-4 p-3 bg-gray-50 rounded">
                      <p className="text-sm font-medium text-gray-600">Assigned Rider</p>
                      <p className="text-sm text-gray-900">{order.riderName} ���� {order.riderPhone}</p>
                    </div>
                  )}

                  {order.notes && (
                    <div className="mb-4 p-3 bg-yellow-50 rounded">
                      <p className="text-sm font-medium text-yellow-800">Notes</p>
                      <p className="text-sm text-yellow-700">{order.notes}</p>
                    </div>
                  )}

                  {/* Order Actions */}
                  {editingOrder === order.id ? (
                    <div className="border-t pt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Update Status</label>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                            className="w-full border border-gray-300 rounded px-3 py-2"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="picked_up">Picked Up</option>
                            <option value="in_transit">In Transit</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Assign Rider</label>
                          <div className="flex space-x-2">
                            <input
                              type="text"
                              placeholder="Rider name"
                              className="flex-1 border border-gray-300 rounded px-3 py-2"
                              defaultValue={order.riderName || ''}
                            />
                            <input
                              type="text"
                              placeholder="Phone"
                              className="w-32 border border-gray-300 rounded px-3 py-2"
                              defaultValue={order.riderPhone || ''}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingOrder(null)}
                        className="bg-rocs-green text-white px-4 py-2 rounded hover:bg-rocs-green-dark"
                      >
                        Save Changes
                      </button>
                    </div>
                  ) : (
                    <div className="border-t pt-4 flex space-x-2">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                        >
                          Confirm Order
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'picked_up')}
                          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
                        >
                          Mark Picked Up
                        </button>
                      )}
                      {order.status === 'picked_up' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'in_transit')}
                          className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 text-sm"
                        >
                          In Transit
                        </button>
                      )}
                      {order.status === 'in_transit' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                        >
                          Mark Delivered
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rocs-green"
                />
              </div>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <div key={message.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <h4 className="font-semibold text-gray-900">{message.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(message.status)}`}>
                        {message.status}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{formatDate(message.timestamp)}</span>
                      <button
                        onClick={() => deleteMessage(message.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {message.email}
                      </span>
                      {message.phone && (
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {message.phone}
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
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* Search */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-rocs-green"
                />
              </div>
            </div>

            {/* Users List */}
            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">Joined {formatDate(user.joinDate)}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.totalOrders}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          KES {user.totalSpent.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => toggleUserStatus(user.id)}
                            className={`${user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
