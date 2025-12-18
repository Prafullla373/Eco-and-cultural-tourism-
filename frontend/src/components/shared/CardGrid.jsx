export default function CardGrid({ items }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <div
          key={item._id}
          className="bg-white rounded-xl shadow hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
        >
          <img
            src={item.image || item.images?.[0] || 'https://via.placeholder.com/300'}
            className="w-full h-48 object-cover rounded-t-xl"
            alt={item.name}
          />
          <div className="p-4">
            <h3 className="font-heading text-xl">{item.name}</h3>
            <p className="text-lightText text-sm">{item.district ?? item.category}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
