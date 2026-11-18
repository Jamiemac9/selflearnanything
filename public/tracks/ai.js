/* Subject: AI */
window.SLA_SEED.push({
  id: "ai-agents",
  subjects: ["ai"],
  title: "How AI agents actually work",
  subtitle: "Context, tools and the loop — without the hype",
  tag: "AI",
  lessons: [
    {
      id: "ai-1",
      title: "Context, tools and the loop",
      intro: "Every AI agent, from a chat assistant to an automated workflow, is built from the same three parts. Know them and you can explain to a client what their agent can and cannot do.",
      links: [
        { label: "Context windows", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows", note: "Claude docs" },
        { label: "Tool use overview", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview", note: "Claude docs" },
        { label: "How tool use works", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works", note: "Claude docs" }
      ],
      steps: [
        {
          title: "The model only knows what is in front of it",
          links: [{ label: "Context windows", url: "https://platform.claude.com/docs/en/build-with-claude/context-windows" }],
          teach: "<p>The <b>context window</b> is all the text a model can reference when it writes a response, including the response itself.</p>" +
            "<p>A model does not remember earlier conversations on its own. If an agent seems to remember yesterday's job, something put yesterday's job back into today's context: a memory file, a database lookup, a summary you paste in.</p>" +
            "<p>That is the first question to ask of any agent: <i>what goes into its context each time, and who decides?</i></p>",
          look: "Think of one agent you run. Write down what it is given at the start of every run.",
          qs: [{
            q: "An agent handled a client's file yesterday and today acts as if it never saw it. Why?",
            opts: ["The model was updated overnight",
                   "Yesterday's work was not put back into today's context",
                   "It deliberately forgets for privacy",
                   "The file was too long"],
            correct: 1,
            why: "Without something feeding it back in, each run starts from what it is given. Memory in an agent is always something you built, not something the model has."
          }]
        },
        {
          title: "Tools: the model asks, your code acts",
          links: [{ label: "Tool use overview", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview" }],
          teach: "<p><b>Tool use</b> (also called function calling) lets a model call functions you define. You give each tool a name, a description and an input schema. The model decides <i>when</i> to use one based on the request and the descriptions.</p>" +
            "<p>For tools you define, the model does not run anything. It replies with a request to use the tool and the inputs; <b>your application runs it</b> and sends the result back. The description you write is doing a lot of work: it is how the model knows the tool exists and what it is for.</p>",
          look: "Pick one action your agent takes, like sending an email or reading a file. Write the one-line description you would give it as a tool.",
          qs: [{
            q: "When an agent 'sends an email' through a tool you defined, what actually sends it?",
            opts: ["The model itself", "Your application, after the model asks for it", "The email provider guesses", "The context window"],
            correct: 1,
            why: "The model proposes the call; your code executes it. Which is exactly why your code is the right place for checks, limits and approvals."
          }]
        },
        {
          title: "The loop",
          links: [{ label: "How tool use works", url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/how-tool-use-works" }],
          teach: "<p>An agent is a model plus tools plus a <b>loop</b>: the model asks for a tool, your code runs it, the result goes back in, and the model decides what to do next. Repeat until it says it is done.</p>" +
            "<p>A loop needs a <b>limit</b>. Without one, a confused agent can keep calling tools indefinitely and run up cost. A sensible cap on steps is part of building one properly, not an afterthought.</p>",
          look: "For one of your agents, decide the maximum number of steps it should ever need. Is that limit written down anywhere?",
          qs: [{
            q: "What stops an agent calling tools forever?",
            opts: ["The model always knows when to stop",
                   "A step or continuation limit you set in your code",
                   "Running out of context",
                   "Nothing can"],
            correct: 1,
            why: "Usually it stops on its own, but you cannot rely on usually. Cap the loop in code and handle the cap being hit."
          }]
        },
        {
          title: "Where the human sits",
          teach: "<p>Models can be fluent and wrong at the same time. For anything with consequences — a grade, a payment, a message sent in your name — the safe pattern is: <b>the agent proposes, a person decides</b>.</p>" +
            "<p>That is not a lack of trust in the tool. It is the design that lets you use it on work that matters. It is also the easiest thing to explain to a client who is nervous about AI.</p>",
          look: "List one decision in your own work where the AI should propose and you should decide.",
          qs: [{
            q: "An agent drafts a compliance grade for a file. Where should a person be in that flow?",
            opts: ["Nowhere — the model is accurate enough",
                   "Final approval before the grade is issued",
                   "Only if the client complains",
                   "Writing the first draft instead"],
            correct: 1,
            why: "Let the model do the reading and drafting, and keep the judgement with someone accountable for it."
          }]
        }
      ],
      recap: [
        "A model only knows what is in its context window for this run.",
        "Memory in an agent is something you build, by feeding things back in.",
        "With your own tools, the model asks and your code acts — so checks belong in your code.",
        "An agent is model + tools + loop, and the loop needs a limit.",
        "For anything with consequences: the agent proposes, a person decides."
      ],
      open: "Describe one agent you would sell to a small business in three lines: what goes in its context, which tools it gets, and where the human signs off."
    }
  ],
  syllabus: [
    { title: "Writing instructions that hold up", covers: "System prompts, examples and why specific beats clever.", kind: "lesson" },
    { title: "MCP: plugging tools into agents", covers: "What the Model Context Protocol is and why it matters for building once and reusing.", kind: "lesson" },
    { title: "Tokens and cost", covers: "What you are billed for and how context size drives it.", kind: "lesson" },
    { title: "Checking an agent's work", covers: "Simple evaluations you can run before trusting an agent with real work.", kind: "lesson" },
    { title: "Data and privacy with AI tools", covers: "What leaves your systems, and what to tell a client.", kind: "lesson" },
    { title: "Spec an SME agent", covers: "Write a one-page spec for an agent a real business would pay for.", kind: "milestone" }
  ]
});
