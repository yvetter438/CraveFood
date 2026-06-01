import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import PrototypeBadge from "../components/PrototypeBadge.jsx";
import UnclaimedDisclaimer from "../components/UnclaimedDisclaimer.jsx";
import { CREATOR, getPostsForCreator } from "../data/posts.js";
import { recipePath } from "../data/urlScheme.js";
import { useRobotsMeta } from "../hooks/useRobotsMeta.js";
import { creatorHubAllowsSearchIndexing } from "../lib/seoIndexing.js";
import { hasPostText } from "../lib/postMeta.js";

const WAITLIST_URL = "https://forms.gle/Ut8bRDfcMP9fZYTN6";

export default function FeedPage() {
  const { creatorId } = useParams();
  const isPilotCreator = creatorId === CREATOR.id;
  const posts = isPilotCreator ? getPostsForCreator(CREATOR.id) : [];

  useRobotsMeta(isPilotCreator && creatorHubAllowsSearchIndexing(CREATOR, posts));

  useEffect(() => {
    document.body.className = "feed-page";
    document.title = `${CREATOR.displayName} · Crave`;
    return () => {
      document.body.className = "";
    };
  }, []);

  if (!isPilotCreator) {
    return <Navigate to={`/c/${CREATOR.id}`} replace />;
  }

  return (
    <div className="feed-app">
      <header className="feed-top">
        <div className="feed-brand">
          <a href="https://crave.food/" className="logo logo-link">
            Crave
          </a>
          <PrototypeBadge />
        </div>
        <a
          className="btn-marketing btn-marketing--primary btn-waitlist-sm"
          href={WAITLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join the waitlist"
        >
          <span className="waitlist-cta__long">Join the waitlist</span>
          <span className="waitlist-cta__short" aria-hidden="true">
            Waitlist
          </span>
        </a>
      </header>

      <UnclaimedDisclaimer creator={CREATOR} variant="banner" />

      <section className="feed-profile" aria-label="Creator profile">
        <div className="feed-avatar" aria-hidden="true">
          <span className="feed-avatar-inner">{CREATOR.avatarInitials}</span>
        </div>
        <div className="feed-profile-text">
          <h1 className="feed-handle">{CREATOR.handle}</h1>
          <p className="feed-bio">{CREATOR.bio}</p>
          <p className="p1-youtube-link">
            <a href={CREATOR.youtubeChannel} target="_blank" rel="noopener noreferrer">
              Watch on YouTube
            </a>
          </p>
        </div>
      </section>

      <nav className="feed-tabs" aria-label="Content">
        <span className="feed-tab is-active" aria-current="page">
          Posts
        </span>
      </nav>

      <ul className="feed-grid" aria-label="Recipe posts">
        {posts.map((post) => (
          <li key={post.id} className="feed-cell">
            <Link className="feed-tile" to={recipePath(CREATOR.id, post.slug)}>
              <div className="feed-tile-media">
                <img className="feed-tile-img" src={post.feedThumb} alt="" width={360} height={640} loading="lazy" decoding="async" />
                <div className="feed-tile-shade" aria-hidden="true" />
                <span className="feed-tile-play" aria-hidden="true">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </div>
              {hasPostText(post.title) ? <p className="feed-tile-title">{post.title}</p> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
