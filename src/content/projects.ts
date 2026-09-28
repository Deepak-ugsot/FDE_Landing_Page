// Featured projects for the Projects reel.
// TODO: category/domain tags are drawn from each project's name, and links are placeholders — confirm with the program team.
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
    title: "AI Resume/Job-Description Matcher (ATS Scorer)",
    category: "AI Application",
    client: "Recruiting",
    image: unsplash("photo-1698047681432-006d2449c631"),
    imageAlt: "A woman reading a resume at a table",
    href: "#",
  },
  {
    title: "PickFlick — Group Movie Night Decision Solver",
    category: "Decision Solver",
    client: "Entertainment",
    image: unsplash("photo-1758525862263-af89b090fb56"),
    imageAlt: "Two friends watching television with a bowl of popcorn",
    href: "#",
  },
  {
    title: "AI Accessibility Auditor",
    category: "AI Application",
    client: "Web Accessibility",
    image: unsplash("photo-1574887427561-d3d5d58c9273"),
    imageAlt: "A person typing on a braille writer",
    href: "#",
  },
  {
    title: "MindMapAI — AI Idea-to-Structure Visual Thinking Tool",
    category: "AI Application",
    client: "Productivity",
    image: unsplash("photo-1745847768382-816bfc32e1bb"),
    imageAlt: "People looking at a mind map on a laptop screen",
    href: "#",
  },
  {
    title: "Employee Attendance & Payroll Processing Engine",
    category: "Processing Engine",
    client: "HR & Payroll",
    image: unsplash("photo-1753955900478-323e4da1eff7"),
    imageAlt: "Someone working through figures with a calculator and a laptop",
    href: "#",
  },
  {
    title: "Healthcare Appointment & Patient Queue Management System",
    category: "Management System",
    client: "Healthcare",
    image: unsplash("photo-1519494026892-80bbd2d6fd0d"),
    imageAlt: "A hospital lobby with a reception desk",
    href: "#",
  },
];
