// Central program facts. Values marked TODO are placeholders until confirmed.
export const program = {
  name: "AI Forward Deployed Engineer Program",
  mentor: "Vishwa Mohan",
  focus: "Applied GenAI & Agentic AI",
  nextCohort: "Dates announcing soon", // TODO: real cohort start date
  applyHref: "#apply", // TODO: application form URL
  brochureHref: "#brochure", // TODO: brochure PDF URL
  privacyHref: "#privacy", // TODO: privacy statement page
  youtubeHref: "https://www.youtube.com/@VishwaMohan-00", // TODO: link to the course playlist once it's live
  // Course intro video, autoplayed (muted) when its section scrolls into view. Set ONE of these:
  introVideoSrc: "", // TODO: a file in /public, e.g. "/assets/course-intro.mp4" (preferred: no YouTube branding)
  introVideoId: "Zmz5gE9nJqY", // or a YouTube video ID (the part after "watch?v=")
  introVideoStart: 1191, // seconds into the YouTube video to start from (19:51); 0 = beginning
  platformHref: "#platform", // TODO: paid practice platform sign-up URL
  platformPrice: "₹99",
  newsletterAction: "#newsletter", // TODO: form endpoint (e.g. your email/CRM provider); the footer form posts here
};

// Official channels shown in the footer.
export const socials = [
  { label: "YouTube", href: "https://www.youtube.com/@VishwaMohan-00", tone: "flame" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/vishwa-mohan/", tone: "accent" },
] as const;

export const navLinks = [
  { label: "Why FDE", href: "#why-fde" },
  { label: "Curriculum", href: "#curriculum" },
  { label: "Projects", href: "#projects" },
  { label: "Mentor", href: "#mentor" },
  { label: "FAQ", href: "#faq" },
];

// Mentor profile — facts from Vishwa Mohan's LinkedIn headline and education
// (linkedin.com/in/vishwa-mohan). Keep this list factual; update from the profile.
export const mentorProfile = {
  name: "Vishwa Mohan",
  role: "Founder & CEO, upGrad School of Technology",
  photo: "/assets/Vishwa_mohan.png",
  linkedin: "https://www.linkedin.com/in/vishwa-mohan/",
  highlights: ["Top 40 CIOs ’23", "IIT (BHU) graduate"],
  // Logos live in public/assets/logos. `tone` picks how each is turned one-colour on the dark cards.
  companies: [
    { name: "upGrad School of Technology", logo: "/assets/logos/upgrad-sot.webp", width: 467, height: 144, tone: "mono" },
    { name: "Oracle", logo: "/assets/logos/oracle.svg", width: 231, height: 30, tone: "mono" },
    { name: "Walmart", logo: "/assets/logos/walmart.svg", width: 1024, height: 241, tone: "mono" },
    { name: "PayPal", logo: "/assets/logos/paypal.svg", width: 204, height: 190, tone: "mono" },
    { name: "LinkedIn", logo: "/assets/logos/linkedin-mono.svg", width: 568, height: 144, tone: "none" },
    { name: "Physics Wallah", logo: "/assets/logos/physics-wallah.svg", width: 822, height: 826, tone: "invert" },
  ],
} as const;
