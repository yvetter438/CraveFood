import { Navigate, useParams } from "react-router-dom";
import { CREATOR, getPostById } from "../data/posts.js";
import { recipePath } from "../data/urlScheme.js";

/** /p/foodwishes_24 → /c/foodwishes/{slug} */
export default function LegacyPostRedirect() {
  const { id } = useParams();
  const post = id ? getPostById(id) : null;
  if (post && post.creatorId === CREATOR.id && post.slug) {
    return <Navigate to={recipePath(CREATOR.id, post.slug)} replace />;
  }
  return <Navigate to={`/c/${CREATOR.id}`} replace />;
}
