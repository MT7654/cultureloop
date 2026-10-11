import { ArrowRight } from "lucide-react";
import { interestLabels, type CultureEvent, type Recommendation } from "../domain/types";

const questions: Record<string, string> = {
  "fat-kids": "How does a story change when the audience chooses what comes next?",
  "musica-intimae": "What can a chorus express that a single voice cannot?",
  singlang: "Which familiar cultural influences do you hear differently in a contemporary sound?",
};
export default function CulturalStory({ event, match }: { event: CultureEvent; match?: Recommendation }) {
  const taste = match?.matchedTags[0];
  return <section className="cultural-story" aria-label="The cultural connection">
    <span className="eyebrow">A CONNECTION WORTH FOLLOWING</span>
    <div className="bridge-strip"><span>{taste ? interestLabels[taste] : "Your curiosity"}</span><ArrowRight size={15}/><span>{event.category.replace("-", " ")}</span><ArrowRight size={15}/><span>Your next chapter</span></div>
    <h3>Look a little closer.</h3>
    {event.culturalNotes.map((note, i) => <p key={i}>{note}</p>)}
    <blockquote>{questions[event.id] ?? "What might this artistic form let you notice for the first time?"}</blockquote>
    <a href={event.sourceUrls.find(url => url !== "https://www.sgculturepass.gov.sg/") ?? event.officialListingUrl} target="_blank" rel="noopener noreferrer">Explore the programme source <ArrowRight size={14}/></a>
  </section>;
}
