import { Suspense, lazy, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  Activity,
  BarChart3,
  Bell,
  Bookmark,
  Building2,
  Check,
  ClipboardList,
  Factory,
  FolderKanban,
  Globe,
  Hand,
  Home,
  Layers,
  MapPin,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  Wrench,
  X,
} from "lucide-react";
import { EngChrome, EngOverview, type EngTab } from "@/components/eng-overview";
import { ArmyHome } from "@/components/army-home";
import { NavyHome } from "@/components/navy-home";
import {
  engineeringPackage,
  filterByStage,
  opportunities,
  reconstructionThread,
  stages,
  viewCopy,
  wingmanReply,
  type Opportunity,
  type ReconPhase,
  type ReqStatus,
  type Stage,
  type ViewId,
} from "@/lib/gmw-data";
import { MissionPortfolioView, PortfolioView } from "@/components/portfolio";

// three.js and the OpenCascade worker load only when the CAD workspace opens.
const CadWorkspace = lazy(() => import("@/cad/CadWorkspace"));

type ChatMsg = { role: "bot" | "user"; text: string };

const navAltitudes: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "portfolio", label: "Portfolio", icon: Layers },
  { id: "opportunities", label: "Opportunities", icon: Activity },
  { id: "projects", label: "Projects", icon: FolderKanban },
  { id: "engineering", label: "Engineering", icon: Settings },
];

const navSupply: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "capabilities", label: "Global Capabilities", icon: Globe },
  { id: "oib", label: "OIB Opportunity Exchange", icon: Factory },
  { id: "execution", label: "Execution & Fielding", icon: Building2 },
  { id: "gallery", label: "Solution Gallery", icon: ClipboardList },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const armyMission: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "saved", label: "Favorites", icon: Bookmark },
  { id: "analytics", label: "Saved Reports", icon: BarChart3 },
  { id: "projects", label: "Projects", icon: FolderKanban },
];
const armyAviation: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "portfolio", label: "Analytics", icon: Layers },
  { id: "opportunities", label: "Aviation Systems", icon: Activity },
  { id: "oib", label: "Acquisition", icon: Factory },
  { id: "execution", label: "Cost and Readiness", icon: Building2 },
  { id: "gallery", label: "Safety", icon: Shield },
];
const armyPersonal: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "mywork", label: "User Access", icon: ClipboardList },
  { id: "ai", label: "AI Assistant", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
];

const navyMission: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "portfolio", label: "Fleet Overview", icon: Layers },
  { id: "projects", label: "Missions", icon: FolderKanban },
  { id: "opportunities", label: "Aircraft", icon: Activity },
  { id: "engineering", label: "Readiness", icon: Shield },
];
const navyOps: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "oib", label: "Logistics and Supply", icon: Factory },
  { id: "capabilities", label: "Talent and Skills", icon: Globe },
  { id: "execution", label: "Test and Evaluation", icon: Building2 },
  { id: "gallery", label: "Sustainment", icon: Wrench },
  { id: "analytics", label: "Analysis and Reports", icon: BarChart3 },
];
const navyPersonal: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "settings", label: "Settings", icon: Settings },
  { id: "ai", label: "Help and Support", icon: Sparkles },
  { id: "mywork", label: "Contact NAVAIR", icon: ClipboardList },
];

const navPersonal: { id: ViewId; label: string; icon: typeof Home }[] = [
  { id: "mywork", label: "My Work", icon: ClipboardList },
  { id: "saved", label: "Saved Views", icon: Bookmark },
  { id: "ai", label: "AI Wingman", icon: Sparkles },
  { id: "settings", label: "Settings", icon: Settings },
];

const kpis = [
  { n: "248", l: "Active Opportunities", d: "↑ 12%", icon: Activity },
  { n: "72", l: "In Engineering", d: "↑ 8%", icon: Settings },
  { n: "58", l: "Ready to Source", d: "↑ 25%", icon: Shield },
  { n: "96", l: "In Execution", d: "↑ 14%", icon: Wrench },
  { n: "184", l: "Fielded Solutions", d: "↑ 32%", icon: Check },
];

const AIRFRAMES = [
  { id: "C-17", name: "Globemaster III", mission: "Mobility" },
  { id: "C-130", name: "Hercules", mission: "Mobility" },
  { id: "KC-135", name: "Stratotanker", mission: "Mobility" },
  { id: "B-52", name: "Stratofortress", mission: "Bombers" },
  { id: "F-15", name: "Eagle", mission: "Fighters" },
];

function AirframeOpportunities({
  airframe,
  selectedId,
  onAirframe,
  onSelect,
  onEngineer,
}: {
  airframe: string;
  selectedId: string;
  onAirframe: (platform: string) => void;
  onSelect: (id: string) => void;
  onEngineer: () => void;
}) {
  const known = AIRFRAMES.find((item) => item.id === airframe);
  const frame = known ?? { id: airframe, name: "Weapon system", mission: "In scope" };
  const rows = opportunities.filter((item) => item.platform === airframe);
  const selected = rows.find((item) => item.id === selectedId) ?? rows[0];
  const days = rows.reduce((sum, item) => sum + item.impactNum, 0);
  const high = rows.filter((item) => item.priority === "High").length;
  return (
    <div className="port">
      <div className="air-switch">
        {AIRFRAMES.map((item) => (
          <button key={item.id} type="button" className={item.id === airframe ? "on" : ""} onClick={() => onAirframe(item.id)}>
            {item.id}
          </button>
        ))}
      </div>
      <div className="air-head">
        <div>
          <div className="air-kicker">{frame.mission}</div>
          <h2>{frame.id}</h2>
          <p>{frame.name}</p>
        </div>
        <div className="air-stats">
          <div>
            <b>{rows.length}</b>
            <span>Concerns</span>
          </div>
          <div>
            <b>{days.toLocaleString()}</b>
            <span>A/C days</span>
          </div>
          <div>
            <b>{high}</b>
            <span>High priority</span>
          </div>
        </div>
      </div>
      {rows.length === 0 || !selected ? (
        <section className="port-panel">
          <p className="port-note">No fleet concerns are captured for {frame.id} yet.</p>
        </section>
      ) : (
        <div className="deck air-deck">
          <section className="panel">
            <div className="panel-h">
              <h3>{frame.id} CONCERNS</h3>
            </div>
            <div className="table-head">
              <span>Priority</span>
              <span>Part</span>
              <span>Opportunity</span>
              <span>Status</span>
              <span>A/C Days</span>
              <span />
            </div>
            {rows.map((item) => (
              <div
                key={item.id}
                className={item.id === selected.id ? "row selected" : "row"}
                onClick={() => onSelect(item.id)}
              >
                <div className="pri">
                  <i className={`dot ${item.priority.toLowerCase()}`} />
                  {item.priority}
                </div>
                <div>{item.part.split(" ")[0]}</div>
                <div>{item.title}</div>
                <div className="muted">{item.status}</div>
                <div>{item.impactNum.toLocaleString()}</div>
                <div className="chev">›</div>
              </div>
            ))}
          </section>
          <section className="panel">
            <div className="panel-h">
              <h3>SELECTED CONCERN</h3>
              <button className="linkish" onClick={onEngineer}>
                Engineer →
              </button>
            </div>
            <div className="sel-body">
              <div className="part-shot">
                <img src={selected.img} alt={selected.title} />
              </div>
              <div>
                <div className="sel-title">{selected.title}</div>
                <div className="sel-sub">Part No. {selected.part}</div>
                <p className="air-summary">{selected.summary}</p>
              </div>
            </div>
            <div className="metrics">
              <div className="metric">
                <b>{selected.impactNum.toLocaleString()}</b>
                <span>A/C days</span>
              </div>
              <div className="metric">
                <b>{selected.cost}</b>
                <span>Cost avoidance</span>
              </div>
              <div className="metric">
                <b>{selected.lead.split(" ")[0]}</b>
                <span>Current lead time</span>
              </div>
            </div>
          </section>
          <section className="panel">
            <div className="panel-h">
              <h3>WHERE IT CAN BE SOURCED</h3>
            </div>
            {selected.sources.map((source) => (
              <div className="src-row" key={source.loc + source.cap}>
                <img src={source.img} alt="" />
                <div>{source.loc}</div>
                <div className="muted">{source.cap}</div>
                <div>{source.lead}</div>
                <div>{source.cost}</div>
                <div />
              </div>
            ))}
          </section>
        </div>
      )}
    </div>
  );
}

const WINGMEN = [
  { id: "mira", name: "Capt. Mira", role: "Operations Officer", img: "/wingmen/mira.jpg", focus: "the mission picture and the next decision" },
  { id: "mason", name: "Lt. Mason", role: "Engineer", img: "/wingmen/mason.jpg", focus: "the technical package and what is still unproven" },
  { id: "arden", name: "Chief Arden", role: "Mentor", img: "/wingmen/arden.jpg", focus: "what has to be true before we commit" },
  { id: "nova", name: "Nova", role: "Technical Analyst", img: "/wingmen/nova.jpg", focus: "the evidence and the gaps" },
  { id: "echo", name: "Echo", role: "Readiness", img: "/wingmen/echo.jpg", focus: "aircraft-days, lead time, and capacity" },
];

const PERSONAS = [
  ["mobility", "Mobility Directorate", "Airlift and tanker concerns across the directorate", "C-5M Super Galaxy, C-17A Globemaster III, C-130H Hercules, C-130J Super Hercules, KC-46A Pegasus, KC-135R Stratotanker, C-40C Clipper"],
  ["spo", "C-17 SPO Engineer", "One airframe. The engineering thread and the technical package", "C-17A Globemaster III"],
  ["ampo", "AMPO Reviewer", "Qualification, airworthiness, and the packages waiting on review", "C-17A Globemaster III, C-130J Super Hercules, KC-46A Pegasus, KC-135R Stratotanker"],
  ["portfolio", "Portfolio Manager", "Committed work, capacity, and what finishes this fiscal year", "C-5M Super Galaxy, C-17A Globemaster III, C-130J Super Hercules, KC-46A Pegasus, KC-135R Stratotanker, B-52H Stratofortress, F-15E Strike Eagle"],
] as const;

function platformCode(name: string) {
  return name.split(" ")[0].replace(/(\d)[A-Z]$/, "$1");
}

const moreC17: Opportunity[] = [
  ["c17-roller", "Cargo Roller", "CR-17-3310", "D17-3310", "1560-01-000-3310", "Cargo-floor roller with recurring line-replaceable demand."],
  ["c17-latch", "Ramp Latch", "RL-17-2284", "D17-2284", "1560-01-000-2284", "Aft ramp latch. Wear shows up in the locking lug."],
  ["c17-troop", "Troop Door Hinge", "TD-17-4418", "D17-4418", "1560-01-000-4418", "Troop door hinge. Same family as the cargo door bracket."],
  ["c17-fairing", "Flap Track Fairing", "FT-17-5521", "D17-5521", "1560-01-000-5521", "Flap track fairing. Often repaired rather than replaced."],
  ["c17-manifold", "Hydraulic Manifold", "HM-17-6602", "D17-6602", "1650-01-000-6602", "Wing hydraulic manifold. Lead time sits with the casting."],
].map(([id, title, part, afPart, nsn, summary]) => ({
  id,
  priority: "Med" as const,
  platform: "C-17",
  title,
  status: "Engineering",
  stage: "engineer" as const,
  impact: "—",
  impactNum: 0,
  cost: "—",
  lead: "—",
  part,
  afPart,
  nsn,
  img: "/assets/I5FBy.jpg",
  summary,
  sources: [],
}));

const partCatalog = [...opportunities, ...moreC17];

function SettingsConcept() {
  const personas = PERSONAS;
  const sections = [
    ["Mobility", ["C-5M Super Galaxy", "C-17A Globemaster III", "C-130H Hercules", "C-130J Super Hercules", "KC-46A Pegasus", "KC-135R Stratotanker", "C-40C Clipper"]],
    ["Bombers", ["B-52H Stratofortress", "B-1B Lancer", "B-2A Spirit"]],
    ["Fighters", ["F-15E Strike Eagle", "F-22A Raptor", "F-35A Lightning II", "A-10C Thunderbolt II"]],
    ["ISR", ["E-3G Sentry", "RC-135W Rivet Joint", "RQ-4B Global Hawk", "MQ-9A Reaper"]],
  ] as const;
  const [persona, setPersona] = useState<(typeof personas)[number][0]>("mobility");
  useEffect(() => {
    const saved = window.localStorage.getItem("gmw-persona");
    if (saved && personas.some((item) => item[0] === saved)) setPersona(saved as (typeof personas)[number][0]);
  }, [personas]);
  const [ask, setAsk] = useState("B-52H Stratofortress");
  const [sent, setSent] = useState("");
  const [rules, setRules] = useState({ micap: true, gate: true, pool: true, digest: false });
  const current = personas.find((item) => item[0] === persona) ?? personas[0];
  const members = current[3].split(", ");
  return (
    <div className="set-page">
      <header className="set-head">
        <h2>SETTINGS</h2>
        <p>Who is signed in, which persona he is working, and what may reach the bell.</p>
      </header>
      <section className="set-panel">
        <h3>IDENTITY</h3>
        <div className="set-id">
          <div className="avatar">JD</div>
          <div>
            <strong>Gen. John Duselis</strong>
            <span>AFLCMC / RSO</span>
            <span>MAJCOM · AFMC</span>
            <em>Last logon: 28 Sep 2026, 07:14 CDT</em>
          </div>
        </div>
        <div className="set-banner">UNCLASSIFIED — sample data</div>
      </section>
      <section className="set-panel">
        <div className="set-split">
          <div>
            <div className="set-mem-head">
              <h3>CURRENT MEMBERSHIP</h3>
              <button type="button" className="set-send" onClick={() => setSent(ask)}>
                Request Additional Access
              </button>
            </div>
            {sent ? <p className="set-sent">Request sent for {sent}.</p> : null}
            <div className="set-persona on">
              <strong>{current[1]}</strong>
              <em>{current[2]}</em>
              {sections.map(([section, frames]) => {
                const mine = frames.filter((frame) => members.includes(frame));
                if (!mine.length) return null;
                return (
                  <div key={section} className="set-air-sec">
                    <b>{section}</b>
                    <span className="set-member-chips">
                      {mine.map((frame) => (
                        <i key={frame}>{frame}</i>
                      ))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="set-ask">
            <h3>OTHER ROLES</h3>
            {personas
              .filter((item) => item[0] !== persona)
              .map(([id, name, note]) => (
                <button
                  key={id}
                  type="button"
                  className="set-persona"
                  onClick={() => {
                    setPersona(id);
                    window.localStorage.setItem("gmw-persona", id);
                    setSent("");
                  }}
                >
                  <strong>{name}</strong>
                  <em>{note}</em>
                </button>
              ))}
          </div>
          <div className="set-ask">
            <h3>OTHER AIRFRAMES</h3>
            <p>Ask for an airframe outside this persona.</p>
            {sections.map(([section, frames]) => {
              const open = frames.filter((frame) => !members.includes(frame));
              if (!open.length) return null;
              return (
                <div key={section} className="set-air-sec">
                  <b>{section}</b>
                  <div className="set-chips">
                    {open.map((frame) => (
                      <button key={frame} type="button" className={ask === frame ? "on" : ""} onClick={() => setAsk(frame)}>
                        {frame}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="set-panel">
        <h3>NOTIFICATION RULES</h3>
        <p>Only exceptions. A digest does not belong on the bell.</p>
        {(
          [
            ["micap", "MICAP or aircraft-down", "A concern in this persona just got worse"],
            ["gate", "A gate waiting on him", "Requirements, qualification, or airworthiness"],
            ["pool", "A pool over its limit", "NDT/CT, heat treat, metrology"],
            ["digest", "Daily digest", "Stays off"],
          ] as const
        ).map(([id, title, note]) => (
          <button key={id} type="button" className="set-rule" onClick={() => setRules((current) => ({ ...current, [id]: !current[id] }))}>
            <span>
              <strong>{title}</strong>
              <em>{note}</em>
            </span>
            <i className={rules[id] ? "set-switch on" : "set-switch"} />
          </button>
        ))}
      </section>
    </div>
  );
}

type ProjectContract = {
  name: string;
  artifacts: string[];
  qty: string;
  need: string;
};

const PACKAGE_ARTIFACTS: Record<string, string[]> = {
  cad: ["3D CAD model"],
  II: ["Validated requirements", "Verified 3D CAD model", "Technical spec", "BOM"],
  III: [
    "Validated requirements",
    "Verified 3D CAD model",
    "Technical spec",
    "BOM",
    "Test reports / evidence",
    "Manufacturing pkg",
    "Airworthiness compliance pkg",
  ],
};

const CUSTOM_ARTIFACTS = [
  ["req", "Validated requirements"],
  ["cad", "Verified 3D CAD model"],
  ["spec", "Technical spec"],
  ["bom", "BOM"],
  ["test", "Test reports / evidence"],
  ["mfg", "Manufacturing pkg"],
  ["air", "Airworthiness compliance pkg"],
] as const;

function requestTitle(help: string) {
  if (help === "redesign") return "Redesign";
  if (help === "transform") return "Digital Transformation";
  if (help === "alternatives") return "Alternatives";
  if (help === "production") return "Production";
  return "New Part";
}

function showNeed(value: string) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${month}/${day}/${year}`;
}

export function Workbench() {
  const [service, setService] = useState<"airforce" | "army" | "navy">("army");
  const [view, setView] = useState<ViewId>("home");
  const [reconPhase, setReconPhase] = useState<ReconPhase>("requirements");
  const [stage, setStage] = useState<Stage>("match");
  const [selectedId, setSelectedId] = useState(opportunities[0].id);
  const [contract, setContract] = useState<ProjectContract | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [wingId, setWingId] = useState("mira");
  const [picker, setPicker] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [custom, setCustom] = useState<{ id: string; name: string; role: string; img: string; focus: string } | null>(null);
  const [draftPhoto, setDraftPhoto] = useState("");
  const [avatarName, setAvatarName] = useState("");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [modal, setModal] = useState(false);
  const [cmdk, setCmdk] = useState(false);
  const [query, setQuery] = useState("");
  const [navOpen, setNavOpen] = useState(false);
  const [rail, setRail] = useState(false);
  const [toast, setToast] = useState("");
  const [notesOpen, setNotesOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackReview, setFeedbackReview] = useState(false);
  const [feedbackZoom, setFeedbackZoom] = useState("");
  const [feedbackDraft, setFeedbackDraft] = useState("");
  const [feedbackClips, setFeedbackClips] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ id: string; text: string; where: string; at: string; clips?: string[] }[]>([]);
  const [notices, setNotices] = useState([
    { id: "gate", object: "C-17 Door Hinge Bracket", exception: "Requirements ready to accept", action: "Accept", tone: "gate" },
    { id: "pool", object: "NDT / CT scanning", exception: "Pool at 184% · slips the hinge", action: "Review", tone: "pool" },
    { id: "micap", object: "C-17 Door Hinge Bracket", exception: "MICAP escalation", action: "Open", tone: "micap" },
  ]);
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      role: "bot",
      text: "Wingman online. I can work the selected opportunity — source-of-repair trades, qualification gaps, and aircraft-days recovered.",
    },
  ]);
  const [draft, setDraft] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const panDrag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const cmdkRef = useRef<HTMLInputElement>(null);

  const selected = opportunities.find((o) => o.id === selectedId) ?? opportunities[0];
  const [platformFocus, setPlatformFocus] = useState<string | null>(null);
  const [airframe, setAirframe] = useState("C-17");
  const rows = useMemo(() => {
    const staged = filterByStage(stage);
    return platformFocus ? staged.filter((item) => item.platform === platformFocus) : staged;
  }, [stage, platformFocus]);
  const hits = opportunities.filter((o) =>
    `${o.platform} ${o.title} ${o.status}`.toLowerCase().includes(query.toLowerCase()),
  );

  function ping(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(""), 2200);
  }

  function toggleRail() {
    setRail((value) => {
      window.localStorage.setItem("gmw-rail", value ? "0" : "1");
      return !value;
    });
  }

  useEffect(() => {
    if (window.localStorage.getItem("gmw-rail") === "1") setRail(true);
    const saved = window.localStorage.getItem("gmw-service");
    if (saved === "airforce" || saved === "army" || saved === "navy") setService(saved);
  }, []);

  function chooseService(next: "airforce" | "army" | "navy") {
    setService(next);
    window.localStorage.setItem("gmw-service", next);
    setView("home");
  }

  function go(id: ViewId) {
    setNavOpen(false);
    if (id === "ai") {
      setView("home");
      setDrawer(true);
      return;
    }
    if (id === "requirements") {
      setReconPhase("requirements");
      setView("engineering");
      return;
    }
    if (id === "home") {
      setPlatformFocus(null);
      setView("home");
      return;
    }
    if (id === "opportunities") {
      setView("opportunities");
      return;
    }
    setView(id);
  }

  function pick(o: Opportunity) {
    setSelectedId(o.id);
    setAirframe(o.platform);
    setCmdk(false);
    setQuery("");
    setNavOpen(false);
    if (o.status === "Engineering") {
      setReconPhase("requirements");
      setView("engineering");
    } else {
      setView("opportunities");
    }
    ping(`${o.platform} ${o.title}`);
  }

  function sendFeedback() {
    const text = feedbackDraft.trim();
    if (!text && feedbackClips.length === 0) return;
    const note = {
      id: String(Date.now()),
      text,
      clips: feedbackClips,
      where: `${view} · ${selected.platform} ${selected.title} · v0.26.10.04.2`,
      at: new Date().toLocaleString("en-US", { day: "2-digit", month: "short", year: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" }),
    };
    const next = [note, ...feedback];
    setFeedback(next);
    setFeedbackDraft("");
    setFeedbackClips([]);
    try {
      window.localStorage.setItem("gmw-feedback", JSON.stringify(next));
    } catch {
      ping("The list is full. Remove an older note.");
    }
  }

  function shrinkClip(file: File) {
    return new Promise<string>((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 960 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject();
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject();
      };
      img.src = url;
    });
  }

  async function addClips(files: File[]) {
    const room = 2 - feedbackClips.length;
    if (room <= 0) {
      ping("Two clippings is enough.");
      return;
    }
    const next: string[] = [];
    for (const file of files.slice(0, room)) {
      try {
        next.push(await shrinkClip(file));
      } catch {
        ping("That clipping could not be read.");
      }
    }
    if (files.length > room) ping("Two clippings is enough.");
    if (next.length) setFeedbackClips((current) => [...current, ...next].slice(0, 2));
  }

  function ask(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = wingmanReply(trimmed, selected);
    setChat((c) => [...c, { role: "user", text: trimmed }, { role: "bot", text: reply }]);
    setDraft("");
    setDrawer(true);
  }

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight });
  }, [chat, drawer]);

  useEffect(() => {
    if (cmdk) cmdkRef.current?.focus();
  }, [cmdk]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA") {
        e.preventDefault();
        setCmdk(true);
      }
      if (e.key === "Escape") {
        setCmdk(false);
        setDrawer(false);
        setModal(false);
        setNavOpen(false);
        setNotesOpen(false);
        setFeedbackOpen(false);
        setFeedbackReview(false);
        setFeedbackZoom("");
        setAvatarOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const onDuty = window.localStorage.getItem("gmw-wingman-on-duty");
    if (onDuty) setWingId(onDuty);
    const raw = window.localStorage.getItem("gmw-wingman");
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { id: string; name: string; role: string; img: string; focus: string };
      if (saved.img && saved.name) {
        if (saved.name === "Your Wingman") saved.name = "Barkely";
        saved.role = "My Wingman";
        setCustom(saved);
        window.localStorage.setItem("gmw-wingman", JSON.stringify(saved));
      }
    } catch {
      /* a bad save should not block the console */
    }
  }, []);

  useEffect(() => {
    const raw = window.localStorage.getItem("gmw-feedback");
    if (!raw) return;
    try {
      const saved = JSON.parse(raw) as { id: string; text: string; where: string; at: string; clips?: string[] }[];
      if (Array.isArray(saved)) setFeedback(saved);
    } catch {
      /* a bad save should not block the console */
    }
  }, []);

  useEffect(() => {
    if (!feedbackOpen) return;
    function onPaste(event: ClipboardEvent) {
      const images = Array.from(event.clipboardData?.items ?? [])
        .filter((item) => item.type.startsWith("image/"))
        .map((item) => item.getAsFile())
        .filter((file): file is File => Boolean(file));
      if (!images.length) return;
      event.preventDefault();
      void addClips(images);
    }
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [feedbackOpen, feedbackClips.length]);

  function chooseWing(id: string) {
    setWingId(id);
    window.localStorage.setItem("gmw-wingman-on-duty", id);
  }

  function takePhoto(file: File | undefined) {
    if (!file) return;
    const ok = file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/webp";
    if (!ok) {
      ping("Use a JPG, PNG, or WEBP.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      ping("That photo is over 8 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setDraftPhoto(String(reader.result));
      setZoom(1);
      setPan({ x: 0, y: 0 });
    };
    reader.readAsDataURL(file);
  }

  function saveAvatar() {
    if (!draftPhoto) return;
    const image = new Image();
    image.onload = () => {
      const size = 512;
      const frame = 220;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const cover = Math.max(size / image.width, size / image.height);
      const drawW = image.width * cover * zoom;
      const drawH = image.height * cover * zoom;
      ctx.drawImage(
        image,
        (size - drawW) / 2 + pan.x * (size / frame),
        (size - drawH) / 2 + pan.y * (size / frame),
        drawW,
        drawH,
      );
      const next = {
        id: "yours",
        name: avatarName.trim() || "Barkely",
        role: "My Wingman",
        img: canvas.toDataURL("image/jpeg", 0.86),
        focus: "the question you ask",
      };
      setCustom(next);
      chooseWing(next.id);
      setPicker(false);
      setAvatarOpen(false);
      window.localStorage.setItem("gmw-wingman", JSON.stringify(next));
    };
    image.src = draftPhoto;
  }

  const module =
    view !== "home" && view !== "opportunities" && view !== "ai" && view !== "portfolio"
      ? viewCopy[view]
      : null;

  return (
    <div className={["app", service === "airforce" ? "" : `service-${service}`, navOpen ? "nav-open" : "", rail ? "rail" : ""].filter(Boolean).join(" ")}>
      <button className="nav-scrim" aria-label="Close menu" onClick={() => setNavOpen(false)} />
      <aside className="sidebar">
        <div className="brand">
          {service === "army" ? (
            <div className="army-mark">
              <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
                <path fill="#e2b657" d="M16 2 19.5 12.2 30 13.2 22 19.4 24.6 30 16 24.2 7.4 30 10 19.4 2 13.2 12.5 12.2Z" />
              </svg>
              <div>
                <b>U.S. ARMY</b>
                <span>DEVCOM AvMC</span>
              </div>
            </div>
          ) : service === "navy" ? (
            <div className="navy-mark">
              <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
                <circle cx="16" cy="16" r="14" fill="none" stroke="#f2d27a" strokeWidth="1.4" />
                <path fill="#f2d27a" d="M15 6h2v8.2l4.2 2.4-1 1.7L16 16.2 11.8 18.3l-1-1.7L15 14.2V6z" />
                <path fill="#f2d27a" d="M9 21h14v2H9zM11 24h10v1.6H11z" />
              </svg>
              <div>
                <b>U.S. NAVY</b>
                <span>NAVAIR</span>
              </div>
            </div>
          ) : (
            <img className="usaf-brand" src="/usaf-lockup.png" alt="U.S. Air Force" />
          )}
          <button className="rail-toggle" type="button" onClick={toggleRail} aria-label={rail ? "Expand navigation" : "Collapse navigation"} title={rail ? "Expand navigation" : "Collapse navigation"}>
            {rail ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>
        </div>
        <div className="nav-label">{service === "army" ? "AVIATION" : service === "navy" ? "FLEET" : "MISSION"}</div>
        <nav className="nav-list">
          {(service === "army" ? armyMission : service === "navy" ? navyMission : navAltitudes).map((item) => (
            <button
              key={item.id}
              className={
                view === item.id ? "nav-item active" : "nav-item"
              }
              title={item.label}
              onClick={() => go(item.id)}
            >
              <item.icon />
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="nav-label">{service === "army" ? "ENTERPRISE" : service === "navy" ? "READINESS" : "SUPPLY CHAIN"}</div>
        <nav className="nav-list">
          {(service === "army" ? armyAviation : service === "navy" ? navyOps : navSupply).map((item) => (
            <button
              key={item.id}
              className={view === item.id ? "nav-item active" : "nav-item"}
              title={item.label}
              onClick={() => go(item.id)}
            >
              <item.icon />
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="nav-label">PERSONAL</div>
        <nav className="nav-list">
          {(service === "army" ? armyPersonal : service === "navy" ? navyPersonal : navPersonal).map((item) => (
            <button
              key={item.id}
              className={view === item.id || (item.id === "ai" && drawer) ? "nav-item active" : "nav-item"}
              title={item.label}
              onClick={() => go(item.id)}
            >
              <item.icon />
              <span className="nav-text">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <button type="button" className="feedback-open" onClick={() => setFeedbackOpen((open) => !open)}>
            <Hand size={16} />
            <span>Feedback</span>
          </button>
          {feedbackOpen ? (
            <div className="feedback-panel">
              <div className="feedback-h">
                <h3>FEEDBACK</h3>
                <button type="button" className="icon-btn" aria-label="Close feedback" onClick={() => setFeedbackOpen(false)}>
                  <X size={14} />
                </button>
              </div>
              <textarea
                value={feedbackDraft}
                onChange={(event) => setFeedbackDraft(event.target.value)}
                placeholder="What should change? Paste a clipping."
              />
              {feedbackClips.length ? (
                <div className="feedback-clips">
                  {feedbackClips.map((src, index) => (
                    <button key={src.slice(-24)} type="button" onClick={() => setFeedbackClips((current) => current.filter((_, item) => item !== index))}>
                      <img src={src} alt="" />
                    </button>
                  ))}
                </div>
              ) : null}
              <button type="button" className="set-send" disabled={!feedbackDraft.trim() && feedbackClips.length === 0} onClick={sendFeedback}>
                Send
              </button>
              <button
                type="button"
                className="review-link"
                onClick={() => {
                  setFeedbackOpen(false);
                  setFeedbackReview(true);
                }}
              >
                Review Feedback
              </button>
            </div>
          ) : null}
          {service === "army" ? (
            <div className="army-foot">DEVCOM Aviation</div>
          ) : service === "navy" ? (
            <div className="navy-foot">NAVAIR</div>
          ) : (
            <img className="rso-lockup" src="/rso-lockup.png" alt="Powered by Rapid Sustainment Office" />
          )}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mob-toggle" aria-label="Open menu" onClick={() => setNavOpen(true)}>
            <Menu size={16} />
          </button>
          <div className="title-block">
            <div>
              <h1>{service === "army" ? "DEVCOM AVIATION WORKBENCH" : service === "navy" ? "NAVAIR MISSION WORKBENCH" : "GLOBAL MISSION WORKBENCH"} <span className="title-ver">v0.26.10.04.2</span></h1>
              <p>{service === "army" ? "People, platforms, and data. A more ready force." : service === "navy" ? "People, platforms, readiness, mission impact." : "From sustainment challenges to fielded capabilities"}</p>
            </div>
          </div>
          <label className="search">
            <Search size={15} />
            <input
              readOnly
              placeholder="Search parts, projects, requirements, capabilities, or ask AI…"
              onClick={() => setCmdk(true)}
              onFocus={() => setCmdk(true)}
            />
          </label>
          <div className="top-actions">
            <button className="btn-ai" onClick={() => { setPicker(false); setDrawer(true); }}>
              <Sparkles size={14} /> <span>{service === "army" ? "Ask an AI assistant" : service === "navy" ? "Plan a mission" : "Ask your Wingman"}</span>
            </button>
            <div className="svc-switch" role="group" aria-label="Signed-in service">
              <button type="button" className={service === "airforce" ? "on" : ""} onClick={() => chooseService("airforce")}>Air Force</button>
              <button type="button" className={service === "army" ? "on" : ""} onClick={() => chooseService("army")}>Army</button>
              <button type="button" className={service === "navy" ? "on" : ""} onClick={() => chooseService("navy")}>Navy</button>
            </div>
            <div className="logon-note">
              <span className="welcome">Welcome back!</span>
              <span className="last-logon">Last logon: 28 Sep 2026, 07:14 CDT</span>
            </div>
            <div className="user">
              <div className="avatar">{service === "army" ? "DR" : service === "navy" ? "AP" : "JD"}</div>
              <div className="user-meta">
                <strong>{service === "army" ? "COL Dana Reeves" : service === "navy" ? "CAPT Avery Park" : "Gen. John Duselis"}</strong>
                <span>{service === "army" ? "DEVCOM AvMC" : service === "navy" ? "NAVAIR" : "AFLCMC / RSO"}</span>
              </div>
            </div>
            <div className={notesOpen ? "bell-wrap open" : "bell-wrap"}>
              {notesOpen && <button className="note-scrim" aria-label="Close decisions" onClick={() => setNotesOpen(false)} />}
              <button
                className="icon-btn top-bell"
                title="Decisions"
                aria-expanded={notesOpen}
                onClick={() => setNotesOpen((open) => !open)}
              >
                <Bell size={20} />
                {notices.length > 0 && <span className="badge-count">{notices.length}</span>}
              </button>
              {notesOpen && (
                <div className="note-panel" role="dialog" aria-label="Decisions">
                  <header>
                    <h3>DECISIONS</h3>
                    <span>{notices.length} open</span>
                  </header>
                  {notices.length === 0 ? (
                    <p className="note-empty">Nothing is waiting on you.</p>
                  ) : (
                    notices.map((note) => (
                      <button
                        key={note.id}
                        type="button"
                        className={`note ${note.tone}`}
                        onClick={() => {
                          setNotices((list) => list.filter((item) => item.id !== note.id));
                          setNotesOpen(false);
                          if (note.id === "pool") {
                            setView("projects");
                            return;
                          }
                          setSelectedId("opp-c17-hinge");
                          setAirframe("C-17");
                          if (note.id === "gate") {
                            setReconPhase("requirements");
                            setView("engineering");
                            return;
                          }
                          setView("opportunities");
                        }}
                      >
                        <strong>{note.object}</strong>
                        <b>{note.action}</b>
                        <em>{note.exception}</em>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {view === "home" && service === "airforce" ? <PulseBar /> : null}
        {view === "engineering" || view === "projects" || view === "portfolio" || view === "opportunities" || view === "settings" || (view === "home" && service !== "airforce") ? null : (
        <section className="kpis">
          {kpis.map((k) => (
            <div className="kpi" key={k.l}>
              <div className="kpi-icon">
                <k.icon />
              </div>
              <div>
                <b>{k.n}</b>
                <div className="lbl">{k.l}</div>
              </div>
              <div className="delta">{k.d}</div>
            </div>
          ))}
        </section>
        )}

        <div className="workspace">
          {view === "engineering" ? (
            <EngineeringView
              key={selected.id}
              selected={selected}
              phase={reconPhase}
              contract={contract}
              onContract={setContract}
              onPhase={setReconPhase}
              onHome={() => go("projects")}
              onPing={ping}
            />
          ) : view === "projects" ? (
            <PortfolioView
              onOpen={(id, title, phase) => {
                setSelectedId(id);
                setReconPhase(phase);
                setView("engineering");
                ping(`Opened ${title} in Engineering`);
              }}
              onPending={(code) => ping(`${code} is in the portfolio. Its engineering thread is not baselined yet.`)}
              onAsk={ask}
            />
          ) : view === "portfolio" ? (
            <MissionPortfolioView
              onProjects={() => go("projects")}
              onPlatform={(platform) => {
                setAirframe(platform);
                setView("opportunities");
                const first = opportunities.find((item) => item.platform === platform);
                if (first) setSelectedId(first.id);
                ping(`${platform} fleet concerns`);
              }}
            />
          ) : view === "opportunities" ? (
            <AirframeOpportunities
              airframe={airframe}
              selectedId={selected.id}
              onAirframe={(platform) => {
                setAirframe(platform);
                const first = opportunities.find((item) => item.platform === platform);
                if (first) setSelectedId(first.id);
              }}
              onSelect={setSelectedId}
              onEngineer={() => go("engineering")}
            />
          ) : view === "settings" ? (
            <SettingsConcept />
          ) : module ? (
            <section className="view active">
              <div className="placeholder-view">
                <h2>{module.title}</h2>
                <p>{module.body}</p>
                <div className="card-grid">
                  {module.cards.map(([h, p]) => (
                    <div className="mini-card" key={h}>
                      <h4>{h}</h4>
                      <p>{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : service === "army" ? (
            <ArmyHome onProject={() => go("engineering")} />
          ) : service === "navy" ? (
            <NavyHome onProject={() => go("engineering")} />
          ) : (
            <section className="view active">
              <Hero
                onStart={(next, partId) => {
                  if (partId && opportunities.some((item) => item.id === partId)) setSelectedId(partId);
                  setContract(next);
                  setReconPhase("requirements");
                  go("engineering");
                }}
              />
              <div className="pipeline">
                {stages.map((s) => (
                  <button
                    key={s.id}
                    className={stage === s.id ? "pipe active" : "pipe"}
                    data-step={s.id}
                    onClick={() => setStage(s.id)}
                  >
                    <span className="num">{s.num}</span>
                    <span className="cap">{s.cap}</span>
                  </button>
                ))}
              </div>
              <div className="deck">
                <section className="panel">
                  <div className="panel-h">
                    <h3>{platformFocus ? `${platformFocus} CONCERNS` : "ACTIVE OPPORTUNITIES"}</h3>
                    <button className="linkish" onClick={() => go("opportunities")}>
                      View All →
                    </button>
                  </div>
                  <div className="table-head">
                    <span>Priority</span>
                    <span>Platform</span>
                    <span>Opportunity</span>
                    <span>Status</span>
                    <span>Est. Readiness Impact</span>
                    <span />
                  </div>
                  {rows.length === 0 ? (
                    <div className="muted empty-row">No opportunities in this stage.</div>
                  ) : (
                    rows.map((o) => (
                      <div
                        key={o.id}
                        className={o.id === selected.id ? "row selected" : "row"}
                        onClick={() => pick(o)}
                      >
                        <div className="pri">
                          <i className={`dot ${o.priority.toLowerCase()}`} />
                          {o.priority}
                        </div>
                        <div>{o.platform}</div>
                        <div>{o.title}</div>
                        <div className="muted">{o.status}</div>
                        <div>{o.impact}</div>
                        <div className="chev">›</div>
                      </div>
                    ))
                  )}
                </section>

                <section className="panel">
                  <div className="panel-h">
                    <h3>SELECTED OPPORTUNITY</h3>
                    <div className="panel-links">
                      <button className="linkish" onClick={() => go("engineering")}>
                        Engineer →
                      </button>
                    </div>
                  </div>
                  <div className="sel-body">
                    <div className="part-shot">
                      <img src={selected.img} alt={selected.title} />
                    </div>
                    <div className="sel-copy">
                      <div>
                        <div className="sel-title">
                          {selected.platform} {selected.title}
                        </div>
                        <div className="sel-sub">Part No. {selected.part}</div>
                        <button className="linkish sel-details" onClick={() => setModal(true)}>
                          View Details →
                        </button>
                      </div>
                      <div className="pill">● {selected.status.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="metrics">
                    <div className="metric">
                      <b>{selected.impactNum.toLocaleString()}</b>
                      <span>Projected A/C Days Saved</span>
                    </div>
                    <div className="metric">
                      <b>{selected.cost}</b>
                      <span>Est. Cost Avoidance</span>
                    </div>
                    <div className="metric">
                      <b>{selected.lead.split(" ")[0]}</b>
                      <span>Current Lead Time</span>
                    </div>
                  </div>
                  <div className="actions">
                    <button
                      className="action"
                      onClick={() => {
                        setModal(true);
                        ping(`Digital thread opened for ${selected.part}`);
                      }}
                    >
                      <ClipboardList size={14} /> View Digital Thread
                    </button>
                    <button className="action" onClick={() => ask("Analyze alternatives for the selected part")}>
                      <Settings size={14} /> Analyze Alternatives
                    </button>
                    <button
                      className="action"
                      onClick={() => {
                        setPortfolio((p) => (p.includes(selected.id) ? p : [...p, selected.id]));
                        const next = portfolio.includes(selected.id) ? portfolio.length : portfolio.length + 1;
                        ping(`Added ${selected.title} to portfolio (${next})`);
                      }}
                    >
                      <FolderKanban size={14} /> Add to Portfolio
                    </button>
                  </div>
                </section>

                <section className="panel">
                  <div className="panel-h">
                    <h3>GLOBAL SOURCING OPTIONS</h3>
                    <button className="linkish" onClick={() => go("capabilities")}>
                      View All →
                    </button>
                  </div>
                  <div className="src-head">
                    <span>Src</span>
                    <span>Location</span>
                    <span>Capability</span>
                    <span>Est. Lead Time</span>
                    <span>Est. Cost</span>
                    <span />
                  </div>
                  {selected.sources.map((s) => (
                    <div
                      className="src-row"
                      key={s.loc + s.cap}
                      onClick={() => ping(`${s.loc} · ${s.cap} · ${s.lead} / ${s.cost}`)}
                    >
                      <img src={s.img} alt="" />
                      <div>{s.loc}</div>
                      <div className="muted">{s.cap}</div>
                      <div>{s.lead}</div>
                      <div>{s.cost}</div>
                      <div className="chev">›</div>
                    </div>
                  ))}
                </section>
              </div>
            </section>
          )}
        </div>
      </main>

      <button type="button" className={feedbackReview ? "review-scrim open" : "review-scrim"} aria-label="Close feedback" onClick={() => setFeedbackReview(false)} />
      <aside className={feedbackReview ? "review-drawer open" : "review-drawer"}>
        <header className="review-h">
          <div>
            <h3>FEEDBACK</h3>
            <p>{feedback.length} {feedback.length === 1 ? "note" : "notes"}, newest first</p>
          </div>
          <button type="button" className="icon-btn" aria-label="Close feedback" onClick={() => setFeedbackReview(false)}>
            <X size={16} />
          </button>
        </header>
        <div className="review-list">
          {feedback.length === 0 ? <p className="review-empty">No notes yet.</p> : null}
          {[...feedback].sort((a, b) => Number(b.id) - Number(a.id)).map((note) => (
            <article key={note.id} className="review-note">
              <time>{note.at}</time>
              {note.text ? <p>{note.text}</p> : null}
              {note.clips?.length ? (
                <div className="review-clips">
                  {note.clips.map((src) => (
                    <button key={src.slice(-32)} type="button" onClick={() => setFeedbackZoom(src)}>
                      <img src={src} alt="Feedback clipping" />
                    </button>
                  ))}
                </div>
              ) : null}
              <span>{note.where}</span>
            </article>
          ))}
        </div>
      </aside>
      {feedbackZoom ? (
        <button type="button" className="clip-zoom" aria-label="Close clipping" onClick={() => setFeedbackZoom("")}>
          <img src={feedbackZoom} alt="Feedback clipping, full size" />
        </button>
      ) : null}

      <div className={drawer ? "drawer-backdrop open" : "drawer-backdrop"} onClick={() => { setDrawer(false); setAvatarOpen(false); }} />
      <aside className={drawer ? "drawer open" : "drawer"}>
        {(() => {
          const roster = custom ? [...WINGMEN, custom] : WINGMEN;
          const wing = roster.find((item) => item.id === wingId) ?? roster[0];
          const best = selected.sources[0];
          const spoken = [...chat].reverse().find((item) => item.role === "bot");
          return (
            <>
              <div className="drawer-h">
                <div className="wing-id">
                  <img className="wing-face" src={wing.img} alt="" />
                  <div>
                    <h3>{wing.name}</h3>
                    <p>
                      <i className="wing-online" /> {wing.role}
                    </p>
                  </div>
                </div>
                <div className="wing-tools">
                  <button type="button" className="wing-change" onClick={() => setPicker((open) => !open)}>
                    {picker ? "Back" : "Change"}
                  </button>
                  <button className="icon-btn" aria-label="Close wingman" onClick={() => { setDrawer(false); setAvatarOpen(false); }}>
                    <X size={16} />
                  </button>
                </div>
              </div>
              {picker ? (
                <div className="persona-grid">
                  <p>Different perspectives. Same mission.</p>
                  {roster.map((person) => (
                    <button
                      key={person.id}
                      type="button"
                      className={person.id === wing.id ? "persona on" : "persona"}
                      onClick={() => {
                        chooseWing(person.id);
                        setPicker(false);
                      }}
                    >
                      <img src={person.img} alt="" />
                      <span className="persona-copy">
                        <strong>{person.name}</strong>
                        <em>{person.role}</em>
                        <span>{person.focus}</span>
                      </span>
                      <b>{person.id === wing.id ? "On duty" : "Select"}</b>
                    </button>
                  ))}
                  <button type="button" className="persona create" onClick={() => setAvatarOpen(true)}>
                    <span className="create-mark">+</span>
                    <span className="persona-copy">
                      <strong>Create your own</strong>
                      <em>Your wingman</em>
                      <span>Upload a photo and make it yours</span>
                    </span>
                    <b>Create</b>
                  </button>
                </div>
              ) : (
                <>
                  <div className="chat" ref={chatRef}>
                    {spoken && (
                      <div className="speech">
                        <img src={wing.img} alt="" />
                        <p>{spoken.text}</p>
                      </div>
                    )}
                    <div className="wing-actions">
                      {[
                        ["Summarize where this stands", `Summarize ${selected.platform} ${selected.title}`],
                        ["Identify missing evidence", "What qualification is still open?"],
                        ["Compare manufacturing options", "Trade the sources of repair"],
                        ["Estimate aircraft-days", "Aircraft-days this recovers"],
                      ].map(([label, prompt]) => (
                        <button key={label} type="button" onClick={() => ask(prompt)}>
                          {label}
                        </button>
                      ))}
                    </div>
                    <div className="insight">
                      <strong>{wing.name.split(" ").slice(-1)[0]}'s insight</strong>
                      <p>
                        {selected.summary} {best.loc} can take {best.cap.toLowerCase()} in {best.lead} at {best.cost}.{" "}
                        {wing.name.split(" ").slice(-1)[0]} is watching {wing.focus}.
                      </p>
                    </div>
                    <ol className="wing-next">
                      <li>
                        <button type="button" onClick={() => { setReconPhase("requirements"); setView("engineering"); setDrawer(false); setAvatarOpen(false); }}>
                          Open the engineering thread
                        </button>
                      </li>
                      <li>
                        <button type="button" onClick={() => ask("Trade the sources of repair")}>
                          Compare cost and lead time
                        </button>
                      </li>
                      <li>
                        <button type="button" onClick={() => ask("What qualification is still open?")}>
                          Review airworthiness gaps
                        </button>
                      </li>
                    </ol>
                    {chat.filter((item) => item !== spoken).map((item, index) => (
                      <div key={index} className={item.role === "bot" ? "msg bot" : "msg user"}>
                        <span className="msg-kicker">{item.role === "bot" ? wing.name.split(" ").slice(-1)[0] : "You"}</span>
                        {item.text}
                      </div>
                    ))}
                  </div>
                  <form
                    className="drawer-input"
                    onSubmit={(e) => {
                      e.preventDefault();
                      ask(draft);
                    }}
                  >
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder={`Ask ${wing.name.split(" ").slice(-1)[0]} about the ${selected.title.toLowerCase()}…`}
                    />
                    <button type="submit" aria-label="Send">
                      <Sparkles size={16} />
                    </button>
                  </form>
                </>
              )}
            </>
          );
        })()}
      </aside>

      <aside className={avatarOpen && drawer ? "avatar-drawer open" : "avatar-drawer"} aria-hidden={!(avatarOpen && drawer)}>
        <div className="drawer-h">
          <div>
            <h3>CREATE YOUR WINGMAN</h3>
            <p>A clear photo of your face.</p>
          </div>
          <button className="icon-btn" aria-label="Close avatar" onClick={() => setAvatarOpen(false)}>
            <X size={16} />
          </button>
        </div>
        <div className="avatar-body">
          <div className="avatar-step">
            <b>1</b> Upload a photo
          </div>
          <div className="upload-stack">
            <div className="upload upload-lg">
              <strong>{draftPhoto ? "Replace photo" : "Drag and drop a photo here"}</strong>
              <p>or browse to upload</p>
              <span className="upload-browse">Browse files</span>
              <p className="upload-note">JPG, PNG, or WEBP. One face, facing the camera. Under 8 MB.</p>
            </div>
            <input
              className="upload-input"
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              aria-label="Upload a wingman photo"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                event.stopPropagation();
                takePhoto(event.dataTransfer.files?.[0]);
              }}
              onChange={(event) => {
                takePhoto(event.target.files?.[0]);
                event.target.value = "";
              }}
            />
          </div>
          <div className="avatar-step">
            <b>2</b> Crop and position
          </div>
          <div
            className="crop-frame"
            style={{ "--x": `${pan.x}px`, "--y": `${pan.y}px`, "--z": String(zoom) } as CSSProperties}
            onPointerDown={(event) => {
              if (!draftPhoto) return;
              panDrag.current = { x: event.clientX, y: event.clientY, ox: pan.x, oy: pan.y };
              event.currentTarget.setPointerCapture(event.pointerId);
            }}
            onPointerMove={(event) => {
              const start = panDrag.current;
              if (!start) return;
              setPan({ x: start.ox + event.clientX - start.x, y: start.oy + event.clientY - start.y });
            }}
            onPointerUp={() => {
              panDrag.current = null;
            }}
          >
            {draftPhoto ? <img src={draftPhoto} alt="" /> : <span>No photo yet</span>}
          </div>
          <label className="zoom-row">
            <span>−</span>
            <input type="range" min={1} max={2.4} step={0.02} value={zoom} onChange={(event) => setZoom(Number(event.target.value))} />
            <span>+</span>
          </label>
          <div className="avatar-step">
            <b>3</b> Save as your Wingman
          </div>
          <input
            className="avatar-name"
            value={avatarName}
            onChange={(event) => setAvatarName(event.target.value)}
            placeholder="Barkely"
          />
          <button type="button" className="avatar-save" disabled={!draftPhoto} onClick={saveAvatar}>
            Save avatar
          </button>
        </div>
      </aside>

      <div
        className={modal ? "modal-backdrop open" : "modal-backdrop"}
        onClick={(e) => {
          if (e.target === e.currentTarget) setModal(false);
        }}
      >
        <div className="modal">
          <div className="panel-h">
            <h2>
              {selected.platform} {selected.title}
            </h2>
            <button className="icon-btn" aria-label="Close details" onClick={() => setModal(false)}>
              <X size={16} />
            </button>
          </div>
          <div className="modal-grid">
            <img src={selected.img} alt="" />
            <div>
              <div className="kv">
                <span>Part number</span>
                <div>{selected.part}</div>
                <span>Status</span>
                <div>{selected.status}</div>
                <span>Priority</span>
                <div>{selected.priority}</div>
                <span>Readiness impact</span>
                <div>{selected.impact}</div>
                <span>Cost avoidance</span>
                <div>{selected.cost}</div>
                <span>Current lead time</span>
                <div>{selected.lead}</div>
                <span>Digital thread</span>
                <div>MTP-2026-{selected.platform}-047</div>
              </div>
              <p className="modal-copy">{selected.summary}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className={cmdk ? "cmdk open" : "cmdk"}
        onClick={(e) => {
          if (e.target === e.currentTarget) setCmdk(false);
        }}
      >
        <div className="cmdk-box">
          <input
            ref={cmdkRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search opportunities, platforms, locations…"
          />
          <div className="cmdk-list">
            {hits.map((o) => (
              <button
                key={o.id}
                type="button"
                className="cmdk-item"
                onMouseDown={(event) => {
                  event.preventDefault();
                  pick(o);
                }}
              >
                {o.platform} {o.title} · {o.status}
              </button>
            ))}
            {hits.length === 0 ? <div className="cmdk-item">No matches</div> : null}
          </div>
        </div>
      </div>

      <div className={toast ? "toast show" : "toast"}>{toast}</div>
    </div>
  );
}

function EngineeringView({
  selected,
  phase,
  contract,
  onContract,
  onPhase,
  onHome,
  onPing,
}: {
  selected: Opportunity;
  phase: ReconPhase;
  contract: ProjectContract | null;
  onContract: (next: ProjectContract) => void;
  onPhase: (phase: ReconPhase) => void;
  onHome: () => void;
  onPing: (msg: string) => void;
}) {
  const pack = engineeringPackage(selected);
  const thread = reconstructionThread(selected);
  const recommended = pack.trades.find((t) => t.recommend) ?? pack.trades[0];
  const [choice, setChoice] = useState(recommended.loc + recommended.cap);
  const picked = pack.trades.find((t) => t.loc + t.cap === choice) ?? recommended;
  const gaps = pack.rows.filter((row) => row.state !== "Complete");
  const [reqStatus, setReqStatus] = useState<Record<string, ReqStatus>>({});
  const requirements = thread.requirements.map((row) => ({
    ...row,
    status: reqStatus[row.id] ?? row.status,
  }));
  const validated = requirements.filter((row) => row.status === "Validated").length;
  const [factId, setFactId] = useState(thread.facts[0]?.id ?? "1");
  const [sheet, setSheet] = useState<"drawing" | "image">("drawing");
  const [uploads, setUploads] = useState<{ id: string; name: string; kind: string; url?: string; state: string }[]>([]);
  const [cadFile, setCadFile] = useState<File | null>(null);
  const [hiddenEvidence, setHiddenEvidence] = useState<string[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const dropped = useRef(false);
  const [tab, setTab] = useState<EngTab>("Overview");
  function pickTab(next: EngTab) {
    setTab(next);
    const phaseFor: Partial<Record<EngTab, ReconPhase>> = {
      "Technical Data": "evidence",
      Requirements: "requirements",
      "Analysis of Alternatives": "reconstruction",
      "Testing & Qualification": "evaluation",
      History: "cad",
    };
    const nextPhase = phaseFor[next];
    if (nextPhase) onPhase(nextPhase);
  }
  const fact = thread.facts.find((item) => item.id === factId) ?? thread.facts[0];
  const material = requirements.find((row) => row.name === "Material");
  const evidence: { id?: string; name: string; kind: string; url?: string; state: string }[] = [
    ...uploads,
    ...thread.evidence.filter((item) => !hiddenEvidence.includes(item.name)),
  ];

  function removeEvidence(item: { id?: string; name: string; url?: string }) {
    if (item.id) {
      if (item.url) URL.revokeObjectURL(item.url);
      setUploads((current) => current.filter((entry) => entry.id !== item.id));
      if (item.url && previewUrl === item.url) {
        setPreviewUrl(null);
        setSheet("drawing");
      }
    } else {
      setHiddenEvidence((current) => [...current, item.name]);
      if (sheet === "image" && !previewUrl) setSheet("drawing");
    }
    onPing(`Removed ${item.name}`);
  }

  function addFiles(list: FileList | null) {
    if (!list?.length) return;
    const added = Array.from(list).map((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const kind = ["png", "jpg", "jpeg", "tif", "tiff", "webp", "gif"].includes(ext)
        ? "Image"
        : CAD_EXTS.includes(ext)
          ? "CAD"
          : "Drawing";
      return {
        id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 7)}`,
        name: file.name,
        kind,
        url: kind === "Image" ? URL.createObjectURL(file) : undefined,
        state: "Ingested",
      };
    });
    setUploads((current) => [...added, ...current]);
    // The first CAD file opens in the Verified CAD workspace.
    const cad = Array.from(list).find((file) => CAD_EXTS.includes(file.name.split(".").pop()?.toLowerCase() ?? ""));
    if (cad) setCadFile(cad);
    const image = added.find((item) => item.url);
    if (image?.url) {
      setPreviewUrl(image.url);
      setSheet("image");
    } else if (added[0]?.kind === "Drawing" || added[0]?.kind === "CAD") {
      setSheet("drawing");
    }
    onPing(
      `${added.length} file${added.length === 1 ? "" : "s"} added to the evidence package${cad ? `. Open Verified Engineering CAD to inspect ${cad.name}` : ""}`,
    );
  }

  return (
    <section className="view active eng">
      <div className="ec-scroll">
        <EngChrome
          thread={pack.thread}
          tab={tab}
          onHome={onHome}
          onTab={pickTab}
          onPing={onPing}
          selected={selected}
          contract={contract}
        />
        {tab === "Overview" ? <EngOverview selected={selected} contract={contract} onTab={pickTab} onPing={onPing} /> : null}
        {tab === "Overview" ? null : (
      <div className="ec-work">
      <div className="phase-rail" aria-label="Engineering reconstruction">
        {thread.phases.map((step) => (
          <button
            key={step.id}
            className={phase === step.id ? "phase on" : "phase"}
            onClick={() => onPhase(step.id)}
          >
            <span className="phase-n">{step.n}</span>
            <strong>{step.label}</strong>
            <em className={step.state === "Complete" ? "done" : step.state === "In Progress" ? "now" : ""}>
              {step.state}
            </em>
          </button>
        ))}
      </div>

      <section className={phase === "cad" ? "req-band cad-band" : "req-band"}>
        <div className="panel-h">
          <h3>
            {phase === "evidence"
              ? "SOURCE EVIDENCE"
              : phase === "requirements"
                ? "REQUIREMENTS"
                : phase === "reconstruction"
                  ? "CANDIDATE RECONSTRUCTION"
                  : phase === "cad"
                    ? "VERIFIED ENGINEERING CAD"
                    : "TECHNICAL EVALUATION"}
          </h3>
          <span className="muted">{thread.authority}</span>
        </div>

        {phase === "evidence" && fact ? (
          <div className="ev">
            <div className="ev-grid">
              <aside className="ev-col ev-upload">
                <div className="panel-h">
                  <h3>UPLOAD EVIDENCE</h3>
                </div>
                <div className="upload-stack">
                  <div className="upload upload-lg">
                    <strong>Drag and drop files here</strong>
                    <p>or browse to upload drawings, images, or CAD</p>
                    <span className="upload-browse">Browse files</span>
                    <p className="upload-note">PDF, TIFF, JPG, PNG, DWG, DXF, STEP, IGES</p>
                  </div>
                  <div className="upload-kinds">
                    {[
                      ["Add Images", "Photos, scans"],
                      ["Add Drawings", "PDF, DWG, DXF"],
                      ["Add CAD", "STEP, IGES"],
                    ].map(([label, hint]) => (
                      <div key={label}>
                        <strong>{label}</strong>
                        <span>{hint}</span>
                      </div>
                    ))}
                  </div>
                  <input
                    className="upload-input"
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.tif,.tiff,.webp,.dwg,.dxf,.step,.stp,.iges,.igs"
                    aria-label="Upload evidence"
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      dropped.current = true;
                      addFiles(event.dataTransfer.files);
                    }}
                    onChange={(event) => {
                      if (dropped.current) {
                        dropped.current = false;
                        event.target.value = "";
                        return;
                      }
                      addFiles(event.target.files);
                      event.target.value = "";
                    }}
                  />
                </div>
              </aside>

              <div className="ev-stage">
                <div className="viewer-bar">
                  <strong>{sheet === "image" ? "Reference image" : thread.evidence[0]?.name}</strong>
                  {sheet === "drawing" ? <em>Primary drawing</em> : null}
                  <span>1 / 1</span>
                  <span className="viewer-tools">
                    <button type="button" onClick={() => setZoom((value) => Math.max(0.8, Number((value - 0.15).toFixed(2))))} aria-label="Zoom out">
                      −
                    </button>
                    <button type="button" onClick={() => setZoom((value) => Math.min(2.2, Number((value + 0.15).toFixed(2))))} aria-label="Zoom in">
                      +
                    </button>
                    <button type="button" onClick={() => setZoom(1)} aria-label="Fit drawing">
                      Fit
                    </button>
                  </span>
                </div>
                <div className="ev-viewer">
                  <div className="ev-frame">
                    {sheet === "image" ? (
                      <img
                        className="ev-photo"
                        src={previewUrl ?? selected.img}
                        alt={selected.title}
                        style={{ transform: `scale(${zoom})` }}
                      />
                    ) : (
                      <img
                        className="sheet-img"
                        src="/assets/hinge-drawing.jpg"
                        alt="Engineering drawing"
                        style={{ transform: `scale(${zoom})` }}
                      />
                    )}
                  </div>
                </div>
                <div className="ev-strip">
                  {evidence.map((item) => {
                    const on =
                      item.kind === "Image"
                        ? sheet === "image" && (item.url ?? null) === previewUrl
                        : sheet === "drawing" && item.kind === "Drawing";
                    return (
                      <div key={item.id ?? item.name} className={on ? "strip-item on" : "strip-item"}>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.kind === "Image") {
                              setPreviewUrl(item.url ?? null);
                              setSheet("image");
                            } else {
                              setSheet("drawing");
                            }
                          }}
                        >
                          {item.kind === "Image" ? (
                            <img src={item.url ?? selected.img} alt="" />
                          ) : (
                            <span>{item.kind === "Drawing" ? "DWG" : item.kind === "CAD" ? "CAD" : "SPEC"}</span>
                          )}
                          <em>{item.name}</em>
                        </button>
                        <button
                          type="button"
                          className="strip-x"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => removeEvidence(item)}
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>

              <aside className="ev-col">
                <div className="panel-h">
                  <h3>EVIDENCE CONTEXT</h3>
                </div>
                <dl className="ev-dl">
                  <div>
                    <dt>Source status</dt>
                    <dd className="ok">{evidence.length} files collected</dd>
                  </div>
                  <div>
                    <dt>Reconstruction</dt>
                    <dd>2D drawing → 3D</dd>
                  </div>
                </dl>
                <div className="panel-h">
                  <h3>ENGINEERING CONTEXT</h3>
                </div>
                <dl className="ev-dl">
                  <div>
                    <dt>Platform</dt>
                    <dd>{selected.platform}</dd>
                  </div>
                  <div>
                    <dt>Part name</dt>
                    <dd>{selected.title}</dd>
                  </div>
                  <div>
                    <dt>Part number</dt>
                    <dd>{selected.part}</dd>
                  </div>
                  <div>
                    <dt>Material</dt>
                    <dd>{material?.value ?? "Not identified"}</dd>
                  </div>
                  <div>
                    <dt>Airworthiness</dt>
                    <dd>To be determined</dd>
                  </div>
                </dl>
                <div className="panel-h">
                  <h3>REFERENCE INPUTS</h3>
                </div>
                <dl className="ev-dl">
                  <div>
                    <dt>Related parts</dt>
                    <dd>1 linked</dd>
                  </div>
                  <div>
                    <dt>Specifications</dt>
                    <dd>{evidence.filter((item) => item.kind === "Spec").length} documents</dd>
                  </div>
                  <div>
                    <dt>Standards</dt>
                    <dd>0 documents</dd>
                  </div>
                  <div>
                    <dt>Historical models</dt>
                    <dd>{evidence.filter((item) => item.kind === "CAD").length} files</dd>
                  </div>
                </dl>
                <button className="action req-accept" onClick={() => onPhase("requirements")}>
                  Review requirements →
                </button>
              </aside>
            </div>
          </div>
        ) : null}

        {phase === "requirements" ? (
          <>
            <table className="req-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Requirement</th>
                  <th>Proposed value</th>
                  <th>Source</th>
                  <th>Confidence</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {requirements.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.value}</td>
                    <td className="muted">{row.source}</td>
                    <td>
                      <span className="conf" title={`${row.confidence}%`}>
                        <i style={{ width: `${row.confidence}%` }} />
                      </span>
                      <span className="muted">{row.confidence}%</span>
                    </td>
                    <td>
                      <button
                        className={`state ${row.status === "Validated" ? "ok" : row.status === "Unresolved" ? "gap" : "review"}`}
                        onClick={() =>
                          setReqStatus((current) => ({
                            ...current,
                            [row.id]: row.status === "Validated" ? "In Review" : "Validated",
                          }))
                        }
                      >
                        {row.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="action req-accept"
              onClick={() => {
                const next: Record<string, ReqStatus> = {};
                for (const row of requirements) {
                  if (row.status === "In Review") next[row.id] = "Validated";
                }
                setReqStatus((current) => ({ ...current, ...next }));
                onPing(`Baseline updated · ${validated + Object.keys(next).length} of ${requirements.length} validated`);
              }}
            >
              Accept reviewed requirements into baseline · {validated}/{requirements.length}
            </button>
          </>
        ) : null}

        {phase === "reconstruction" ? (
          <div className="cand-row">
            {thread.candidates.map((cand) => (
              <div className={cand.recommend ? "cand on" : "cand"} key={cand.name}>
                <strong>
                  {cand.name}
                  {cand.recommend ? <em> Recommended</em> : null}
                </strong>
                <b>{cand.match}%</b>
                <p>
                  {cand.kind}. {cand.note}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {phase === "cad" ? (
          <>
            <p className="muted">
              Recognized features are proposals until an engineer validates them. Reconstruction stays blocked while GD&T
              and the additive process spec are unresolved.
            </p>
            <Suspense fallback={<p className="muted">Loading the CAD workspace…</p>}>
              <CadWorkspace file={cadFile} onPing={onPing} />
            </Suspense>
          </>
        ) : null}

        {phase === "evaluation" ? (
          <p className="muted">
            Manufacturability, lead time, and source-of-repair trades below use the validated model. Airworthiness
            applicability is still to be determined for this part.
          </p>
        ) : null}
      </section>

      {phase === "evidence" ? null : (
      <div className="eng-grid">
        <section className="panel">
          <div className="panel-h">
            <h3>MISSION TECHNICAL PACKAGE</h3>
          </div>
          {pack.rows.map((row) => (
            <div className="pkg-row" key={row.area}>
              <div>
                <strong>{row.area}</strong>
                <p>{row.item}</p>
              </div>
              <span className={`state ${row.state === "Complete" ? "ok" : row.state === "Gap" ? "gap" : "review"}`}>
                {row.state}
              </span>
            </div>
          ))}
        </section>

        <section className="panel">
          <div className="panel-h">
            <h3>QUALIFICATION GAPS</h3>
            <span className="muted">{gaps.length} open</span>
          </div>
          {gaps.length === 0 ? (
            <p className="muted">No open gaps. This package can move to source.</p>
          ) : (
            gaps.map((row) => (
              <div className="gap-card" key={row.area}>
                <div className="gap-top">
                  <strong>{row.area}</strong>
                  <span className="muted">{row.owner}</span>
                </div>
                <p>{row.next}</p>
                <button className="action" onClick={() => onPing(`${row.area}: ${row.next}`)}>
                  Assign next action
                </button>
              </div>
            ))
          )}
        </section>

        <section className="panel">
          <div className="panel-h">
            <h3>SOURCE-OF-REPAIR TRADES</h3>
          </div>
          {pack.trades.map((trade) => {
            const id = trade.loc + trade.cap;
            const on = id === choice;
            return (
              <button
                key={id}
                className={on ? "trade on" : "trade"}
                onClick={() => setChoice(id)}
              >
                <img src={trade.img} alt="" />
                <div>
                  <strong>
                    {trade.loc}
                    {trade.recommend ? <em> Recommended</em> : null}
                  </strong>
                  <p>
                    {trade.cap} · {trade.lead} · {trade.cost}
                  </p>
                  <p className="muted">{trade.note}</p>
                </div>
                <span className={`risk ${trade.risk.toLowerCase()}`}>{trade.risk}</span>
              </button>
            );
          })}
          <button
            className="action eng-accept"
            onClick={() =>
              onPing(`Path set · ${picked.loc} ${picked.cap} · ${picked.lead} / ${picked.cost}`)
            }
          >
            Accept {picked.loc}
          </button>
        </section>
      </div>
      )}
      </div>
        )}
      </div>
    </section>
  );
}

const CAD_EXTS = ["step", "stp", "iges", "igs", "brep", "brp", "stl", "obj", "glb", "gltf", "sldprt"];

const drawingPins = [
  { x: 250, y: 78 },
  { x: 92, y: 210 },
  { x: 250, y: 330 },
  { x: 500, y: 78 },
  { x: 668, y: 168 },
  { x: 500, y: 330 },
];

function DrawingSheet({
  title,
  part,
  material,
  facts,
  active,
  onPick,
}: {
  title: string;
  part: string;
  material: string;
  facts: { id: string; value: string }[];
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <svg className="drawing-svg" viewBox="0 0 760 460" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Engineering drawing preview">
      <rect x="1" y="1" width="758" height="458" className="sheet" />
      <rect x="10" y="10" width="740" height="440" className="sheet-inner" />
      <g className="hinge" fill="none" stroke="#1d4e89" strokeWidth="2">
        <rect x="180" y="145" width="400" height="130" rx="8" />
        <circle cx="230" cy="210" r="48" />
        <circle cx="230" cy="210" r="18" />
        <circle cx="530" cy="210" r="48" />
        <circle cx="530" cy="210" r="18" />
        <line x1="70" y1="210" x2="690" y2="210" strokeDasharray="4 4" />
        <line x1="180" y1="145" x2="180" y2="100" />
        <line x1="580" y1="145" x2="580" y2="100" />
        <line x1="180" y1="100" x2="580" y2="100" />
      </g>
      {facts.slice(0, 6).map((item, index) => {
        const pin = drawingPins[index];
        const on = item.id === active;
        return (
          <g key={item.id} className={on ? "pin on" : "pin"} onClick={() => onPick(item.id)}>
            <circle cx={pin.x} cy={pin.y} r="14" />
            <text x={pin.x} y={pin.y + 4} textAnchor="middle">
              {item.id}
            </text>
            <text className="pin-label" x={pin.x + (pin.x > 400 ? 18 : -18)} y={pin.y - 18} textAnchor={pin.x > 400 ? "start" : "end"}>
              {item.value}
            </text>
          </g>
        );
      })}
      <g className="titleblock">
        <rect x="430" y="360" width="300" height="78" />
        <text x="444" y="380">MATERIAL</text>
        <text x="444" y="398" className="tb-val">{material}</text>
        <text x="590" y="380">TITLE</text>
        <text x="590" y="398" className="tb-val">{title}</text>
        <text x="444" y="422">PART {part}</text>
      </g>
    </svg>
  );
}

function PulseBar() {
  const items = [
    "2 mission-assigned tails downgraded in the last 6 hours",
    "New hydraulic pump issue affecting 3 aircraft",
    "Tail 85-0009 returned FMC at Travis",
  ];
  const once = Array.from({ length: 6 }, () => items).flat();
  const loop = [...once, ...once];
  return (
    <div className="pulse" role="status" aria-label="Mission pulse">
      <em>Alerts</em>
      <div className="pulse-window">
        <div className="pulse-track">
          {loop.map((text, index) => (
            <span key={index}>
              <i aria-hidden="true">✦</i>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero({ onStart }: { onStart: (contract: ProjectContract, partId?: string) => void }) {
  const [assist, setAssist] = useState(false);
  const [help, setHelp] = useState("");
  const [partNo, setPartNo] = useState("");
  const [craft, setCraft] = useState("");
  const [nsn, setNsn] = useState("");
  const [noun, setNoun] = useState("");
  const [found, setFound] = useState<Opportunity[] | "none" | null>(null);
  const [picked, setPicked] = useState("");
  const [pack, setPack] = useState("");
  const [have, setHave] = useState<string[]>([]);
  const [qty, setQty] = useState("");
  const [needBy, setNeedBy] = useState("");
  const [roleCraft, setRoleCraft] = useState<string[]>(PERSONAS[0][3].split(", "));
  useEffect(() => {
    const saved = window.localStorage.getItem("gmw-persona");
    const row = PERSONAS.find((item) => item[0] === saved) ?? PERSONAS[0];
    setRoleCraft(row[3].split(", "));
  }, []);
  useEffect(() => {
    if (!help || help === "new") return;
    const allowed = new Set(roleCraft.map(platformCode));
    const code = craft ? platformCode(craft) : "";
    const nsnNeedle = nsn.replace(/[^a-z0-9]/gi, "").toLowerCase();
    const partNeedle = partNo.trim().toLowerCase();
    const nounNeedle = noun.trim().toLowerCase();
    if (!code && !nsnNeedle && !partNeedle && !nounNeedle) {
      setFound(null);
      return;
    }
    const hits = partCatalog.filter((item) => {
      if (!allowed.has(item.platform)) return false;
      if (code && item.platform !== code) return false;
      if (nsnNeedle && !(item.nsn ?? "").replace(/[^a-z0-9]/gi, "").toLowerCase().includes(nsnNeedle)) return false;
      if (partNeedle && !`${item.part} ${item.afPart ?? ""}`.toLowerCase().includes(partNeedle)) return false;
      if (nounNeedle && !item.title.toLowerCase().includes(nounNeedle)) return false;
      return true;
    }).slice(0, 8);
    setFound(hits.length ? hits : "none");
    setPicked((current) => (hits.some((item) => item.id === current) ? current : ""));
  }, [help, craft, nsn, partNo, noun, roleCraft]);
  function clearPart() {
    setCraft("");
    setNsn("");
    setPartNo("");
    setNoun("");
    setFound(null);
    setPicked("");
    setPack("");
    setHave([]);
    setQty("");
    setNeedBy("");
  }
  return (
    <div className={assist ? "hero assist-open" : "hero"}>
      <div className="hero-art">
        <div className="hero-left" />
        <div className="hero-right" />
      </div>
      <div className="hero-blend" />
      <svg className="net-svg" viewBox="0 0 1600 500" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="arc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3ee0ff" stopOpacity="0" />
            <stop offset="0.5" stopColor="#3ee0ff" stopOpacity="0.85" />
            <stop offset="1" stopColor="#3ee0ff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M620 160 C 740 90, 880 120, 980 150" stroke="url(#arc)" strokeWidth="1.4" fill="none" />
        <path d="M560 300 C 720 210, 900 230, 1080 210" stroke="url(#arc)" strokeWidth="1.4" fill="none" />
        <path d="M700 220 C 820 180, 980 250, 1180 280" stroke="url(#arc)" strokeWidth="1.3" fill="none" />
        <path d="M980 150 C 1080 130, 1220 200, 1320 220" stroke="url(#arc)" strokeWidth="1.3" fill="none" />
      </svg>
      <span className="glow-node n1" />
      <span className="glow-node n2" />
      <span className="glow-node n3" />
      <span className="glow-node n4" />
      <span className="glow-node n5" />
      <div className="hero-copy">
        <h2>
          RIGHT SOLUTION.
          <br />
          RIGHT LOCATION.
          <br />
          MISSION READY.
        </h2>
        <p>
          Connect sustainment demand to U.S. organic, Five Eyes, forward and authorized industrial
          capabilities — executing closer to the point of need.
        </p>
      </div>
      <div className="assist-wrap">
        <button
          type="button"
          className="assist-pill"
          onClick={() => {
            setHelp("");
            clearPart();
            setAssist((open) => !open);
          }}
        >
          <span>Request Assistance</span>
        </button>
        {assist ? null : (
          <span className="assist-hint">
            Click here to have the Wingman walk you through a request for assistance, from digital transformation, to a complete part redesign, to a production run of an existing solution.
          </span>
        )}
      </div>
      {assist ? (
        <div className="assist-pair">
        <div className="assist-card">
          <div className="assist-h">
            <h3>REQUEST ASSISTANCE</h3>
            <button
              type="button"
              aria-label="Close request"
              onClick={() => {
              setHelp("");
              clearPart();
              setAssist(false);
            }}
            >
              <X size={14} />
            </button>
          </div>
          <p>How can I help you?</p>
          <div className="assist-choices assist-help">
            {[
              ["redesign", "Redesign an existing part"],
              ["new", "Design a new part"],
              ["transform", "Digitally transform legacy technical data"],
              ["alternatives", "Analyze manufacturing and repair alternatives"],
              ["production", "Request a production run of an existing solution"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={help === id ? "on" : ""}
                onClick={() => {
                  setHelp(id);
                  clearPart();
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {help === "new" ? <p className="assist-next">A new design. No part number yet.</p> : null}
        </div>
          {help && help !== "new" ? (
            <form
              className="assist-lookup assist-side"
              onSubmit={(event) => event.preventDefault()}
            >
              <h3>FIND THE PART</h3>
              <label>
                Aircraft
                <select value={craft} onChange={(event) => setCraft(event.target.value)} aria-label="Aircraft">
                  <option value="">Choose an aircraft...</option>
                  {roleCraft.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label>
                NSN / NIIN
                <input value={nsn} onChange={(event) => setNsn(event.target.value)} placeholder="1560-01-000-2307" />
              </label>
              <label>
                Part no.
                <input value={partNo} onChange={(event) => setPartNo(event.target.value)} placeholder="B39-22307" />
              </label>
              <label>
                Description
                <input value={noun} onChange={(event) => setNoun(event.target.value)} placeholder="Door hinge" />
              </label>
              <button type="submit">Look up</button>
              {found === "none" ? <p className="assist-next">No match in this role.</p> : null}
            </form>
          ) : null}
          {Array.isArray(found) ? (
            <div className="assist-side assist-results">
              <h3>MATCHES</h3>
              <div className="assist-cols"><span>NSN / NIIN</span><span>Part no.</span><span>AF part no.</span></div>
              {found.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={picked === item.id ? "on" : ""}
                  onClick={() => {
                    setPicked(item.id);
                    setPack("");
                    setHave(item.summary.toLowerCase().includes("digital thread") ? ["cad"] : []);
                  }}
                >
                  <b>{item.platform} {item.title}</b>
                  <span>{item.nsn ?? "—"}</span>
                  <span>{item.part}</span>
                  <span>{item.afPart ?? "—"}</span>
                </button>
              ))}
            </div>
          ) : null}
          {Array.isArray(found) && found.find((item) => item.id === picked) ? (
            <div className="assist-side assist-part">
              {(() => {
                const part = found.find((item) => item.id === picked)!;
                return (
                  <>
                    <div className="assist-h">
                      <h3>THE PART</h3>
                      <button type="button" aria-label="Close part" onClick={() => setPicked("")}>
                        <X size={14} />
                      </button>
                    </div>
                    <p className="part-name">{part.platform} {part.title}</p>
                    <img src={part.img} alt="" />
                    <p><span>Part no.</span>{part.part}</p>
                    <p><span>AF part no.</span>{part.afPart ?? "—"}</p>
                    {part.nsn ? <p><span>NSN</span>{part.nsn}</p> : null}
                    <p><span>Status</span>{part.status}</p>
                    <p className="assist-sum">{part.summary}</p>
                  </>
                );
              })()}
            </div>
          ) : null}
          {help === "new" || (picked && help) ? (
            <div className="assist-side assist-pack">
              <h3>THE PACKAGE / DELIVERABLES</h3>
              {(
                [
                  ["cad", "3D CAD model (only)", ""],
                  ["II", "Level II TDP", "Level II covers validated requirements, a verified 3D model, the technical specification, and the bill of materials."],
                  ["III", "Level III TDP", "Level III adds test reports and evidence, the manufacturing package, and the airworthiness package."],
                  ["custom", "Custom", ""],
                ] as const
              ).map(([id, label, note]) => (
                <button key={id} type="button" className={pack === id ? "choice on" : "choice"} onClick={() => setPack(id)}>
                  <i />
                  <span>
                    {label}
                    {note ? <small>{note}</small> : null}
                  </span>
                </button>
              ))}
              {pack === "custom" ? (
                <div className="pack-custom">
                  <p>A la carte</p>
                  {[
                    ["req", "Validated requirements"],
                    ["cad", "Verified 3D CAD model"],
                    ["spec", "Technical spec"],
                    ["bom", "BOM"],
                    ["test", "Test reports / evidence"],
                    ["mfg", "Manufacturing pkg"],
                    ["air", "Airworthiness compliance pkg"],
                  ].map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      className={have.includes(id) ? "check on" : "check"}
                      onClick={() => setHave((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]))}
                    >
                      <i />
                      {label}
                    </button>
                  ))}
                </div>
              ) : null}
              <label className="pack-qty">
                Qty. needed
                <input value={qty} onChange={(event) => setQty(event.target.value)} placeholder="24" />
              </label>
              <label className="pack-qty">
                Need date
                <input type="date" value={needBy} onChange={(event) => setNeedBy(event.target.value)} />
              </label>
              <button
                type="button"
                className="assist-go"
                disabled={!pack}
                onClick={() => {
                  const part = Array.isArray(found) ? found.find((item) => item.id === picked) : undefined;
                  const artifacts =
                    pack === "custom"
                      ? CUSTOM_ARTIFACTS.filter(([id]) => have.includes(id)).map(([, label]) => label)
                      : PACKAGE_ARTIFACTS[pack] ?? [];
                  onStart(
                    {
                      name: part ? `${part.platform} ${part.title} ${requestTitle(help)}` : "New part",
                      artifacts,
                      qty,
                      need: needBy,
                    },
                    picked || undefined,
                  );
                }}
              >
                Start project
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
      <div className="hero-right-copy">
        A RESILIENT GLOBAL DIGITAL SUPPLY CHAIN EXECUTING CLOSER TO THE POINT OF NEED.
      </div>
      <div className="chip chip-organic">
        <div className="chip-ico">
          <Building2 size={14} />
        </div>
        <div>
          <div className="t">U.S. ORGANIC</div>
          <div className="s">Depots & Bases</div>
        </div>
        <img src="/assets/7b0QN.jpg" alt="U.S. organic depot" />
      </div>
      <div className="chip chip-forward">
        <div className="chip-ico teal">
          <MapPin size={14} />
        </div>
        <div>
          <div className="t">FORWARD ORGANIC</div>
          <div className="s">CONUS · OCONUS Point of Need</div>
        </div>
        <img src="/assets/UP5cd.jpg" alt="Forward organic" />
      </div>
      <div className="chip chip-five">
        <div className="chip-ico purple">
          <Star size={14} />
        </div>
        <div>
          <div className="t">FIVE EYES</div>
          <div className="s">Partner Capabilities</div>
        </div>
        <img src="/assets/G8Qcq.jpg" alt="Five Eyes" />
      </div>
      <div className="chip chip-dib">
        <div className="chip-ico">
          <Factory size={14} />
        </div>
        <div>
          <div className="t">DIB</div>
          <div className="s">Defense Industrial Base</div>
        </div>
        <img src="/assets/XaljJ.jpg" alt="Defense industrial base" />
      </div>
      <div className="mtp">
        <div className="mtp-ico">
          <Shield size={22} />
        </div>
        <h3>MISSION TECHNICAL PACKAGE</h3>
        <p>
          REQUIREMENTS | TECHNICAL DATA | QUALIFICATION
          <br />
          AIRWORTHINESS | REPAIRABILITY
        </p>
      </div>
    </div>
  );
}
