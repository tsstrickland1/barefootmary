export const sampleEpisodes = [
  {
    number: 0,
    title: "Door to the Seven Gates",
    description:
      "A sealed passage at Fort Pickens, marked with unexplained graffiti, becomes the point of departure for an investigation into Pensacola's most persistent underground legends.",
    duration: "38 min",
    visibility: "public" as const,
    slug: "door-to-the-seven-gates",
    seasonSlug: "season-1",
  },
  {
    number: 1,
    title: "Janus-Faced John",
    description:
      "At the Innerarity House, the earliest tunnel story forms around a passage that can be documented—but not fully accounted for by the legends attached to it.",
    duration: "41 min",
    visibility: "public" as const,
    slug: "janus-faced-john",
    seasonSlug: "season-1",
  },
  {
    number: 2,
    title: "Lost Causeway",
    description:
      "In white memory, submerged corridors appear as feats of Confederate ingenuity. In African American oral tradition, they bind to the Underground Railroad and to enslaved labor.",
    duration: "44 min",
    visibility: "subscriber" as const,
    slug: "lost-causeway",
    seasonSlug: "season-1",
  },
  {
    number: 3,
    title: "Shadow of the Light",
    description:
      "The Pensacola Lighthouse stands as both beacon and site of haunting. Legends claim a tunnel once ran from its base to nearby forts—but the truth is more intimate.",
    duration: "39 min",
    visibility: "subscriber" as const,
    slug: "shadow-of-the-light",
    seasonSlug: "season-1",
  },
  {
    number: 4,
    title: "Rite of Passage",
    description:
      "Contemporary records describe trenches and buried works using language dangerously easy to misread—and a moment of real danger underground turned rumor into ritual.",
    duration: "43 min",
    visibility: "subscriber" as const,
    slug: "rite-of-passage",
    seasonSlug: "season-1",
  },
  {
    number: 5,
    title: "Tunnel of Love",
    description:
      "At Fort George, tunnel stories gather around a house shaped by love and loss—built by a physician for a woman he hoped to marry, and never finished.",
    duration: "40 min",
    visibility: "subscriber" as const,
    slug: "tunnel-of-love",
    seasonSlug: "season-1",
  },
];

export const sampleArticles = [
  {
    slug: "why-pensacola-keeps-dreaming-of-tunnels",
    title: "Why Pensacola Keeps Dreaming of Tunnels: A Reading List",
    excerpt:
      "Before the first episode aired, we buried ourselves in scholarship on subterranean legend, borderland identity, and the archaeology of Gulf Coast fortifications. Here is what we read—and what it changed about how we listen to a story.",
    tag: "Free · Essay",
    tagType: "free" as const,
    byline: "T.S. Strickland · April 2025 · 12 min read",
    featured: true,
  },
  {
    slug: "1978-spot-investigation",
    title: "The 1978 SPOT Investigation: Original PNJ Clippings",
    excerpt: "",
    tag: "Subscriber · Primary Source",
    tagType: "locked" as const,
    byline: "Pensacola News Journal · 1978 · Annotated",
    featured: false,
  },
  {
    slug: "inanna-at-fort-pickens",
    title: "Inanna at Fort Pickens: The Mythic Structure of Season One",
    excerpt: "",
    tag: "Subscriber · Analysis",
    tagType: "locked" as const,
    byline: "T.S. Strickland · March 2025",
    featured: false,
  },
  {
    slug: "talking-to-the-believers",
    title: "Talking to the Believers: What Oral History Fieldwork Actually Looks Like",
    excerpt: "",
    tag: "Free · Interview",
    tagType: "free" as const,
    byline: "T.S. Strickland · February 2025",
    featured: false,
  },
  {
    slug: "underground-railroad-gulf-coast",
    title: "The Underground Railroad and the Gulf Coast: What the Records Actually Show",
    excerpt: "",
    tag: "Subscriber · Deep Dive",
    tagType: "locked" as const,
    byline: "T.S. Strickland · January 2025",
    featured: false,
  },
];

export const sampleArchiveItems = [
  {
    id: "1",
    type: "PDF",
    title: "Fort Pickens Structural Survey, U.S. Army Corps of Engineers, 1903",
    visibility: "public" as const,
    episode: "Episode 0",
  },
  {
    id: "2",
    type: "IMG",
    title: "Innerarity House Floor Plan, Spanish Colonial Period (annotated)",
    visibility: "subscriber" as const,
    episode: "Episode 1",
  },
  {
    id: "3",
    type: "AUD",
    title: "Oral History Interview: Eleanor Whitfield, age 84 (unedited, 47 min)",
    visibility: "subscriber" as const,
    episode: "Episode 1",
  },
  {
    id: "4",
    type: "PDF",
    title: "Pensacola News Journal SPOT Coverage, Nov–Dec 1978 (complete clippings)",
    visibility: "subscriber" as const,
    episode: "Episode 0",
  },
];
