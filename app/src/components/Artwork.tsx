import { useId } from "react";

/** Original vector mood artwork. Never presented as event photography. */
export default function Artwork({
  kind = "orbit",
  className = "",
  active = false,
}: {
  kind?: string;
  className?: string;
  active?: boolean;
}) {
  const id = useId().replace(/:/g, "");
  const theatre = kind === "theatre",
    heritage = kind === "heritage",
    art = kind === "visual-arts",
    music = !theatre && !heritage && !art;
  return (
    <svg
      className={`artwork ${className} ${active ? "playing" : ""}`}
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={`Original abstract ${kind} artwork`}
    >
      <defs>
        <radialGradient id={id}>
          <stop
            stopColor={
              theatre
                ? "#fda58a"
                : heritage
                  ? "#c0bd79"
                  : art
                    ? "#b4a2de"
                    : "#bdebd0"
            }
          />
          <stop
            offset="1"
            stopColor={
              theatre
                ? "#d86b55"
                : heritage
                  ? "#766a3f"
                  : art
                    ? "#716692"
                    : "#4f8578"
            }
          />
        </radialGradient>
        <pattern
          id={`${id}grid`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M30 0H0V30"
            fill="none"
            stroke="#d8e4dd"
            strokeOpacity=".08"
          />
        </pattern>
      </defs>
      <rect
        width="600"
        height="600"
        fill={
          theatre
            ? "#402923"
            : heritage
              ? "#2a3026"
              : art
                ? "#272737"
                : "#152f2c"
        }
      />
      <rect width="600" height="600" fill={`url(#${id}grid)`} />
      <g className="art-orbit" transform="translate(300 300)">
        {Array.from({ length: music ? 23 : 14 }, (_, i) => (
          <ellipse
            key={i}
            cx={0}
            cy={0}
            rx={80 + i * 7}
            ry={80 + i * 7}
            transform={`rotate(${i * 5}) translate(${Math.sin(i * 0.19) * 45} 0)`}
            fill={i === 0 ? `url(#${id})` : "none"}
            stroke={
              i === 0
                ? "none"
                : theatre
                  ? "#f09c80"
                  : heritage
                    ? "#bebc85"
                    : art
                      ? "#b6a5e2"
                      : "#acd9bd"
            }
            strokeWidth={i === 1 ? 3 : 1}
            opacity={1 - i * 0.025}
          />
        ))}
      </g>
      <circle cx="457" cy="146" r="40" fill={music ? "#ef9178" : "#bad4af"} />
      <circle
        cx="457"
        cy="146"
        r="53"
        stroke="#e6e8d8"
        strokeOpacity=".4"
        fill="none"
      />
      <path
        d="M91 418Q360 542 492 285"
        stroke="#eee7d5"
        strokeWidth="1"
        fill="none"
      />
      <g fill="#f1ecdf">
        <circle cx="91" cy="418" r="4" />
        <circle cx="492" cy="285" r="3" />
        <path
          d="M133 128v20m-10-10h20M470 452v16m-8-8h16"
          stroke="#eee7d5"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}
