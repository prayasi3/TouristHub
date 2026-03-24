import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
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
  });

  useEffect(() => {
    async function loadFlights() {
      try {
        const response = await API.get("/flights");
        setFlights(response.data);
      } catch {
        setError("Could not load flights.");
      } finally {
        setLoading(false);
      }
    }

    loadFlights();
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
      const response = await API.get("/flights", {
        params: {
          source: searchParams.from.trim() || undefined,
          destination: searchParams.to.trim() || undefined,
          date: searchParams.date || undefined,
        },
      });

      setFlights(response.data);
      setHasSearched(true);
    } catch {
      setError("Could not load flights.");
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setSearchParams({ from: "", to: "", date: "" });
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/flights");
      setFlights(response.data);
      setHasSearched(false);
    } catch {
      setError("Could not load flights.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState label="Loading flights" />;
  if (error) return <ErrorState title="Flights unavailable" message={error} />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Flight Search"
        title="Browse Scheduled Flights"
        description="Search flight records using the fields stored in your flights table: source, destination, date, departure time, arrival time, and price."
        compact
      />

      <section className="surface-card">
        <h2 className="text-2xl font-semibold text-ink-950">Search Flights</h2>

        <form onSubmit={handleSearch} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label-text" htmlFor="from">Source</label>
            <input
              id="from"
              name="from"
              type="text"
              placeholder="Source airport or city"
              value={searchParams.from}
              onChange={handleChange}
              className="input-shell"
            />
          </div>

          <div>
            <label className="label-text" htmlFor="to">Destination</label>
            <input
              id="to"
              name="to"
              type="text"
              placeholder="Destination airport or city"
              value={searchParams.to}
              onChange={handleChange}
              className="input-shell"
            />
          </div>

          <div>
            <label className="label-text" htmlFor="date">Flight Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={searchParams.date}
              onChange={handleChange}
              className="input-shell"
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="primary-button w-full">
              Search Flights
            </button>
          </div>

          <div className="md:col-span-2 lg:col-span-4 flex flex-wrap gap-3">
            <button type="button" onClick={handleReset} className="secondary-button">
              Reset Filters
            </button>
            <p className="self-center text-sm text-ink-900/55">
              Showing airline, flight number, route, date, departure time, arrival time, and price.
            </p>
          </div>
        </form>
      </section>

      {hasSearched || flights.length > 0 ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-semibold text-ink-950">Available Flights</h2>
            <p className="text-sm text-ink-900/55">{flights.length} result{flights.length === 1 ? "" : "s"}</p>
          </div>

          {flights.length > 0 ? (
            flights.map((flight) => (
              <article key={flight.id} className="surface-card">
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-lg font-semibold text-ink-950">{flight.airline}</p>
                      <span className="pill">{flight.flight_number}</span>
                    </div>

                    <div className="mt-4 grid gap-4 sm:grid-cols-3">
                      <div>
                        <p className="text-sm text-ink-900/45">Source</p>
                        <p className="mt-1 text-lg font-semibold text-ink-950">{flight.source}</p>
                        <p className="mt-1 text-sm text-ink-900/60">Departs {formatTime(flight.departure_time)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-ink-900/45">Destination</p>
                        <p className="mt-1 text-lg font-semibold text-ink-950">{flight.destination}</p>
                        <p className="mt-1 text-sm text-ink-900/60">Arrives {formatTime(flight.arrival_time)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-ink-900/45">Flight Date</p>
                        <p className="mt-1 text-lg font-semibold text-ink-950">{formatDate(flight.date)}</p>
                      </div>
                    </div>
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
              message="No flight records matched the current source, destination, and date filters."
            />
          )}
        </section>
      ) : (
        <EmptyState
          title="No flights found"
          message="Create flight records in the database and they will appear here."
        />
      )}
    </div>
  );
}

export default Flights;
