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
  updateOrderStatus,
  assignRiderToOrder,
  confirmPaymentAndSendReceipt,
  resendReceipt
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
  deleteRider,
  getRiderEarnings,
  addRiderEarning,
  processRiderPayment
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
import {
  submitPartnershipRequest,
  getPartnershipRequests,
  updatePartnershipRequestStatus,
  deletePartnershipRequest,
  getPartnershipRequest
} from "./routes/partnerships";

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
  app.patch("/api/admin/orders/:id/assign-rider", assignRiderToOrder);
  app.post("/api/admin/orders/:id/confirm-payment", confirmPaymentAndSendReceipt);
  app.post("/api/admin/orders/:id/resend-receipt", resendReceipt);

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
  app.get("/api/admin/riders/:id/earnings", getRiderEarnings);
  app.post("/api/admin/riders/:id/add-earning", addRiderEarning);
  app.post("/api/admin/riders/:id/process-payment", processRiderPayment);

  // Auth routes
  app.post("/api/users/signup", userSignup);
  app.post("/api/auth/login", login);
  app.get("/api/auth/profile/:userId", getProfile);
  app.patch("/api/auth/profile/:userId", updateProfile);
  app.get("/api/admin/users", getAllUsers);
  app.patch("/api/admin/users/:userId/status", toggleUserStatus);
  app.delete("/api/admin/users/:userId", deleteUser);

  // Partnership routes
  app.post("/api/partnership-requests", submitPartnershipRequest);
  app.get("/api/admin/partnership-requests", getPartnershipRequests);
  app.patch("/api/admin/partnership-requests/:id/status", updatePartnershipRequestStatus);
  app.delete("/api/admin/partnership-requests/:id", deletePartnershipRequest);
  app.get("/api/partnership-requests/:id", getPartnershipRequest);

  return app;
}
