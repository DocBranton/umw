import { useState } from "react";
import { Activity, BarChart3, ChevronDown, Shield, Wrench } from "lucide-react";
import type { Opportunity } from "@/lib/gmw-data";

const TABS = [
  "Overview",
  "Requirements",
  "Technical Data",
  "Analysis of Alternatives",
  "Manufacturing Plan",
  "Testing & Qualification",
  "Supply Chain",
  "Cost & Schedule",
  "Risk",
  "Team & Collaboration",
  "History",
] as const;

export type EngTab = (typeof TABS)[number];

type Contract = { name: string; artifacts?: string[]; qty: string; need: string } | null;

const MILES = [
  ["01", "Source Evidence", "Complete", "Technical Data"],
  ["02", "Requirements", "In progress", "Requirements"],
  ["03", "Design & Analysis", "Planned", "Analysis of Alternatives"],
  ["04", "Manufacturing Plan", "Planned", "Manufacturing Plan"],
  ["05", "Qualification & Test", "Planned", "Testing & Qualification"],
  ["06", "Fielding", "Planned", "History"],
] as const;

const GANTT = [
  ["Requirements & MBSE", 8, 16],
  ["3D Design & Analysis", 18, 22],
  ["Manufacturing Plan", 36, 16],
  ["Test & Qualification", 48, 18],
  ["Procurement / Production", 62, 22],
  ["Fielding", 82, 14],
] as const;

function showNeed(value: string) {
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${month}/${day}/${year}`;
}

function packageOf(contract: Contract) {
  const level3 = ["Validated requirements", "Technical specification", "Verified 3D model", "Bill of materials", "Manufacturing package", "Test reports and evidence", "Airworthiness package"];
  const level2 = level3.slice(0, 4);
  const artifacts = contract?.artifacts ?? [];
  const same = (list: string[]) => artifacts.length === list.length && list.every((item) => artifacts.includes(item));
  if (same(["Validated requirements", "Verified 3D CAD model", "Technical spec", "BOM", "Test reports / evidence", "Manufacturing pkg", "Airworthiness compliance pkg"])) {
    return { title: "Level III TDP", items: level3 };
  }
  if (same(["Validated requirements", "Verified 3D CAD model", "Technical spec", "BOM"])) {
    return { title: "Level II TDP", items: level2 };
  }
  if (artifacts.length === 1 && /cad/i.test(artifacts[0])) {
    return { title: "3D CAD model", items: ["Verified 3D model"] };
  }
  if (artifacts.length > 0) return { title: "Custom", items: artifacts };
  return { title: "Level III TDP", items: level3 };
}

export function EngChrome({
  thread,
  tab,
  onHome,
  onTab,
  onPing,
  selected,
  contract,
}: {
  thread: string;
  tab: EngTab;
  onHome: () => void;
  onTab: (tab: EngTab) => void;
  onPing: (msg: string) => void;
  selected: Opportunity;
  contract: Contract;
}) {
  const name = contract?.name || `${selected.platform} ${selected.title} Redesign`;
  const hinge = selected.id === "opp-c17-hinge";
  const [open, setOpen] = useState(true);
  return (
    <>
      <div className="ec-crumb">
        <button type="button" className="linkish" onClick={onHome}>
          ← Back to Projects
        </button>
        <span>/</span>
        <em>Engineering</em>
        <span>/</span>
        <strong>{thread}</strong>
        <div className="ec-actions">
          {["Share", "Export", "Project Actions"].map((label) => (
            <button key={label} type="button" onClick={() => onPing(`${label} is not wired yet`)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {open ? (
      <div className="ec-head">
        <div className="ec-ident">
          <img src={selected.img} alt="" />
          <div>
            <span className="ec-status">● {selected.status.toUpperCase()}</span>
            <h2>{name}</h2>
            <p className="ec-ids">
              {selected.nsn ? <span>NSN/NIIN {selected.nsn}</span> : null}
              <span>Part No. {selected.part}</span>
              {hinge ? <span>CAGE 12345</span> : null}
              {hinge ? <span>Rev A</span> : null}
            </p>
            <p className="ec-sum">{selected.summary}</p>
            <div className="ec-tags">
              <i className="hot">Flight Critical</i>
              <i className="hot">{selected.priority} Priority</i>
              <i className="warm">Limited Supply</i>
              <i className="warm">DSMS Risk</i>
              <i className="ok">AM Candidate</i>
              <i className="ok">Validated Model</i>
              <i className="ok">Airworthiness Applicable</i>
            </div>
          </div>
        </div>
        <div className="ec-kpis">
          <article>
            <Activity size={16} />
            <b>{selected.impactNum.toLocaleString()}</b>
            <span>Readiness Impact</span>
            <em>A/C Days</em>
            <small className="down">42% est. reduction</small>
          </article>
          <article>
            <BarChart3 size={16} />
            <b>{selected.cost}</b>
            <span>Cost Avoidance</span>
            <em>10 yr</em>
            <small className="down">63% vs. buy new</small>
          </article>
          <article>
            <Wrench size={16} />
            <b>{selected.lead.replace(" days", "")} days</b>
            <span>Current Lead Time</span>
            <small className="down">68% target reduction</small>
          </article>
          <article>
            <Shield size={16} />
            <b className="high">{selected.priority}</b>
            <span>Mission Criticality</span>
          </article>
          <article className="ec-progress">
            <svg viewBox="0 0 72 72" aria-hidden="true">
              <circle cx="36" cy="36" r="28" />
              <circle cx="36" cy="36" r="28" />
              <text x="36" y="40">65%</text>
            </svg>
            <div>
              <strong>Project Progress</strong>
              <small>4 / 8 Milestones Complete</small>
              <small className="down">On Track</small>
              <small>Target Fielding: Q3 FY27</small>
            </div>
          </article>
        </div>
      </div>
      ) : null}

      <div className="ec-tabs" role="tablist">
        {TABS.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} className={tab === item ? "on" : ""} onClick={() => onTab(item)}>
            {item}
          </button>
        ))}
        <button type="button" className="ec-grip" aria-expanded={open} onClick={() => setOpen((value) => !value)}>
          <em>{open ? "Hide summary" : "Show summary"}</em>
          <ChevronDown size={16} />
        </button>
      </div>
    </>
  );
}

export function EngOverview({
  selected,
  contract,
  onTab,
  onPing,
}: {
  selected: Opportunity;
  contract: Contract;
  onTab: (tab: EngTab) => void;
  onPing: (msg: string) => void;
}) {
  const [partTab, setPartTab] = useState("Part Details");
  const [openInfo, setOpenInfo] = useState("Mission Need");
  const hinge = selected.id === "opp-c17-hinge";
  const agreed = packageOf(contract);
  return (
    <div className="ec-body">
      <div className="ec-split ec-upper">
        <section className={partTab === "Part Details" ? "ec-card ec-context" : "ec-card"}>
          <header>
            <h3>Platform & Part Context</h3>
            <div className="ec-seg">
              {["Part Details", "3D Model", "Drawings", "In-Service Photos"].map((item) => (
                <button key={item} type="button" className={partTab === item ? "on" : ""} onClick={() => setPartTab(item)}>
                  {item}
                </button>
              ))}
            </div>
          </header>
          {partTab === "Part Details" ? (
            <div className="ec-part">
              <div className="ec-air">
                <img src="/assets/LJIQT.jpg" alt="" />
                <div>
                  <b>{selected.platform === "C-17" ? "C-17 Globemaster III" : selected.platform}</b>
                  <span>
                    <i>Mobility</i>
                    <i>Airlift</i>
                  </span>
                </div>
                <dl>
                  <div><dt>Platforms Assigned</dt><dd>{hinge ? "272" : "—"}</dd></div>
                  <div><dt>Bases Worldwide</dt><dd>{hinge ? "18" : "—"}</dd></div>
                  <div><dt>Annual Sorties</dt><dd>{hinge ? "52,000" : "—"}</dd></div>
                  <div><dt>Current FMC</dt><dd>{hinge ? "78%" : "—"}</dd></div>
                </dl>
              </div>
              <div className="ec-partinfo">
                <img className="ec-part-shot" src={selected.img} alt="" />
                <dl className="ec-spec">
                  <div><dt>NSN/NIIN</dt><dd>{selected.nsn ?? "—"}</dd></div>
                  <div><dt>Part Number</dt><dd>{selected.part}</dd></div>
                  <div><dt>Nomenclature</dt><dd>{selected.title}</dd></div>
                  <div><dt>Assembly</dt><dd>Cargo Door</dd></div>
                  <div><dt>Material</dt><dd>15-5 PH (current)</dd></div>
                  <div><dt>Size</dt><dd>4.80 in × 2.10 in × 1.25 in</dd></div>
                  <div><dt>Weight</dt><dd>0.82 lb</dd></div>
                  <div><dt>Lifecycle Phase</dt><dd>Sustainment</dd></div>
                  <div><dt>Technical Data</dt><dd className="warn">Available (Partial)</dd></div>
                  <div><dt>3D CAD</dt><dd className="ok">Available (Validated)</dd></div>
                </dl>
              </div>
              <aside className="ec-contract">
                <h4>The contract</h4>
                <div className="lvl">
                  <b>{agreed.title}</b>
                  <ul>
                    {agreed.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <dl>
                  <div>
                    <dt>Need date</dt>
                    <dd>{contract?.need ? showNeed(contract.need) : "12/24/2026"}</dd>
                  </div>
                  <div className="qty">
                    <dt>Qty needed</dt>
                    <dd>{contract?.qty || "4"}</dd>
                  </div>
                </dl>
              </aside>
              <aside className="ec-alt">
                <strong>Alternate Design (AM Candidate)</strong>
                <img src="/assets/am-hinge.jpg" alt="Additive hinge candidate" />
                <ul>
                  <li>34% Lighter</li>
                  <li>Increased Strength</li>
                  <li>Fewer Parts (Consolidation)</li>
                  <li>AM 15-5 PH + Finish Machining</li>
                  <li>Meets Airworthiness Requirements</li>
                </ul>
              </aside>
              <div className="ec-drivers">
                <h4>Top Drivers</h4>
                <ol>
                  {["Reduced lead time", "Eliminates DSMS risk", "Supports global fleet", "Enables spares production", "Improves maintainability"].map((item, index) => (
                    <li key={item}><b>{index + 1}</b> {item}</li>
                  ))}
                </ol>
              </div>
            </div>
          ) : (
            <div className="ec-part is-media">
              <div className="ec-media">
                <img
                  src={partTab === "Drawings" ? "/assets/hinge-drawing.jpg" : partTab === "3D Model" ? "/assets/am-hinge.jpg" : selected.img}
                  alt={partTab}
                />
              </div>
              <aside className="ec-alt">
                <strong>{partTab}</strong>
                <p>
                  {partTab === "Drawings"
                    ? "Primary 2D drawing. Dimensions stay with the requirements baseline."
                    : partTab === "3D Model"
                      ? "Additive candidate. The validated model is the reconstruction target."
                      : "In-service condition of the current bracket."}
                </p>
              </aside>
            </div>
          )}
        </section>
        <section className="ec-card">
          <header>
            <h3>Schedule Timeline</h3>
            <div className="ec-fy"><span>FY26</span><span>FY27</span><span>FY28</span></div>
          </header>
          <div className="ec-gantt">
            <div className="ec-q">
              {["Q1", "Q2", "Q3", "Q4", "Q1", "Q2", "Q3", "Q4", "Q1", "Q2"].map((q, index) => (
                <span key={`${q}-${index}`}>{q}</span>
              ))}
              <i className="ec-today" />
            </div>
            {GANTT.map(([label, left, width]) => (
              <div key={label} className="ec-grow">
                <em>{label}</em>
                <span><i style={{ left: `${left}%`, width: `${width}%` }} /></span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="ec-card">
        <header>
          <h3>Project Lifecycle & Milestones</h3>
          <button type="button" className="ec-link" onClick={() => onTab("Cost & Schedule")}>View Full Schedule →</button>
        </header>
        <div className="ec-miles">
          {MILES.map(([n, label, state, dest]) => (
            <button key={n} type="button" className={state === "In progress" ? "on" : state === "Complete" ? "done" : ""} onClick={() => onTab(dest)}>
              <span>{n}</span>
              <strong>{label}</strong>
              <em>{state}</em>
            </button>
          ))}
        </div>
      </section>

      <div className="ec-bottom">
        <section className="ec-card">
          <h3>Key Information</h3>
          {[
            ["Mission Need", "Recurring depot demand, limited supply, and long lead times are impacting C-17 availability."],
            ["Scope", "Redesign the hinge bracket for additive manufacture or an equivalent organic path."],
            ["Success Criteria", "Qualified design, approved technical data, and fielded spares by Q3 FY27."],
            ["Stakeholders", "AFLCMC/ROD, AFSC (Robins), Mobility Directorate, AMPO, DLA, industry partner."],
          ].map(([title, body]) => (
            <button key={title} type="button" className={openInfo === title ? "ec-acc on" : "ec-acc"} onClick={() => setOpenInfo(title)}>
              <strong>{title}</strong>
              {openInfo === title ? <p>{body}</p> : null}
            </button>
          ))}
        </section>
        <section className="ec-card">
          <header>
            <h3>Risks & Issues</h3>
            <button type="button" className="ec-link" onClick={() => onTab("Risk")}>View All →</button>
          </header>
          <table className="ec-risk">
            <thead><tr><th>Risk / Issue</th><th>Level</th><th>Mitigation</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Airworthiness approval timeline</td><td><i className="high">High</i></td><td>Early coordination with AFGSC/DER</td><td><i className="open">Open</i></td></tr>
              <tr><td>Material procurement (15-5 PH)</td><td><i className="med">Med</i></td><td>Dual source strategy</td><td><i className="work">In work</i></td></tr>
              <tr><td>AM process qualification</td><td><i className="med">Med</i></td><td>Leverage existing QMS</td><td><i className="work">In work</i></td></tr>
              <tr><td>Design performance (fatigue)</td><td><i className="low">Low</i></td><td>FEA + coupon testing</td><td><i className="watch">Monitoring</i></td></tr>
            </tbody>
          </table>
        </section>
        <section className="ec-card">
          <header>
            <h3>Team & Collaboration</h3>
            <button type="button" className="ec-link" onClick={() => onTab("Team & Collaboration")}>View All →</button>
          </header>
          <div className="ec-team">
            {[
              ["Engineering", "AFLCMC/ROD"],
              ["Certification", "DER / A4Q"],
              ["Manufacturing", "AFSC"],
              ["Supply Chain", "DLA"],
              ["Cost / PM", "AFLCMC"],
              ["Industry Partner", "TBD"],
            ].map(([role, org]) => (
              <div key={role}><b>{role}</b><span>{org}</span></div>
            ))}
          </div>
          <div className="ec-team-actions">
            <button type="button" onClick={() => onPing("Digital thread opened for this project")}>Open in Digital Thread</button>
            <button type="button" onClick={() => onPing("Engineering review requested")}>Start Engineering Review</button>
            <button type="button" className="ask" onClick={() => onPing("Ask the Wingman about this project")}>Ask AI about this project</button>
          </div>
        </section>
      </div>
    </div>
  );
}
