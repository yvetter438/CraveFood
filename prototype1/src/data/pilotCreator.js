/**
 * First SEO + outreach pilot. See docs/PILOT-CREATOR-FOODWISHES.md
 */
export const PILOT_CREATOR_ID = "foodwishes";

export const PILOT_CREATOR = {
  id: PILOT_CREATOR_ID,
  displayName: "Food Wishes",
  youtubeHandle: "@foodwishes",
  youtubeShortsUrl: "https://www.youtube.com/@foodwishes/shorts",
};

export function isPilotCreatorId(creatorId) {
  return creatorId === PILOT_CREATOR_ID;
}
