import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/axios";
import PageHeader from "../components/PageHeader";
import { ErrorState, LoadingState } from "../components/StatusView";
import { daysRemaining, formatDate } from "../lib/format";

function buildCampaignAbout(campaign) {
  const title = String(campaign?.title || "").toLowerCase();
  const description = String(campaign?.description || "").trim();

  const intro = description
    ? `${description} `
    : "This campaign is designed to give travelers a focused and well-planned experience built around the offer theme, helping them understand what the trip includes and why this promotion is worth considering. ";

  if (title.includes("trek") || title.includes("hike")) {
    return `${intro}This campaign focuses on a trekking-centered experience with the kind of preparation and structure travelers usually need before heading into mountain regions. Visitors can expect route planning support, accommodation coordination, and a journey shaped around scenic trails, fresh air, and gradual immersion into the landscape. It is intended for travelers who want a physically active trip while still having the comfort of an organized offer that makes the experience easier to manage from start to finish.`;
  }

  if (title.includes("adventure") || title.includes("expedition")) {
    return `${intro}This campaign is built for travelers who want a more energetic and experience-driven itinerary rather than a slow sightseeing trip. The overall offer is expected to include action-focused planning, flexible movement between key locations, and opportunities to enjoy outdoor activities that make the journey feel exciting and memorable. It suits people who are looking for a trip with strong momentum, a sense of discovery, and a schedule that emphasizes experience over routine.`;
  }

  if (title.includes("pilgrimage") || title.includes("spiritual") || title.includes("temple")) {
    return `${intro}This campaign is centered on a calmer and more meaningful style of travel, with attention given to spiritual landmarks, reflection, and cultural understanding. Travelers can expect an itinerary that prioritizes important temples, heritage sites, and peaceful surroundings while maintaining a pace that feels respectful and comfortable. The purpose of the campaign is not only to help people visit these places, but also to create a setting where the journey feels intentional, memorable, and personally significant.`;
  }

  if (title.includes("festival") || title.includes("celebration")) {
    return `${intro}This campaign is designed around the energy and timing of a festival or celebration, which means the experience is likely to feel lively, colorful, and connected to the local atmosphere. Travelers can expect the trip to highlight cultural events, seasonal excitement, and special moments that make this period different from an ordinary visit. The campaign is meant to help travelers enjoy the celebration more fully by aligning the offer with the schedule, mood, and popularity of the event itself.`;
  }

  if (title.includes("luxury") || title.includes("premium")) {
    return `${intro}This campaign is intended for travelers who want a more refined and comfortable experience, with stronger attention to convenience, quality, and overall presentation. The offer is likely to emphasize upgraded accommodation, smoother travel arrangements, and a trip structure that reduces stress while improving comfort throughout the stay. Rather than focusing only on movement from place to place, this campaign highlights the feeling of traveling well and enjoying a more polished, premium journey.`;
  }

  if (title.includes("family") || title.includes("holiday")) {
    return `${intro}This campaign is arranged with shared travel in mind, making it suitable for families or groups who want a trip that feels easy to follow and enjoyable for everyone involved. Travelers can expect a balanced itinerary, dependable accommodation, and activities that allow time for both exploration and rest without making the experience feel rushed. The overall goal is to make the campaign practical, welcoming, and comfortable for people traveling together across different ages and preferences.`;
  }

  if (title.includes("honeymoon") || title.includes("romance") || title.includes("couple")) {
    return `${intro}This campaign is shaped around a more intimate and memorable travel experience for couples who want their trip to feel personal and well considered. Travelers can expect scenic settings, comfortable stays, and a pace that allows room for quiet moments, shared experiences, and a stronger sense of connection throughout the journey. The purpose of the campaign is to create an atmosphere that feels special rather than routine, with details that support comfort, privacy, and lasting memories.`;
  }

  if (title.includes("wildlife") || title.includes("safari") || title.includes("nature")) {
    return `${intro}This campaign is built for travelers who want to spend more time around natural landscapes, open environments, and the distinctive ecological character of the destination. The experience is expected to include sightseeing opportunities, nature-focused excursions, and moments that appeal to travelers interested in wildlife, scenery, and photography. More than a simple trip, the campaign aims to give visitors a stronger connection to the outdoors and a clearer sense of what makes the destination naturally unique.`;
  }

  if (title.includes("city") || title.includes("heritage") || title.includes("cultural")) {
    return `${intro}This campaign focuses on the cultural and historical identity of the destination, making it a strong fit for travelers who want more than just a quick visit. Guests can expect city exploration, landmark visits, local flavor, and an itinerary that helps them understand the story, character, and everyday life of the place they are visiting. The campaign is designed to make the journey feel informative as well as enjoyable, turning the trip into a deeper cultural experience rather than a surface-level tour.`;
  }

  return `${intro}This campaign offers a more complete travel experience than a simple promotion by combining timing, planning, and destination appeal into one package. Travelers can expect a structured offer that helps them understand what the campaign is about, what kind of experience it is aiming to create, and why the promotion may be worth acting on during the active period. Overall, it is meant to give visitors a clearer sense of value, purpose, and experience before they commit to the trip.`;
}

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
  const aboutCampaign = buildCampaignAbout(campaign);

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

      <section className="surface-card">
        <span className="section-kicker">About This Campaign</span>
        <h2 className="mt-4 text-2xl font-semibold text-ink-950">What to expect</h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-ink-900/70">
          {aboutCampaign}
        </p>
      </section>
    </div>
  );
}

export default CampaignDetails;
