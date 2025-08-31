import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/Auth/ProtectedRoute";

// Pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import BundlePage from "./pages/BundlePage";
import VoucherRecharge from "./pages/VoucherRecharge";
import Login from "./pages/Login";
import Unauthorized from "./pages/Unauthorized";
import Balance from "./pages/Balance";
import Bundles from "./pages/Bundles";
import Notifications from "./pages/Notifications";
import MasterNotificationList from "./pages/Notifications/MasterNotificationList";
import MasterNotificationAdd from "./pages/Notifications/MasterNotificationAdd";
import MasterNotificationDetail from "./pages/Notifications/MasterNotificationDetail";
import NotificationList from "./pages/Notifications/NotificationList";
import NotificationDetail from "./pages/Notifications/NotificationDetail";
import UserManagement from "./pages/Users/UserManagement";
import Registration from "./pages/Users/Registration";
import EditUser from "./pages/Users/EditUser";
import NotFound from "./pages/NotFound";

// Balance Management Pages
import AdjustBalance from "./pages/BalanceManagement/AdjustBalance";
import PinRecharge from "./pages/BalanceManagement/PinRecharge";
import PinlessRecharge from "./pages/BalanceManagement/PinlessRecharge";
import CheckBalance from "./pages/BalanceManagement/CheckBalance";

// Bundle Management Pages
import BundleDetails from "./pages/BundleManagement/BundleDetails";
import SubscribeBundle from "./pages/BundleManagement/SubscribeBundle";
import RemoveBundle from "./pages/BundleManagement/RemoveBundle";
import UpdateResources from "./pages/BundleManagement/UpdateResources";
import GiftBundle from "./pages/BundleManagement/GiftBundle";
import LoanBundle from "./pages/BundleManagement/LoanBundle";
import SubscribedBundles from "./pages/BundleManagement/SubscribedBundles";
import CVMBundle from "./pages/BundleManagement/CVMBundle";
import MessagesTemplate from "./pages/MessagesTemplate";

// Utilities Pages
import UnitConversion from "./pages/Utilities/UnitConversion";
import TaxCalculator from "./pages/Utilities/TaxCalculator";
import BundleConfigGenerator from "./pages/Utilities/BundleConfigGenerator";
import RoamingRateUpload from "./pages/Rates/RoamingRateUpload";
import RoamingRates from "./pages/Rates/RoamingRates";
import RateMappingTable from "./pages/Rates/RateMappingTable";
import RateMappingCompare from "./pages/Rates/RateMappingCompare";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Protected routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bundle_page/:category"
              element={
                <ProtectedRoute>
                  <BundlePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/balance"
              element={
                <ProtectedRoute>
                  <Balance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/bundles"
              element={
                <ProtectedRoute>
                  <Bundles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notifications"
              element={
                <ProtectedRoute businessOnly>
                  <Notifications />
                </ProtectedRoute>
              }
            />

            {/* Notifications */}
            <Route
              path="/master_notification_list"
              element={
                <ProtectedRoute businessOnly>
                  <MasterNotificationList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/master_notification_add"
              element={
                <ProtectedRoute businessOnly>
                  <MasterNotificationAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/master_notification/:id"
              element={
                <ProtectedRoute businessOnly>
                  <MasterNotificationDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification_list"
              element={
                <ProtectedRoute businessOnly>
                  <NotificationList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notification/:id"
              element={
                <ProtectedRoute businessOnly>
                  <NotificationDetail />
                </ProtectedRoute>
              }
            />

            {/* Balance Management Routes */}
            <Route
              path="/adjust_balance"
              element={
                <ProtectedRoute businessOnly>
                  <AdjustBalance />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recharge_pin"
              element={
                <ProtectedRoute>
                  <VoucherRecharge />
                </ProtectedRoute>
              }
            />

            <Route
              path="/voucher_recharge"
              element={
                <ProtectedRoute>
                  <VoucherRecharge />
                </ProtectedRoute>
              }
            />

            <Route
              path="/recharge_pinless"
              element={
                <ProtectedRoute>
                  <PinlessRecharge />
                </ProtectedRoute>
              }
            />

            <Route
              path="/update_and_balance_info"
              element={
                <ProtectedRoute>
                  <CheckBalance />
                </ProtectedRoute>
              }
            />

            {/* Bundle Management Routes */}
            <Route
              path="/bundle_info"
              element={
                <ProtectedRoute>
                  <BundleDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/subscribe_bundle"
              element={
                <ProtectedRoute>
                  <SubscribeBundle />
                </ProtectedRoute>
              }
            />

            <Route
              path="/remove_bundle"
              element={
                <ProtectedRoute>
                  <RemoveBundle />
                </ProtectedRoute>
              }
            />

            <Route
              path="/update_bundle"
              element={
                <ProtectedRoute>
                  <UpdateResources />
                </ProtectedRoute>
              }
            />

            {/* New Bundle Management */}
            <Route
              path="/gift_bundle"
              element={
                <ProtectedRoute>
                  <GiftBundle />
                </ProtectedRoute>
              }
            />

            <Route
              path="/loan_bundle"
              element={
                <ProtectedRoute>
                  <LoanBundle />
                </ProtectedRoute>
              }
            />

            <Route
              path="/subscribed_bundles"
              element={
                <ProtectedRoute>
                  <SubscribedBundles />
                </ProtectedRoute>
              }
            />

            <Route
              path="/cvm_bundle"
              element={
                <ProtectedRoute>
                  <CVMBundle />
                </ProtectedRoute>
              }
            />

            <Route
              path="/messages-template"
              element={
                <ProtectedRoute>
                  <MessagesTemplate />
                </ProtectedRoute>
              }
            />

            {/* Utilities Routes */}
            <Route
              path="/unit_convertion"
              element={
                <ProtectedRoute adminOnly>
                  <UnitConversion />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tax_cal"
              element={
                <ProtectedRoute adminOnly>
                  <TaxCalculator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bundle_list_new"
              element={
                <ProtectedRoute adminOnly>
                  <BundleConfigGenerator />
                </ProtectedRoute>
              }
            />

            {/* Rates */}
            <Route
              path="/roaming_rate_upload"
              element={
                <ProtectedRoute adminOnly>
                  <RoamingRateUpload />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roaming_rates"
              element={
                <ProtectedRoute adminOnly>
                  <RoamingRates />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rate_mapping_table"
              element={
                <ProtectedRoute adminOnly>
                  <RateMappingTable />
                </ProtectedRoute>
              }
            />
            <Route
              path="/rate_mapping_compare"
              element={
                <ProtectedRoute adminOnly>
                  <RateMappingCompare />
                </ProtectedRoute>
              }
            />

            {/* Users */}
            <Route
              path="/user_management"
              element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/registration"
              element={
                <ProtectedRoute adminOnly>
                  <Registration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit_user/:id"
              element={
                <ProtectedRoute adminOnly>
                  <EditUser />
                </ProtectedRoute>
              }
            />

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
