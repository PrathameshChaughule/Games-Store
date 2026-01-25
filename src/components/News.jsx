import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { getOptimizedImage } from "../supabaseClient/supabaseClient";

function News({ title, date, img, desc }) {
  const imageUrl = getOptimizedImage(img, {
    width: 350,
    height: 480,
    quality: 50,
    resize: "contain"
  });
  return (
    <div>
      <div className="flex h-90 flex-col gap-2 cursor-pointer md:w-78 rounded-2xl bg-gray-400/10">
        <LazyLoadImage
          effect="blur"
          className="h-43 w-full rounded-t-2xl"
          alt={title}
          src={imageUrl}
        />
        <div className="px-4 py-3">
          <span>{title}</span>
          <div className="flex gap-3 text-md my-1.5 text-gray-400">
            <span className="flex items-center gap-2">
              {date}
            </span>
          </div>
          <span className="text-sm text-gray-500">{desc}</span>
        </div>
      </div>
    </div>
  );
}

export default News;
