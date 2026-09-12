export default function StarRating({ value = 0, size = "text-sm" }) {
  const rounded = Math.round(value);
  return (
    <span className={`${size} text-accent-500`} aria-label={`Rated ${value} out of 5`}>
      {"★".repeat(rounded)}
      <span className="text-ink-300">{"★".repeat(5 - rounded)}</span>
    </span>
  );
}
