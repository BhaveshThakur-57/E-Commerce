import { Star } from "lucide-react";

const StarRating = ({ rating, onRate, size = 20, readonly = false }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onRate && onRate(star)}
          disabled={readonly}
          className={`transition-transform duration-150 ${
            !readonly ? "hover:scale-125 cursor-pointer" : "cursor-default"
          }`}
        >
          <Star
            size={size}
            className={
              star <= rating
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-300 dark:text-zinc-600"
            }
          />
        </button>
      ))}
    </div>
  );
};

export default StarRating;