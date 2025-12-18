import { Link } from "react-router-dom";
import { FaArrowRight, FaStar } from "react-icons/fa";

export default function ModernCard({
  image,
  title,
  description,
  price,
  rating,
  footer,
  link,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 
                    border border-gray-200 overflow-hidden group hover:-translate-y-1">
      
      {/* IMAGE */}
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
        />
      </div>

      {/* BODY */}
      <div className="p-5 space-y-3">

        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

        {description && (
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        )}

        {/* PRICE */}
        {price && (
          <p className="text-lg font-semibold text-primary">{price}</p>
        )}

        {/* RATING */}
        {rating && (
          <div className="flex items-center gap-1 text-yellow-500">
            {Array.from({ length: Math.floor(rating) }).map((_, i) => (
              <FaStar key={i} />
            ))}
            <span className="text-sm text-gray-700 ml-1">{rating}</span>
          </div>
        )}

        {/* VIEW DETAILS BUTTON */}
        <Link
          to={link}
          className="mt-3 w-full flex justify-center items-center gap-2 
                     bg-primary text-white py-2 rounded-xl 
                     hover:bg-secondary transition-all duration-300"
        >
          {footer || "View Details"}
          <FaArrowRight className="text-sm" />
        </Link>
      </div>
    </div>
  );
}
