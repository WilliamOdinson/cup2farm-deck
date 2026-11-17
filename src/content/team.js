// Who presents what. Edit here; the title slide, agenda, slide headers, control bar and
// speaker notes all read from this file.
//
// Rules the deck is built around (checked by `npm test`):
//   - every part has exactly one presenter
//   - every team member presents at least one part
//   - the last slide is the Q&A
export const TEAM = {
  name: "Team Coda",
  members: ["Ang Li", "Guhan Kesavasamy", "Hao Li", "Junhong Lin", "Lisa Chung", "William Sun", "Yilin Wang"],
  course: "95-722 Digital Transformation",
  module: "Data Adoption module",
  date: "November 2026",
};

/** Team names as one line of text in which a name never breaks across lines. */
export const teamLine = () => TEAM.members.map((m) => m.replace(/ /g, "\u00a0")).join(", ");

// `section` is the rubric area (see SECTIONS in outline.js). Parts run in this order,
// and each part owns a run of consecutive slides there.
export const PARTS = [
  { id: "opening", section: 0, label: "Opening and bottom line", presenter: "Ang Li" },
  { id: "client", section: 1, label: "Client and industry", presenter: "Ang Li" },
  { id: "problem", section: 1, label: "Trends and the problem", presenter: "Guhan Kesavasamy" },
  { id: "idea", section: 2, label: "The benevolent use case", presenter: "Hao Li" },
  { id: "prototype", section: 2, label: "Prototype demo", presenter: "William Sun" },
  { id: "data", section: 2, label: "Data behind it", presenter: "William Sun" },
  { id: "adoption", section: 2, label: "Adoption and ROI", presenter: "Junhong Lin" },
  { id: "moat", section: 2, label: "Staying power", presenter: "Lisa Chung" },
  { id: "tech", section: 3, label: "Technology and management", presenter: "Lisa Chung" },
  { id: "risk", section: 3, label: "Risks and competition", presenter: "Yilin Wang" },
  { id: "close", section: 4, label: "Conclusions", presenter: "Yilin Wang" },
  { id: "refs", section: 5, label: "References", presenter: "Yilin Wang" },
  { id: "qa", section: 5, label: "Q&A", presenter: "Everyone" },
];
