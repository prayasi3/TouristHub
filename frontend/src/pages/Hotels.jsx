import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";
import { currency, splitImages } from "../lib/format";

const fallbackImage = "/images/destinations/pokhara.jpg";

function getAmenities(hotel) {
  const source = `${hotel.contact_info || ""} ${hotel.name || ""}`.toLowerCase();
  const amenities = [];

  if (source.includes("wifi")) amenities.push("Free WiFi");
  if (source.includes("restaurant")) amenities.push("Restaurant");
  if (source.includes("pool")) amenities.push("Pool");
  if (source.includes("spa")) amenities.push("Spa");
  if (source.includes("garden")) amenities.push("Garden");
  if (source.includes("lake")) amenities.push("Lake View");

  if (amenities.length === 0) {
    amenities.push("Comfort Stay", "Great Location");
  }

  return amenities.slice(0, 4);
}

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "2",
  });

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get("/hotels");
        setHotels(response.data);
      } catch {
        setError("Could not load hotels.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const searchResults = useMemo(() => {
    const destinationQuery = searchParams.destination.trim().toLowerCase();

    return hotels.filter((hotel) => {
      const matchesDestination =
        !destinationQuery ||
        `${hotel.name || ""} ${hotel.location || ""} ${hotel.contact_info || ""}`
          .toLowerCase()
          .includes(destinationQuery);

      return matchesDestination;
    });
  }, [hotels, searchParams.destination]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setHasSearched(true);
  };

  if (loading) return <LoadingState label="Loading hotels" />;
  if (error) return <ErrorState title="Hotels unavailable" message={error} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-ink-950 sm:text-5xl">
          Book Hotels
        </h1>
        <p className="mt-3 text-lg text-ink-900/65">
          Find the perfect accommodation for your stay
        </p>
      </div>

      <section className="rounded-[28px] border border-ink-950/10 bg-white px-6 py-7 shadow-[0_20px_60px_-40px_rgba(15,23,32,0.25)] sm:px-8">
        <h2 className="text-2xl font-semibold text-ink-950">Search Hotels</h2>

        <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label-text" htmlFor="destination">Destination</label>
            <input
              id="destination"
              name="destination"
              type="text"
              placeholder="Where are you going?"
              value={searchParams.destination}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div>
            <label className="label-text" htmlFor="checkIn">Check-in</label>
            <input
              id="checkIn"
              name="checkIn"
              type="date"
              value={searchParams.checkIn}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div>
            <label className="label-text" htmlFor="checkOut">Check-out</label>
            <input
              id="checkOut"
              name="checkOut"
              type="date"
              value={searchParams.checkOut}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div>
            <label className="label-text" htmlFor="guests">Guests</label>
            <input
              id="guests"
              name="guests"
              type="number"
              min="1"
              max="10"
              value={searchParams.guests}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="w-full rounded-2xl bg-[#050414] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#111026]"
            >
              Search Hotels
            </button>
          </div>
        </form>
      </section>

      {hasSearched ? (
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold text-ink-950">Available Hotels</h2>

          {searchResults.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {searchResults.map((hotel) => {
                const image = splitImages(hotel.images)[0] || fallbackImage;
                const amenities = getAmenities(hotel);

                return (
                  <article
                    key={hotel.id}
                    className="overflow-hidden rounded-[28px] border border-ink-950/10 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,32,0.35)] transition hover:-translate-y-1"
                  >
                    <div className="relative h-56">
                      <img src={image} alt={hotel.name} className="h-full w-full object-cover" />
                      <div className="absolute right-3 top-3">
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink-950">
                          {currency(hotel.price_per_night)}
                        </span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-2xl font-semibold text-ink-950">{hotel.name}</h3>
                      <p className="mt-1 text-sm text-ink-900/60">{hotel.location}</p>
                      <p className="mt-3 text-sm leading-7 text-ink-900/65">
                        {hotel.contact_info || "Comfortable stay with booking support."}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {amenities.map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-full border border-ink-950/10 px-3 py-1 text-xs font-medium text-ink-900/70"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-semibold text-ink-950">{currency(hotel.price_per_night)}</span>
                          <span className="text-sm text-ink-900/60"> / night</span>
                        </div>
                        <Link to="/booking" className="primary-button">
                          Book Now
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No hotels found"
              message="Please try different search criteria."
            />
          )}
        </section>
      ) : hotels.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No hotels found"
            message="Seed the hotel catalog to populate this page."
          />
        </div>
      ) : null}
    </div>
  );
}

export default Hotels;
