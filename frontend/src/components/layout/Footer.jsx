import { Link } from "react-router-dom";
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiInstagram, FiYoutube } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6 mt-16">
      {/* TOP SECTION */}
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-3">JharkhandTour</h2>
          <p className="text-sm leading-relaxed">
            Your gateway to eco-tourism, culture, waterfalls, wildlife, tribal heritage  
            & unexplored beauty of Jharkhand.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4 text-xl">
            <a
              href="https://www.facebook.com/jharkhandtourism/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              <FiFacebook />
            </a>

            <a
              href="https://www.instagram.com/jharkhandtourism/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              <FiInstagram />
            </a>

            <a
              href="https://www.youtube.com/@JharkhandTourismDept"
              target="_blank"
              rel="noreferrer"
              className="hover:text-primary"
            >
              <FiYoutube />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/explore" className="hover:text-primary">Explore Attractions</Link></li>
            <li><Link to="/packages" className="hover:text-primary">Tour Packages</Link></li>
            <li><Link to="/hotels" className="hover:text-primary">Hotels & Stays</Link></li>
            <li><Link to="/culture" className="hover:text-primary">Culture & Heritage</Link></li>
            <li><Link to="/about" className="hover:text-primary">About Jharkhand</Link></li>
          </ul>
        </div>

        {/* Helpful Resources */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Traveler Resources</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a
                href="https://jharkhandtourism.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                Official Jharkhand Tourism Website
              </a>
            </li>

            <li>
              <a
                href="https://transport.jharkhand.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                Transport & Route Information
              </a>
            </li>

            <li>
              <a
                href="https://forest.jharkhand.gov.in/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                Forest & Wildlife Permits
              </a>
            </li>

            <li>
              <a
                href="https://www.india.gov.in/essential-helpline-numbers"
                target="_blank"
                rel="noreferrer"
                className="hover:text-primary"
              >
                National Emergency Helplines
              </a>
            </li>

            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact Support
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">Contact Us</h3>
          <p className="flex items-center gap-2 text-sm mb-2">
            <FiMapPin className="text-primary" /> Ranchi, Jharkhand, India
          </p>

          <p className="flex items-center gap-2 text-sm mb-2">
            <FiPhone className="text-primary" /> Tourist Helpline: 0651–2331828
          </p>

          <p className="flex items-center gap-2 text-sm mb-2">
            <FiMail className="text-primary" /> info@jharkhandtour.com
          </p>

          <p className="text-xs text-gray-400 mt-3">
            *Helpline taken from official Jharkhand Tourism directory.
          </p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-sm">
        <p>© {new Date().getFullYear()} JharkhandTour — Eco & Cultural Tourism Platform</p>
        <p className="text-gray-500 text-xs mt-1">
          This website is a project-based tourism platform and not the official government website.
        </p>
      </div>
    </footer>
  );
}
