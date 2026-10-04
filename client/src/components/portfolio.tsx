import { useMemo, useState } from "react";

const HORIZON = 6;

function fiscalQuarters(count: number, from = new Date()) {
  const month = from.getMonth();
  let fy = month >= 9 ? from.getFullYear() + 1 : from.getFullYear();
  let quarter = month >= 9 ? 1 : Math.floor(month / 3) + 2;
  const cells: { fy: number; quarter: number }[] = [];
  for (let index = 0; index < count; index += 1) {
    cells.push({ fy, quarter });
    quarter += 1;
    if (quarter > 4) {
      quarter = 1;
      fy += 1;
    }
  }
  return cells;
}

function yearBands(cells: { fy: number; quarter: number }[]) {
  const bands: { fy: number; span: number }[] = [];
  for (const cell of cells) {
    const last = bands[bands.length - 1];
    if (last?.fy === cell.fy) last.span += 1;
    else bands.push({ fy: cell.fy, span: 1 });
  }
  return bands;
}

type Column = "intake" | "engineering" | "qualification" | "source" | "field";
type Priority = "High" | "Med" | "Low";

type Project = {
  id: string;
  code: string;
  platform: string;
  title: string;
  priority: Priority;
  column: Column;
  value: number;
  effort: number;
  days: number;
  office: string;
  site: string;
  opportunityId?: string;
  start: number;
  span: number;
};

const COLUMNS: { id: Column; label: string; wip: string }[] = [
  { id: "intake", label: "Intake", wip: "12" },
  { id: "engineering", label: "Engineering", wip: "20" },
  { id: "qualification", label: "Qualification", wip: "60" },
  { id: "source", label: "Source", wip: "30" },
  { id: "field", label: "Field", wip: "∞" },
];

const PROJECTS: Project[] = [
  { id: "p22307", code: "P-22307", platform: "C-17", title: "Door Hinge Bracket", priority: "High", column: "engineering", value: 92, effort: 38, days: 1240, office: "AFLCMC", site: "Tinker AFB", opportunityId: "opp-c17-hinge", start: 0.2, span: 2.2 },
  { id: "p8841", code: "P-8841", platform: "KC-135", title: "Fuel Control LRU", priority: "High", column: "engineering", value: 84, effort: 64, days: 980, office: "AFLCMC", site: "Tinker AFB", opportunityId: "opp-kc135-lru", start: 0, span: 3.1 },
  { id: "p4402", code: "P-4402", platform: "C-130", title: "Hydraulic Pump", priority: "Med", column: "source", value: 71, effort: 28, days: 620, office: "WR-ALC", site: "Robins AFB", opportunityId: "opp-c130-hyd", start: 1.1, span: 1.2 },
  { id: "p1904", code: "P-1904", platform: "B-52", title: "Avionics Bracket", priority: "Med", column: "engineering", value: 63, effort: 44, days: 480, office: "OC-ALC", site: "Tinker AFB", opportunityId: "opp-b52-avion", start: 0.4, span: 2 },
  { id: "p7720", code: "P-7720", platform: "F-15", title: "Actuator Housing", priority: "Low", column: "intake", value: 34, effort: 22, days: 260, office: "WR-ALC", site: "Robins AFB", opportunityId: "opp-f15-act", start: 0, span: 1.3 },
  { id: "p0987", code: "P-0987", platform: "F-135", title: "Turbine Case", priority: "High", column: "qualification", value: 88, effort: 78, days: 860, office: "AFLCMC", site: "Tinker AFB", start: 0.3, span: 2.6 },
  { id: "p1122", code: "P-1122", platform: "C-17", title: "Wing Mount", priority: "High", column: "qualification", value: 80, effort: 70, days: 740, office: "AFLCMC", site: "Robins AFB", start: 0.8, span: 1.8 },
  { id: "p0910", code: "P-0910", platform: "KC-46", title: "Manifold Block", priority: "Med", column: "source", value: 58, effort: 36, days: 410, office: "OC-ALC", site: "Tinker AFB", start: 1.6, span: 1 },
  { id: "p0755", code: "P-0755", platform: "C-17", title: "Landing Gear Fitting", priority: "Med", column: "field", value: 66, effort: 30, days: 390, office: "WR-ALC", site: "Robins AFB", start: 0.5, span: 0.9 },
  { id: "p1321", code: "P-1321", platform: "F-15", title: "Sensor Bracket", priority: "Low", column: "intake", value: 28, effort: 18, days: 140, office: "AFLCMC", site: "Hill AFB", start: 0.1, span: 1.1 },
  { id: "p1255", code: "P-1255", platform: "F-15", title: "Fuel Nozzle", priority: "Med", column: "qualification", value: 61, effort: 55, days: 330, office: "OC-ALC", site: "Hill AFB", start: 0.6, span: 1.7 },
  { id: "p0877", code: "P-0877", platform: "C-5", title: "Heat Exchanger", priority: "High", column: "qualification", value: 77, effort: 82, days: 510, office: "WR-ALC", site: "Robins AFB", start: 0.2, span: 2.8 },
  { id: "p0601", code: "P-0601", platform: "C-130", title: "Seat Track", priority: "Low", column: "field", value: 42, effort: 24, days: 180, office: "WR-ALC", site: "Robins AFB", start: 1.8, span: 0.8 },
  { id: "p1044", code: "P-1044", platform: "F-22", title: "Bleed Valve", priority: "Med", column: "engineering", value: 69, effort: 58, days: 450, office: "AFLCMC", site: "Hill AFB", start: 0.4, span: 2.1 },
  { id: "p1108", code: "P-1108", platform: "C-5", title: "Actuator Housing", priority: "Low", column: "intake", value: 31, effort: 48, days: 210, office: "OC-ALC", site: "AMARG", start: 0, span: 1.4 },
];

const POOLS = [
  { name: "Design engineers", avail: "4,000 hrs", req: "6,200 hrs", pct: 155 },
  { name: "Machine time (AM)", avail: "1,800 hrs", req: "1,200 hrs", pct: 67 },
  { name: "Heat treatment", avail: "640 hrs", req: "950 hrs", pct: 148 },
  { name: "Finishing", avail: "1,100 hrs", req: "1,230 hrs", pct: 112 },
  { name: "NDT / CT", avail: "180 scans", req: "330 scans", pct: 184 },
  { name: "Metrology", avail: "900 hrs", req: "1,120 hrs", pct: 124 },
  { name: "Testing (lab)", avail: "240 days", req: "410 days", pct: 171 },
  { name: "Airworthiness review", avail: "1,200 hrs", req: "1,580 hrs", pct: 132 },
];

const ALL = "All";

function uniq(values: string[]) {
  return [ALL, ...Array.from(new Set(values))];
}

function tone(pct: number) {
  if (pct >= 130) return "hot";
  if (pct >= 100) return "warn";
  return "ok";
}

export function PortfolioView({
  onOpen,
  onPending,
  onAsk,
}: {
  onOpen: (opportunityId: string, title: string, phase: "evidence" | "requirements" | "evaluation") => void;
  onPending: (code: string) => void;
  onAsk: (text: string) => void;
}) {
  const [platform, setPlatform] = useState(ALL);
  const [phase, setPhase] = useState(ALL);
  const [office, setOffice] = useState(ALL);
  const [site, setSite] = useState(ALL);
  const [scheduleSort, setScheduleSort] = useState<"completion" | "priority">("completion");

  const filtered = useMemo(
    () =>
      PROJECTS.filter(
        (project) =>
          (platform === ALL || project.platform === platform) &&
          (phase === ALL || project.column === phase) &&
          (office === ALL || project.office === office) &&
          (site === ALL || project.site === site),
      ),
    [platform, phase, office, site],
  );

  const active = filtered.length;
  const engineering = filtered.filter((project) => project.column === "engineering").length;
  const ready = filtered.filter((project) => project.column === "source" || project.column === "field").length;
  const days = filtered.reduce((sum, project) => sum + project.days, 0);
  const score = active ? Math.round(filtered.reduce((sum, project) => sum + project.value, 0) / active) : 0;
  const over = POOLS.filter((pool) => pool.pct > 100).length;
  const constraints = [...POOLS].sort((a, b) => b.pct - a.pct).slice(0, 4);
  const quarters = fiscalQuarters(HORIZON);
  const bands = yearBands(quarters);
  const first = quarters[0];
  const last = quarters[quarters.length - 1];
  const scheduleLabel = `FY${String(first.fy).slice(2)} Q${first.quarter} – FY${String(last.fy).slice(2)} Q${last.quarter}`;

  function open(project: Project) {
    if (!project.opportunityId) {
      onPending(project.code);
      return;
    }
    const next =
      project.column === "intake" ? "evidence" : project.column === "engineering" ? "requirements" : "evaluation";
    onOpen(project.opportunityId, project.title, next);
  }

  return (
    <div className="port">
      <div className="port-kpis">
        {[
          ["Active projects", String(active), "In scope"],
          ["In engineering", String(engineering), "Threads open"],
          ["Portfolio value", `${score}`, "Weighted readiness"],
          ["A/C days at stake", days.toLocaleString(), "Filtered scope"],
          ["Ready to field", String(ready), "Source or field"],
          ["Over capacity", String(over), "Constraint pools"],
        ].map(([label, value, note]) => (
          <div className="port-kpi" key={label}>
            <span>{label}</span>
            <b>{value}</b>
            <em>{note}</em>
          </div>
        ))}
      </div>

      <div className="port-filters">
        <Filter label="Weapon system" value={platform} options={uniq(PROJECTS.map((project) => project.platform))} onChange={setPlatform} />
        <Filter label="Phase" value={phase} options={[ALL, ...COLUMNS.map((column) => column.id)]} onChange={setPhase} />
        <Filter label="Program office" value={office} options={uniq(PROJECTS.map((project) => project.office))} onChange={setOffice} />
        <Filter label="Site" value={site} options={uniq(PROJECTS.map((project) => project.site))} onChange={setSite} />
        <button
          type="button"
          className="port-reset"
          onClick={() => {
            setPlatform(ALL);
            setPhase(ALL);
            setOffice(ALL);
            setSite(ALL);
          }}
        >
          Reset
        </button>
        <span className="port-scope">{active} projects in scope</span>
      </div>

      <div className="port-mid">
        <section className="port-panel">
          <header>
            <h3>Prioritization</h3>
            <span>Value against effort</span>
          </header>
          <Matrix projects={filtered} onOpen={open} />
          <p className="port-note">Bubble size is aircraft-days at stake. High value and low effort is the first cut.</p>
        </section>
        <section className="port-panel">
          <header>
            <h3>Capacity</h3>
            <span>Organic constraint pools</span>
          </header>
          <div className="pools">
            {POOLS.map((pool) => (
              <div className="pool" key={pool.name}>
                <div className="pool-top">
                  <strong>{pool.name}</strong>
                  <b className={tone(pool.pct)}>{pool.pct}%</b>
                </div>
                <div className="util" title={`${pool.pct}%`}>
                  <i className={tone(pool.pct)} style={{ width: `${Math.min(pool.pct, 200) / 2}%` }} />
                </div>
                <span>
                  {pool.avail} available · {pool.req} required
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="port-panel">
          <header>
            <h3>Constraints</h3>
            <span>What slips the portfolio</span>
          </header>
          <ol className="constraints">
            {constraints.map((pool, index) => (
              <li key={pool.name}>
                <em>{index + 1}</em>
                <div>
                  <strong>{pool.name}</strong>
                  <span>{pool.pct}% of available capacity</span>
                </div>
              </li>
            ))}
          </ol>
          <button type="button" className="port-ask" onClick={() => onAsk("Which projects slip if NDT and CT capacity is not added?")}>
            Ask what slips
          </button>
          <ul className="forecast">
            <li>
              <strong>NDT / CT</strong>
              <span>Critical in 30 days · qualification evidence waits on the scanner</span>
            </li>
            <li>
              <strong>Testing lab</strong>
              <span>Critical in 45 days</span>
            </li>
            <li>
              <strong>Heat treatment</strong>
              <span>Critical in 60 days · certified furnace time</span>
            </li>
          </ul>
          <div className="reco">
            <strong>Recommended</strong>
            <span>Add a certified CT shift before adding printer time.</span>
            <span>Hold qualification starts that still need a scan.</span>
            <span>Fit-check access is fixture and aircraft time, not a shop-hour pool.</span>
          </div>
        </section>
      </div>

      <section className="port-panel">
        <header>
          <h3>Portfolio board</h3>
          <span>Click a baselined part to open it in Engineering</span>
        </header>
        <div className="board">
          {COLUMNS.map((column) => {
            const items = filtered.filter((project) => project.column === column.id);
            return (
              <div className="board-col" key={column.id}>
                <div className="board-h">
                  <strong>{column.label}</strong>
                  <span>{items.length}</span>
                </div>
                {items.map((project) => (
                  <button type="button" className="board-card" key={project.id} onClick={() => open(project)}>
                    <span>
                      {project.code}
                      <i className={`dot ${project.priority.toLowerCase()}`} />
                    </span>
                    <b>
                      {project.platform} {project.title}
                    </b>
                  </button>
                ))}
                <div className="wip">WIP {column.wip}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="port-low">
        <section className="port-panel">
          <header>
            <h3>Schedule</h3>
            <div className="schedule-tools">
              <span>{scheduleLabel}</span>
              <label className="port-filter port-sort">
                Sort
                <select value={scheduleSort} onChange={(event) => setScheduleSort(event.target.value as "completion" | "priority")}>
                  <option value="completion">Completion date</option>
                  <option value="priority">Priority</option>
                </select>
              </label>
            </div>
          </header>
          <div className="gantt">
            <div className="fy-scale">
              <span />
              <span className="fy-bands">
                {bands.map((band) => (
                  <i key={band.fy} style={{ flex: band.span }}>
                    FY{String(band.fy).slice(2)}
                  </i>
                ))}
              </span>
            </div>
            <div className="gantt-scale">
              <span>Project</span>
              <span className="gantt-ticks" style={{ gridTemplateColumns: `repeat(${quarters.length}, 1fr)` }}>
                {quarters.map((cell) => (
                  <i key={`${cell.fy}-${cell.quarter}`}>Q{cell.quarter}</i>
                ))}
              </span>
            </div>
            {[...filtered]
              .sort((a, b) => {
                if (scheduleSort === "priority") {
                  const rank = { High: 0, Med: 1, Low: 2 };
                  return rank[a.priority] - rank[b.priority] || a.start + a.span - (b.start + b.span);
                }
                return a.start + a.span - (b.start + b.span) || a.start - b.start;
              })
              .map((project) => (
              <button type="button" className="gantt-row" key={project.id} onClick={() => open(project)}>
                <b>
                  {project.code} {project.title}
                </b>
                <span className="gantt-track">
                  <i style={{ left: `${(project.start / HORIZON) * 100}%`, width: `${(project.span / HORIZON) * 100}%` }} />
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Filter({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="port-filter">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === "intake" || option === "engineering" || option === "qualification" || option === "source" || option === "field"
              ? option[0].toUpperCase() + option.slice(1)
              : option}
          </option>
        ))}
      </select>
    </label>
  );
}

function Matrix({ projects, onOpen }: { projects: Project[]; onOpen: (project: Project) => void }) {
  return (
    <>
    <svg className="matrix" viewBox="0 0 360 188" role="img" aria-label="Value versus effort">
      <rect x="28" y="8" width="320" height="160" className="matrix-plot" />
      <line x1="188" y1="8" x2="188" y2="168" className="matrix-mid" />
      <line x1="28" y1="88" x2="348" y2="88" className="matrix-mid" />
      {projects.map((project) => {
        const cx = 28 + (project.effort / 100) * 320;
        const cy = 168 - (project.value / 100) * 160;
        const r = 4 + Math.min(project.days, 1400) / 260;
        return (
          <circle
            key={project.id}
            cx={cx}
            cy={cy}
            r={r}
            className={`bubble ${project.priority.toLowerCase()}`}
            onClick={() => onOpen(project)}
          >
            <title>
              {project.code} {project.title}
            </title>
          </circle>
        );
      })}
    </svg>
    <div className="matrix-key">
      <span>Low effort</span>
      <span>High value, low effort is the first cut</span>
      <span>High effort</span>
    </div>
    </>
  );
}
export function missionRollup() {
  const missions = [
    { id: "mobility", label: "Mobility", note: "Airlift and tankers", platforms: ["C-17", "C-5", "C-130", "KC-135", "KC-46"] },
    { id: "bombers", label: "Bombers", note: "Strategic deterrent", platforms: ["B-52"] },
    { id: "fighters", label: "Fighters", note: "Air superiority", platforms: ["F-15", "F-22", "F-135"] },
  ] as const;
  return missions.map((mission) => {
    const rows = PROJECTS.filter((project) => (mission.platforms as readonly string[]).includes(project.platform));
    return {
      id: mission.id,
      label: mission.label,
      note: mission.note,
      projects: rows.length,
      days: rows.reduce((sum, project) => sum + project.days, 0),
      systems: mission.platforms
        .map((platform) => {
          const items = rows.filter((project) => project.platform === platform);
          return { platform, projects: items.length, days: items.reduce((sum, project) => sum + project.days, 0) };
        })
        .filter((system) => system.projects > 0),
    };
  });
}

export function MissionPortfolioView({
  onProjects,
  onPlatform,
}: {
  onProjects: () => void;
  onPlatform: (platform: string) => void;
}) {
  const missions = missionRollup();
  const projects = missions.reduce((sum, mission) => sum + mission.projects, 0);
  const days = missions.reduce((sum, mission) => sum + mission.days, 0);
  return (
    <div className="port">
      <div className="port-kpis">
        <div className="port-kpi">
          <span>Mission areas</span>
          <b>{missions.length}</b>
          <em>In this scope</em>
        </div>
        <div className="port-kpi">
          <span>Projects</span>
          <b>{projects}</b>
          <em>Committed work</em>
        </div>
        <div className="port-kpi">
          <span>A/C days at stake</span>
          <b>{days.toLocaleString()}</b>
          <em>Across the portfolio</em>
        </div>
      </div>
      <div className="mission-grid">
        {missions.map((mission) => (
          <section className="port-panel" key={mission.id}>
            <header>
              <h3>{mission.label}</h3>
              <span>{mission.note}</span>
            </header>
            <div className="mission-stats">
              <div>
                <b>{mission.projects}</b>
                <span>Projects</span>
              </div>
              <div>
                <b>{mission.days.toLocaleString()}</b>
                <span>A/C days</span>
              </div>
            </div>
            <button type="button" className="linkish" onClick={onProjects}>
              View projects →
            </button>
          </section>
        ))}
      </div>
      <section className="port-panel">
        <header>
          <h3>Weapon systems</h3>
          <span>Open a system to see its fleet concerns</span>
        </header>
        <div className="mission-table">
          {missions.map((mission) => (
            <div key={mission.id}>
              <strong>{mission.label}</strong>
              {mission.systems.map((system) => (
                <button type="button" key={system.platform} onClick={() => onPlatform(system.platform)}>
                  <b>{system.platform}</b>
                  <span>{system.projects} projects</span>
                  <span>{system.days.toLocaleString()} A/C days</span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="port-note">Armament has no work in this scope.</p>
      </section>
    </div>
  );
}