// Sample data for the prototype. Everything here is illustrative: the lot, the grower
// and the numbers are invented to match the kind of records the case describes.
export const LOT = {
  id: "UG-GLC-0417",
  name: "Eastern Uganda, washed",
  region: "Mount Elgon slopes, eastern Uganda",
  cupScore: 86,
  growers: 38,
  premium: "+42%",
  notes: 127,
  servedAt: "Coda cafe, Edgewater",
};

// status: "ledger" = written to the blockchain by a machine or partner system,
//         "reported" = entered by a partner, not yet independently verified.
export const JOURNEY = [
  {
    step: "Cherries delivered and graded",
    date: "14 Jan",
    status: "ledger",
    detail: "38 growers delivered. Two cameras photographed every cherry; AI graded color, brightness and defects.",
    record: "9f3a…c21e",
  },
  { step: "Depulped", date: "14 Jan", status: "ledger", detail: "Skin and pulp removed at the washing station.", record: "41b7…08da" },
  { step: "Washed", date: "15 Jan", status: "ledger", detail: "Washed in clean water at the station.", record: "c0e2…77f1" },
  { step: "Fermented", date: "16 Jan", status: "ledger", detail: "Fermented in tanks for about 36 hours.", record: "5d90…ab34" },
  { step: "Dried", date: "2 Feb", status: "ledger", detail: "Seventeen days on raised beds.", record: "e7c4…19b0" },
  { step: "Milled and graded", date: "20 Feb", status: "ledger", detail: "Great Lakes Coffee, Kampala.", record: "02fa…d6c8" },
  {
    step: "Shipped",
    date: "11 Mar",
    status: "reported",
    detail: "Reported by the exporter. Awaiting the shipping line’s own record.",
    record: "pending",
  },
  { step: "Roasted", date: "9 Nov", status: "ledger", detail: "Coda roastery, Denver. Batch D-1107.", record: "8a15…f402" },
  { step: "Served", date: "Today", status: "ledger", detail: "Coda cafe, Edgewater, Colorado.", record: "b3d8…6e57" },
];

export const GROWER = {
  name: "Grace N.",
  initials: "GN",
  farm: "About 2 acres of coffee and bananas",
  since: "Farm2Cup certified since 2023",
  receipt: [
    ["DATE", "14 JAN 2026 07:42"],
    ["FARMER", "****2291 GRACE N."],
    ["CHERRIES", "64.0 KG"],
    ["RIPE", "92%"],
    ["CUP SCORE EST.", "86"],
    "-",
    ["PREMIUM", "+42% VS LOCAL"],
    ["AMOUNT", "PRIVATE"],
    ["PAID", "INSTANT"],
    ["LEDGER", "9F3A…C21E"],
  ],
};

export const QUICK_NOTES = ["Thank you for this cup.", "Best coffee of my week.", "Greetings from Denver."];

export const TIPS = [0, 1, 2, 5];

// What each screen draws on, shown beside the phone.
export const SCREENS = [
  {
    id: "scan",
    label: "Scan",
    rows: [
      ["Code on the cup", "Carries the lot and the venue. Nothing about you."],
      ["Web app", "Opens in the browser. Nothing to install."],
    ],
    rule: "Ask for nothing before giving something.",
  },
  {
    id: "cup",
    label: "See",
    rows: [
      ["bextmachine", "Cup score estimate from machine-vision grading."],
      ["Ledger", "Nine dated steps. Eight verified, one reported and labeled as such."],
      ["Coda roastery", "Roast date and batch."],
    ],
    rule: "Say what is not verified.",
  },
  {
    id: "grower",
    label: "Meet",
    rows: [
      ["Co-op, with consent", "First name and district only."],
      ["bextmachine", "Weight and ripeness of the delivery."],
      ["Ledger", "Paid the same day, at a premium. The amount stays private."],
    ],
    rule: "Protect the people in the data.",
  },
  {
    id: "thank",
    label: "Thank",
    rows: [
      ["Drinker, opt-in", "A note, an optional tip, an optional rating."],
      ["Payment partner", "Tips reach the co-op’s community fund in full."],
      ["Farm2Cup team", "Ratings go to farmers and roasters in aggregate."],
    ],
    rule: "Every field is optional.",
  },
  {
    id: "sent",
    label: "Delivered",
    rows: [
      ["Translation", "Machine translated, then checked by a person."],
      ["Co-op liaison", "Notes are read out at the next meeting."],
      ["Drinker, opt-in", "Email only if you want the reply."],
    ],
    rule: "Close the loop, or do not open it.",
  },
  {
    id: "passport",
    label: "Return",
    rows: [
      ["On the phone", "Your history stays on the device."],
      ["Co-op", "Replies, and harvest news twice a year."],
    ],
    rule: "No points, no streaks.",
  },
];
