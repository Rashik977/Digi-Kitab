import { createElement } from "./createElement";

export const createStarRating = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    const starClass = i <= rating ? "text-yellow-500" : "text-gray-300";
    stars.push(
      createElement("span", { className: starClass, innerHTML: "&#9733;" }) // Unicode for star symbol
    );
  }
  return stars;
};
