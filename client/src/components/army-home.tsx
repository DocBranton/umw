const phases = [
  ["Strategy", "Plan the future force"],
  ["Requirements", "Define capabilities"],
  ["Engineering", "Design and integrate"],
  ["In test", "Verify and validate"],
  ["Contract", "Produce and field"],
  ["In service", "Sustain and modernize"],
  ["Closeout", "Capture and modernize"],
];

const programs = [
  ["UH-60", "Black Hawk Modernization", "Engineering", "Milestone B Q1FY27"],
  ["AH-64E", "Apache Modernization", "Production", "Initial operational test Q1FY26"],
  ["CH-47F", "Chinook Modernization", "Sustainment", "Milestone C Q3FY26"],
  ["FLRAA", "Future Long Range Assault", "Development", "Milestone B Q3FY27"],
  ["FARA", "Future Attack Reconnaissance", "Engineering", "Critical design review Q4FY26"],
  ["MV-75", "Next Gen Vertical Lift", "Risk reduction", "Milestone B Q2FY26"],
];

const reading = [
  ["Aviation Modernization Strategy", "Strategic guidance", "24 Apr 26"],
  ["UH-72A Initial Operational Test", "Test and evaluation", "22 Apr 26"],
  ["Sustainment Analysis Update", "Logistics and support", "18 Apr 26"],
  ["AH-64E v6.0 Technical Data", "Technical data", "14 Apr 26"],
  ["MV-75 Program Brief", "Acquisition", "10 Apr 26"],
];

const kpis = [
  ["342", "Active operations", "+23%"],
  ["85", "Flight testing", "+13%"],
  ["57", "Program plans", "+33%"],
  ["122", "Test events", "+33%"],
  ["221", "Workforce online", "+30%"],
];

export function ArmyHome({ onProject }: { onProject: () => void }) {
  return (
    <section className="army-home view active">
      <div className="army-kpis">
        {kpis.map(([n, label, delta]) => (
          <article key={label}><b>{n}</b><span>{label}</span><em>{delta}</em></article>
        ))}
      </div>
      <div className="army-hero">
        <img src="/army-hero.jpg" alt="" />
        <div className="army-hero-copy">
          <h2>
            RIGHT SOLUTION.
            <br />
            RIGHT LOCATION.
            <br />
            MISSION READY.
          </h2>
          <p>Connect aviation readiness across development, acquisition, and sustainment to deliver capability today and tomorrow.</p>
        </div>
        <div className="army-call a">Global support<span>Sustainment readiness across the force</span></div>
        <div className="army-call b">Acquisition insights<span>From need to capability</span></div>
        <div className="army-call c">Mission focused. People.<span>Delivering aviation capability and operational excellence.</span></div>
        <div className="army-call d">Aviation readiness<span>Depots, sustainment, demand</span></div>
        <button type="button" className="army-dash" onClick={onProject}>Program dashboard</button>
      </div>

      <div className="army-ribbon">
        {phases.map(([title, note], index) => (
          <button key={title} type="button" className={index === 3 ? "on" : ""} onClick={onProject}>
            <b>{title}</b>
            <span>{note}</span>
          </button>
        ))}
      </div>

      <div className="army-deck">
        <section>
          <header><h3>Active aviation programs</h3><button type="button" onClick={onProject}>View all</button></header>
          <table>
            <thead><tr><th>Platform</th><th>Program</th><th>Phase</th><th>Next milestone</th></tr></thead>
            <tbody>
              {programs.map((row) => (
                <tr key={row[0]} onClick={onProject}>
                  {row.map((cell) => <td key={cell}>{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="army-status">
          <header><h3>Selected system status</h3><em>In production</em></header>
          <div className="army-part">
            <img src="/assets/am-hinge.jpg" alt="" />
            <div>
              <strong>UH-60M main gearbox bracket</strong>
              <button type="button" onClick={onProject}>View technical data</button>
            </div>
          </div>
          <dl>
            <div><b>1,250</b><span>Units produced</span></div>
            <div><b>98.4%</b><span>On-time delivery</span></div>
            <div><b>28</b><span>Open actions</span></div>
          </dl>
        </section>
        <section>
          <header><h3>Recent aviation content</h3></header>
          <ul>
            {reading.map(([title, kind, when]) => (
              <li key={title}><b>{title}</b><span>{kind}</span><time>{when}</time></li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
