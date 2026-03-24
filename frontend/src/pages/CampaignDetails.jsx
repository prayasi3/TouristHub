import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { ErrorState, LoadingState } from "../components/StatusView";
import { daysRemaining, formatDate } from "../lib/format";

function CampaignDetails() {
  const { id } = useParams();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await API.get(`/campaigns/${id}`);
        setCampaign(response.data);
      } catch {
        setError("Campaign details could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  if (loading) return <LoadingState label="Loading campaign details" />;
  if (error) {
    return (
      <ErrorState
        title="Campaign unavailable"
        message={error}
        action={<Link to="/campaigns" className="primary-button">Back to Campaigns</Link>}
      />
    );
  }
  if (!campaign) return null;

  const remaining = daysRemaining(campaign.end_date);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Campaign Details"
        title={campaign.title}
        description={campaign.description}
        compact
        actions={
          <>
            <Link to="/campaigns" className="secondary-button">All Campaigns</Link>
          </>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface-card overflow-hidden p-0">
          <img
            src={campaign.banner_url || "/images/campaigns/nepal_banner.jpg"}
            alt={campaign.title}
            className="h-full min-h-96 w-full object-cover"
          />
        </div>
        <div className="surface-card">
          <span className="section-kicker">Offer Window</span>
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm text-ink-900/55">Starts</p>
              <p className="mt-1 text-xl font-semibold">{formatDate(campaign.start_date)}</p>
            </div>
            <div>
              <p className="text-sm text-ink-900/55">Ends</p>
              <p className="mt-1 text-xl font-semibold">{formatDate(campaign.end_date)}</p>
            </div>
            <div>
              <p className="text-sm text-ink-900/55">Status</p>
              <p className="mt-1 text-xl font-semibold">{remaining > 0 ? `${remaining} days remaining` : "Final window or expired"}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CampaignDetails;
