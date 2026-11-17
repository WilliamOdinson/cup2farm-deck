import { OUTLINE, partOf, sectionOf } from "./outline.js";
import { AgendaSlide, BlufSlide, TitleSlide, WhySlide } from "../slides/Open.jsx";
import {
  ChainSlide,
  GapsSlide,
  ProblemSlide,
  RivalsSlide,
  SoWhatSlide,
  StandsForSlide,
  TimelineSlide,
  TrendsASlide,
  TrendsBSlide,
} from "../slides/Scoping.jsx";
import { DoesDoesntSlide, ExistsNewSlide, IdeaSlide, SpectrumSlide, TrustSlide } from "../slides/Solving.jsx";
import { PrototypeSlide } from "../slides/PrototypeSlide.jsx";
import { DataSourcesSlide, LearnSlide, SixFieldsSlide } from "../slides/Data.jsx";
import { FrictionSlide, MotiveSlide, ReturnSlide } from "../slides/Adoption.jsx";
import { EvidenceSlide, InnovationSlide, ReachSlide, RoiSlide, ScorecardSlide } from "../slides/Roi.jsx";
import {
  FlowSlide,
  InsideCodaSlide,
  LandscapeSlide,
  PartnersSlide,
  PrecedentsSlide,
  RisksSlide,
  RolloutSlide,
  TechChoicesSlide,
} from "../slides/TechMgmt.jsx";
import { BrandSlide, BriefSlide, GainsSlide, OutcomesSlide, RoadmapSlide } from "../slides/Conclusions.jsx";
import { AssumptionsSlide, QASlide, SourcesCompanySlide, SourcesCourseSlide, SourcesMarketSlide } from "../slides/Appendix.jsx";

const COMPONENTS = {
  cup2farm: TitleSlide,
  agenda: AgendaSlide,
  bluf: BlufSlide,
  why: WhySlide,
  "stands-for": StandsForSlide,
  timeline: TimelineSlide,
  "supply-chain": ChainSlide,
  rivals: RivalsSlide,
  "trends-coffee": TrendsASlide,
  "trends-trust": TrendsBSlide,
  "so-what": SoWhatSlide,
  problem: ProblemSlide,
  gaps: GapsSlide,
  idea: IdeaSlide,
  "exists-new": ExistsNewSlide,
  spectrum: SpectrumSlide,
  benevolent: DoesDoesntSlide,
  trust: TrustSlide,
  prototype: PrototypeSlide,
  "data-sources": DataSourcesSlide,
  "six-fields": SixFieldsSlide,
  learn: LearnSlide,
  friction: FrictionSlide,
  motive: MotiveSlide,
  return: ReturnSlide,
  evidence: EvidenceSlide,
  roi: RoiSlide,
  reach: ReachSlide,
  innovation: InnovationSlide,
  scorecard: ScorecardSlide,
  "how-it-works": FlowSlide,
  "tech-choices": TechChoicesSlide,
  "inside-coda": InsideCodaSlide,
  rollout: RolloutSlide,
  "data-risks": RisksSlide,
  landscape: LandscapeSlide,
  precedents: PrecedentsSlide,
  partners: PartnersSlide,
  outcomes: OutcomesSlide,
  brand: BrandSlide,
  "who-gains": GainsSlide,
  roadmap: RoadmapSlide,
  brief: BriefSlide,
  "sources-course": SourcesCourseSlide,
  "sources-market": SourcesMarketSlide,
  "sources-company": SourcesCompanySlide,
  assumptions: AssumptionsSlide,
  qa: QASlide,
};

export const SLIDES = OUTLINE.map((o) => {
  const Component = COMPONENTS[o.id];
  if (!Component) throw new Error(`No slide component registered for "${o.id}"`);
  const part = partOf(o);
  return { ...o, Component, partLabel: part.label, presenter: part.presenter, section: sectionOf(o) };
});
