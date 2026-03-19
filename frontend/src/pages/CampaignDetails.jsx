import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/campaigns/${id}`)
      .then(res => res.json())
      .then(data => setCampaign(data));
  }, [id]);

  if (!campaign) return <h2>Loading...</h2>;

  return (
    <div>
      <h1>{campaign.title}</h1>
      <img src={campaign.image} alt={campaign.title} width="400" />
      <p>{campaign.description}</p>
      <p><b>Location:</b> {campaign.location}</p>
      <p><b>Duration:</b> {campaign.duration}</p>
    </div>
  );
}

export default CampaignDetails;