import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Navbar />
      <div className="pt-20 min-h-screen bg-gray-50">
        <AppRoutes />
      </div>
      <Footer />
    </>
  );
}
