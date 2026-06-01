import { CLAIM_PROFILE_URL, showUnclaimedDisclaimer, unclaimedDisclaimerText } from "../lib/disclaimerCopy.js";
import { trackClaimCtaClick } from "../lib/shopAnalytics.js";

/**
 * Visible trust line on unclaimed demo profiles.
 * @param {{ creator: { claimed?: boolean, displayName?: string }, variant?: 'banner' | 'compact' }} props
 */
export default function UnclaimedDisclaimer({ creator, variant = "banner" }) {
  if (!showUnclaimedDisclaimer(creator)) return null;

  const { segments } = unclaimedDisclaimerText(creator.displayName);

  return (
    <aside
      className={`p1-unclaimed-disclaimer p1-unclaimed-disclaimer--${variant}`}
      role="note"
      aria-label="Demo profile notice"
    >
      <p className="p1-unclaimed-disclaimer__text">
        <span>{segments[0]}</span>
        <span className="p1-unclaimed-disclaimer__sep" aria-hidden="true">
          ·
        </span>
        <span>{segments[1]}</span>
        <span className="p1-unclaimed-disclaimer__sep" aria-hidden="true">
          ·
        </span>
        <a
          href={CLAIM_PROFILE_URL}
          className="p1-unclaimed-disclaimer__cta"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackClaimCtaClick({
              creatorId: creator.id || "unknown",
              location: variant,
            })
          }
        >
          {segments[2]}
        </a>
      </p>
    </aside>
  );
}
