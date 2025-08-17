// Rider Activity Tracking System
// This tracks all rider activities and links them to earnings for accountability

export interface RiderActivity {
  id: string;
  riderId: string;
  riderName: string;
  type: 'order_assigned' | 'pickup_completed' | 'delivery_completed' | 'payment_received' | 'status_change' | 'earnings_added' | 'login' | 'logout';
  orderId?: string;
  description: string;
  amount?: number;
  commission?: number;
  netEarning?: number;
  location?: string;
  timestamp: string;
  metadata?: {
    customerName?: string;
    customerPhone?: string;
    pickupLocation?: string;
    deliveryLocation?: string;
    paymentMethod?: string;
    previousStatus?: string;
    newStatus?: string;
    balanceChange?: number;
    newBalance?: number;
  };
}

// In-memory storage for activities (in production, use a proper database)
let riderActivities: RiderActivity[] = [];
let activityIdCounter = 1;

// Sample activities for demonstration
const sampleActivities: RiderActivity[] = [
  {
    id: 'ACT-001',
    riderId: 'RD-001',
    riderName: 'John Mwangi',
    type: 'delivery_completed',
    orderId: 'RC-2024-001',
    description: 'Successfully delivered order to KICC, Nairobi CBD',
    amount: 156,
    commission: 31.2,
    netEarning: 124.8,
    location: 'KICC, Nairobi CBD',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    metadata: {
      customerName: 'John Doe',
      customerPhone: '+254 712 345 678',
      pickupLocation: 'Westlands Shopping Mall, Nairobi',
      deliveryLocation: 'KICC, Nairobi CBD',
      balanceChange: 124.8,
      newBalance: 12604.8
    }
  },
  {
    id: 'ACT-002',
    riderId: 'RD-001',
    riderName: 'John Mwangi',
    type: 'payment_received',
    description: 'Received payment of KES 5,000 via M-Pesa',
    amount: 5000,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    metadata: {
      paymentMethod: 'M-Pesa',
      balanceChange: -5000,
      newBalance: 7480
    }
  },
  {
    id: 'ACT-003',
    riderId: 'RD-002',
    riderName: 'Peter Kimani',
    type: 'order_assigned',
    orderId: 'RC-2024-003',
    description: 'Assigned to new delivery order',
    location: 'Sarit Centre, Westlands',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    metadata: {
      customerName: 'Sarah Akinyi',
      customerPhone: '+254 733 456 789',
      pickupLocation: 'Sarit Centre, Westlands',
      deliveryLocation: 'Village Market, Gigiri',
      previousStatus: 'available',
      newStatus: 'assigned'
    }
  },
  {
    id: 'ACT-004',
    riderId: 'RD-002',
    riderName: 'Peter Kimani',
    type: 'pickup_completed',
    orderId: 'RC-2024-002',
    description: 'Package picked up from Karen Shopping Centre',
    location: 'Karen Shopping Centre',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    metadata: {
      customerName: 'Mary Wanjiku',
      customerPhone: '+254 722 987 654',
      pickupLocation: 'Karen Shopping Centre',
      deliveryLocation: 'Yaya Centre, Kilimani'
    }
  },
  {
    id: 'ACT-005',
    riderId: 'RD-002',
    riderName: 'Peter Kimani',
    type: 'delivery_completed',
    orderId: 'RC-2024-002',
    description: 'Successfully delivered order to Yaya Centre, Kilimani',
    amount: 243,
    commission: 48.6,
    netEarning: 194.4,
    location: 'Yaya Centre, Kilimani',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    metadata: {
      customerName: 'Mary Wanjiku',
      customerPhone: '+254 722 987 654',
      pickupLocation: 'Karen Shopping Centre',
      deliveryLocation: 'Yaya Centre, Kilimani',
      balanceChange: 194.4,
      newBalance: 9154.4
    }
  }
];

// Initialize with sample data
riderActivities = [...sampleActivities];
activityIdCounter = 6;

// Log a new rider activity
export const logRiderActivity = (activity: Omit<RiderActivity, 'id' | 'timestamp'>): RiderActivity => {
  const newActivity: RiderActivity = {
    ...activity,
    id: `ACT-${activityIdCounter.toString().padStart(3, '0')}`,
    timestamp: new Date().toISOString()
  };

  riderActivities.unshift(newActivity); // Add to beginning for newest first
  activityIdCounter++;

  console.log(`📝 Rider Activity Logged: ${newActivity.riderName} - ${newActivity.description}`);
  
  return newActivity;
};

// Get all activities for a specific rider
export const getRiderActivities = (riderId: string): RiderActivity[] => {
  return riderActivities.filter(activity => activity.riderId === riderId);
};

// Get all activities
export const getAllRiderActivities = (): RiderActivity[] => {
  return riderActivities;
};

// Get activities by type
export const getActivitiesByType = (type: RiderActivity['type']): RiderActivity[] => {
  return riderActivities.filter(activity => activity.type === type);
};

// Get activities for a specific order
export const getOrderActivities = (orderId: string): RiderActivity[] => {
  return riderActivities.filter(activity => activity.orderId === orderId);
};

// Get activities within a date range
export const getActivitiesInRange = (startDate: Date, endDate: Date): RiderActivity[] => {
  return riderActivities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    return activityDate >= startDate && activityDate <= endDate;
  });
};

// Get earnings-related activities for a rider
export const getRiderEarningsActivities = (riderId: string): RiderActivity[] => {
  return riderActivities.filter(activity => 
    activity.riderId === riderId && 
    (activity.type === 'delivery_completed' || activity.type === 'payment_received' || activity.type === 'earnings_added')
  );
};

// Calculate total earnings from activities
export const calculateTotalEarningsFromActivities = (riderId: string): {
  totalEarned: number;
  totalPaid: number;
  currentBalance: number;
  deliveryCount: number;
} => {
  const earningsActivities = getRiderEarningsActivities(riderId);
  
  let totalEarned = 0;
  let totalPaid = 0;
  let deliveryCount = 0;

  earningsActivities.forEach(activity => {
    if (activity.type === 'delivery_completed' && activity.netEarning) {
      totalEarned += activity.netEarning;
      deliveryCount++;
    } else if (activity.type === 'payment_received' && activity.amount) {
      totalPaid += activity.amount;
    }
  });

  return {
    totalEarned,
    totalPaid,
    currentBalance: totalEarned - totalPaid,
    deliveryCount
  };
};

// Helper function to format activity description with more details
export const getDetailedActivityDescription = (activity: RiderActivity): string => {
  const baseDesc = activity.description;
  
  switch (activity.type) {
    case 'delivery_completed':
      return `${baseDesc} | Earned: KES ${activity.netEarning?.toFixed(2)} (after 20% commission)`;
    case 'payment_received':
      return `${baseDesc} | Balance reduced by KES ${activity.amount?.toFixed(2)}`;
    case 'order_assigned':
      return `${baseDesc} | Route: ${activity.metadata?.pickupLocation} → ${activity.metadata?.deliveryLocation}`;
    case 'pickup_completed':
      return `${baseDesc} | Next: Deliver to ${activity.metadata?.deliveryLocation}`;
    default:
      return baseDesc;
  }
};

// Get activity statistics
export const getActivityStats = (): {
  totalActivities: number;
  todayActivities: number;
  weekActivities: number;
  deliveriesCompleted: number;
  paymentsProcessed: number;
  activeRiders: number;
} => {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const todayActivities = riderActivities.filter(a => new Date(a.timestamp) >= todayStart).length;
  const weekActivities = riderActivities.filter(a => new Date(a.timestamp) >= weekStart).length;
  const deliveriesCompleted = riderActivities.filter(a => a.type === 'delivery_completed').length;
  const paymentsProcessed = riderActivities.filter(a => a.type === 'payment_received').length;
  
  const activeRiders = new Set(
    riderActivities
      .filter(a => new Date(a.timestamp) >= weekStart)
      .map(a => a.riderId)
  ).size;

  return {
    totalActivities: riderActivities.length,
    todayActivities,
    weekActivities,
    deliveriesCompleted,
    paymentsProcessed,
    activeRiders
  };
};
