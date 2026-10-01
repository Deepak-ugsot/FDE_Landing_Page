import { CtaButton } from "@/components/ui/CtaButton";
import { FeatureSections, type Feature } from "@/components/ui/feature-sections";
import { program } from "@/content/program";
import {
  CertificateVisual,
  CommunityVisual,
  JobsVisual,
  NotesVisual,
  PlatformVisual,
  ProjectsVisual,
} from "./WhyPaidVisuals";

// What the paid tier adds on top of the free YouTube course.
// TODO: confirm the wording with the program team (especially the job-opportunities promise).
const perks: Feature[] = [
  {
    title: "Structured notes",
    body: "Module-by-module notes that follow the videos, so you revise in minutes instead of rewatching hours.",
    visual: <NotesVisual />,
  },
  {
    title: "Practice projects",
    body: "Hands-on projects for every module, so you build the systems yourself instead of only watching them being built.",
    visual: <ProjectsVisual />,
  },
  {
    title: "Learning platform",
    body: "One place for the whole course: lessons, notes, projects and your progress.",
    visual: <PlatformVisual />,
  },
  {
    title: "Community",
    body: "Learn alongside other engineers on the same path. Ask questions, share what you build and get unstuck faster.",
    visual: <CommunityVisual />,
  },
  {
    title: "Job opportunities",
    body: "Hear about FDE and applied-AI roles as you work through the program.",
    visual: <JobsVisual />,
  },
  {
    // TODO: confirm who issues the certificate and what completing the program requires.
    title: "Certificate",
    body: "Finish the program and earn a certificate you can add to your resume and LinkedIn profile.",
    visual: <CertificateVisual />,
  },
];

/** What the paid tier unlocks: free-vs-paid heading, a card per perk, then the sign-up CTA. */
export function WhyPaid() {
  return (
    <FeatureSections
      id="why-paid"
      eyebrow={`What ${program.platformPrice} unlocks`}
      title={
        <>
          Watch it free.
          <br />
          <span className="font-normal text-accent">Master it for {program.platformPrice}.</span>
        </>
      }
      description={`The lessons stay free on YouTube. ${program.platformPrice} adds everything that turns watching into doing.`}
      features={perks}
    >
      <CtaButton href={program.platformHref}>Unlock it for {program.platformPrice}</CtaButton>
    </FeatureSections>
  );
}
