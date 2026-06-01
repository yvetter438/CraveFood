/** Lightweight slide shell — keeps scroll height without loading a YouTube iframe. */
export default function ShortSlidePlaceholder({ post }) {
  return (
    <article className="p1-shorts-slide p1-shorts-slide--placeholder" data-post-id={post.id} aria-hidden="true">
      <main className="main p1-shorts-slide-main">
        <div className="p1-media-row">
          <section className="stage p1-stage">
            <div className="video-shell p1-video-shell p1-video-shell--short">
              <img className="p1-yt-poster p1-yt-poster--solo" src={post.feedThumb} alt="" />
            </div>
          </section>
        </div>
      </main>
    </article>
  );
}
