import { Link } from "react-router-dom";

const features = [
  {
    title: "Browse Destinations",
    description: "Explore amazing destinations around Nepal.",
    color: "bg-blue-500",
    to: "/destinations",
  },
  {
    title: "Book Flights",
    description: "Find and book the best available flight options.",
    color: "bg-green-500",
    to: "/flights",
  },
  {
    title: "Book Hotels",
    description: "Reserve comfortable places to stay for your trip.",
    color: "bg-violet-500",
    to: "/hotels",
  },
  {
    title: "Create Booking",
    description: "Plan your trip with flights, hotels, and travel date.",
    color: "bg-teal-500",
    to: "/booking",
  },
  {
    title: "My Trips",
    description: "Check your bookings and travel plans in one place.",
    color: "bg-indigo-500",
    to: "/my-trips",
  },
  {
    title: "Tour Guides",
    description: "Connect with experienced local guides across Nepal.",
    color: "bg-orange-500",
    to: "/tour-guides",
  },
  {
    title: "Campaigns",
    description: "See featured offers and active travel campaigns.",
    color: "bg-pink-500",
    to: "/campaigns",
  },
];

function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            Welcome to TouristHub Nepal
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100 sm:text-xl">
            Your one-stop destination for exploring Nepal. Browse destinations, book flights and hotels,
            connect with tour guides, and manage your travel plans from one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-semibold tracking-[-0.03em] text-ink-950">
          Explore Our Features
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Link
              key={feature.title}
              to={feature.to}
              className="rounded-[24px] border border-ink-950/8 bg-white p-6 shadow-[0_16px_40px_-32px_rgba(15,23,32,0.35)] transition hover:-translate-y-1 hover:shadow-[0_22px_50px_-30px_rgba(15,23,32,0.35)]"
            >
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${feature.color}`}>
                <div className="h-5 w-5 rounded-sm bg-white/95" />
              </div>
              <h3 className="text-xl font-semibold text-ink-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-ink-900/65">{feature.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[#f3f4f6] py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-[-0.03em] text-ink-950">
            Ready to Start Your Journey?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-900/60">
            Join travelers discovering destinations, hotels, flights, and guides across Nepal.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/destinations"
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
