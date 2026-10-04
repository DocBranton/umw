export type Stage =
  | "detect"
  | "understand"
  | "engineer"
  | "match"
  | "source"
  | "execute"
  | "learn";

export type ViewId =
  | "home"
  | "portfolio"
  | "opportunities"
  | "projects"
  | "requirements"
  | "engineering"
  | "capabilities"
  | "oib"
  | "execution"
  | "gallery"
  | "analytics"
  | "mywork"
  | "saved"
  | "settings"
  | "ai";

export type Source = {
  loc: string;
  cap: string;
  lead: string;
  cost: string;
  img: string;
};

export type Opportunity = {
  id: string;
  priority: "High" | "Med" | "Low";
  platform: string;
  title: string;
  status: string;
  stage: Stage;
  impact: string;
  impactNum: number;
  cost: string;
  lead: string;
  part: string;
  afPart?: string;
  nsn?: string;
  img: string;
  summary: string;
  sources: Source[];
};

export const opportunities: Opportunity[] = [
  {
    id: "opp-c17-hinge",
    priority: "High",
    platform: "C-17",
    title: "Door Hinge Bracket",
    status: "Engineering",
    stage: "engineer",
    impact: "1,240 A/C Days",
    impactNum: 1240,
    cost: "$18.6M",
    lead: "37 days",
    part: "B39-22307",
    afPart: "D39-22307",
    nsn: "1560-01-000-2307",
    img: "/assets/I5FBy.jpg",
    summary:
      "Flight-critical cargo door hinge bracket with recurring depot demand. Digital thread exists; qualification path is the constraint, not geometry.",
    sources: [
      { loc: "Tinker AFB", cap: "Additive Manufacturing", lead: "14 days", cost: "$42K", img: "/assets/jWjQh.jpg" },
      { loc: "Robins AFB", cap: "Repair & Overhaul", lead: "28 days", cost: "$38K", img: "/assets/u2V3o.jpg" },
      { loc: "AMARG", cap: "Parts Harvest / Reuse", lead: "21 days", cost: "$26K", img: "/assets/ZXGSf.jpg" },
      { loc: "Five Eyes Partner", cap: "Manufacture (Cert.)", lead: "35 days", cost: "$48K", img: "/assets/88T66.jpg" },
      { loc: "DIB Supplier", cap: "New Manufacture", lead: "56 days", cost: "$62K", img: "/assets/XaljJ.jpg" },
    ],
  },
  {
    id: "opp-c17-wing",
    priority: "High",
    platform: "C-17",
    title: "Wing Mount",
    status: "Engineering",
    stage: "engineer",
    impact: "740 A/C Days",
    impactNum: 740,
    cost: "$9.4M",
    lead: "44 days",
    part: "WM-17-1122",
    afPart: "D17-1122",
    nsn: "1560-01-000-1122",
    img: "/assets/JX7aQ.jpg",
    summary:
      "Primary wing mount with a long organic queue. Qualification and fit-check access are the constraint, not the model.",
    sources: [
      { loc: "Robins AFB", cap: "Repair & Overhaul", lead: "30 days", cost: "$54K", img: "/assets/u2V3o.jpg" },
      { loc: "Tinker AFB", cap: "Additive Manufacturing", lead: "22 days", cost: "$61K", img: "/assets/jWjQh.jpg" },
      { loc: "DIB Supplier", cap: "New Manufacture", lead: "70 days", cost: "$88K", img: "/assets/XaljJ.jpg" },
    ],
  },
  {
    id: "opp-c17-gear",
    priority: "Med",
    platform: "C-17",
    title: "Landing Gear Fitting",
    status: "Ready to Source",
    stage: "source",
    impact: "390 A/C Days",
    impactNum: 390,
    cost: "$4.1M",
    lead: "19 days",
    part: "LG-17-0755",
    afPart: "D17-0755",
    nsn: "1620-01-000-0755",
    img: "/assets/Shf1y.jpg",
    summary:
      "Landing-gear fitting already through engineering. Forward organic repair is the best value if the bay holds.",
    sources: [
      { loc: "Robins AFB", cap: "Repair & Overhaul", lead: "16 days", cost: "$27K", img: "/assets/u2V3o.jpg" },
      { loc: "AMARG", cap: "Parts Harvest / Reuse", lead: "18 days", cost: "$21K", img: "/assets/ZXGSf.jpg" },
      { loc: "Five Eyes Partner", cap: "Manufacture (Cert.)", lead: "34 days", cost: "$39K", img: "/assets/88T66.jpg" },
    ],
  },
  {
    id: "opp-kc135-lru",
    priority: "High",
    platform: "KC-135",
    title: "Fuel Control LRU",
    status: "Analysis",
    stage: "understand",
    impact: "980 A/C Days",
    impactNum: 980,
    cost: "$11.4M",
    lead: "54 days",
    part: "FCU-135-8841",
    nsn: "2915-01-000-8841",
    img: "/assets/I5FBy.jpg",
    summary:
      "Aging fuel control LRU with diminishing manufacturing sources. Candidate for dual-source organic repair plus partner capability.",
    sources: [
      { loc: "Tinker AFB", cap: "Repair & Overhaul", lead: "32 days", cost: "$71K", img: "/assets/u2V3o.jpg" },
      { loc: "Five Eyes Partner", cap: "Repair (Cert.)", lead: "29 days", cost: "$68K", img: "/assets/88T66.jpg" },
      { loc: "DIB Supplier", cap: "New Manufacture", lead: "90 days", cost: "$124K", img: "/assets/XaljJ.jpg" },
    ],
  },
  {
    id: "opp-c130-hyd",
    priority: "Med",
    platform: "C-130",
    title: "Hydraulic Pump",
    status: "Ready to Source",
    stage: "source",
    impact: "620 A/C Days",
    impactNum: 620,
    cost: "$6.2M",
    lead: "22 days",
    part: "HP-130-4402",
    nsn: "1650-01-000-4402",
    img: "/assets/I5FBy.jpg",
    summary:
      "Technical package complete. Best value currently sits with forward organic repair if capacity holds this quarter.",
    sources: [
      { loc: "Robins AFB", cap: "Repair & Overhaul", lead: "18 days", cost: "$29K", img: "/assets/u2V3o.jpg" },
      { loc: "AMARG", cap: "Parts Harvest / Reuse", lead: "16 days", cost: "$19K", img: "/assets/ZXGSf.jpg" },
      { loc: "DIB Supplier", cap: "New Manufacture", lead: "45 days", cost: "$41K", img: "/assets/XaljJ.jpg" },
    ],
  },
  {
    id: "opp-b52-avion",
    priority: "Med",
    platform: "B-52",
    title: "Avionics Bracket",
    status: "Engineering",
    stage: "engineer",
    impact: "480 A/C Days",
    impactNum: 480,
    cost: "$3.1M",
    lead: "41 days",
    part: "AVB-52-1904",
    nsn: "1680-01-000-1904",
    img: "/assets/I5FBy.jpg",
    summary:
      "Non-critical structural bracket. Strong additive candidate after vibration and finish qualification.",
    sources: [
      { loc: "Tinker AFB", cap: "Additive Manufacturing", lead: "12 days", cost: "$18K", img: "/assets/jWjQh.jpg" },
      { loc: "DIB Supplier", cap: "New Manufacture", lead: "38 days", cost: "$24K", img: "/assets/XaljJ.jpg" },
    ],
  },
  {
    id: "opp-f15-act",
    priority: "Low",
    platform: "F-15",
    title: "Actuator Housing",
    status: "Capture",
    stage: "detect",
    impact: "260 A/C Days",
    impactNum: 260,
    cost: "$1.8M",
    lead: "63 days",
    part: "AH-15-7720",
    nsn: "1650-01-000-7720",
    img: "/assets/JX7aQ.jpg",
    summary:
      "Demand signal newly captured from field reliability data. Requirements package still incomplete.",
    sources: [
      { loc: "Robins AFB", cap: "Repair & Overhaul", lead: "40 days", cost: "$33K", img: "/assets/u2V3o.jpg" },
      { loc: "DIB Supplier", cap: "New Manufacture", lead: "70 days", cost: "$51K", img: "/assets/XaljJ.jpg" },
    ],
  },
];

export const viewCopy: Record<
  Exclude<ViewId, "home" | "ai" | "portfolio">,
  { title: string; body: string; cards: [string, string][] }
> = {
  opportunities: {
    title: "Opportunity Command Center",
    body: "All sustainment demand signals — fielded failures, forecasted DMSMS, and campaign readiness gaps — land here before they become grounded aircraft.",
    cards: [
      ["Demand intake", "Merge reliability, MICAP, and planner signals into a single opportunity object."],
      ["Scoring", "Rank by aircraft days at risk, cost avoidance, and time-to-capability."],
      ["Campaign view", "Group opportunities by platform, theater, and mission set."],
    ],
  },
  projects: {
    title: "Projects",
    body: "Active work packages moving through engineering, sourcing, and fielding. Each project inherits the Mission Technical Package.",
    cards: [
      ["C-17 door hinge", "Engineering — additive path at Tinker under review."],
      ["KC-135 fuel control", "Analysis — dual source trade study."],
      ["C-130 hydraulic pump", "Ready to source — OIB exchange live."],
    ],
  },
  requirements: {
    title: "Requirements",
    body: "Authoritative need statements, specs, and acceptance criteria tied to each opportunity.",
    cards: [
      ["Form / fit / function", "Capture the minimum viable technical requirement."],
      ["Qualification", "Airworthiness and repairability gates sit on the same object."],
      ["Traceability", "Every clause maps back to a fielded mission effect."],
    ],
  },
  engineering: {
    title: "Engineering Workbench",
    body: "Where geometry, materials, and repair data become a sourceable package.",
    cards: [
      ["Digital thread", "Models, TOs, and as-maintained history in one pane."],
      ["Alt. analysis", "Machine, repair, harvest, or print — scored side by side."],
      ["Tech data gaps", "Flag missing specs before they stall sourcing."],
    ],
  },
  capabilities: {
    title: "Global Capabilities",
    body: "U.S. organic, forward organic, Five Eyes, and authorized DIB capacity — visible as a living map.",
    cards: [
      ["Organic depots", "Tinker, Robins, and other ALC capacity and queues."],
      ["Five Eyes", "Certified partner manufacture and repair lanes."],
      ["DIB", "Authorized industrial base with qualification status."],
    ],
  },
  oib: {
    title: "OIB Opportunity Exchange",
    body: "A controlled marketplace for organic industrial base workshare, not a public solicitation board.",
    cards: [
      ["Post a need", "Push a technical package to eligible sources."],
      ["Receive capacity", "See who can actually execute this quarter."],
      ["Award path", "Keep contracting artifacts on the same object."],
    ],
  },
  execution: {
    title: "Execution & Fielding",
    body: "Manufacture, repair, inspect, ship, and close the loop back to the weapon system.",
    cards: [
      ["Work orders", "Live status from depot and partner floor."],
      ["Fielding", "Induction back onto the aircraft or into supply."],
      ["Evidence pack", "Quality and airworthiness artifacts travel with the part."],
    ],
  },
  gallery: {
    title: "Solution Gallery",
    body: "What already worked. Reuse before you reinvent.",
    cards: [
      ["Fielded solutions", "184 packages already returned to the fleet."],
      ["Patterns", "Repeatable additive, harvest, and repair plays."],
      ["Lessons", "What failed qualification — and why."],
    ],
  },
  analytics: {
    title: "Analytics",
    body: "Readiness impact, cost avoidance, and cycle time across the workbench.",
    cards: [
      ["A/C days saved", "The unit of measure that matters to the operator."],
      ["Bottlenecks", "Where packages stall: data, quals, or capacity."],
      ["Network health", "Organic vs partner vs DIB mix over time."],
    ],
  },
  mywork: {
    title: "My Work",
    body: "Packages you own, reviews waiting on you, and watches you set.",
    cards: [
      ["Owned", "C-17 Door Hinge Bracket — engineering lead."],
      ["Reviews", "Two qualification packages need AFLCMC sign-off."],
      ["Watches", "KC-135 fuel control source-of-repair decision."],
    ],
  },
  saved: {
    title: "Saved Views",
    body: "Pinned queries and theater filters for the next stand-up.",
    cards: [
      ["PACAF readiness", "High-priority airlift parts west of the date line."],
      ["Additive candidates", "Geometry-ready, qual-pending."],
      ["AMARG harvest", "Airframes with reusable door hardware."],
    ],
  },
  settings: {
    title: "Settings",
    body: "Classification banner, data sources, and notification rules for this prototype.",
    cards: [
      ["Prototype mode", "No live systems connected. Sample data only."],
      ["Identity", "Gen. John Duselis — AFLCMC / RSO"],
      ["Notifications", "3 unread — one MICAP escalation on C-17 hinge."],
    ],
  },
};

const stageFilter: Record<Stage, string[] | null> = {
  detect: ["Capture"],
  understand: ["Analysis", "Capture"],
  engineer: ["Engineering"],
  match: null,
  source: ["Ready to Source"],
  execute: ["In Execution"],
  learn: ["Fielded"],
};

export type PackageState = "Complete" | "Gap" | "In Review";

export type PackageRow = {
  area: string;
  item: string;
  state: PackageState;
  owner: string;
  next: string;
};

export type RepairTrade = Source & {
  risk: "Low" | "Med" | "High";
  note: string;
  recommend: boolean;
};

export type EngineeringPackage = {
  thread: string;
  rows: PackageRow[];
  trades: RepairTrade[];
};

const engineeringPackages: Record<string, EngineeringPackage> = {
  "opp-c17-hinge": {
    thread: "MTP-2026-C17-047",
    rows: [
      {
        area: "Requirements",
        item: "Cargo-door load case and MICAP demand are captured.",
        state: "Complete",
        owner: "AFLCMC / RSO",
        next: "Locked to the opportunity object.",
      },
      {
        area: "Technical Data",
        item: "Drawing is 2D. Additive process spec is not released.",
        state: "Gap",
        owner: "Engineering",
        next: "Release the AM process spec before first article.",
      },
      {
        area: "Qualification",
        item: "First-article plan and NDT method are unsigned.",
        state: "Gap",
        owner: "Qual engineering",
        next: "Sign the FAI plan and name the NDT method.",
      },
      {
        area: "Airworthiness",
        item: "Structural substantiation is in AFLCMC review.",
        state: "In Review",
        owner: "Structures",
        next: "Close the substantiation comment cycle.",
      },
      {
        area: "Repairability",
        item: "Depot repair scheme is drafted for Robins.",
        state: "Complete",
        owner: "Robins MRO",
        next: "Available as the low-risk alternate path.",
      },
    ],
    trades: [
      {
        loc: "Tinker AFB",
        cap: "Additive Manufacturing",
        lead: "14 days",
        cost: "$42K",
        img: "/assets/jWjQh.jpg",
        risk: "Med",
        note: "Fastest path. The constraint is the process spec, not the geometry.",
        recommend: true,
      },
      {
        loc: "Robins AFB",
        cap: "Repair & Overhaul",
        lead: "28 days",
        cost: "$38K",
        img: "/assets/u2V3o.jpg",
        risk: "Low",
        note: "Known repair. Slower, with the lowest airworthiness risk.",
        recommend: false,
      },
      {
        loc: "AMARG",
        cap: "Parts Harvest / Reuse",
        lead: "21 days",
        cost: "$26K",
        img: "/assets/ZXGSf.jpg",
        risk: "High",
        note: "Cheapest unit. Remaining life and configuration are the risk.",
        recommend: false,
      },
      {
        loc: "Five Eyes Partner",
        cap: "Manufacture (Cert.)",
        lead: "35 days",
        cost: "$48K",
        img: "/assets/88T66.jpg",
        risk: "Med",
        note: "Certified manufacture if the organic queue slips.",
        recommend: false,
      },
      {
        loc: "DIB Supplier",
        cap: "New Manufacture",
        lead: "56 days",
        cost: "$62K",
        img: "/assets/XaljJ.jpg",
        risk: "Low",
        note: "Clean new-make. Longest lead and highest unit cost.",
        recommend: false,
      },
    ],
  },
  "opp-kc135-lru": {
    thread: "MTP-2026-KC135-112",
    rows: [
      {
        area: "Requirements",
        item: "DMSMS signal is real. Form-fit-function is not frozen.",
        state: "In Review",
        owner: "AFLCMC / RSO",
        next: "Freeze the minimum LRU requirement.",
      },
      {
        area: "Technical Data",
        item: "Overhaul TO is incomplete for the current dash number.",
        state: "Gap",
        owner: "Tech data",
        next: "Recover the missing TO pages before dual-source.",
      },
      {
        area: "Qualification",
        item: "No approved repair source beyond the OEM trail.",
        state: "Gap",
        owner: "Qual engineering",
        next: "Open a repair-source qualification.",
      },
      {
        area: "Airworthiness",
        item: "Fuel-system safety review has not started.",
        state: "In Review",
        owner: "Propulsion",
        next: "Schedule the safety review.",
      },
      {
        area: "Repairability",
        item: "Tinker can induct the LRU if the TO gap closes.",
        state: "Complete",
        owner: "Tinker MRO",
        next: "Hold capacity, do not award yet.",
      },
    ],
    trades: [
      {
        loc: "Tinker AFB",
        cap: "Repair & Overhaul",
        lead: "32 days",
        cost: "$71K",
        img: "/assets/u2V3o.jpg",
        risk: "Med",
        note: "Preferred organic path once the TO gap closes.",
        recommend: true,
      },
      {
        loc: "Five Eyes Partner",
        cap: "Repair (Cert.)",
        lead: "29 days",
        cost: "$68K",
        img: "/assets/88T66.jpg",
        risk: "Med",
        note: "Useful second source. Do not sole-source it yet.",
        recommend: false,
      },
      {
        loc: "DIB Supplier",
        cap: "New Manufacture",
        lead: "90 days",
        cost: "$124K",
        img: "/assets/XaljJ.jpg",
        risk: "High",
        note: "New-make does not solve the near-term MICAP.",
        recommend: false,
      },
    ],
  },
  "opp-c130-hyd": {
    thread: "MTP-2026-C130-088",
    rows: [
      {
        area: "Requirements",
        item: "Pump specification and acceptance tests are baselined.",
        state: "Complete",
        owner: "AFLCMC / RSO",
        next: "Ready for source selection.",
      },
      {
        area: "Technical Data",
        item: "Repair TO and test stand procedure are current.",
        state: "Complete",
        owner: "Tech data",
        next: "No engineering hold.",
      },
      {
        area: "Qualification",
        item: "Organic repair source is already qualified.",
        state: "Complete",
        owner: "Qual engineering",
        next: "No new first article required.",
      },
      {
        area: "Airworthiness",
        item: "No open structural or system comment.",
        state: "Complete",
        owner: "Systems",
        next: "Cleared.",
      },
      {
        area: "Repairability",
        item: "Forward organic capacity is the only open question.",
        state: "In Review",
        owner: "Robins MRO",
        next: "Confirm this-quarter induction slots.",
      },
    ],
    trades: [
      {
        loc: "Robins AFB",
        cap: "Repair & Overhaul",
        lead: "18 days",
        cost: "$29K",
        img: "/assets/u2V3o.jpg",
        risk: "Low",
        note: "Best value if the induction slot holds.",
        recommend: true,
      },
      {
        loc: "AMARG",
        cap: "Parts Harvest / Reuse",
        lead: "16 days",
        cost: "$19K",
        img: "/assets/ZXGSf.jpg",
        risk: "Med",
        note: "Faster and cheaper. Confirm remaining service life.",
        recommend: false,
      },
      {
        loc: "DIB Supplier",
        cap: "New Manufacture",
        lead: "45 days",
        cost: "$41K",
        img: "/assets/XaljJ.jpg",
        risk: "Low",
        note: "Fallback if organic capacity breaks.",
        recommend: false,
      },
    ],
  },
  "opp-b52-avion": {
    thread: "MTP-2026-B52-031",
    rows: [
      {
        area: "Requirements",
        item: "Bracket is non-critical structure. Envelope is known.",
        state: "Complete",
        owner: "AFLCMC / RSO",
        next: "Locked.",
      },
      {
        area: "Technical Data",
        item: "Solid model is usable for additive.",
        state: "Complete",
        owner: "Engineering",
        next: "Model is sourceable.",
      },
      {
        area: "Qualification",
        item: "Vibration and finish qualification are not closed.",
        state: "Gap",
        owner: "Qual engineering",
        next: "Run the vibration coupon before production.",
      },
      {
        area: "Airworthiness",
        item: "Non-critical finding. Review is light.",
        state: "In Review",
        owner: "Structures",
        next: "Accept the non-critical classification.",
      },
      {
        area: "Repairability",
        item: "Print-and-replace is the intended scheme.",
        state: "Complete",
        owner: "Tinker AM",
        next: "No depot repair required.",
      },
    ],
    trades: [
      {
        loc: "Tinker AFB",
        cap: "Additive Manufacturing",
        lead: "12 days",
        cost: "$18K",
        img: "/assets/jWjQh.jpg",
        risk: "Med",
        note: "Right path after the vibration coupon.",
        recommend: true,
      },
      {
        loc: "DIB Supplier",
        cap: "New Manufacture",
        lead: "38 days",
        cost: "$24K",
        img: "/assets/XaljJ.jpg",
        risk: "Low",
        note: "Use only if the coupon fails.",
        recommend: false,
      },
    ],
  },
  "opp-f15-act": {
    thread: "MTP-2026-F15-019",
    rows: [
      {
        area: "Requirements",
        item: "Field reliability signal is new. Need statement is thin.",
        state: "Gap",
        owner: "AFLCMC / RSO",
        next: "Write the minimum requirement before engineering spend.",
      },
      {
        area: "Technical Data",
        item: "Housing model is not in the package.",
        state: "Gap",
        owner: "Engineering",
        next: "Pull the drawing from the TO library.",
      },
      {
        area: "Qualification",
        item: "Not started.",
        state: "Gap",
        owner: "Qual engineering",
        next: "Do not open a qual until requirements exist.",
      },
      {
        area: "Airworthiness",
        item: "Not started.",
        state: "Gap",
        owner: "Structures",
        next: "Hold.",
      },
      {
        area: "Repairability",
        item: "Robins can repair this family. No package yet.",
        state: "In Review",
        owner: "Robins MRO",
        next: "Watch only.",
      },
    ],
    trades: [
      {
        loc: "Robins AFB",
        cap: "Repair & Overhaul",
        lead: "40 days",
        cost: "$33K",
        img: "/assets/u2V3o.jpg",
        risk: "Med",
        note: "Likely path. Do not award from a capture-stage package.",
        recommend: true,
      },
      {
        loc: "DIB Supplier",
        cap: "New Manufacture",
        lead: "70 days",
        cost: "$51K",
        img: "/assets/XaljJ.jpg",
        risk: "High",
        note: "Premature until the drawing is in the thread.",
        recommend: false,
      },
    ],
  },
};

export function engineeringPackage(opp: Opportunity): EngineeringPackage {
  return engineeringPackages[opp.id];
}

export type ReconPhase = "evidence" | "requirements" | "reconstruction" | "cad" | "evaluation";
export type PhaseState = "Complete" | "In Progress" | "Not started";
export type ReqStatus = "Validated" | "In Review" | "Unresolved";

export type DerivedRequirement = {
  id: string;
  name: string;
  value: string;
  source: string;
  confidence: number;
  status: ReqStatus;
};

export type ExtractedFact = {
  id: string;
  name: string;
  value: string;
  zone: string;
  confidence: number;
  req: string;
};

export type ReconstructionThread = {
  phases: { id: ReconPhase; n: string; label: string; state: PhaseState }[];
  evidence: { name: string; kind: string; state: string }[];
  facts: ExtractedFact[];
  requirements: DerivedRequirement[];
  candidates: { name: string; kind: string; match: number; recommend: boolean; note: string }[];
  authority: string;
};

const hingeThread: ReconstructionThread = {
  phases: [
    { id: "evidence", n: "01", label: "Source Evidence", state: "Complete" },
    { id: "requirements", n: "02", label: "Requirements", state: "In Progress" },
    { id: "reconstruction", n: "03", label: "Reconstruction", state: "Not started" },
    { id: "cad", n: "04", label: "Verified CAD", state: "Not started" },
    { id: "evaluation", n: "05", label: "Evaluation", state: "Not started" },
  ],
  evidence: [
    { name: "B39-22307_RevD.pdf", kind: "Drawing", state: "Extracted" },
    { name: "hinge_primary.png", kind: "Image", state: "Analyzed" },
    { name: "MICAP demand record", kind: "Spec", state: "Ingested" },
  ],
  facts: [
    { id: "1", name: "Lug spacing", value: "4.80 in", zone: "Drawing · Zone C4", confidence: 96, req: "REQ-001" },
    { id: "2", name: "Bore diameter", value: "Ø0.500 in", zone: "Drawing · Zone B3", confidence: 94, req: "REQ-002" },
    { id: "3", name: "Lug thickness", value: "0.375 in", zone: "Drawing · Zone C2", confidence: 91, req: "REQ-003" },
    { id: "4", name: "Hole quantity", value: "4", zone: "Drawing · Zone D4", confidence: 98, req: "REQ-004" },
    { id: "5", name: "Material", value: "15-5 PH", zone: "Drawing note", confidence: 88, req: "REQ-005" },
    { id: "6", name: "True position", value: "Ø0.010 to A", zone: "Drawing · GD&T", confidence: 71, req: "REQ-007" },
  ],
  requirements: [
    { id: "REQ-001", name: "Lug spacing", value: "4.80 in", source: "Drawing (Dim)", confidence: 96, status: "Validated" },
    { id: "REQ-002", name: "Bore diameter", value: "0.500 in", source: "Drawing (Dim)", confidence: 94, status: "Validated" },
    { id: "REQ-003", name: "Lug thickness", value: "0.375 in", source: "Drawing (Dim)", confidence: 91, status: "In Review" },
    { id: "REQ-004", name: "Hole quantity", value: "4", source: "Drawing (Dim)", confidence: 98, status: "Validated" },
    { id: "REQ-005", name: "Material", value: "15-5 PH", source: "Drawing (Note)", confidence: 88, status: "In Review" },
    { id: "REQ-006", name: "Heat treat", value: "H900", source: "Drawing (Note)", confidence: 84, status: "In Review" },
    { id: "REQ-007", name: "True position", value: "Ø0.010 to A", source: "Drawing (GD&T)", confidence: 71, status: "Unresolved" },
    { id: "REQ-008", name: "AM process spec", value: "Not in package", source: "Gap", confidence: 20, status: "Unresolved" },
  ],
  candidates: [
    { name: "Candidate A", kind: "Conventional baseline", match: 78, recommend: false, note: "Matches the legacy envelope. No additive relief." },
    { name: "Candidate B", kind: "Optimized reconstruction", match: 92, recommend: true, note: "Best constraint match. Waiting on a validated baseline." },
    { name: "Candidate C", kind: "Harvest configuration", match: 64, recommend: false, note: "AMARG geometry. Remaining-life evidence is thin." },
  ],
  authority: "AI proposes. The engineer validates the baseline before any reconstruction.",
};

export function reconstructionThread(opp: Opportunity): ReconstructionThread {
  if (opp.id === "opp-c17-hinge") return hingeThread;
  const early = opp.stage === "detect" || opp.stage === "understand";
  const sourced = opp.stage === "source" || opp.stage === "execute" || opp.stage === "learn";
  const phase = (id: ReconPhase, n: string, label: string, state: PhaseState) => ({ id, n, label, state });
  return {
    phases: [
      phase("evidence", "01", "Source Evidence", early ? "In Progress" : "Complete"),
      phase("requirements", "02", "Requirements", early ? "Not started" : sourced ? "Complete" : "In Progress"),
      phase("reconstruction", "03", "Reconstruction", sourced ? "Complete" : "Not started"),
      phase("cad", "04", "Verified CAD", sourced ? "In Progress" : "Not started"),
      phase("evaluation", "05", "Evaluation", opp.stage === "source" ? "In Progress" : "Not started"),
    ],
    evidence: [
      { name: `${opp.part}.pdf`, kind: "Drawing", state: early ? "Ingested" : "Extracted" },
      { name: `${opp.platform} reference image`, kind: "Image", state: "Analyzed" },
    ],
    facts: [
      { id: "1", name: "Envelope", value: "From legacy drawing", zone: "Drawing · Zone C4", confidence: 90, req: "REQ-001" },
      { id: "2", name: "Material", value: "See technical order", zone: "Drawing note", confidence: 82, req: "REQ-002" },
      { id: "3", name: "Airworthiness", value: "To be determined", zone: "Gap", confidence: 40, req: "REQ-003" },
    ],
    requirements: [
      { id: "REQ-001", name: "Envelope", value: "From legacy drawing", source: "Drawing (Dim)", confidence: 90, status: early ? "In Review" : "Validated" },
      { id: "REQ-002", name: "Material", value: "See technical order", source: "Spec", confidence: 82, status: "In Review" },
      { id: "REQ-003", name: "Airworthiness", value: "To be determined", source: "Gap", confidence: 40, status: "Unresolved" },
    ],
    candidates: [
      { name: "Candidate A", kind: "Conventional baseline", match: 80, recommend: !sourced, note: "Legacy envelope." },
      { name: "Candidate B", kind: "Repair geometry", match: 86, recommend: sourced, note: "Aligned to the current source path." },
    ],
    authority: "AI proposes. The engineer validates the baseline before any reconstruction.",
  };
}

export function filterByStage(stage: Stage) {
  const filter = stageFilter[stage];
  return opportunities.filter((o) => !filter || filter.includes(o.status));
}

export function wingmanReply(text: string, opp: Opportunity) {
  const q = text.toLowerCase();
  const first = opp.sources[0];
  if (q.includes("hinge") || q.includes("c-17") || q.includes("best") || q.includes("alternative")) {
    return `For ${opp.platform} ${opp.title} (${opp.part}), the current best-value path is ${first.loc} — ${first.cap}: ${first.lead}, ${first.cost}. A cheaper harvest option exists, but qualification risk is higher. Projected readiness impact is ${opp.impact}.`;
  }
  if (q.includes("qual") || q.includes("airworth")) {
    return `Airworthiness and repairability sit inside the Mission Technical Package. ${opp.title} is in ${opp.status}. Missing items are usually process spec, NDT method, and first-article evidence — not the CAD.`;
  }
  if (q.includes("five") || q.includes("partner")) {
    return `Five Eyes certified manufacture is available for this family of fittings when the organic queue slips or theater positioning favors a partner depot.`;
  }
  return `Wingman on station. Selected object is ${opp.platform} ${opp.title}. I can compare source-of-repair options, flag tech-data gaps, or estimate aircraft-days recovered if we pull this package forward.`;
}

export const stages: { id: Stage; num: string; cap: string }[] = [
  { id: "detect", num: "01 DETECT", cap: "Turn data into opportunities" },
  { id: "understand", num: "02 UNDERSTAND", cap: "Capture the opportunity" },
  { id: "engineer", num: "ENGINEER", cap: "Analyze and define options" },
  { id: "match", num: "MATCH", cap: "Find the best global solution" },
  { id: "source", num: "SOURCE", cap: "OIB, exchange & beyond" },
  { id: "execute", num: "EXECUTE", cap: "Manufacture, repair and deliver" },
  { id: "learn", num: "LEARN", cap: "Multiply readiness impact" },
];
