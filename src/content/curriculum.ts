// Program curriculum, rendered by the Curriculum section.
// TODO: draft outline — confirm module names, durations, projects and topics with the program team.
export type Module = {
  title: string;
  duration: string;
  summary: string;
  project?: string;
  topics: { heading: string; items: string[] }[];
};

export const curriculum: Module[] = [
  {
    title: "LLM Foundations & Prompt Engineering",
    duration: "3 weeks",
    summary:
      "Learn how today's language models work under the hood, how to steer their output reliably, and which AI tools fit which job.",
    project: "AI Interview Coach",
    topics: [
      {
        heading: "How LLMs work",
        items: [
          "Transformers, attention, tokens and context windows",
          "Reasoning models and extended thinking",
          "Choosing between frontier and open models",
          "AI coding assistants and no-code builders",
        ],
      },
      {
        heading: "Prompt design",
        items: [
          "Zero-shot, few-shot and role prompting",
          "Chain-of-thought and self-critique",
          "Prompt chaining and multi-turn design",
          "System prompt structure",
        ],
      },
      {
        heading: "Structured output",
        items: [
          "Tool use and function calling",
          "JSON schemas and Pydantic validation",
          "Token cost and prompt caching",
          "Prompt injection basics",
        ],
      },
    ],
  },
  {
    title: "Python & APIs for AI",
    duration: "2 weeks",
    summary: "Get fluent enough in Python to read, write and debug AI applications on your own.",
    project: "Daily AI Briefing Bot",
    topics: [
      {
        heading: "Python essentials",
        items: [
          "Core language, data structures and OOP",
          "Files, JSON and error handling",
          "Async Python for concurrent API calls",
          "Virtual environments, secrets and Git",
        ],
      },
      {
        heading: "Working with APIs",
        items: [
          "HTTP, status codes and pagination",
          "Model provider SDKs and streaming",
          "Retries, rate limits and timeouts",
          "Structuring an AI project repo",
        ],
      },
    ],
  },
  {
    title: "RAG & Vector Search",
    duration: "3 weeks",
    summary: "Build systems that answer questions from a company's own documents, accurately and with sources.",
    project: "Chat With Your Documents",
    topics: [
      {
        heading: "Embeddings & retrieval",
        items: [
          "Embedding models and similarity search",
          "Vector databases",
          "Chunking strategies and their trade-offs",
        ],
      },
      {
        heading: "RAG pipelines",
        items: [
          "End-to-end retrieval pipeline design",
          "Hybrid search: keyword plus vector",
          "Re-ranking and query rewriting",
          "Measuring faithfulness and relevance",
        ],
      },
    ],
  },
  {
    title: "Fine-Tuning & Open Models",
    duration: "3 weeks",
    summary: "Know when fine-tuning beats prompting, then adapt and serve an open model on your own data.",
    project: "A Domain-Tuned Mini Model",
    topics: [
      {
        heading: "Fine-tuning",
        items: [
          "LoRA and QLoRA",
          "Preparing training datasets",
          "Preference tuning basics",
          "Tracking training runs",
        ],
      },
      {
        heading: "Serving models",
        items: [
          "Running models locally",
          "Quantisation and its quality cost",
          "Renting GPUs on a budget",
          "Cost vs quality trade-offs",
        ],
      },
    ],
  },
  {
    title: "Agentic AI Systems",
    duration: "4 weeks",
    summary: "Build agents that plan, use tools, remember context and finish multi-step tasks with the right checks in place.",
    project: "An Autonomous Research Assistant",
    topics: [
      {
        heading: "Agent design",
        items: [
          "ReAct and planner–executor loops",
          "Tool use and the Model Context Protocol (MCP)",
          "Human-in-the-loop checkpoints",
        ],
      },
      {
        heading: "Frameworks",
        items: [
          "Graph-based agent orchestration",
          "Multi-agent teams and hand-offs",
          "Workflow automation tools",
        ],
      },
      {
        heading: "Memory & safety",
        items: [
          "Short-term, long-term and episodic memory",
          "Agent evaluation and trajectory testing",
          "Guardrails and PII scrubbing",
        ],
      },
    ],
  },
  {
    title: "LLMOps & Deployment",
    duration: "2 weeks",
    summary: "Put your AI system on the internet and keep it observable, tested and affordable once real users arrive.",
    project: "Ship Your AI to Production",
    topics: [
      {
        heading: "Infrastructure",
        items: [
          "FastAPI services with streaming",
          "Docker and docker-compose",
          "CI/CD with prompt regression tests",
          "Deploying on a major cloud",
        ],
      },
      {
        heading: "Observability",
        items: [
          "Tracing every LLM call",
          "Cost and latency dashboards",
          "Evals that run in CI",
          "Why AI needs different ops",
        ],
      },
    ],
  },
  {
    title: "Forward Deployed Engineering",
    duration: "5 weeks",
    summary:
      "Take an AI system into an environment you don't control: scope the real problem with a client, work with their data, deploy under their rules and defend your design.",
    project: "A Full Client Engagement, End to End",
    topics: [
      {
        heading: "Discovery & scoping",
        items: [
          "Stated problem vs real problem",
          "When to use an LLM and when not to",
          "Success metrics and acceptance criteria",
          "Scoping documents and decision records",
        ],
      },
      {
        heading: "Enterprise data",
        items: [
          "Working with legacy and undocumented systems",
          "Connectors, auth and incremental sync",
          "Masking PII at extraction",
        ],
      },
      {
        heading: "Deploying in their environment",
        items: [
          "Private networking and on-prem inference",
          "SSO, RBAC and tenant isolation",
          "Cost modelling with the client",
        ],
      },
      {
        heading: "Compliance & handover",
        items: [
          "Data protection law and data residency",
          "Audit logs and security reviews",
          "Architecture reviews with client stakeholders",
          "Runbooks, adoption and impact reporting",
        ],
      },
    ],
  },
  {
    title: "Interview Electives",
    duration: "Self-paced",
    summary: "Two optional tracks alongside the core modules, covering the fundamentals hiring panels still test.",
    topics: [
      {
        heading: "System design",
        items: [
          "Caching, load balancing and CDNs",
          "Databases, sharding and replication",
          "Queues and event-driven systems",
          "Classic design problems, worked through",
        ],
      },
      {
        heading: "Data structures & algorithms",
        items: [
          "Arrays, hashing and two pointers",
          "Trees, graphs and heaps",
          "Recursion and dynamic programming",
          "Complexity analysis",
        ],
      },
    ],
  },
];
