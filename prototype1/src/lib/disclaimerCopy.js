/** Claim CTA until dedicated /claim flow ships (Phase 3). */
export const CLAIM_PROFILE_URL = "https://forms.gle/Ut8bRDfcMP9fZYTN6";

export function showUnclaimedDisclaimer(creator) {
  return creator && !creator.claimed;
}

export function unclaimedDisclaimerText(creatorDisplayName) {
  const name = creatorDisplayName || "this creator";
  return {
    full: `Demo profile · Not affiliated with ${name} · Claim to manage`,
    segments: ["Demo profile", `Not affiliated with ${name}`, "Claim to manage"],
    creatorName: name,
  };
}
