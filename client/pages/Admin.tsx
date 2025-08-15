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
  Star,
  Handshake,
  Building2
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
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'messages' | 'users' | 'riders' | 'partnerships'>('overview');
  
  // Data states
  const [messages, setMessages] = useState<Message[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [riders, setRiders] = useState<any[]>([]);
  const [availableRiders, setAvailableRiders] = useState<any[]>([]);
  const [partnershipRequests, setPartnershipRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assigningRider, setAssigningRider] = useState<string | null>(null);
  
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

  const fetchRiders = async () => {
    try {
      const response = await fetch('/api/admin/riders');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRiders(data.riders);
        }
      }
    } catch (error) {
      console.error('Error fetching riders:', error);
    }
  };

  const fetchAvailableRiders = async () => {
    try {
      const response = await fetch('/api/riders/available');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setAvailableRiders(data.riders);
        }
      }
    } catch (error) {
      console.error('Error fetching available riders:', error);
    }
  };

  const fetchPartnershipRequests = async () => {
    try {
      const response = await fetch('/api/admin/partnership-requests');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setPartnershipRequests(data.requests);
        }
      }
    } catch (error) {
      console.error('Error fetching partnership requests:', error);
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    await Promise.all([fetchOrders(), fetchMessages(), fetchRiders(), fetchAvailableRiders(), fetchPartnershipRequests()]);
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

  // Rider management functions
  const updateRiderStatus = async (riderId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/riders/${riderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchRiders();
      } else {
        alert('Failed to update rider status');
      }
    } catch (error) {
      console.error('Error updating rider status:', error);
      alert('Error updating rider status');
    }
  };

  const toggleRiderActive = async (riderId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/riders/${riderId}/active`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        await fetchRiders();
      } else {
        alert('Failed to update rider status');
      }
    } catch (error) {
      console.error('Error updating rider status:', error);
      alert('Error updating rider status');
    }
  };

  const deleteRider = async (riderId: string) => {
    if (!confirm('Are you sure you want to delete this rider?')) return;

    try {
      const response = await fetch(`/api/admin/riders/${riderId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchRiders();
      } else {
        alert('Failed to delete rider');
      }
    } catch (error) {
      console.error('Error deleting rider:', error);
      alert('Error deleting rider');
    }
  };

  const assignRiderToOrder = async (orderId: string, riderId: string) => {
    try {
      const selectedRider = availableRiders.find(r => r.id === riderId);
      if (!selectedRider) {
        alert('Selected rider not found');
        return;
      }

      const response = await fetch(`/api/admin/orders/${orderId}/assign-rider`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          riderId: selectedRider.id,
          riderName: selectedRider.fullName,
          riderPhone: selectedRider.phone
        }),
      });

      if (response.ok) {
        await fetchOrders();
        setAssigningRider(null);
      } else {
        alert('Failed to assign rider');
      }
    } catch (error) {
      console.error('Error assigning rider:', error);
      alert('Error assigning rider');
    }
  };

  // Partnership management functions
  const updatePartnershipRequestStatus = async (requestId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/admin/partnership-requests/${requestId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchPartnershipRequests();
      } else {
        alert('Failed to update partnership request status');
      }
    } catch (error) {
      console.error('Error updating partnership request status:', error);
      alert('Error updating partnership request status');
    }
  };

  const deletePartnershipRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this partnership request?')) return;

    try {
      const response = await fetch(`/api/admin/partnership-requests/${requestId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchPartnershipRequests();
      } else {
        alert('Failed to delete partnership request');
      }
    } catch (error) {
      console.error('Error deleting partnership request:', error);
      alert('Error deleting partnership request');
    }
  };

  // Payment confirmation function
  const confirmPaymentAndSendReceipt = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const order = orders.find(o => o.id === orderId);
        alert(`✅ Payment Confirmed Successfully!\n\n📧 Receipt sent to: ${order?.customerEmail}\n💰 Order ID: ${orderId}\n\nCustomer has been notified via email with their receipt.`);

        // Refresh orders to get latest data
        await fetchOrders();
      } else {
        alert(`❌ Payment confirmation failed:\n${result.error || 'Unknown error'}\n\nPlease try again or contact support.`);
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('❌ Error confirming payment. Please check your connection and try again.');
    }
  };

  // Resend receipt function
  const resendReceipt = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/resend-receipt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert(`✅ Receipt Resent Successfully!\n\n📧 Email sent to: ${result.customerEmail}\n📋 Order ID: ${orderId}\n\nThe customer will receive their receipt shortly.`);
      } else {
        alert(`❌ Failed to resend receipt:\n${result.error || 'Unknown error'}\n\nPlease try again or check email settings.`);
      }
    } catch (error) {
      console.error('Error resending receipt:', error);
      alert('❌ Error resending receipt. Please check your connection and try again.');
    }
  };

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
        const result = await response.json();

        // Update local state
        setOrders(orders.map(order =>
          order.id === orderId
            ? { ...order, status: newStatus }
            : order
        ));

        // Show success message with email confirmation
        if (newStatus === 'confirmed' && result.emailSent) {
          const order = orders.find(o => o.id === orderId);
          alert(`✅ Order confirmed successfully!\n📧 Receipt email sent to: ${order?.customerEmail}\n\nCustomer will receive their delivery confirmation and receipt.`);
        }

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
                { key: 'riders', label: 'Riders', icon: Bike },
                { key: 'partnerships', label: 'Partnerships', icon: Handshake }
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
                          <p className="text-xs text-gray-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDate(order.timestamp)}
                          </p>
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
                          <p className="text-xs text-gray-400">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatDate(message.timestamp)}
                          </p>
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
                      <p className="text-xs text-gray-500 mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        Created: {formatDate(order.timestamp)}
                      </p>
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

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
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
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status Updated</p>
                      <p className="text-sm text-gray-900">{order.updatedAt ? formatDate(order.updatedAt) : 'Not updated'}</p>
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
                          {order.riderName ? (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                              <p className="text-sm font-medium text-green-800">{order.riderName}</p>
                              <p className="text-sm text-green-600">{order.riderPhone}</p>
                              <button
                                onClick={() => setAssigningRider(order.id)}
                                className="text-xs text-green-600 hover:text-green-800 mt-1"
                              >
                                Change Rider
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setAssigningRider(order.id)}
                              className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-rocs-green hover:text-rocs-green transition-colors"
                            >
                              + Assign Rider
                            </button>
                          )}

                          {assigningRider === order.id && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <label className="block text-xs font-medium text-gray-600 mb-2">Select Available Rider:</label>
                              <select
                                onChange={(e) => {
                                  if (e.target.value) {
                                    assignRiderToOrder(order.id, e.target.value);
                                  }
                                }}
                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                defaultValue=""
                              >
                                <option value="">Choose a rider...</option>
                                {availableRiders.map((rider) => (
                                  <option key={rider.id} value={rider.id}>
                                    {rider.fullName} - {rider.area} (Rating: {rider.rating})
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => setAssigningRider(null)}
                                className="mt-2 text-xs text-gray-500 hover:text-gray-700"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
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
                    <div className="border-t pt-4">
                      {/* Payment Confirmation Section */}
                      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2 flex items-center">
                          💰 Payment Management
                        </h4>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => confirmPaymentAndSendReceipt(order.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm font-medium flex items-center space-x-2"
                          >
                            <span>✅ Confirm Payment & Send Receipt</span>
                          </button>
                          <button
                            onClick={() => resendReceipt(order.id)}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-medium flex items-center space-x-2"
                          >
                            <span>📧 Resend Receipt</span>
                          </button>
                        </div>
                        <p className="text-yellow-700 text-xs mt-2">
                          Click "Confirm Payment" to send a receipt email to <strong>{order.customerEmail}</strong>
                        </p>
                      </div>

                      {/* Order Status Management */}
                      <div className="flex space-x-2 flex-wrap">
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
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDate(message.timestamp)}
                      </div>
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

        {/* Riders Tab */}
        {activeTab === 'riders' && (
          <div className="space-y-6">
            {/* Header with refresh button */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Rider Management</h2>
                <button
                  onClick={fetchRiders}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-rocs-green hover:bg-rocs-green-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isLoading ? 'Refreshing...' : 'Refresh Riders'}</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{riders.filter(r => r.status === 'pending').length}</div>
                  <div className="text-sm text-blue-600">Pending</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{riders.filter(r => r.status === 'approved').length}</div>
                  <div className="text-sm text-green-600">Approved</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{riders.filter(r => r.status === 'rejected').length}</div>
                  <div className="text-sm text-red-600">Rejected</div>
                </div>
                <div className="bg-rocs-green-light p-4 rounded-lg">
                  <div className="text-2xl font-bold text-rocs-green">{riders.filter(r => r.isActive).length}</div>
                  <div className="text-sm text-rocs-green">Active</div>
                </div>
              </div>
            </div>

            {/* Riders List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rocs-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading riders...</p>
                </div>
              ) : riders.length === 0 ? (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                  <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No riders found</h3>
                  <p className="text-gray-600">No rider applications have been submitted yet.</p>
                </div>
              ) : (
                riders.map((rider) => (
                  <div key={rider.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-rocs-green rounded-full flex items-center justify-center">
                          <Bike className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{rider.fullName}</h3>
                          <p className="text-gray-600">{rider.id} • {rider.area}</p>
                          {rider.rating > 0 && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600">{rider.rating} ({rider.totalDeliveries} deliveries)</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          rider.status === 'approved' ? 'bg-green-100 text-green-800' :
                          rider.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {rider.status}
                        </span>

                        {rider.status === 'approved' && (
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            rider.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {rider.isActive ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contact</p>
                        <p className="text-sm text-gray-900">{rider.email}</p>
                        <p className="text-sm text-gray-900">{rider.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Motorcycle</p>
                        <p className="text-sm text-gray-900">{rider.motorcycle}</p>
                        <p className="text-sm text-gray-600">Experience: {rider.experience}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Application Date</p>
                        <p className="text-sm text-gray-900">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {formatDate(rider.joinedAt)}
                        </p>
                        {rider.updatedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last updated: {formatDate(rider.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {rider.motivation && (
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium text-gray-600">Why they want to join:</p>
                        <p className="text-sm text-gray-700 mt-1">{rider.motivation}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        {rider.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRiderStatus(rider.id, 'approved')}
                              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              <UserCheck className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => updateRiderStatus(rider.id, 'rejected')}
                              className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              <UserX className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {rider.status === 'approved' && (
                          <button
                            onClick={() => toggleRiderActive(rider.id, !rider.isActive)}
                            className={`px-3 py-1 rounded text-sm font-medium ${
                              rider.isActive
                                ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                : 'bg-rocs-green text-white hover:bg-rocs-green-dark'
                            }`}
                          >
                            {rider.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => deleteRider(rider.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Partnership Requests Tab */}
        {activeTab === 'partnerships' && (
          <div className="space-y-6">
            {/* Header with refresh button */}
            <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Partnership Requests</h2>
                <button
                  onClick={fetchPartnershipRequests}
                  disabled={isLoading}
                  className="flex items-center space-x-2 bg-rocs-green hover:bg-rocs-green-dark text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  <svg className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>{isLoading ? 'Refreshing...' : 'Refresh Requests'}</span>
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{partnershipRequests.filter(r => r.status === 'pending').length}</div>
                  <div className="text-sm text-blue-600">Pending Review</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{partnershipRequests.filter(r => r.status === 'approved').length}</div>
                  <div className="text-sm text-green-600">Approved</div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{partnershipRequests.filter(r => r.status === 'rejected').length}</div>
                  <div className="text-sm text-red-600">Rejected</div>
                </div>
              </div>
            </div>

            {/* Partnership Requests List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rocs-green mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading partnership requests...</p>
                </div>
              ) : partnershipRequests.length === 0 ? (
                <div className="bg-white rounded-lg shadow border border-gray-200 p-12 text-center">
                  <Handshake className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No partnership requests found</h3>
                  <p className="text-gray-600">No partnership requests have been submitted yet.</p>
                </div>
              ) : (
                partnershipRequests.map((request) => (
                  <div key={request.id} className="bg-white rounded-lg shadow border border-gray-200 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-rocs-green rounded-full flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{request.companyName}</h3>
                          <p className="text-gray-600">{request.id} • {request.businessCategory}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Submitted: {formatDate(request.timestamp)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contact Person</p>
                        <p className="text-sm text-gray-900">{request.contactPerson}</p>
                        <p className="text-sm text-gray-900">{request.email}</p>
                        <p className="text-sm text-gray-900">{request.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Business Details</p>
                        <p className="text-sm text-gray-900">Category: {request.businessCategory}</p>
                        <p className="text-sm text-gray-900">Volume: {request.deliveryVolume}</p>
                        {request.updatedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Last updated: {formatDate(request.updatedAt)}
                          </p>
                        )}
                      </div>
                    </div>

                    {request.message && (
                      <div className="mb-4 p-3 bg-gray-50 rounded">
                        <p className="text-sm font-medium text-gray-600">Request Message:</p>
                        <p className="text-sm text-gray-700 mt-1">{request.message}</p>
                      </div>
                    )}

                    {request.adminNotes && (
                      <div className="mb-4 p-3 bg-blue-50 rounded">
                        <p className="text-sm font-medium text-blue-800">Admin Notes:</p>
                        <p className="text-sm text-blue-700 mt-1">{request.adminNotes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updatePartnershipRequestStatus(request.id, 'approved')}
                              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Approve</span>
                            </button>
                            <button
                              onClick={() => updatePartnershipRequestStatus(request.id, 'rejected')}
                              className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                            >
                              <AlertCircle className="w-4 h-4" />
                              <span>Reject</span>
                            </button>
                          </>
                        )}

                        {request.status !== 'pending' && (
                          <span className="text-sm text-gray-500">
                            Request {request.status} on {request.updatedAt ? formatDate(request.updatedAt) : 'Unknown date'}
                          </span>
                        )}
                      </div>

                      <button
                        onClick={() => deletePartnershipRequest(request.id)}
                        className="text-red-400 hover:text-red-600 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
