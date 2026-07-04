export default function IngredientPopup({ visible, exiting, product, productNumber, onClick }) {
  if (!product && !visible) return null;

  return (
    <button
      type="button"
      className={`ingredient-popup ingredient-popup--badge${visible && !exiting ? " is-enter" : ""}${exiting ? " is-exit" : ""}`}
      id="ingredientPopup"
      hidden={!visible && !exiting}
      aria-hidden={!visible}
      aria-label={
        product && productNumber != null
          ? `Ingredient ${productNumber}: ${product.name}. Tap to view ingredients.`
          : undefined
      }
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
    >
      {productNumber != null ? <span className="ingredient-popup-number">{productNumber}</span> : null}
    </button>
  );
}
