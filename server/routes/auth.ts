import { RequestHandler } from "express";
import { getRidersData } from "./riders";

// In-memory storage for users (in production, use a proper database)
let users: any[] = [];
let userIdCounter = 1;

// Sample users for demonstration
const sampleUsers = [
  {
    id: 'USR-001',
    fullName: 'John Customer',
    email: 'john@customer.com',
    phone: '+254 712 345 678',
    password: 'password123', // In production, this would be hashed
    userType: 'customer',
    isActive: true,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initialize with sample data
users = [...sampleUsers];
userIdCounter = 2;

// POST /api/users/signup - Create customer account
export const userSignup: RequestHandler = (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      userType = 'customer'
    } = req.body;
    
    if (!fullName || !email || !phone || !password) {
      return res.status(400).json({
        error: 'All fields are required: fullName, email, phone, password'
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => 
      user.email === email || user.phone === phone
    );

    if (existingUser) {
      return res.status(400).json({
        error: 'A user with this email or phone already exists'
      });
    }

    const newUser = {
      id: `USR-${userIdCounter.toString().padStart(3, '0')}`,
      fullName,
      email,
      phone,
      password, // In production, hash this password
      userType,
      isActive: true,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    userIdCounter++;

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({ 
      success: true, 
      message: 'Account created successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error creating user account:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/auth/login - User login (handles both customers and riders)
export const login: RequestHandler = (req, res) => {
  try {
    const { email, password, userType } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required'
      });
    }

    let user = null;
    let foundUserType = null;

    // If userType is specified, search in the appropriate collection
    if (userType === 'rider') {
      // Import riders from riders module
      const ridersModule = require('./riders');
      const riders = ridersModule.getRidersData?.() || [];
      user = riders.find((r: any) => r.email === email && r.userType === 'rider');
      foundUserType = 'rider';
    } else {
      // Search in users first (customers)
      user = users.find(u => u.email === email);
      foundUserType = user?.userType || 'customer';
    }

    // If not found and no userType specified, also search riders
    if (!user && !userType) {
      const ridersModule = require('./riders');
      const riders = ridersModule.getRidersData?.() || [];
      const riderUser = riders.find((r: any) => r.email === email);
      if (riderUser) {
        user = riderUser;
        foundUserType = 'rider';
      }
    }

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // Check password (in production, use proper password hashing)
    if (user.password !== password) {
      return res.status(401).json({
        error: 'Invalid credentials'
      });
    }

    // For riders, check if they are approved and active
    if (foundUserType === 'rider') {
      if (user.status !== 'approved') {
        return res.status(401).json({
          error: 'Rider account is not yet approved. Please wait for admin approval.'
        });
      }
      if (!user.isActive) {
        return res.status(401).json({
          error: 'Rider account is inactive. Please contact support.'
        });
      }
    } else {
      // For regular users, just check if active
      if (!user.isActive) {
        return res.status(401).json({
          error: 'Account is inactive. Please contact support.'
        });
      }
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        ...userWithoutPassword,
        userType: foundUserType
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/auth/profile - Get user profile
export const getProfile: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({ 
      success: true, 
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/auth/profile/:userId - Update user profile
export const updateProfile: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { fullName, phone } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user
    if (fullName) users[userIndex].fullName = fullName;
    if (phone) users[userIndex].phone = phone;
    users[userIndex].updatedAt = new Date().toISOString();

    // Return user without password
    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/admin/users - Get all users (admin only)
export const getAllUsers: RequestHandler = (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    const sortedUsers = usersWithoutPasswords.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    res.json({ 
      success: true, 
      users: sortedUsers,
      total: users.length,
      stats: {
        customers: users.filter(u => u.userType === 'customer').length,
        riders: users.filter(u => u.userType === 'rider').length,
        active: users.filter(u => u.isActive).length
      }
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/admin/users/:userId/status - Toggle user active status (admin only)
export const toggleUserStatus: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    users[userIndex].isActive = isActive;
    users[userIndex].updatedAt = new Date().toISOString();

    // Return user without password
    const { password: _, ...userWithoutPassword } = users[userIndex];

    res.json({ 
      success: true, 
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error toggling user status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// DELETE /api/admin/users/:userId - Delete user (admin only)
export const deleteUser: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const deletedUser = users.splice(userIndex, 1)[0];
    const { password: _, ...userWithoutPassword } = deletedUser;

    res.json({ 
      success: true, 
      message: 'User deleted successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
