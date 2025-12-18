import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AttractionDetailPage from "../components/detail/AttractionDetailPage";
import axios from "axios";

export default function DetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/explore/${id}`
        );

        setItem(res.data);

        // Fetch related items based on category
        const relatedRes = await axios.get(
          `http://localhost:5000/api/explore?category=${res.data.category}`
        );

        const filtered = relatedRes.data.filter((x) => x._id !== id);

        setRelated(
          filtered.slice(0, 10).map((el) => ({
            id: el._id,
            title: el.title,
            categoryLabel: el.category,
            location: el.location,
            href: `/explore/${el._id}`,
            thumbnail: el.images?.[0]?.url || "",
          }))
        );

        setLoading(false);
      } catch (err) {
        console.error("ERROR:", err);
        navigate("/not-found");
      }
    }
    fetchData();
  }, [id]);

  if (loading) return <div className="p-10">Loading…</div>;

  return (
    <AttractionDetailPage
      id={item._id}
      apiCategorySlug="explore"
      title={item.title}
      categoryLabel={item.category}
      breadcrumb={[
        { label: item.category },
        { label: item.title },
      ]}
      rating={item.rating || 4.2}
      ratingCount={item.reviews?.length || 0}
      heroImages={item.images?.map((img) => img.url) || []}
      description={item.description}
      richSections={item.sections || []}
      keyInfo={[
        { label: "District", value: item.district },
        { label: "Location", value: item.location },
        { label: "Best Season", value: item.bestTime || "Oct–Mar" },
        { label: "Category", value: item.category },
      ]}
      coordinates={item.mapLocation}
      contactInfo={{
        phone: item.contactPhone,
        email: item.contactEmail,
        website: item.officialSite,
      }}
      externalBookingUrl={item.bookNowUrl}
      entityType={item.entityType || "attraction"}
      relatedItems={related}
      existingReviews={item.reviews || []}
    />
  );
}
