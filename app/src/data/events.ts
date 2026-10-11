import type { CultureEvent } from "../domain/types";

const verifiedAt = "2026-10-11T02:38:46Z";
const base = {
  verifiedAt,
  verificationStatus: "verified_eligible" as const,
  verificationMethod: "indexed-primary-page" as const,
  availability: "unknown" as const,
};
const expandedBase = {
  ...base,
  verifiedAt: "2026-10-11T05:00:46Z",
};

/** A curated snapshot, not live ticket inventory. Artwork is original abstract interpretation. */
export const events: CultureEvent[] = [
  {
    ...base,
    id: "fat-kids",
    title: "Fat Kids Are Harder To Kidnap 2026",
    description:
      "An audience-directed hour of 31 short plays, turning the present moment into local topical comedy.",
    organiser: "How Drama",
    category: "theatre",
    tags: ["theatre"],
    culturalNotes: [
      "The audience chooses the running order of 31 short plays.",
    ],
    bridgeFromTags: ["film", "pop"],
    bridgeExplanations: {
      film: "take your love of stories into an interactive live format, where the audience chooses the play order.",
      pop: "move from pop culture on a screen to topical comedy shaped by the people in the room.",
    },
    occasions: ["date", "friends", "solo"],
    location: "Wild Rice @ Funan",
    startDate: "2026-10-16",
    endDate: "2026-10-25",
    startingPriceSGD: 35,
    priceNote:
      "Standard ticket; BookMyShow lists a S$3 booking fee separately. Advisory 16.",
    officialListingUrl:
      "https://cp.bookmyshow.sg/en/events/fat-kids-are-harder-to-kidnap-2026/26FATKID",
    sourceUrls: [
      "https://www.sgculturepass.gov.sg/",
      "https://cp.bookmyshow.sg/en/events/fat-kids-are-harder-to-kidnap-2026/26FATKID",
      "https://www.wildrice.com.sg/event/615488-fat-kids-are-harder-to-kidnap-2026/",
    ],
    verificationMethod: "primary-page",
  },
  {
    ...base,
    id: "musica-intimae",
    title: "Musica Intimae: The Anatomy of Goodbye",
    description:
      "Vox Camerata brings choral voices and spoken word together in a participatory reflection on parting.",
    organiser: "Vox Camerata",
    category: "music",
    tags: [],
    culturalNotes: [
      "A semi-staged performance combines choral repertoire, spoken word and audience participation.",
    ],
    bridgeFromTags: ["indie", "theatre", "film", "literature"],
    bridgeExplanations: {
      indie:
        "explore the intimacy of human voices through choral music and spoken word.",
      theatre:
        "follow live storytelling into a choral performance with spoken word and audience participation.",
      film: "follow your interest in stories into a live reflection on grief, carried by voices and spoken word.",
      literature:
        "hear language performed through spoken word alongside a live choir.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Common Ground Civic Centre · Level 3 Auditorium",
    startDate: "2026-10-31",
    endDate: "2026-10-31",
    startingPriceSGD: 50,
    priceNote:
      "Official SG Culture Pass listing starts at S$50; organiser also lists a S$55 tier. Confirm the ticket tier and fees.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/RITES026?lang=en",
    sourceUrls: [
      "https://www.sgculturepass.gov.sg/events/RITES026?lang=en",
      "https://www.sgculturepass.gov.sg/",
      "https://www.ritesofus.com/",
    ],
  },
  {
    ...base,
    id: "singlang",
    title: "SING浪 2026",
    description:
      "Mandopop meets electronic dance music and Chinese cultural influences on a 360-degree stage.",
    organiser: "Singapore Chinese Cultural Centre",
    category: "music",
    tags: ["pop", "electronic"],
    culturalNotes: [
      "The programme combines Mandopop, electronic dance music and traditional Chinese culture.",
    ],
    bridgeFromTags: ["heritage", "indie"],
    bridgeExplanations: {
      heritage:
        "discover Chinese cultural influences through a contemporary Mandopop and electronic concert.",
      indie:
        "try a different contemporary music scene with Singaporean performers, Mandopop and electronic music.",
    },
    occasions: ["date", "friends", "solo"],
    location: "Singapore Indoor Stadium",
    startDate: "2026-10-31",
    endDate: "2026-10-31",
    startingPriceSGD: 18,
    priceNote:
      "Listed starting tier; confirm seat categories and fees. Organiser says no admission under 13.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/singlang2026?lang=en",
    sourceUrls: [
      "https://www.sgculturepass.gov.sg/events/singlang2026?lang=en",
      "https://singaporeccc.org.sg/zh-hans/events/sing-lang-2026/",
    ],
  },
  {
    ...base,
    id: "black-myth",
    title: "[OMM Presents] Black Myth: Wukong Global Concert",
    description:
      "The game soundtrack moves into the theatre through symphonic orchestration and Chinese folk music.",
    organiser: "Willow Arts Pte Ltd",
    category: "music",
    tags: ["gaming", "orchestral"],
    culturalNotes: [
      "Selected in-game music is arranged through symphonic orchestration and Chinese folk music.",
    ],
    bridgeFromTags: ["gaming", "film", "heritage", "electronic"],
    bridgeExplanations: {
      gaming:
        "hear a game world translated into live orchestral and Chinese folk music.",
      film: "discover another kind of soundtrack: game music reimagined for live orchestral performance.",
      heritage:
        "listen for Chinese folk music alongside the symphonic score of a contemporary game.",
      electronic:
        "explore a digitally created game soundtrack in a live orchestral setting.",
    },
    occasions: ["date", "friends", "solo"],
    location: "Esplanade Theatre",
    startDate: "2026-10-24",
    endDate: "2026-10-25",
    startingPriceSGD: 78,
    priceNote:
      "Lowest listed standard tier; SISTIC lists a separate S$6 booking fee for this price band.",
    officialListingUrl: "https://www.sistic.com.sg/events/blackmyth1026",
    sourceUrls: [
      "https://www.sistic.com.sg/events/blackmyth1026",
      "https://www.sgculturepass.gov.sg/",
    ],
  },
  {
    ...base,
    id: "under-one-roof",
    title: "Under One Roof: A Living Chinatown Experience",
    description:
      "Character-led storytelling in recreated shophouses, followed by a heritage-inspired dinner.",
    organiser: "Chinatown Heritage Collective Pte Ltd",
    category: "heritage",
    tags: ["heritage"],
    culturalNotes: [
      "An immersive character-led visit explores the lives of early Chinatown pioneers.",
    ],
    bridgeFromTags: ["theatre", "film", "art"],
    bridgeExplanations: {
      theatre:
        "take your interest in live performance into character-led stories of 1950s Chinatown.",
      film: "step inside a local story through recreated shophouses and character-led storytelling.",
      art: "explore how recreated spaces can tell the stories of Chinatown pioneers.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Chinatown Heritage Centre · 48 Pagoda Street",
    startDate: "2026-08-05",
    endDate: "2026-12-31",
    startingPriceSGD: 61,
    priceNote:
      "Listed English experience and heritage dinner bundle; confirm individual sessions and fees.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/381350?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/381350?lang=en"],
  },
  {
    ...base,
    id: "affordable-art-fair",
    title: "Affordable Art Fair 2026",
    description:
      "Explore contemporary works from local and international galleries at Singapore’s F1 Pit Building.",
    organiser: "Affordable Art Fairs Pte Ltd",
    category: "visual-arts",
    tags: ["art"],
    culturalNotes: [
      "A contemporary art fair brings local and international galleries together.",
    ],
    bridgeFromTags: ["workshop", "film"],
    bridgeExplanations: {
      workshop:
        "take your curiosity about making into an encounter with contemporary artworks.",
      film: "move from storytelling on screen to the visual possibilities of contemporary art.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "F1 Pit Building",
    startDate: "2026-11-26",
    endDate: "2026-11-29",
    startingPriceSGD: 24,
    priceNote:
      "Standard advance 3-day pass S$24 until 22 Nov; fair-week standard S$28. Private view costs extra. Fees excluded.",
    officialListingUrl: "https://www.sistic.com.sg/events/aaf1126",
    sourceUrls: ["https://www.sistic.com.sg/events/aaf1126"],
  },
  {
    ...base,
    id: "comic-con",
    title: "Singapore Comic Con 2026 · 2-Day Access",
    description:
      "Comics, gaming, cosplay and creator showcases come together for a weekend of pop culture.",
    organiser: "Generation Experience Pte Ltd",
    category: "visual-arts",
    tags: ["gaming", "art", "literature"],
    culturalNotes: [
      "The event includes local and international creators, panels and community showcases.",
    ],
    bridgeFromTags: ["film", "workshop", "literature"],
    bridgeExplanations: {
      film: "follow your interest in fictional worlds into comics, cosplay and creator showcases.",
      workshop:
        "explore the creative processes behind comic art and cosplay through a pop-culture gathering.",
      literature:
        "discover storytelling through comics and visual character worlds.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Marina Bay Sands Expo & Convention",
    startDate: "2026-12-05",
    endDate: "2026-12-06",
    startingPriceSGD: 68,
    priceNote:
      "Official listed starting price for 5–6 Dec access; excludes 4 Dec preview unless specified by ticketing partner.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/391490?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/391490?lang=en"],
  },
  {
    ...expandedBase,
    id: "runaway-songs-stories",
    title: "Runaway — Songs & Stories by Chi Sheng",
    description:
      "Singaporean composer Peng Chi Sheng shares original piano works, songs and the memories behind them.",
    organiser: "Peng Chi Sheng / Intune Music",
    category: "music",
    tags: ["indie"],
    culturalNotes: [
      "Original local compositions combine piano solos, songs, chamber collaborations and personal storytelling.",
      "The programme includes the first public performances of five new piano works.",
    ],
    bridgeFromTags: ["literature", "orchestral", "film"],
    bridgeExplanations: {
      literature:
        "follow personal stories into a Singaporean composer's musical diary, told through original songs and piano works.",
      orchestral:
        "explore a more intimate setting for contemporary classical music through piano solos and chamber collaborations.",
      film: "hear how memories become music through the composer's stories behind his original works.",
    },
    occasions: ["date", "friends", "solo"],
    location: "Play Den, The Arts House",
    startDate: "2026-10-31",
    endDate: "2026-10-31",
    startingPriceSGD: 60,
    priceNote:
      "Official listed starting tier; confirm booking fees and remaining sessions.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/runaway1026?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/runaway1026?lang=en"],
  },
  {
    ...expandedBase,
    id: "the-violinist",
    title: "The Violinist",
    description:
      "An animated historical drama follows two childhood musicians from 1930s Singapore through war, friendship and memory.",
    organiser: "Golden Village Pictures Pte Ltd",
    category: "film",
    tags: ["film"],
    culturalNotes: [
      "An animated story uses music to carry the memories of two friends across decades of Singapore's history.",
    ],
    bridgeFromTags: ["heritage", "orchestral", "art"],
    bridgeExplanations: {
      heritage:
        "explore a fictional story beginning in 1930s Singapore, shaped by war and the Japanese occupation.",
      orchestral:
        "follow your interest in music into a film about two childhood musicians and a treasured violin.",
      art: "discover visual storytelling through an animated historical drama.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Golden Village cinemas · check current screenings",
    startDate: "2026-09-07",
    endDate: "2026-10-14",
    startingPriceSGD: 16,
    priceNote:
      "PG. This is a movie e-voucher, not a reserved seat. Redeem separately at GV; online redemption adds S$2.50 not payable with credits. Check the chosen screening before buying.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/211491c?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/211491c?lang=en"],
  },
  {
    ...expandedBase,
    id: "writing-as-witness",
    title: "Writing as Witness: The Third Ear and the Stories We Carry",
    description:
      "A guided creative-writing workshop explores the stories, gestures and silences of care and everyday life.",
    organiser: "Arts House Group",
    category: "literature",
    tags: ["literature", "workshop"],
    culturalNotes: [
      "Guided creative reflection draws on narrative medicine and listening beyond words.",
    ],
    bridgeFromTags: ["film", "theatre"],
    bridgeExplanations: {
      film: "move from watching stories to writing your own, using guided reflection on gestures, silences and everyday care.",
      theatre:
        "explore another way of expressing human experience through a guided creative-writing workshop.",
    },
    occasions: ["solo", "friends"],
    location: "Asian Civilisations Museum · Discovery Room",
    startDate: "2026-11-14",
    endDate: "2026-11-14",
    startingPriceSGD: 16,
    priceNote:
      "Official starting ticket; 120-minute workshop. Confirm fees and session details. This is a literary activity, not healthcare advice.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/SWF26T35?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/SWF26T35?lang=en"],
  },
  {
    ...expandedBase,
    id: "cloth-paste-painting",
    title: "Cloth-Paste Painting: Preserving Stories Through Fabric Art",
    description:
      "Layer fabric into your own artwork while exploring a folk-art practice used to preserve stories and traditions.",
    organiser: "Trendsen Cultural Enterprise",
    category: "workshop",
    tags: ["workshop", "art", "heritage"],
    culturalNotes: [
      "Participants learn a Chinese decorative fabric technique and create layered artworks through guided practice.",
    ],
    bridgeFromTags: ["literature", "film"],
    bridgeExplanations: {
      literature:
        "explore how folk tales and everyday stories can be preserved in tactile fabric artworks.",
      film: "try telling a story through layered fabric and visual symbols in a hands-on art session.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Waterloo Street · exact classroom confirmed by organiser",
    startDate: "2026-03-20",
    endDate: "2026-11-07",
    startingPriceSGD: 48,
    priceNote:
      "90 minutes; English and Mandarin. Listing covers multiple sessions. Organiser emails the Waterloo Street classroom at least three days before the workshop; confirm fees.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/633383?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/633383?lang=en"],
  },
  {
    ...expandedBase,
    id: "haw-ror-villa",
    title: "Haw Ror Villa 5!: Back from the Dead",
    description:
      "Asian folklore, the Aw family's story and Haw Par Villa's dioramas meet an interactive Halloween experience.",
    organiser: "Haw Par Villa Pte Ltd",
    category: "heritage",
    tags: ["heritage", "theatre"],
    culturalNotes: [
      "Interactive horror elements introduce the cultural significance of Hell's Museum and the Ten Courts of Hell.",
    ],
    bridgeFromTags: ["film", "gaming", "art"],
    bridgeExplanations: {
      film: "step into an Asian folklore experience where sculptural dioramas and interactive horror carry the story.",
      gaming:
        "take your curiosity about interactive worlds into a heritage experience built around Asian folklore.",
      art: "discover the stories and cultural meanings behind Haw Par Villa's sculptures and dioramas.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Haw Par Villa · 262 Pasir Panjang Road",
    startDate: "2026-10-08",
    endDate: "2026-11-15",
    startingPriceSGD: 35,
    priceNote:
      "Official starting price; horror themes. Check the selected 90-minute session, admission guidance and fees with the organiser.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/2pwu43twij?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/2pwu43twij?lang=en"],
  },
  {
    ...expandedBase,
    id: "bedok-to-bollywood",
    title: "Bedok to Bollywood",
    description:
      "Rishi Budhrani and KP Sandhu turn two Singaporeans' Bollywood ambitions into an interactive dramedy.",
    organiser: "Esplanade – Theatres on the Bay",
    category: "theatre",
    tags: ["theatre"],
    culturalNotes: [
      "A performance based on the artists' true stories invites the audience into their journey from Singapore toward Bollywood.",
    ],
    bridgeFromTags: ["film", "pop", "heritage"],
    bridgeExplanations: {
      film: "follow Bollywood dreams into an interactive stage story about two Singaporean performers.",
      pop: "explore entertainment ambitions through a stage story with laughter, music and audience participation.",
      heritage:
        "encounter a contemporary Singaporean cultural story through two performers' journeys toward Bollywood.",
    },
    occasions: ["date", "friends", "solo"],
    location: "Esplanade Recital Studio",
    startDate: "2026-11-27",
    endDate: "2026-11-28",
    startingPriceSGD: 50,
    priceNote:
      "Official starting tier; 75 minutes, English and other languages. Admission rating is TBA; confirm session, age guidance and fees.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/bedok1126?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/bedok1126?lang=en"],
  },
  {
    ...expandedBase,
    id: "yunnan-garden-walk",
    title: "云南园的今生：导览南洋理工大学的新地标和地景风华",
    description:
      "A Mandarin literary walk follows writer Tung Ka Wei through NTU landmarks and the changing memories of Yunnan Garden.",
    organiser: "Arts House Group",
    category: "heritage",
    tags: ["heritage", "literature"],
    culturalNotes: [
      "A book-led walk explores the same landscape from the perspectives of different generations of students.",
    ],
    bridgeFromTags: ["art", "film"],
    bridgeExplanations: {
      art: "bring a camera or pen to a literary walk that invites you to capture the contours and stories of NTU's landmarks.",
      film: "explore how a place changes across generations through a book-led walk in Yunnan Garden.",
    },
    occasions: ["solo", "friends", "family"],
    location: "Meet at Pioneer MRT Station · Exit B",
    startDate: "2026-11-21",
    endDate: "2026-11-21",
    startingPriceSGD: 40,
    priceNote:
      "Mandarin-language, 120-minute literary walk. Official starting ticket; confirm meeting instructions and fees.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/SWF26T15?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/SWF26T15?lang=en"],
  },
  {
    ...expandedBase,
    id: "mini-tingkat-painting",
    title: "Mini Tingkat Painting Workshop",
    description:
      "Turn a mini tingkat container into a personal painted object while connecting with local cultural traditions.",
    organiser: "Mochiart Art Studio",
    category: "workshop",
    tags: ["workshop", "art", "heritage"],
    culturalNotes: [
      "A guided two-hour session uses acrylics and markers to decorate a mini tingkat; materials are provided.",
    ],
    bridgeFromTags: ["gaming"],
    bridgeExplanations: {
      gaming:
        "try a different kind of customisation: designing a physical mini tingkat with acrylics and markers.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location:
      "Mochiart Art Studio · Prosper House, 101 Lorong 23 Geylang #07-01",
    startDate: "2026-08-19",
    endDate: "2027-02-07",
    startingPriceSGD: 46,
    priceNote:
      "Official starting ticket includes materials; English-language session listed as suitable for all ages. Date range covers multiple sessions; confirm timing and fees.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/lite_minitingkatpainting8?lang=en",
    sourceUrls: [
      "https://www.sgculturepass.gov.sg/events/lite_minitingkatpainting8?lang=en",
    ],
  },
  {
    ...expandedBase,
    id: "ministry-of-djs-workshop",
    title: "DJ Workshop with Ministry of DJs",
    description:
      "Learn cueing, beatmatching and transitions with club-scene veterans, alongside stories of Singapore's DJ heritage.",
    organiser: "Ministry of DJs Pte Ltd",
    category: "workshop",
    tags: ["workshop"],
    culturalNotes: [
      "A beginner-friendly, 60-minute workshop combines hands-on DJ equipment with the history of Singapore's nightlife.",
    ],
    bridgeFromTags: ["electronic", "pop", "indie", "heritage"],
    bridgeExplanations: {
      electronic:
        "move from listening to learning how DJs cue, beatmatch and transition between tracks on professional equipment.",
      pop: "explore how tracks are selected and mixed through a practical introduction to DJing.",
      indie:
        "explore a different part of music-making by learning to mix tracks with Singapore club-scene veterans.",
      heritage:
        "discover the evolution of Singapore's nightlife through firsthand stories and a hands-on DJ session.",
    },
    occasions: ["solo", "friends", "date"],
    location: "Ministry of DJs – Pro DJ School",
    startDate: "2025-09-13",
    endDate: "2026-12-26",
    startingPriceSGD: 100,
    priceNote:
      "Standard S$100 plus listed S$6 booking fee. Up to 10 registered participants; no additional guests. Confirm your scheduled session; no prior experience needed.",
    officialListingUrl:
      "https://www.sistic.com.sg/events/lite_djworkshopmodjs1",
    sourceUrls: [
      "https://www.sistic.com.sg/events/lite_djworkshopmodjs1",
      "https://www.sistic.com.sg/sg-culture-pass",
    ],
  },
  {
    ...expandedBase,
    id: "viva-concerti",
    title: "VIVA Concerti: Where the Twain Shall Meet",
    description:
      "Niu Niu and the Metropolitan Festival Orchestra bring Eastern and Western concerto traditions into one evening.",
    organiser: "VIVA Foundation for Children with Cancer",
    category: "music",
    tags: ["orchestral"],
    culturalNotes: [
      "The programme juxtaposes concerto movements, Gershwin's Rhapsody in Blue, Butterfly Lovers and Yellow River.",
    ],
    bridgeFromTags: ["jazz", "heritage"],
    bridgeExplanations: {
      jazz: "explore a different musical setting through Gershwin's Rhapsody in Blue within an orchestral concerto programme.",
      heritage:
        "listen to Butterfly Lovers and Yellow River alongside Western concerto works in a programme framed as cultural exchange.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Esplanade Concert Hall",
    startDate: "2026-10-27",
    endDate: "2026-10-27",
    startingPriceSGD: 20,
    priceNote:
      "Lowest standard tier S$20; other tiers S$50–1,000. Fees excluded. No admission below age 6; 7.30pm performance.",
    officialListingUrl: "https://www.sistic.com.sg/events/donaviva1026",
    sourceUrls: ["https://www.sistic.com.sg/events/donaviva1026"],
  },
  {
    ...expandedBase,
    id: "singapore-dream-toys",
    title: "A Singaporean's Dream Through Toys",
    description:
      "A guided museum visit and AR colouring workshop explore how toys reflect Singapore's trading roots and evolving identity.",
    organiser: "MINT Museum of Toys",
    category: "heritage",
    tags: ["heritage", "workshop", "art"],
    culturalNotes: [
      "The experience combines a guided toy-collection tour with interactive AR storytelling and colouring.",
    ],
    bridgeFromTags: ["gaming", "film"],
    bridgeExplanations: {
      gaming:
        "explore interactive AR storytelling alongside physical toys that reflect Singapore's changing cultural identity.",
      film: "discover stories of Singapore's past through a toy collection and an interactive colouring workshop.",
    },
    occasions: ["family", "friends", "date", "solo"],
    location: "MINT Museum of Toys · 26 Seah Street",
    startDate: "2026-08-19",
    endDate: "2027-05-31",
    startingPriceSGD: 38,
    priceNote:
      "Official starting ticket; 60-minute experience. Date range covers bookable sessions, not guaranteed daily operation. Confirm fees and selected session.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/388850?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/388850?lang=en"],
  },
  {
    ...expandedBase,
    id: "battle-bukit-chandu",
    title: "Battle of Bukit Chandu",
    description:
      "A guided trail follows the 1942 Battle of Pasir Panjang and the stories of Lieutenant Adnan Saidi and the Malay Regiment.",
    organiser: "Kembara Collective",
    category: "heritage",
    tags: ["heritage"],
    culturalNotes: [
      "The trail reads wartime history through the landscape, concluding at Reflections at Bukit Chandu.",
    ],
    bridgeFromTags: ["film", "literature"],
    bridgeExplanations: {
      film: "move from historical stories on screen to a guided walk through the sites of a defining wartime battle.",
      literature:
        "encounter narratives of courage and sacrifice in the actual landscape of the Battle of Pasir Panjang.",
    },
    occasions: ["solo", "friends", "family"],
    location: "Kent Ridge · meeting point at 7 Science Park Drive",
    startDate: "2026-09-07",
    endDate: "2027-02-14",
    startingPriceSGD: 25,
    priceNote:
      "Official starting ticket for a 165-minute walking trail; confirm the chosen session, route requirements and fees.",
    officialListingUrl:
      "https://www.sgculturepass.gov.sg/events/ptkykci5a?lang=en",
    sourceUrls: ["https://www.sgculturepass.gov.sg/events/ptkykci5a?lang=en"],
  },
  {
    ...expandedBase,
    id: "sso-pops-kapustin",
    title: "SSO Pops: Kapustin, Gershwin and E.T.",
    description:
      "Jazz-inflected piano, Gershwin and the orchestral music of E.T. meet in the Singapore Symphony's season-closing programme.",
    organiser: "Singapore Symphony Orchestra",
    category: "music",
    tags: ["orchestral", "jazz"],
    culturalNotes: [
      "Kapustin's Piano Concerto No. 2 brings saxophones, drum set and guitar into a programme with Rhapsody in Blue and the E.T. Symphonic Suite.",
    ],
    bridgeFromTags: ["film", "pop", "electronic"],
    bridgeExplanations: {
      film: "hear John Williams's E.T. film music performed alongside jazz-inflected piano and orchestral works.",
      pop: "explore a different live-music palette through saxophones, drum set, guitar and Gershwin in an orchestral programme.",
      electronic:
        "discover another approach to rhythm and texture through jazz-inflected piano, drum set and live orchestra.",
    },
    occasions: ["date", "friends", "family", "solo"],
    location: "Esplanade Concert Hall",
    startDate: "2027-05-20",
    endDate: "2027-05-21",
    startingPriceSGD: 28,
    priceNote:
      "Standard tickets start at S$28 plus S$3 booking fee; lower advertised S$19.60 is concession pricing. Admission age 7+. This is a May 2027 experience, not an upcoming October performance.",
    officialListingUrl: "https://www.sistic.com.sg/events/SOT2720-1a",
    sourceUrls: [
      "https://www.sistic.com.sg/events/SOT2720-1a",
      "https://www.sso.org.sg/whats-on/pops-kapustin-e.t.",
      "https://www.esplanade.com/whats-on/2027/sso-pops-kapustin-gershwin-and-et",
    ],
  },
];

export const catalogueNotice =
  "Curated snapshot checked 11 October 2026 using official listings and authorised ticketing pages, including search-indexed pages. Eligibility, prices and availability may change. Confirm the official listing before booking.";
