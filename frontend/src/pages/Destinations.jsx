import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";

const fallbackImage = "/images/destinations/pokhara.jpg";

function getCategory(destination) {
  const text = `${destination.name || ""} ${destination.location || ""} ${destination.description || ""}`.toLowerCase();

  if (text.includes("beach")) return "Beach";
  if (text.includes("mount") || text.includes("himal") || text.includes("trek")) return "Mountain";
  if (text.includes("adventure") || text.includes("safari") || text.includes("wildlife")) return "Adventure";
  return "City";
}

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get("/destinations");
        setDestinations(response.data);
      } catch {
        setError("Could not load destinations from the backend.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const categories = useMemo(() => {
    const derived = destinations.map(getCategory);
    return ["All", ...new Set(derived)];
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return destinations.filter((destination) => {
      const category = getCategory(destination);
      const matchesCategory = selectedCategory === "All" || category === selectedCategory;
      const searchable = `${destination.name || ""} ${destination.location || ""} ${destination.description || ""}`.toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [destinations, searchTerm, selectedCategory]);

  if (loading) return <LoadingState label="Loading destinations" />;
  if (error) return <ErrorState title="Destinations unavailable" message={error} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-ink-950 sm:text-5xl">
          Explore Destinations
        </h1>
        <p className="mt-3 text-lg text-ink-900/65">Discover amazing places around the world</p>
      </div>

      <div className="mt-10 space-y-5">
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search destinations..."
            className="w-full rounded-2xl border border-ink-950/8 bg-white/70 px-5 py-4 text-base text-ink-950 outline-none transition placeholder:text-ink-900/35 focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "border-ink-950 bg-ink-950 text-white"
                    : "border-ink-950/12 bg-white/80 text-ink-900/75 hover:border-ocean-500/40 hover:text-ocean-600"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {filteredDestinations.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No destinations found"
            message="Try another search term or category."
          />
        </div>
      ) : (
        <section className="mt-10 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredDestinations.map((destination) => {
            const category = getCategory(destination);

            return (
              <article
                key={destination.id}
                className="overflow-hidden rounded-[28px] border border-ink-950/10 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,32,0.35)] transition hover:-translate-y-1"
              >
                <img
                  src={destination.image_url || fallbackImage}
                  alt={destination.name}
                  className="h-72 w-full object-cover"
                />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-[2rem] leading-tight font-medium text-ink-950">{destination.name}</h2>
                    <span className="rounded-full bg-[#f8f8fb] px-3 py-1 text-sm font-semibold text-ink-950">
                      {category}
                    </span>
                  </div>

                  <p className="mt-4 text-base leading-8 text-ink-900/72">
                    {destination.description}
                  </p>

                  <p className="mt-5 text-sm font-medium text-ink-900/55">
                    {destination.location || "Nepal"}
                  </p>

                  <div className="mt-6 flex gap-3">
                    <Link to="/booking" className="primary-button">Book Now</Link>
                    <Link to="/campaigns" className="secondary-button">View Offers</Link>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default Destinations;
