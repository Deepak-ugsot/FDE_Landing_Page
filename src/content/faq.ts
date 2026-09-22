import { curriculum } from "./curriculum";
import { mentorProfile, program } from "./program";

// Answers only use facts stated elsewhere on the page.
// TODO: confirm with the program team, and add questions on schedule (live vs recorded),
// certificates and career support once those details are final.
const weeksOf = (d: string) => parseInt(d, 10) || 0;
const core = curriculum.filter((m) => weeksOf(m.duration));
const coreWeeks = core.reduce((sum, m) => sum + weeksOf(m.duration), 0);

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
    a: "The curriculum starts from how LLMs work and includes a Python & APIs module, so the foundations are covered before you move on to RAG, agents and deployment.",
  },
  {
    q: "How long is the program?",
    a: `${core.length} core modules over ${coreWeeks} weeks, plus self-paced interview electives in system design and data structures that you can take alongside.`,
  },
  {
    q: "What will I build?",
    a: "A project in every core module, from an AI interview coach and a chat-with-your-documents system to an autonomous agent, ending with a full client engagement run end to end.",
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
