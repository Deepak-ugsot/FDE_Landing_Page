import { curriculum, labsOf, modulesOf } from "./curriculum";
import { mentorProfile, program } from "./program";

// Answers only use facts stated elsewhere on the page.
// TODO: confirm with the program team, and add questions on schedule (live vs recorded),
// certificates and career support once those details are final.
const moduleCount = curriculum.reduce((sum, p) => sum + modulesOf(p).length, 0);
const labCount = curriculum.reduce((sum, p) => sum + labsOf(p).length, 0);

export const faqs = [
  {
    q: "Who is this program for?",
    a: "Engineers who want to take AI from a promising demo to a system a real business runs on: scoping the problem with the client, building across the stack, shipping it into their environment and owning the outcome.",
  },
  {
    q: "What exactly is a Forward Deployed Engineer?",
    a: "An engineer who works embedded with the customer. The role began at Palantir, and today OpenAI, Anthropic and Salesforce are building FDE teams, because AI only pays off once it works inside a real business.",
  },
  {
    q: "Do I need prior AI or machine learning experience?",
    a: "No. The curriculum starts with the FDE role and Python fundamentals, then builds up through LLMs, RAG and agents to deployment, system design and the FDE craft.",
  },
  {
    q: "How long is the program?",
    // TODO: add the program's duration in weeks once it's confirmed.
    a: `${curriculum.length} phases and ${moduleCount} modules, with ${labCount} hands-on labs along the way.`,
  },
  {
    q: "What will I build?",
    a: `${labCount} hands-on labs across the phases, from a Northstar data pipeline and orders API to an AI support copilot, an enterprise support agent and a full production deployment, plus an Autonomous Business Operations Agent project.`,
  },
  {
    q: `Is the course really free? What does the ${program.platformPrice} cover?`,
    a: `The whole course is free on YouTube. For ${program.platformPrice} you unlock hands-on practice, extra resources and access to the learning platform.`,
  },
  {
    q: "Who teaches the program?",
    a: `${mentorProfile.name}, ${mentorProfile.role}. Before that he worked at Oracle, Walmart, PayPal, LinkedIn and PW.`,
  },
];
