import { useId } from "react";
import type { CultureEvent } from "../domain/types";

/** CultureLoop's original poster illustrations, never event photography. */
export default function EventCover({
  event,
  kind = "music",
  title,
  variant,
}: {
  event?: CultureEvent;
  kind?: string;
  title?: string;
  variant?: string;
}) {
  const id = useId().replace(/:/g, "");
  const category = event?.category || kind;
  const seed = variant || event?.id || kind;
  const theatre = category === "theatre";
  const art = category === "visual-arts";
  const music = category === "music" || category === "orbit";
  const ink = "#121523";
  const colour = theatre
    ? "#ff947d"
    : art
      ? "#b5a1eb"
      : music
        ? "#d6ff75"
        : "#9bcfff";
  const phrases: Record<string, string> = {
    "fat-kids": "A different\npoint of view.",
    "musica-intimae": "THE ART OF\nGOODBYE.",
    singlang: "SING IT\nTOGETHER.",
    "black-myth": "WORLDS\nIN SOUND.",
    "under-one-roof": "STORIES\nLIVE HERE.",
    "affordable-art-fair": "SEE THE\nPOSSIBILITY.",
    "comic-con": "IMAGINATION\nUNBOUND.",
    "runaway-songs-stories": "A SONG.\nA STORY.",
    "the-violinist": "STORIES\nON SCREEN.",
    "writing-as-witness": "WORDS\nBEAR WITNESS.",
    "cloth-paste-painting": "MAKE IT\nYOUR OWN.",
    "haw-ror-villa": "AFTER\nDARK.",
    "bedok-to-bollywood": "MANY ROOTS.\nONE CITY.",
    "yunnan-garden-walk": "A WALK\nTHROUGH TIME.",
    "mini-tingkat-painting": "SMALL OBJECT.\nYOUR STORY.",
    "ministry-of-djs-workshop": "FIND YOUR\nFREQUENCY.",
    "viva-concerti": "IN GOOD\nHARMONY.",
    "singapore-dream-toys": "A CITY\nOF PLAY.",
    "battle-bukit-chandu": "STORIES\nOF THIS PLACE.",
    "sso-pops-kapustin": "ROOM TO\nIMPROVISE.",
  };
  const phrase =
    title ||
    phrases[seed] ||
    (theatre
      ? "A different\npoint of view."
      : art
        ? "SEE THE\nPOSSIBILITY."
        : music
          ? "A NEW\nFREQUENCY."
          : "WORLDS\nWITHIN.");
  const alt = seed.includes("musica") || seed.includes("black-myth") || seed.includes("viva") || seed.includes("kapustin");
  return (
    <svg
      viewBox="0 0 600 600"
      preserveAspectRatio="xMidYMid slice"
      className={`event-cover art-orbit cover-${category}`}
      role="img"
      aria-label={`Original CultureLoop illustration for ${event?.title || kind}`}
    >
      <defs>
        <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r=".7" fill={ink} opacity=".16" />
        </pattern>
      </defs>
      <rect width="600" height="600" fill={colour} />
      <rect width="600" height="600" fill={`url(#${id})`} />
      {theatre ? (
        <g fill={ink}>
          <path d="M0 0h160c40 170 22 296-48 430L0 500Z" />
          <path d="M600 0H440c-40 170-22 296 48 430l112 70Z" />
          <ellipse cx="300" cy="492" rx="240" ry="78" opacity=".2" />
          {Array.from({ length: 5 }, (_, i) => (
            <g
              key={i}
              transform={`translate(${196 + i * 52} ${245 + Math.abs(2 - i) * 18})`}
            >
              <circle r="18" />
              <path d="M-17 25q17-8 34 0l17 102h-68Z" />
            </g>
          ))}
          <path
            d="M170 85h260M205 101h190"
            fill="none"
            stroke={ink}
            strokeWidth="2"
          />
        </g>
      ) : seed === "comic-con" ? (
        <g stroke={ink} strokeWidth="2" fill={ink}>
          <path d="m300 95 33 88 80-52-30 88 101 17-84 52 65 77-96-20-8 97-60-76-63 67 2-98-92 3 71-64-69-61 96-2Z" />
          <path
            d="m250 245 75-30-25 61 58-10-75 99 18-75-56 15Z"
            fill="#f4e8ff"
          />
        </g>
      ) : category === "film" ? (
        <g fill="none" stroke={ink} strokeWidth="3">
          <rect x="115" y="100" width="370" height="280"/>
          <path d="m268 175 95 65-95 65Z" fill={ink}/>
          {Array.from({length:6},(_,i)=><g key={i}><rect x={132+i*58} y="112" width="36" height="17" fill={ink}/><rect x={132+i*58} y="350" width="36" height="17" fill={ink}/></g>)}
          <path d="M160 395h280M210 410h180"/>
        </g>
      ) : category === "literature" ? (
        <g fill="none" stroke={ink} strokeWidth="3">
          <path d="M300 150q-85-65-180-20v250q105-40 180 20 75-60 180-20V130q-95-45-180 20Z"/>
          <path d="M300 150v250"/>
          {[0,1,2,3,4].map(i=><path key={i} d={`M150 ${170+i*36}q60-12 120 12M330 ${182+i*36}q60-24 120-12`}/>)}
        </g>
      ) : category === "workshop" ? (
        <g stroke={ink} strokeWidth="3" fill="none">
          <circle cx="300" cy="270" r="130"/>
          <path d="m140 165 160 270 160-270ZM120 340h360M300 105v330"/>
          <circle cx="300" cy="270" r="55" fill={ink}/>
          <circle cx="165" cy="130" r="25" fill={ink}/><circle cx="460" cy="360" r="18" fill={ink}/>
        </g>
      ) : art ? (
        <g stroke={ink} strokeWidth="2" fill="none">
          <path d="M90 390 244 130 510 240 353 502Z" />
          <path d="M244 130 310 340 90 390M510 240 310 340 353 502" />
          <path d="m244 130 266 110-157 262-43-162Z" fill={ink} opacity=".88" />
          <path d="m90 390 220-50 43 162Z" fill="#e5d8ff" />
          <circle cx="475" cy="115" r="38" fill="#e5d8ff" stroke="none" />
        </g>
      ) : music ? (
        <g fill={ink}>
          {seed === "black-myth" ? (
            <g>
              <circle cx="300" cy="275" r="150" />
              <path
                d="m330 105-105 166 68-9-35 166 127-213-88 17Z"
                fill={colour}
              />
              {[0, 1, 2, 3, 4].map((i) => (
                <circle
                  key={i}
                  cx="300"
                  cy="275"
                  r={165 + i * 12}
                  fill="none"
                  stroke={ink}
                  opacity={1 - i * 0.17}
                />
              ))}
            </g>
          ) : alt ? (
            <g transform="translate(300 290)">
              {Array.from({ length: 20 }, (_, i) => (
                <ellipse
                  key={i}
                  rx={35 + i * 10}
                  ry={160 - i * 3}
                  transform={`rotate(${i * 9})`}
                  fill="none"
                  stroke={ink}
                  strokeWidth="1.5"
                />
              ))}
            </g>
          ) : (
            <g transform="translate(300 290) rotate(-22)">
              {Array.from({ length: 13 }, (_, i) => (
                <rect
                  key={i}
                  x={-224 + i * 34}
                  y={-Math.sin(i * 0.46) * 94 - 45}
                  width="20"
                  height={140 + Math.sin(i * 0.46) * 140}
                  rx="10"
                />
              ))}
            </g>
          )}
          <g transform="translate(485 95)" stroke={ink} strokeWidth="3">
            {Array.from({ length: 6 }, (_, i) => (
              <path key={i} d="M0-24V24" transform={`rotate(${i * 30})`} />
            ))}
          </g>
        </g>
      ) : (
        <g fill={ink} stroke={ink} strokeWidth="2">
          <path d="m100 190 200-110 200 110Z" />
          <path d="M130 220h340v225H130Z" />
          <path d="M90 450h420" />
          <g fill={colour}>
            {[0, 1, 2].map((i) => (
              <g key={i}>
                <path d={`M${163 + i * 96} 425v-94q0-25 25-25t25 25v94Z`} />
                <rect x={163 + i * 96} y="241" width="50" height="40" />
              </g>
            ))}
          </g>
          <path d="M250 155h100" stroke={colour} />
        </g>
      )}
      <text
        x="38"
        y="47"
        fill={ink}
        fontSize="12"
        fontWeight="600"
        letterSpacing="3"
        fontFamily="DM Sans, sans-serif"
      >
        CULTURELOOP / ORIGINAL SERIES
      </text>
      <g transform="translate(36 480)">
        <rect x="-8" y="-48" width="550" height="135" fill={colour} />
        {phrase.split("\n").map((line, i) => (
          <text
            key={line}
            y={i * 54}
            fill={ink}
            fontSize="53"
            fontWeight="600"
            letterSpacing="-3"
            fontFamily="Space Grotesk, sans-serif"
          >
            {line}
          </text>
        ))}
      </g>
      <path d="M38 575H560" stroke={ink} strokeWidth="1" />
      <text
        x="38"
        y="594"
        fill={ink}
        fontSize="9"
        letterSpacing="2"
        fontFamily="DM Sans, sans-serif"
      >
        SINGAPORE · ARTWORK INSPIRED BY CULTURAL CONNECTIONS
      </text>
    </svg>
  );
}
