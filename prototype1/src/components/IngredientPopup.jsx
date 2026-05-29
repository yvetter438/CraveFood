import ThumbnailImage from "./ThumbnailImage.jsx";
import { formatMoney } from "../lib/format.js";

export default function IngredientPopup({ visible, exiting, product, onSave, onClick }) {
  if (!product && !visible) return null;

  return (
    <div
      className={`ingredient-popup${visible && !exiting ? " is-enter" : ""}${exiting ? " is-exit" : ""}`}
      id="ingredientPopup"
      hidden={!visible && !exiting}
      aria-hidden={!visible}
      onClick={onClick}
    >
      {product ? (
        <>
          <ThumbnailImage className="ingredient-popup-thumb" src={product.image} alt={product.name} width={48} height={48} />
          <div className="ingredient-popup-text">
            <p className="ingredient-popup-label">On screen now</p>
            <p className="ingredient-popup-name">{product.name}</p>
            <p className="ingredient-popup-price">{formatMoney(product.price)}</p>
          </div>
          <button type="button" className="btn-add-mini" onClick={onSave}>
            Save
          </button>
        </>
      ) : null}
    </div>
  );
}
