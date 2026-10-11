import type { Interest } from "../domain/types";

/** Twelve original symbols make selecting a taste feel like browsing record sleeves. */
export default function InterestArt({ interest }: { interest: Interest }) {
  const colours: Record<Interest, string> = {
    indie: "#d6ff75",
    pop: "#ffa68d",
    jazz: "#c5abef",
    electronic: "#91cbff",
    theatre: "#ff947d",
    film: "#dec6a8",
    art: "#b5a1eb",
    heritage: "#9bcfff",
    literature: "#dbc98b",
    workshop: "#d6ff75",
    gaming: "#94dcca",
    orchestral: "#ebadb9",
  };
  const paths: Record<Interest, React.ReactNode> = {
    indie: (
      <g transform="rotate(-22 100 100)">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <rect
            key={i}
            x={36 + i * 19}
            y={65 + Math.sin(i) * 18}
            width="10"
            height={65 - Math.sin(i) * 36}
            rx="5"
          />
        ))}
      </g>
    ),
    pop: (
      <>
        <path d="m100 30 18 45 50 5-38 33 12 47-42-25-42 25 12-47-38-33 50-5Z" />
        <circle cx="100" cy="101" r="16" fill={colours.pop} />
      </>
    ),
    jazz: (
      <g fill="none" stroke="currentColor" strokeWidth="8">
        <path d="M115 35v86q0 38-36 38-30 0-30-24 0-22 25-22 20 0 28 15M115 40h28v80" />
        <circle cx="71" cy="137" r="9" fill="currentColor" />
      </g>
    ),
    electronic: (
      <g fill="none" stroke="currentColor" strokeWidth="3">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} d={`M25 ${60 + i * 17}h35l20-25 30 50 20-25h45`} />
        ))}
      </g>
    ),
    theatre: (
      <>
        <path d="M35 40h55v60q0 45-27 55-28-10-28-55Z" />
        <path d="M110 60h55v60q0 45-27 55-28-10-28-55Z" />
        <g stroke={colours.theatre} strokeWidth="5" fill="none">
          <path d="m47 73 10-5m13 0 10 5m-33 34q16 17 32 0M120 90h12m12 0h12m-32 49q14-15 28 0" />
        </g>
      </>
    ),
    film: (
      <>
        <path d="M30 62h140v99H30Z" />
        <path d="m30 48 125-28 8 27-125 27Z" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={i}
            d={`m${45 + i * 33} 47 15-3 12 21-15 3Z`}
            fill={colours.film}
          />
        ))}
        <path d="m87 90 35 23-35 23Z" fill={colours.film} />
      </>
    ),
    art: (
      <g fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m40 140 45-105 80 55-45 85Z" fill="currentColor" />
        <path
          d="m85 35 15 80 65-25M40 140l60-25 20 60"
          stroke={colours.art}
          strokeWidth="3"
        />
        <circle cx="151" cy="40" r="13" fill="currentColor" />
      </g>
    ),
    heritage: (
      <>
        <path d="m27 77 73-43 73 43Z" />
        <path d="M30 158h140v12H30ZM37 142h126v10H37Z" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={43 + i * 32} y="87" width="17" height="48" />
        ))}
        <circle cx="100" cy="62" r="7" fill={colours.heritage} />
      </>
    ),
    literature: (
      <>
        <path d="M30 40q38-10 70 10 32-20 70-10v110q-38-9-70 10-32-19-70-10Z" />
        <g stroke={colours.literature} strokeWidth="3">
          <path d="M100 55v96M44 65l40 7m-40 11 40 7m-40 11 40 7m32-36 40-7m-40 25 40-7m-40 25 40-7" />
        </g>
      </>
    ),
    workshop: (
      <>
        <path d="m37 154 18-42 83-83 29 29-83 83Z" />
        <path d="m114 53 30 29" stroke={colours.workshop} strokeWidth="4" />
        <path d="M35 169h133" stroke="currentColor" strokeWidth="3" />
        <path d="m35 156 19-5-13-13Z" />
      </>
    ),
    gaming: (
      <>
        <path d="M57 62h86q20 0 29 20l16 55q3 23-18 23-12 0-29-25H59q-17 25-29 25-21 0-18-23l16-55q9-20 29-20Z" />
        <path d="M54 81v32m-16-16h32" stroke={colours.gaming} strokeWidth="6" />
        <circle cx="141" cy="86" r="7" fill={colours.gaming} />
        <circle cx="155" cy="105" r="7" fill={colours.gaming} />
      </>
    ),
    orchestral: (
      <g fill="none" stroke="currentColor" strokeWidth="3">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx={20 + i * 8}
            ry={70 - i * 4}
            transform={`rotate(${i * 22.5} 100 100)`}
          />
        ))}
      </g>
    ),
  };
  return (
    <svg
      viewBox="0 0 200 200"
      className="interest-art"
      aria-hidden="true"
      style={{ background: colours[interest], color: "#121523" }}
    >
      <g fill="currentColor">{paths[interest]}</g>
    </svg>
  );
}
