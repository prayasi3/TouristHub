import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StatusView";
import { campaignFallbackImage, resolveAssetUrl } from "../lib/assets";
import { daysRemaining, formatDate } from "../lib/format";

function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get("/campaigns");
        setCampaigns(response.data);
      } catch {
        setError("Could not load campaign data.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) return <LoadingState label="Loading campaigns" />;
  if (error) return <ErrorState title="Campaigns unavailable" message={error} />;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Offers"
        title="Campaigns worth acting on"
        description="The frontend highlights timing, creative, and urgency while still matching the exact campaign fields your backend exposes."
        compact
      />

      {campaigns.length === 0 ? (
        <EmptyState
          title="No campaigns yet"
          message="Create records in the `campaigns` table to populate this page."
        />
      ) : (
        <section className="grid gap-6 lg:grid-cols-2">
          {campaigns.map((campaign) => {
            const remaining = daysRemaining(campaign.end_date);
            return (
              <Link key={campaign.id} to={`/campaigns/${campaign.id}`} className="surface-card overflow-hidden p-0">
                <img
                  src={resolveAssetUrl(campaign.banner_url, campaignFallbackImage)}
                  alt={campaign.title}
                  className="h-72 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = campaignFallbackImage;
                  }}
                />
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="pill">Starts {formatDate(campaign.start_date)}</span>
                    <span className="pill">Ends {formatDate(campaign.end_date)}</span>
                    <span className="pill">{remaining > 0 ? `${remaining} days left` : "Expired or closing"}</span>
                  </div>
                  <h2 className="mt-5 text-2xl font-bold">{campaign.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-ink-900/65">{campaign.description}</p>
                </div>
              </Link>
            );
          })}
        </section>
      )}
    </div>
  );
}

export default Campaigns;
