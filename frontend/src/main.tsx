import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import AdvancedSearch from "./AdvancedSearch";
import Login from "./login";
import Register from "./Register"; // ✅ Import Register page
import SellYourCar from "./sellyourcar";
import CarDealershipRegister from "./carDealershipRegister"; 
import CarDealershipLogin from "./carDealershipLogin";
import CarAds from "./carads"; // ✅ Import CarAds page
import MyAccount from "./myaccount";
import EditCar from "./editcar"
import CarAdPage from "./caradpage"
import ForgotPassword from "./forgot-password";
import ForgotPasswordCarDealership from "./forgot-password-cardealership";
import ResetPassword from "./reset-password";
import ResetPasswordCarDealership from "./reset-password-cardealership";
import AdminDashboard from "./caditiperadmininoheker";
import PrivateAdminRoute from "./PrivateAdminRoute";
import EditContact from "./editcontact";
import AdminUserAds from "./AdminUserAds";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="*" element={<div className="p-6 text-center text-red-600">404 - Page Not Found</div>} />
        <Route path="/" element={<App />} />
        <Route path="/advanced-search" element={<AdvancedSearch />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> {/* ✅ New Route */}
        <Route path="/sellyourcar" element={<SellYourCar />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/carads" element={<CarAds />} /> 
        <Route path="/editcar/:id" element={<EditCar />} />
        <Route path="/caradpage/:id" element={<CarAdPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/forgot-password-cardealership" element={<ForgotPasswordCarDealership />} />
        <Route path="/cardealershiplogin" element={<CarDealershipLogin />} />
        <Route path="/carDealershipRegister" element={<CarDealershipRegister />} /> 
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-password-cardealership" element={<ResetPasswordCarDealership />} />
        <Route path="/caditiperadmininoheker"element={<PrivateAdminRoute><AdminDashboard /></PrivateAdminRoute>}/>
        <Route path="/editcontact" element={<EditContact />} /> 
        <Route path="/admin/user-ads" element={
          <PrivateAdminRoute>
            <AdminUserAds />
          </PrivateAdminRoute>
        } />
        </Routes> </Router> </StrictMode>
);
