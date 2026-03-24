import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";
import { currency } from "../lib/format";

const fallbackImage = "/images/destinations/pokhara.jpg";

function splitList(value) {
  if (!value) return [];
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function TourGuides() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get("/tour-guides");
        setGuides(response.data);
      } catch {
        setError("Could not load tour guides.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredGuides = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return guides;

    return guides.filter((guide) => {
      const searchable = [
        guide.name,
        guide.contact,
        guide.languages,
        guide.specialties,
        guide.experience,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [guides, searchTerm]);

  const handleContact = (guide) => {
    setSelectedGuide(guide);
    setMessage("");
  };

  const handleSendMessage = () => {
    if (!selectedGuide || !message.trim()) return;
    window.alert(`Message sent to ${selectedGuide.name}. They will contact you soon.`);
    setSelectedGuide(null);
    setMessage("");
  };

  if (loading) return <LoadingState label="Loading guides" />;
  if (error) return <ErrorState title="Guides unavailable" message={error} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-semibold tracking-[-0.04em] text-ink-950 sm:text-5xl">
          Connect with Tour Guides
        </h1>
        <p className="mt-3 text-lg text-ink-900/65">
          Find experienced local guides for your next adventure
        </p>
      </div>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Search by name, language, contact, or specialty..."
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="w-full rounded-2xl border border-ink-950/8 bg-white/70 px-5 py-4 text-base text-ink-950 outline-none transition placeholder:text-ink-900/35 focus:border-ocean-500 focus:ring-4 focus:ring-ocean-500/10"
        />
      </div>

      {filteredGuides.length === 0 ? (
        <EmptyState
          title="No tour guides found"
          message="Try a different search."
        />
      ) : (
        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredGuides.map((guide) => {
            const languages = splitList(guide.languages);
            const specialties = splitList(guide.specialties);

            return (
              <article
                key={guide.id}
                className="overflow-hidden rounded-[28px] border border-ink-950/10 bg-white shadow-[0_18px_50px_-38px_rgba(15,23,32,0.35)] transition hover:-translate-y-1"
              >
                <div className="relative h-56">
                  <img
                    src={guide.photo_url || fallbackImage}
                    alt={guide.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute right-3 top-3">
                    <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-ink-950">
                      {currency(guide.rate_per_hour)} / hr
                    </span>
                  </div>
                </div>

                <div className="space-y-4 p-5">
                  <div>
                    <h2 className="text-2xl font-semibold text-ink-950">{guide.name}</h2>
                    <p className="mt-1 text-sm text-ink-900/60">{guide.contact || "Contact unavailable"}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-ink-900/60">
                    <span>{guide.experience || "Experience not listed"}</span>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-ink-900/60">Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {languages.length > 0 ? languages.map((language) => (
                        <span
                          key={language}
                          className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-medium text-ink-900/75"
                        >
                          {language}
                        </span>
                      )) : (
                        <span className="text-sm text-ink-900/45">Not listed</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-medium text-ink-900/60">Specialties</p>
                    <div className="flex flex-wrap gap-2">
                      {specialties.length > 0 ? specialties.map((specialty) => (
                        <span
                          key={specialty}
                          className="rounded-full border border-ink-950/10 px-3 py-1 text-xs font-medium text-ink-900/70"
                        >
                          {specialty}
                        </span>
                      )) : (
                        <span className="text-sm text-ink-900/45">Not listed</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-ink-950/8 pt-4">
                    <div>
                      <span className="text-2xl font-semibold text-ink-950">{currency(guide.rate_per_hour)}</span>
                      <span className="text-sm text-ink-900/60"> / hour</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleContact(guide)}
                      className="rounded-xl bg-ink-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-ocean-600"
                    >
                      Contact
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {selectedGuide ? (
        <section className="mt-10 rounded-[28px] border border-ink-950/10 bg-white p-6 shadow-[0_18px_50px_-38px_rgba(15,23,32,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-ink-950">Contact {selectedGuide.name}</h2>
              <p className="mt-2 text-sm text-ink-900/60">
                {selectedGuide.contact || "Send your tour requirements below."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedGuide(null);
                setMessage("");
              }}
              className="rounded-xl border border-ink-950/10 px-4 py-2 text-sm font-semibold text-ink-900/70 transition hover:border-ocean-500/40 hover:text-ocean-600"
            >
              Close
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-[#f7f7f8] p-4 text-sm text-ink-900/70">
            <p><span className="font-semibold text-ink-950">Guide:</span> {selectedGuide.name}</p>
            <p className="mt-2"><span className="font-semibold text-ink-950">Experience:</span> {selectedGuide.experience || "Not listed"}</p>
            <p className="mt-2"><span className="font-semibold text-ink-950">Rate:</span> {currency(selectedGuide.rate_per_hour)} / hour</p>
          </div>

          <div className="mt-5">
            <label className="label-text" htmlFor="guide-message">Your Message</label>
            <textarea
              id="guide-message"
              rows="5"
              placeholder="Tell the guide about your tour requirements..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="input-shell min-h-32 resize-y"
            />
          </div>

          <button
            type="button"
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="mt-5 w-full rounded-2xl bg-[#050414] px-5 py-4 text-base font-semibold text-white transition hover:bg-[#111026] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Send Message
          </button>
        </section>
      ) : null}
    </div>
  );
}

export default TourGuides;
