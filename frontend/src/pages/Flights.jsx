import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";
import { currency, formatDate, formatTime } from "../lib/format";

function Flights() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
    passengers: "1",
  });

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get("/flights");
        setFlights(response.data);
      } catch {
        setError("Could not load flights.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const searchResults = useMemo(() => {
    const fromQuery = searchParams.from.trim().toLowerCase();
    const toQuery = searchParams.to.trim().toLowerCase();
    const dateQuery = searchParams.date;

    return flights.filter((flight) => {
      const matchesFrom = !fromQuery || String(flight.source || "").toLowerCase().includes(fromQuery);
      const matchesTo = !toQuery || String(flight.destination || "").toLowerCase().includes(toQuery);
      const matchesDate = !dateQuery || String(flight.date || "").slice(0, 10) === dateQuery;
      return matchesFrom && matchesTo && matchesDate;
    });
  }, [flights, searchParams]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchParams((current) => ({ ...current, [name]: value }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setHasSearched(true);
  };

  if (loading) return <LoadingState label="Loading flights" />;
  if (error) return <ErrorState title="Flights unavailable" message={error} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-ink-950 sm:text-5xl">
          Book Flights
        </h1>
        <p className="mt-3 text-lg text-ink-900/65">
          Find the best flight deals for your journey
        </p>
      </div>

      <section className="rounded-[28px] border border-ink-950/10 bg-white px-6 py-7 shadow-[0_20px_60px_-40px_rgba(15,23,32,0.25)] sm:px-8">
        <h2 className="text-2xl font-semibold text-ink-950">Search Flights</h2>

        <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label-text" htmlFor="from">From</label>
            <input
              id="from"
              name="from"
              type="text"
              placeholder="Departure city"
              value={searchParams.from}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div>
            <label className="label-text" htmlFor="to">To</label>
            <input
              id="to"
              name="to"
              type="text"
              placeholder="Destination city"
              value={searchParams.to}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div>
            <label className="label-text" htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={searchParams.date}
              onChange={handleChange}
              className="input-shell"
              required
            />
          </div>

          <div>
            <label className="label-text" htmlFor="passengers">Passengers</label>
            <input
              id="passengers"
              name="passengers"
              type="number"
              min="1"
              max="10"
              value={searchParams.passengers}
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
              Search Flights
            </button>
          </div>
        </form>
      </section>

      {hasSearched ? (
        <section className="mt-10 space-y-4">
          <h2 className="text-2xl font-semibold text-ink-950">Available Flights</h2>

          {searchResults.length > 0 ? (
            searchResults.map((flight) => (
              <article
                key={flight.id}
                className="rounded-[24px] border border-ink-950/10 bg-white p-6 shadow-[0_18px_40px_-34px_rgba(15,23,32,0.3)]"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-ink-950">{flight.airline}</p>
                      <span className="rounded-full border border-ink-950/10 bg-[#f7f7f8] px-3 py-1 text-xs font-semibold text-ink-900/70">
                        {flight.flight_number || "Flight"}
                      </span>
                    </div>

                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                      <div>
                        <p className="text-2xl font-semibold text-ink-950">{formatTime(flight.departure_time)}</p>
                        <p className="text-sm text-ink-900/60">{flight.source}</p>
                      </div>

                      <div className="text-sm font-medium text-ink-900/35">to</div>

                      <div>
                        <p className="text-2xl font-semibold text-ink-950">{formatTime(flight.arrival_time)}</p>
                        <p className="text-sm text-ink-900/60">{flight.destination}</p>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-ink-900/55">
                      {formatDate(flight.date)} • Passenger count: {searchParams.passengers}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <p className="text-3xl font-semibold text-ink-950">{currency(flight.price)}</p>
                    <Link to="/booking" className="primary-button">
                      Book Now
                    </Link>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <EmptyState
              title="No flights found"
              message="Please try different search criteria."
            />
          )}
        </section>
      ) : flights.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            title="No flights found"
            message="Create flight records and they will appear here."
          />
        </div>
      ) : null}
    </div>
  );
}

export default Flights;
