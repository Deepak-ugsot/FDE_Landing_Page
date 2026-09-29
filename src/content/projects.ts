import type { StaticImageData } from "next/image";
// Static imports: Next reads each image's size and generates a blur placeholder at build time.
// Sources are 1600×900 WebP (16:9); the PNGs beside them are the uncompressed originals.
import attendance from "../../public/assets/projects/EmployeeAttendance.webp";
import healthcare from "../../public/assets/projects/Healthcare.webp";
import mindMap from "../../public/assets/projects/MindMapAI.webp";
import auditor from "../../public/assets/projects/ai_Auditor.webp";
import pickFlick from "../../public/assets/projects/pickflick.webp";
import resume from "../../public/assets/projects/resume.webp";

// Featured projects for the Projects reel.
// TODO: category/domain tags are drawn from each project's name — confirm with the program team.
export type Project = {
  title: string;
  category: string;
  client: string;
  image: StaticImageData;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    title: "AI Resume/Job-Description Matcher (ATS Scorer)",
    category: "AI Application",
    client: "Recruiting",
    image: resume,
    imageAlt: "A developer at a laptop beside a resume, a job description and an ATS score of 92 out of 100",
  },
  {
    title: "PickFlick — Group Movie Night Decision Solver",
    category: "Decision Solver",
    client: "Entertainment",
    image: pickFlick,
    imageAlt: "Friends on a sofa choosing a film on a laptop, with genre preferences and a 95% group match",
  },
  {
    title: "AI Accessibility Auditor",
    category: "AI Application",
    client: "Web Accessibility",
    image: auditor,
    imageAlt: "Accessibility audit dashboards showing an accessibility score of 87 and issues by category",
  },
  {
    title: "MindMapAI — AI Idea-to-Structure Visual Thinking Tool",
    category: "AI Application",
    client: "Productivity",
    image: mindMap,
    imageAlt: "An idea typed in, processed by AI and turned into a structured mind map",
  },
  {
    title: "Employee Attendance & Payroll Processing Engine",
    category: "Processing Engine",
    client: "HR & Payroll",
    image: attendance,
    imageAlt: "A person on a laptop surrounded by attendance, payroll and salary breakdown panels",
  },
  {
    title: "Healthcare Appointment & Patient Queue Management System",
    category: "Management System",
    client: "Healthcare",
    image: healthcare,
    imageAlt: "A smiling man at a laptop with appointment, patient queue and satisfaction dashboards",
  },
];
