import { useEffect, useMemo, useState } from "react";
import API from "../api/axios";
import { ErrorState, LoadingState } from "../components/StatusView";

const sections = [
  { id: "destinations", label: "Destinations" },
  { id: "campaigns", label: "Campaigns" },
  { id: "hotels", label: "Hotels" },
  { id: "flights", label: "Flights" },
  { id: "guides", label: "Guides" },
];

const emptyForms = {
  destinations: {
    id: null,
    name: "",
    location: "",
    description: "",
    image_url: "",
  },
  campaigns: {
    id: null,
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    banner_url: "",
  },
  hotels: {
    id: null,
    name: "",
    location: "",
    price_per_night: "",
    contact_info: "",
  },
  flights: {
    id: null,
    airline: "",
    flight_number: "",
    source: "",
    destination: "",
    price: "",
    date: "",
    departure_time: "",
    arrival_time: "",
  },
  guides: {
    id: null,
    name: "",
    experience: "",
    languages: "",
    specialties: "",
    rate_per_hour: "",
    contact: "",
    email: "",
    photo_url: "",
  },
};

function SectionButton({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
        active
          ? "bg-cyan-400/15 text-cyan-200"
          : "border border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
      }`}
    >
      {children}
    </button>
  );
}

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("destinations");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [flights, setFlights] = useState([]);
  const [guides, setGuides] = useState([]);
  const [forms, setForms] = useState(emptyForms);

  const loadData = async () => {
    try {
      setError("");
      const [destinationsResponse, campaignsResponse, hotelsResponse, flightsResponse, guidesResponse] = await Promise.all([
        API.get("/destinations"),
        API.get("/campaigns"),
        API.get("/hotels"),
        API.get("/flights"),
        API.get("/tour-guides"),
      ]);

      setDestinations(destinationsResponse.data);
      setCampaigns(campaignsResponse.data);
      setHotels(hotelsResponse.data);
      setFlights(flightsResponse.data);
      setGuides(guidesResponse.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load admin dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(
    () => [
      { label: "Destinations", value: destinations.length },
      { label: "Campaigns", value: campaigns.length },
      { label: "Hotels", value: hotels.length },
      { label: "Flights", value: flights.length },
      { label: "Guides", value: guides.length },
    ],
    [campaigns.length, destinations.length, flights.length, guides.length, hotels.length],
  );

  const handleChange = (section, event) => {
    const { name, value } = event.target;
    setForms((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [name]: value,
      },
    }));
  };

  const handleReset = (section) => {
    setForms((current) => ({
      ...current,
      [section]: emptyForms[section],
    }));
    setMessage("");
  };

  const handleEdit = (section, record) => {
    setActiveSection(section);
    setForms((current) => ({
      ...current,
      [section]: {
        ...emptyForms[section],
        ...record,
      },
    }));
    setMessage("");
  };

  const getSectionConfig = (section) => {
    switch (section) {
      case "destinations":
        return {
          title: "Manage destinations",
          endpoint: "/destinations",
          items: destinations,
          form: forms.destinations,
          submitLabel: forms.destinations.id ? "Update Destination" : "Add Destination",
          successCreate: "Destination created successfully.",
          successUpdate: "Destination updated successfully.",
          list: (item) => (
            <>
              <h3 className="text-lg font-bold text-slate-950">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.location}</p>
              <p className="mt-2 text-sm text-slate-600">{item.description || "No description provided."}</p>
            </>
          ),
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "location", label: "Location", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "image_url", label: "Image URL", type: "text" },
          ],
        };
      case "campaigns":
        return {
          title: "Manage campaigns",
          endpoint: "/campaigns",
          items: campaigns,
          form: forms.campaigns,
          submitLabel: forms.campaigns.id ? "Update Campaign" : "Add Campaign",
          successCreate: "Campaign created successfully.",
          successUpdate: "Campaign updated successfully.",
          list: (item) => (
            <>
              <h3 className="text-lg font-bold text-slate-950">{item.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.start_date?.slice(0, 10)} to {item.end_date?.slice(0, 10)}</p>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </>
          ),
          fields: [
            { name: "title", label: "Title", type: "text", required: true },
            { name: "description", label: "Description", type: "textarea", required: true },
            { name: "start_date", label: "Start Date", type: "date", required: true },
            { name: "end_date", label: "End Date", type: "date", required: true },
            { name: "banner_url", label: "Banner URL", type: "text", required: true },
          ],
        };
      case "hotels":
        return {
          title: "Manage hotels",
          endpoint: "/hotels",
          items: hotels,
          form: forms.hotels,
          submitLabel: forms.hotels.id ? "Update Hotel" : "Add Hotel",
          successCreate: "Hotel created successfully.",
          successUpdate: "Hotel updated successfully.",
          list: (item) => (
            <>
              <h3 className="text-lg font-bold text-slate-950">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.location}</p>
              <p className="mt-2 text-sm text-slate-600">NPR {Number(item.price_per_night || 0).toLocaleString()} / night</p>
              <p className="mt-1 text-sm text-slate-600">{item.contact_info || "No contact info."}</p>
            </>
          ),
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "location", label: "Location", type: "text", required: true },
            { name: "price_per_night", label: "Price Per Night", type: "number", required: true, min: "0", step: "0.01" },
            { name: "contact_info", label: "Contact Info", type: "text" },
          ],
        };
      case "flights":
        return {
          title: "Manage flights",
          endpoint: "/flights",
          items: flights,
          form: forms.flights,
          submitLabel: forms.flights.id ? "Update Flight" : "Add Flight",
          successCreate: "Flight created successfully.",
          successUpdate: "Flight updated successfully.",
          list: (item) => (
            <>
              <h3 className="text-lg font-bold text-slate-950">{item.airline} {item.flight_number}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.source} to {item.destination}</p>
              <p className="mt-2 text-sm text-slate-600">
                {item.date?.slice(0, 10)} | {String(item.departure_time || "").slice(0, 5)} - {String(item.arrival_time || "").slice(0, 5)}
              </p>
              <p className="mt-1 text-sm text-slate-600">NPR {Number(item.price || 0).toLocaleString()}</p>
            </>
          ),
          fields: [
            { name: "airline", label: "Airline", type: "text", required: true },
            { name: "flight_number", label: "Flight Number", type: "text", required: true },
            { name: "source", label: "Source", type: "text", required: true },
            { name: "destination", label: "Destination", type: "text", required: true },
            { name: "price", label: "Price", type: "number", required: true, min: "0", step: "0.01" },
            { name: "date", label: "Date", type: "date", required: true },
            { name: "departure_time", label: "Departure Time", type: "time", required: true },
            { name: "arrival_time", label: "Arrival Time", type: "time", required: true },
          ],
        };
      case "guides":
      default:
        return {
          title: "Manage guides",
          endpoint: "/tour-guides",
          items: guides,
          form: forms.guides,
          submitLabel: forms.guides.id ? "Update Guide" : "Add Guide",
          successCreate: "Guide created successfully.",
          successUpdate: "Guide updated successfully.",
          list: (item) => (
            <>
              <h3 className="text-lg font-bold text-slate-950">{item.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{item.experience || "Experience not listed"}</p>
              <p className="mt-2 text-sm text-slate-600">{item.languages || "Languages not listed"}</p>
              <p className="mt-1 text-sm text-slate-600">{item.specialties || "Specialties not listed"}</p>
              <p className="mt-1 text-sm text-slate-600">{item.email || "Email not listed"}</p>
            </>
          ),
          fields: [
            { name: "name", label: "Name", type: "text", required: true },
            { name: "experience", label: "Experience", type: "text", required: true },
            { name: "languages", label: "Languages", type: "text", required: true },
            { name: "specialties", label: "Specialties", type: "text", required: true },
            { name: "rate_per_hour", label: "Rate Per Hour", type: "number", required: true, min: "0", step: "0.01" },
            { name: "email", label: "Email", type: "email", required: true },
            { name: "contact", label: "Contact", type: "text", required: true },
            { name: "photo_url", label: "Photo URL", type: "text" },
          ],
        };
    }
  };

  const activeConfig = getSectionConfig(activeSection);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const section = activeSection;
    const config = getSectionConfig(section);
    const form = config.form;

    try {
      if (form.id) {
        await API.put(`${config.endpoint}/${form.id}`, form);
        setMessage(config.successUpdate);
      } else {
        await API.post(config.endpoint, form);
        setMessage(config.successCreate);
      }

      handleReset(section);
      await loadData();
    } catch (err) {
      const details = err.response?.data?.errors;
      const detailText = Array.isArray(details) && details.length ? ` ${details.join(", ")}` : "";
      setMessage((err.response?.data?.message || "Operation failed.") + detailText);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (section, id) => {
    const config = getSectionConfig(section);
    setMessage("");

    try {
      await API.delete(`${config.endpoint}/${id}`);
      if (config.form.id === id) {
        handleReset(section);
      }
      setMessage(`${config.title.replace("Manage ", "").replace(/^\w/, (char) => char.toUpperCase())} record deleted successfully.`);
      await loadData();
    } catch (err) {
      setMessage(err.response?.data?.message || "Delete failed.");
    }
  };

  if (loading) return <LoadingState label="Loading admin dashboard" />;
  if (error) return <ErrorState title="Admin dashboard unavailable" message={error} />;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[36px] bg-[#08111f] px-6 py-8 text-white shadow-[0_30px_100px_-35px_rgba(8,17,31,0.88)] sm:px-8 lg:px-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_28%),radial-gradient(circle_at_80%_20%,_rgba(59,130,246,0.24),_transparent_22%),linear-gradient(135deg,_rgba(255,255,255,0.02),_transparent)]" />
        <div className="relative z-10">
          <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.28em] text-cyan-200">
            Admin Console
          </div>
          <h1 className="mt-5 max-w-4xl text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Role-based admin workspace for destinations, campaigns, hotels, flights, and guides.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 sm:text-base">
            Admin users manage travel inventory here. Regular users stay on the traveler side and access booking history through My Trips.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{stat.label}</p>
                <p className="mt-3 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[32px] border border-white/70 bg-white/80 p-5 shadow-[0_18px_60px_-30px_rgba(15,23,32,0.35)] backdrop-blur">
        <div className="flex flex-wrap gap-3">
          {sections.map((section) => (
            <SectionButton
              key={section.id}
              active={activeSection === section.id}
              onClick={() => {
                setActiveSection(section.id);
                setMessage("");
              }}
            >
              {section.label}
            </SectionButton>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-[#d9e0ea] bg-white p-6 shadow-[0_24px_80px_-38px_rgba(15,23,32,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Editor</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950">
                {activeConfig.title}
              </h2>
            </div>
            {activeConfig.form.id ? (
              <button type="button" onClick={() => handleReset(activeSection)} className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950">
                Clear
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-5">
            {activeConfig.fields.map((field) => (
              <div key={field.name}>
                <label className="label-text" htmlFor={field.name}>{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    id={field.name}
                    name={field.name}
                    rows="4"
                    className="input-shell min-h-28 resize-y"
                    value={activeConfig.form[field.name] ?? ""}
                    onChange={(event) => handleChange(activeSection, event)}
                    required={field.required}
                  />
                ) : (
                  <input
                    id={field.name}
                    name={field.name}
                    type={field.type}
                    min={field.min}
                    step={field.step}
                    className="input-shell"
                    value={activeConfig.form[field.name] ?? ""}
                    onChange={(event) => handleChange(activeSection, event)}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          {message ? (
            <div className="mt-5 rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800">
              {message}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-full bg-[#08111f] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0d1e37] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Saving..." : activeConfig.submitLabel}
            </button>
            <button
              type="button"
              onClick={() => handleReset(activeSection)}
              className="inline-flex items-center justify-center rounded-full border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
            >
              Reset Form
            </button>
          </div>
        </form>

        <section className="rounded-[32px] border border-[#d9e0ea] bg-white p-6 shadow-[0_24px_80px_-38px_rgba(15,23,32,0.45)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-slate-500">Registry</p>
              <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-slate-950">{activeConfig.title}</h2>
            </div>
            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {activeConfig.items.length} records
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {activeConfig.items.map((item) => (
              <article key={item.id} className="rounded-[26px] border border-slate-200 bg-[#fbfcfd] p-4 transition hover:border-slate-300 hover:bg-white">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    {activeConfig.list(item)}
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">Record ID {item.id}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(activeSection, item)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-950"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(activeSection, item.id)}
                      className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {activeConfig.items.length === 0 ? (
              <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No records yet in this section.
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </div>
  );
}

export default AdminDashboard;
