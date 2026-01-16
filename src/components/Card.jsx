import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";

function Card({ id, name, com, img, discountPrice }) {
  const nav = useNavigate();

  return (
    <div
      onClick={() => nav(`/details/${id}`)}
      className="flex flex-col items-center w-35 h-40 lg:h-fit lg:w-fit cursor-pointer hover:bg-white/10 p-3 rounded-xl"
    >
      <div className="relative">
        <LazyLoadImage
          src={img[0]}
          effect="blur"
          className="h-[100px] md:w-50 md:h-40 lg:rounded-lg"
          alt={name}
        />
        <div className="absolute bottom-2 right-1 font-semibold bg-gray-900/70 px-2 rounded text-[15px]">
          <span>₹{discountPrice}</span>
        </div>
      </div>
      <span className="mt-1.5 text-sm lg:text-xl font-semibold text-center">
        {name}
      </span>
      <span className="hidden sm:block text-sm text-center text-gray-500 font-semibold">
        {com}
      </span>
    </div>
  );
}

export default Card;
