import { RequestHandler } from "express";

// In-memory storage for orders (in production, use a proper database)
let orders: any[] = [];
let orderIdCounter = 1;

// Sample data for demonstration
const sampleOrders = [
  {
    id: 'RC-2024-001',
    customerName: 'John Doe',
    customerPhone: '+254 712 345 678',
    pickup: 'Westlands Shopping Mall, Nairobi',
    delivery: 'KICC, Nairobi CBD',
    distance: 5.2,
    cost: 156,
    currentStatus: 'in_transit',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    riderName: 'Peter Kimani',
    riderPhone: '+254 700 123 456',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Order received and is being processed'
      },
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
        description: 'Order confirmed and rider assigned'
      },
      {
        status: 'picked_up',
        timestamp: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        description: 'Package picked up from Westlands Shopping Mall'
      },
      {
        status: 'in_transit',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        description: 'Package is on the way to destination'
      }
    ]
  },
  {
    id: 'RC-2024-002',
    customerName: 'Mary Wanjiku',
    customerPhone: '+254 722 987 654',
    pickup: 'Karen Shopping Centre',
    delivery: 'Yaya Centre, Kilimani',
    distance: 8.1,
    cost: 243,
    currentStatus: 'delivered',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    estimatedDelivery: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    riderName: 'James Mwangi',
    riderPhone: '+254 701 987 654',
    statusHistory: [
      {
        status: 'pending',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        description: 'Order received and is being processed'
      },
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 220 * 60 * 1000).toISOString(),
        description: 'Order confirmed and rider assigned'
      },
      {
        status: 'picked_up',
        timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
        description: 'Package picked up from Karen Shopping Centre'
      },
      {
        status: 'in_transit',
        timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
        description: 'Package is on the way to destination'
      },
      {
        status: 'delivered',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        description: 'Package delivered successfully to Yaya Centre'
      }
    ]
  }
];

// Initialize with sample data
orders = [...sampleOrders];
orderIdCounter = 3;

// POST /api/orders - Create a new order
export const createOrder: RequestHandler = (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      pickup,
      delivery,
      distance,
      cost,
      packageDetails,
      notes
    } = req.body;
    
    if (!customerName || !customerEmail || !customerPhone || !pickup || !delivery || !distance || !cost || !packageDetails) {
      return res.status(400).json({
        error: 'Missing required fields: customerName, customerEmail, customerPhone, pickup, delivery, distance, cost, and packageDetails are required'
      });
    }

    const now = new Date();
    const estimatedDelivery = new Date(now.getTime() + 90 * 60 * 1000); // 90 minutes from now

    const newOrder = {
      id: `RC-2024-${orderIdCounter.toString().padStart(3, '0')}`,
      customerName,
      customerEmail,
      customerPhone,
      pickup,
      delivery,
      distance: Number(distance),
      cost: Number(cost),
      packageDetails,
      notes: notes || '',
      currentStatus: 'pending',
      createdAt: now.toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      statusHistory: [
        {
          status: 'pending',
          timestamp: now.toISOString(),
          description: 'Order received and is being processed'
        }
      ]
    };

    orders.push(newOrder);
    orderIdCounter++;

    res.status(201).json({ 
      success: true, 
      message: 'Order created successfully',
      order: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/orders/track/:id - Get order tracking information
export const trackOrder: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const order = orders.find(order => order.id === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({ 
      success: true, 
      order 
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/admin/orders - Get all orders (admin only)
export const getOrders: RequestHandler = (req, res) => {
  try {
    // Sort orders by creation date (newest first)
    const sortedOrders = [...orders].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({ 
      success: true, 
      orders: sortedOrders,
      total: orders.length 
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/admin/orders/:id - Update order status
export const updateOrderStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'picked_up', 'in_transit', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const orderIndex = orders.findIndex(order => order.id === id);
    if (orderIndex === -1) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orders[orderIndex];
    const now = new Date().toISOString();

    // Update status
    order.currentStatus = status;
    order.updatedAt = now;

    // Add to status history
    const statusDescriptions = {
      pending: 'Order received and is being processed',
      confirmed: 'Order confirmed and rider assigned',
      picked_up: `Package picked up from ${order.pickup}`,
      in_transit: 'Package is on the way to destination',
      delivered: `Package delivered successfully to ${order.delivery}`
    };

    order.statusHistory.push({
      status,
      timestamp: now,
      description: statusDescriptions[status as keyof typeof statusDescriptions]
    });

    // Assign rider info when confirmed
    if (status === 'confirmed' && !order.riderName) {
      const riders = [
        { name: 'Peter Kimani', phone: '+254 700 123 456' },
        { name: 'James Mwangi', phone: '+254 701 987 654' },
        { name: 'David Ochieng', phone: '+254 702 456 789' },
        { name: 'Samuel Kiprotich', phone: '+254 703 654 321' }
      ];
      const randomRider = riders[Math.floor(Math.random() * riders.length)];
      order.riderName = randomRider.name;
      order.riderPhone = randomRider.phone;
    }

    res.json({ 
      success: true, 
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
