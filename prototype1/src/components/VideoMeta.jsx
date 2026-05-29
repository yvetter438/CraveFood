import { hasPostText } from "../lib/postMeta.js";

export default function VideoMeta({ post, hideTitle = false }) {
  const showTitle = !hideTitle && hasPostText(post.title);
  const showAuthor = hasPostText(post.author);
  const showBlurb = hasPostText(post.blurb);
  const showMacros = hasPostText(post.macros);
  const compact = !showBlurb && !showMacros;

  if (!showTitle && !showAuthor && !showBlurb && !showMacros) {
    return null;
  }

  return (
    <div className={`video-meta${compact ? " video-meta--compact" : ""}`}>
      {showTitle ? <p className="recipe-title">{post.title}</p> : null}
      {showAuthor ? <p className="recipe-author">{post.author}</p> : null}
      {showBlurb ? <p className="recipe-blurb">{post.blurb}</p> : null}
      {showMacros ? <p className="recipe-macros">{post.macros}</p> : null}
    </div>
  );
}
