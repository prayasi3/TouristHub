import { useEffect, useState } from "react";
import API from "../api/axios";

function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await API.get("/destinations");
        setDestinations(res.data);
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestinations();
  }, []);

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Destinations</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {destinations.map((d) => (
          <div
            key={d.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={d.image}
              alt={d.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-semibold">{d.name}</h2>
              <p className="text-gray-500">{d.location}</p>
              <p className="mt-2 text-sm">{d.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Destinations;
