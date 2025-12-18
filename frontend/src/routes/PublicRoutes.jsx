import ExploreDetail from "../pages/ExploreDetail";

export default function PublicRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/explore/:id" element={<ExploreDetail />} />   {/* ⭐ REQUIRED */}
    </Routes>
  );
}
