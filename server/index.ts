import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleGift } from "./routes/gift";
import { handleLoan } from "./routes/loan";
import { handleSubscriptions } from "./routes/subscriptions";
import { handleGetCvmBuckets, handleCvmSubscribe } from "./routes/cvm";
import {
  listMasterNotifications,
  createMasterNotification,
  getMasterNotification,
  updateMasterNotification,
  deleteMasterNotification,
} from "./routes/masterNotifications";
import {
  listNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
  regenerateNotification,
  downloadNotification,
} from "./routes/notifications";
import {
  uploadRoamingRates,
  getRoamingRates,
  downloadRoamingExcel,
  downloadRateIdsZip,
  getMappingTable,
  downloadMappingCsv,
  compareMappingTables,
} from "./routes/rates";
import {
  listUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
} from "./routes/users";
import {
  getBundleDetails,
  getNotificationMessages,
  subscribeBundle,
} from "./routes/bundle-details";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Bundle Management APIs (mock)
  app.post("/api/bundles/gift", handleGift);
  app.post("/api/bundles/loan", handleLoan);
  app.get("/api/subscriptions", handleSubscriptions);
  app.get("/api/cvm/bundles/:bundleId", handleGetCvmBuckets);
  app.post("/api/cvm/subscribe", handleCvmSubscribe);

  // Bundle Details APIs
  app.get("/api/bundle-details", getBundleDetails);
  app.get("/api/notification-messages", getNotificationMessages);
  app.post("/api/bundle-subscribe", subscribeBundle);

  // Master Notifications
  app.get("/api/master-notifications", listMasterNotifications);
  app.post("/api/master-notifications", createMasterNotification);
  app.get("/api/master-notifications/:id", getMasterNotification);
  app.put("/api/master-notifications/:id", updateMasterNotification);
  app.delete("/api/master-notifications/:id", deleteMasterNotification);

  // Notifications
  app.get("/api/notifications", listNotifications);
  app.get("/api/notifications/:id", getNotification);
  app.put("/api/notifications/:id", updateNotification);
  app.delete("/api/notifications/:id", deleteNotification);
  app.post("/api/notifications/:id/regenerate", regenerateNotification);
  app.get("/api/notifications/:id/download", downloadNotification);

  // Rates APIs (mock)
  app.post("/api/rates/roaming/upload", uploadRoamingRates);
  app.get("/api/rates/roaming", getRoamingRates);
  app.get("/api/rates/roaming/download-excel", downloadRoamingExcel);
  app.get("/api/rates/roaming/download-zip", downloadRateIdsZip);
  app.get("/api/rates/mapping", getMappingTable);
  app.get("/api/rates/mapping/download", downloadMappingCsv);
  app.post("/api/rates/mapping/compare", compareMappingTables);

  // Users APIs (mock)
  app.get("/api/users", listUsers);
  app.post("/api/users", createUser);
  app.get("/api/users/:id", getUser);
  app.put("/api/users/:id", updateUser);
  app.delete("/api/users/:id", deleteUser);

  return app;
}
