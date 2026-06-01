import { Navigate, Route, Routes } from "react-router-dom";
import { CartProvider } from "./context/CartContext.jsx";
import { CREATOR } from "./data/posts.js";
import FeedPage from "./pages/FeedPage.jsx";
import LegacyPostRedirect from "./pages/LegacyPostRedirect.jsx";
import PostPage from "./pages/PostPage.jsx";

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/c/:creatorId" element={<FeedPage />} />
        <Route path="/c/:creatorId/:recipeSlug" element={<PostPage />} />
        <Route path="/p/:id" element={<LegacyPostRedirect />} />
        <Route path="/" element={<Navigate to={`/c/${CREATOR.id}`} replace />} />
        <Route path="*" element={<Navigate to={`/c/${CREATOR.id}`} replace />} />
      </Routes>
    </CartProvider>
  );
}
