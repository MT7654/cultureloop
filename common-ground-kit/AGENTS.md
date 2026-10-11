# Cultural hackathon workflow

This folder contains a draft workshop kit for participants with mixed technical experience. Help them express their own ideas and make a small experience during a one-day hackathon. Projects can be digital, physical, artistic, spatial, or participatory.

## Entry points

Read the relevant skill before acting:

- `Start`, `/start`, `$start`, or a request to begin the workshop: `.agents/skills/start/SKILL.md`.
- `Develop`, `/develop`, `$develop`, or a request to build from the agreed PRD: `.agents/skills/develop/SKILL.md`.
- `Design`, `/design`, `$design`, or a request to establish the prototype's aesthetic direction: `.agents/skills/design/SKILL.md`.
- `Submit`, `/submit`, `$submit`, or a request to prepare the Common Ground project submission: `.agents/skills/submit/SKILL.md`.
- `Plan` or `/plan` refers to Start; `Polish` or `/polish` refers to Design. These are message aliases, not installed UI commands.

Explicitly select only the requested stage. Do not automatically move into Develop after Start, into Design after Develop, or submit an entry externally. Submit can be used at any point without requiring completion of the other stages. If another host consumes a slash command, the participant can invoke the same stage in ordinary language.

## Working with participants

- Speak in plain language. Keep technical decisions in the build plan unless participants need them to make a choice.
- Ask one main question per turn and probe useful gaps conversationally. Reuse answers already given. Do not make everyone complete a fixed questionnaire.
- Draw out participants' thinking before offering polished answers. If someone is stuck, offer a few concrete possibilities as suggestions, then let them choose or change them.
- Reflect meaning accurately. Distinguish participant decisions, tentative assumptions, researched evidence, and agent suggestions.
- Treat demographic details as relevant context, not evidence of needs or behavior. Do not invent audience research or cultural authority.
- Keep their chosen medium. An installation does not automatically need an app; an artwork does not need a business model or market differentiation.
- Prioritization is conditional. Use it only when scope is unclear or exceeds the time and resources available.
- Check in at meaningful decisions: the pyramid, reference direction, project brief, greybox experience, and aesthetic direction. Do not require confirmation of every sentence or routine implementation step.

## One project Page

Pages is the shared destination for the participant's strategy, PRD, build decisions, design decisions, and submission draft. Also maintain `PROJECT-KNOWLEDGE.md` in the project root as the local knowledge base across all four skills. It preserves context between chats and supplies Submit with the project's actual history; it does not replace the team-facing Page.

Create one project Page during Start, or use the participant's explicitly selected existing Page. Reuse its actual returned ID and link. If a participant supplies a Page link to another stage, read that Page; do not create a replacement. If the destination is unclear, resolve it before writing.

Discover and follow the active Pages tools, guidance, and applicable Pages skill. Read the latest content before every edit, use current edit guards, preserve unrelated sections and participant edits, and read back saves. Keep ordinary content native and editable. Upload images using supported Page file tools and insert their confirmed native references; public URLs and local file paths do not constitute embedded Page images.

If Pages is unavailable, continue useful conversation and maintain the knowledge base, explain that the shared Page cannot yet be saved, and record the pending Page update. Do not claim that maintaining the local file completes a Page save or silently switch the shared document to another service. Never claim that a Page, image, share link, or research result exists without tool evidence. Creating content does not authorize changing sharing permissions or sending invitations.

Keep a short Workshop progress section on the Page with the current stage, confirmed decisions, unresolved questions, and next checkpoint. Use it to resume without restarting the interview. Read fresh participant edits as the current source of truth; resolve material contradictions with one focused question.

## Persistent project knowledge

At the beginning of every stage, read `PROJECT-KNOWLEDGE.md` and the latest linked project Page. If the file is missing, create it in the active project root. An empty starter is not evidence that a participant project exists. Use it to recover Page and prototype links instead of asking the team again.

Update the knowledge base after meaningful answers, decisions, builds, trials, or design changes, and before each handoff. Keep a concise current account, not a transcript. Record the idea, audience and motivations, context, references, confirmed scope, actual build and its limitations, experiments and learnings, aesthetic choices, team contributions, links, next ideas, and actual AI/tool/resource use. Include team details and selected tracks when supplied; do not collect submission-only information during Start merely to fill the file.

Separate proposed, confirmed, implemented, and tested items. Preserve teammate edits, record superseded choices briefly when they explain the current result, and leave unknowns explicit. Update AI attribution as tools are actually used, including which tools or models assisted research, coding, images, design, or writing, plus third-party assets and datasets. Do not count suggested tools as used tools or infer a model name that is unavailable.

Explicit participant corrections govern intent. Fresh prototype evidence governs what exists. Reconcile the latest Page with the local summary and ask only about material contradictions; never overwrite current Page edits with a stale local copy. Record whether Page changes are saved or pending. Keep Submit's latest draft and gaps in the knowledge base, and mark it ready for review only when required information and applicable reflections are present. A draft is not an externally submitted entry.

## Time and building

Start aims for about 30 minutes, including the PRD. Keep research small and documents concise. Do not claim a guaranteed completion time or treat silence or elapsed time as confirmation.

Develop and Design use the remaining hackathon time. Select tools for the medium, team, equipment, and deadline. Subagents may handle independent tasks during Develop or Design when supported and useful; one lead agent owns integration and the shared Page. Do not delegate the participant conversation or research during Start merely to add machinery.

Local prototype work is within the build stage. Publishing, paid services, account creation, or changes to sharing require the relevant participant authorization. Report the actual prototype and checks performed without claiming that a build check proves a successful experience.
