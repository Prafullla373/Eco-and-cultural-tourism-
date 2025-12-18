import { Routes, Route } from "react-router-dom";

// Public pages
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import MapExploration from "../pages/MapExploration";
import ExploreDetail from "../pages/ExploreDetail";
import Packages from "../pages/Packages";
import PackageDetails from "../pages/PackageDetails";
import Hotels from "../pages/Hotels";
import HotelDetail from "../pages/HotelDetail";
import Culture from "../pages/Culture";
import CultureDetails from "../pages/CultureDetails";
import AboutJharkhand from "../pages/AboutJharkhand";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import Profile from "../pages/Profile";

// Admin pages
import AdminLogin from "../pages/admin/AdminLogin";
import AdminRegister from "../pages/admin/AdminRegister";
import AdminProfile from "../pages/admin/AdminProfile";
import ManageAdmins from "../pages/admin/ManageAdmins";
import DashboardLayout from "../components/layout/DashboardLayout";
import SuperAdminDashboard from "../pages/admin/dashboards/SuperAdminDashboard";

// Admin Sub-pages
import HotelList from "../pages/admin/hotels/HotelList";
import HotelForm from "../pages/admin/hotels/HotelForm";
import PackageList from "../pages/admin/packages/PackageList";
import PackageForm from "../pages/admin/packages/PackageForm";
import EventList from "../pages/admin/events/EventList";
import EventForm from "../pages/admin/events/EventForm";
import LocationList from "../pages/admin/locations/LocationList";
import LocationForm from "../pages/admin/locations/LocationForm";

import PrivateRoute from "./PrivateRoute";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/explore/map" element={<MapExploration />} />
      <Route path="/explore/:id" element={<ExploreDetail />} />
      <Route path="/packages" element={<Packages />} />
      <Route path="/packages/:id" element={<PackageDetails />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/hotels/:id" element={<HotelDetail />} />
      <Route path="/culture" element={<Culture />} />
      <Route path="/culture/:id" element={<CultureDetails />} />
      <Route path="/about" element={<AboutJharkhand />} />
      <Route path="/contact" element={<Contact />} />

      {/* USER AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/profile" element={<Profile />} />

      {/* ADMIN AUTH */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/register" element={<AdminRegister />} />

      {/* ADMIN DASHBOARD ROUTES */}
      <Route element={<PrivateRoute allowedRoles={["super_admin", "hotel_manager", "cultural_manager", "eco_manager", "event_manager", "package_manager"]} />}>
        <Route path="/admin" element={<DashboardLayout />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="users" element={<ManageAdmins />} />

          {/* Hotel Manager Routes */}
          <Route element={<PrivateRoute allowedRoles={["super_admin", "hotel_manager"]} />}>
            <Route path="hotels" element={<HotelList />} />
            <Route path="hotels/add" element={<HotelForm />} />
            <Route path="hotels/edit/:id" element={<HotelForm />} />
          </Route>

          {/* Cultural Manager Routes */}
          <Route element={<PrivateRoute allowedRoles={["super_admin", "cultural_manager"]} />}>
            <Route path="culture" element={<LocationList category="culture" />} />
            <Route path="culture/add" element={<LocationForm category="culture" />} />
            <Route path="culture/edit/:id" element={<LocationForm category="culture" />} />
          </Route>

          {/* Eco Manager Routes */}
          <Route element={<PrivateRoute allowedRoles={["super_admin", "eco_manager"]} />}>
            <Route path="eco" element={<LocationList category="eco" />} />
            <Route path="eco/add" element={<LocationForm category="eco" />} />
            <Route path="eco/edit/:id" element={<LocationForm category="eco" />} />
          </Route>

          {/* Event Manager Routes */}
          <Route element={<PrivateRoute allowedRoles={["super_admin", "event_manager"]} />}>
            <Route path="events" element={<EventList />} />
            <Route path="events/add" element={<EventForm />} />
            <Route path="events/edit/:id" element={<EventForm />} />
          </Route>

          {/* Package Manager Routes */}
          <Route element={<PrivateRoute allowedRoles={["super_admin", "package_manager"]} />}>
            <Route path="packages" element={<PackageList />} />
            <Route path="packages/add" element={<PackageForm />} />
            <Route path="packages/edit/:id" element={<PackageForm />} />
          </Route>
        </Route>
      </Route>

    </Routes>
  );
}
