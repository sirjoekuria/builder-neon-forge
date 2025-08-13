import { RequestHandler } from "express";

// In-memory storage for riders (in production, use a proper database)
let riders: any[] = [];
let riderIdCounter = 1;

// Sample data for demonstration
const sampleRiders = [
  {
    id: 'RD-001',
    fullName: 'John Mwangi',
    email: 'john.mwangi@example.com',
    phone: '+254 712 345 678',
    nationalId: '12345678',
    motorcycle: 'Honda CB 150R, 2020',
    experience: '3-5 years',
    area: 'Westlands',
    motivation: 'I want to earn extra income and provide excellent delivery service to customers.',
    status: 'approved',
    rating: 4.8,
    totalDeliveries: 156,
    joinedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'RD-002',
    fullName: 'Peter Kimani',
    email: 'peter.kimani@example.com',
    phone: '+254 700 123 456',
    nationalId: '87654321',
    motorcycle: 'Yamaha YBR 125, 2019',
    experience: '5+ years',
    area: 'CBD',
    motivation: 'I have extensive experience in Nairobi and want to help businesses with reliable delivery.',
    status: 'approved',
    rating: 4.9,
    totalDeliveries: 203,
    joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true
  },
  {
    id: 'RD-003',
    fullName: 'David Ochieng',
    email: 'david.ochieng@example.com',
    phone: '+254 722 987 654',
    nationalId: '11223344',
    motorcycle: 'TVS Apache 160, 2021',
    experience: '1-2 years',
    area: 'Karen',
    motivation: 'I am a recent graduate looking for flexible work opportunities while I pursue other goals.',
    status: 'pending',
    rating: 0,
    totalDeliveries: 0,
    joinedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false
  }
];

// Initialize with sample data
riders = [...sampleRiders];
riderIdCounter = 4;

// POST /api/riders/signup - Submit rider application
export const riderSignup: RequestHandler = (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      nationalId,
      motorcycle,
      experience,
      area,
      motivation
    } = req.body;
    
    if (!fullName || !email || !phone || !nationalId || !motorcycle || !experience || !area || !motivation) {
      return res.status(400).json({
        error: 'All fields are required for rider application'
      });
    }

    // Check if rider already exists
    const existingRider = riders.find(rider => 
      rider.email === email || rider.phone === phone || rider.nationalId === nationalId
    );

    if (existingRider) {
      return res.status(400).json({
        error: 'A rider with this email, phone, or national ID already exists'
      });
    }

    const newRider = {
      id: `RD-${riderIdCounter.toString().padStart(3, '0')}`,
      fullName,
      email,
      phone,
      nationalId,
      motorcycle,
      experience,
      area,
      motivation,
      status: 'pending',
      rating: 0,
      totalDeliveries: 0,
      joinedAt: new Date().toISOString(),
      isActive: false
    };

    riders.push(newRider);
    riderIdCounter++;

    res.status(201).json({ 
      success: true, 
      message: 'Rider application submitted successfully',
      rider: {
        id: newRider.id,
        fullName: newRider.fullName,
        email: newRider.email,
        status: newRider.status
      }
    });
  } catch (error) {
    console.error('Error creating rider application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/admin/riders - Get all riders (admin only)
export const getRiders: RequestHandler = (req, res) => {
  try {
    // Sort riders by join date (newest first)
    const sortedRiders = [...riders].sort((a, b) => 
      new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
    );

    res.json({ 
      success: true, 
      riders: sortedRiders,
      total: riders.length,
      stats: {
        approved: riders.filter(r => r.status === 'approved').length,
        pending: riders.filter(r => r.status === 'pending').length,
        rejected: riders.filter(r => r.status === 'rejected').length,
        active: riders.filter(r => r.isActive).length
      }
    });
  } catch (error) {
    console.error('Error getting riders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/admin/riders/:id/status - Update rider status (approve/reject)
export const updateRiderStatus: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'approved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` 
      });
    }

    const riderIndex = riders.findIndex(rider => rider.id === id);
    if (riderIndex === -1) {
      return res.status(404).json({ error: 'Rider not found' });
    }

    const rider = riders[riderIndex];
    rider.status = status;
    rider.updatedAt = new Date().toISOString();

    // If approved, activate the rider
    if (status === 'approved') {
      rider.isActive = true;
    } else if (status === 'rejected') {
      rider.isActive = false;
    }

    res.json({ 
      success: true, 
      message: `Rider ${status} successfully`,
      rider
    });
  } catch (error) {
    console.error('Error updating rider status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/admin/riders/:id/active - Toggle rider active status
export const toggleRiderActive: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const riderIndex = riders.findIndex(rider => rider.id === id);
    if (riderIndex === -1) {
      return res.status(404).json({ error: 'Rider not found' });
    }

    const rider = riders[riderIndex];
    rider.isActive = isActive;
    rider.updatedAt = new Date().toISOString();

    res.json({ 
      success: true, 
      message: `Rider ${isActive ? 'activated' : 'deactivated'} successfully`,
      rider
    });
  } catch (error) {
    console.error('Error toggling rider active status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/riders/available - Get available riders for assignment
export const getAvailableRiders: RequestHandler = (req, res) => {
  try {
    const availableRiders = riders.filter(rider => 
      rider.status === 'approved' && rider.isActive
    ).map(rider => ({
      id: rider.id,
      fullName: rider.fullName,
      phone: rider.phone,
      area: rider.area,
      rating: rider.rating,
      totalDeliveries: rider.totalDeliveries
    }));

    res.json({ 
      success: true, 
      riders: availableRiders
    });
  } catch (error) {
    console.error('Error getting available riders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/admin/riders/:id - Delete rider
export const deleteRider: RequestHandler = (req, res) => {
  try {
    const { id } = req.params;
    
    const riderIndex = riders.findIndex(rider => rider.id === id);
    if (riderIndex === -1) {
      return res.status(404).json({ error: 'Rider not found' });
    }

    const deletedRider = riders.splice(riderIndex, 1)[0];

    res.json({ 
      success: true, 
      message: 'Rider deleted successfully',
      rider: deletedRider
    });
  } catch (error) {
    console.error('Error deleting rider:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
