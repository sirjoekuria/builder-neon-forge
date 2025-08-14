import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { 
  createMessage, 
  getMessages, 
  updateMessageStatus 
} from "./routes/messages";
import {
  createOrder,
  trackOrder,
  getOrders,
  updateOrderStatus
} from "./routes/orders";
import {
  createPayPalOrder,
  capturePayPalOrder,
  verifyPayPalPayment,
  processCashOnDelivery,
  getPayment,
  getAllPayments,
  updatePaymentStatus
} from "./routes/payments";
import {
  riderSignup,
  getRiders,
  updateRiderStatus,
  toggleRiderActive,
  getAvailableRiders,
  deleteRider
} from "./routes/riders";
import {
  userSignup,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  toggleUserStatus,
  deleteUser
} from "./routes/auth";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Existing routes
  app.get("/api/ping", (req, res) => {
    res.json({ message: "Server is running!" });
  });
  app.get("/api/demo", handleDemo);

  // Message routes
  app.post("/api/messages", createMessage);
  app.get("/api/admin/messages", getMessages);
  app.patch("/api/admin/messages/:id", updateMessageStatus);

  // Order routes
  app.post("/api/orders", createOrder);
  app.get("/api/orders/track/:id", trackOrder);
  app.get("/api/admin/orders", getOrders);
  app.patch("/api/admin/orders/:id", updateOrderStatus);

  // Payment routes
  app.post("/api/payments/create-paypal-order", createPayPalOrder);
  app.post("/api/payments/capture-paypal-order", capturePayPalOrder);
  app.post("/api/payments/verify-paypal", verifyPayPalPayment);
  app.post("/api/payments/cash-on-delivery", processCashOnDelivery);
  app.get("/api/payments/:id", getPayment);
  app.get("/api/admin/payments", getAllPayments);
  app.patch("/api/payments/:id/status", updatePaymentStatus);

  // Rider routes
  app.post("/api/riders/signup", riderSignup);
  app.get("/api/admin/riders", getRiders);
  app.patch("/api/admin/riders/:id/status", updateRiderStatus);
  app.patch("/api/admin/riders/:id/active", toggleRiderActive);
  app.get("/api/riders/available", getAvailableRiders);
  app.delete("/api/admin/riders/:id", deleteRider);

  return app;
}
