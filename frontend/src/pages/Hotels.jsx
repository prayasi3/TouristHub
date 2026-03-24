import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";
import { currency } from "../lib/format";

function Hotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState({
    location: "",
    name: "",
  });

  useEffect(() => {
    async function loadHotels() {
      try {
        const response = await API.get("/hotels");
        setHotels(response.data);
      } catch {
        setError("Could not load hotels.");
      } finally {
        setLoading(false);
      }
    }

    loadHotels();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/hotels", {
        params: {
          location: searchParams.location.trim() || undefined,
          name: searchParams.name.trim() || undefined,
        },
      });

      setHotels(response.data);
      setHasSearched(true);
    } catch {
      setError("Could not load hotels.");
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchParams({ location: "", name: "" });
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/hotels");
      setHotels(response.data);
      setHasSearched(false);
    } catch {
      setError("Could not load hotels.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState label="Loading hotels" />;
  if (error) return <ErrorState title="Hotels unavailable" message={error} />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Hotel Search"
        title="Browse Hotels"
        description="Search hotel records using the fields stored in your hotels table: name, location, price per night, and contact info."
        compact
      />

      <section className="surface-card">
        <h2 className="text-2xl font-semibold text-ink-950">Search Hotels</h2>

        <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="label-text" htmlFor="location">Location</label>
            <input
              id="location"
              name="location"
              type="text"
              placeholder="City or area"
              value={searchParams.location}
              onChange={handleChange}
              className="input-shell"
            />
          </div>

          <div>
            <label className="label-text" htmlFor="name">Hotel Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Search by hotel name"
              value={searchParams.name}
              onChange={handleChange}
              className="input-shell"
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="primary-button w-full">
              Search Hotels
            </button>
          </div>

          <div className="md:col-span-2 lg:col-span-3 flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="secondary-button">
              Reset Filters
            </button>
            <p className="self-center text-sm text-ink-900/55">
              Showing hotel name, location, nightly rate, and contact info.
            </p>
          </div>
        </form>
      </section>

      {hasSearched || hotels.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-ink-950">Available Hotels</h2>
            <p className="text-sm text-ink-900/55">{hotels.length} result{hotels.length === 1 ? "" : "s"}</p>
          </div>

          {hotels.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {hotels.map((hotel) => (
                <article key={hotel.id} className="surface-card">
                  <div>
                    <p className="section-kicker">Hotel</p>
                    <h3 className="mt-4 text-2xl font-semibold text-ink-950">{hotel.name}</h3>
                    <p className="mt-2 text-sm text-ink-900/60">{hotel.location}</p>
                    <p className="mt-4 text-sm leading-7 text-ink-900/65">
                      {hotel.contact_info || "Contact information not available."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-ink-950/8 pt-4">
                    <div>
                      <span className="text-2xl font-semibold text-ink-950">{currency(hotel.price_per_night)}</span>
                      <span className="text-sm text-ink-900/60"> / night</span>
                    </div>
                    <Link to="/booking" className="primary-button">
                      Book Now
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No hotels found"
              message="No hotel records matched the current location and name filters."
            />
          )}
        </section>
      ) : (
        <EmptyState
          title="No hotels found"
          message="Create hotel records in the database and they will appear here."
        />
      )}
    </div>
  );
}

export default Hotels;
