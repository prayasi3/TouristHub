import { useEffect, useState } from "react";
import API from "../api/axios";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await API.get("/campaigns");
        setCampaigns(res.data);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };

    fetchCampaigns();
  }, []);

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Campaigns</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {campaigns.map((c) => (
          <div
            key={c.id}
            className="bg-white shadow-md rounded-2xl overflow-hidden"
          >
            <img
              src={c.banner}
              alt={c.title}
              className="w-full h-48 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-sm mt-2">{c.description}</p>
              <p className="text-xs text-gray-500 mt-2">
                {c.start_date} - {c.end_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Campaigns;
