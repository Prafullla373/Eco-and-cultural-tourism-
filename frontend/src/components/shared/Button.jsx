export default function Button({ children, className, ...props }) {
  return (
    <button
      {...props}
      className={`px-5 py-2 rounded-md bg-primary text-white font-heading
      hover:bg-secondary transition-all duration-300 shadow-md hover:shadow-lg 
      ${className}`}
    >
      {children}
    </button>
  );
}
