// Featured projects for the Projects reel.
// TODO: demo data — replace titles, tags, images and links with real learner projects.
export type Project = {
  title: string;
  category: string;
  client: string;
  image: string;
  imageAlt: string;
  href: string;
};

// Stand-in photos from Unsplash (free licence), cropped to 16:9.
const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&h=900&q=80`;

export const projects: Project[] = [
  {
    title: "Support Copilot for a Fintech Help Desk",
    category: "Agentic AI",
    client: "Demo client · Fintech",
    image: unsplash("photo-1626863905121-3b0c0ed7b94c"),
    imageAlt: "Two support agents wearing headsets in a bright office",
    href: "#",
  },
  {
    title: "Insurance Claims Document Intelligence",
    category: "RAG",
    client: "Demo client · Insurance",
    image: unsplash("photo-1635859890085-ec8cb5466806"),
    imageAlt: "A woman working through a table covered in paperwork",
    href: "#",
  },
  {
    title: "Voice Agent for Clinic Appointments",
    category: "Voice AI",
    client: "Demo client · Healthcare",
    image: unsplash("photo-1519494026892-80bbd2d6fd0d"),
    imageAlt: "A hospital lobby with a reception desk",
    href: "#",
  },
  {
    title: "Sales Research Agent",
    category: "Multi-agent",
    client: "Demo client · B2B SaaS",
    image: unsplash("photo-1522071820081-009f0129c71c"),
    imageAlt: "A team working together around laptops",
    href: "#",
  },
  {
    title: "Contract Review Assistant",
    category: "LLM + Evals",
    client: "Demo client · Legal",
    image: unsplash("photo-1450101499163-c8848c66ca85"),
    imageAlt: "A person reviewing and signing a document",
    href: "#",
  },
  {
    title: "Retail Demand Forecast Copilot",
    category: "LLMOps",
    client: "Demo client · Retail",
    image: unsplash("photo-1722639096485-7f48cae22a87"),
    imageAlt: "A grocery store aisle stocked with products",
    href: "#",
  },
];
