import { useState } from "react";

const FALLBACK = "/assets/ingredient-default.svg";
const FALLBACK_DATA =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" rx="5" fill="#3d2f48"/><path d="M7 12h10M12 8v8" stroke="#ffb89a" stroke-width="1.5" stroke-linecap="round"/></svg>'
  );

export default function ThumbnailImage({ src, alt = "", className, width, height, loading }) {
  const [current, setCurrent] = useState(src || FALLBACK);

  const onError = () => {
    if (current === FALLBACK_DATA) return;
    if (current === FALLBACK) setCurrent(FALLBACK_DATA);
    else setCurrent(FALLBACK);
  };

  return (
    <img
      className={className}
      src={current}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      onError={onError}
    />
  );
}
