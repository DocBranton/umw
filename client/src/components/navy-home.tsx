const phases = [
  ["1. Plan", "Align mission requirements"],
  ["2. Allocate", "Assign assets and resources"],
  ["3. Execute", "Coordinate and monitor"],
  ["4. Assess", "Measure impact"],
  ["5. Improve", "Capture lessons learned"],
  ["6. Sustain", "Institutionalize capability"],
  ["7. Scale", "Support the global force"],
];

const units = [
  ["pk", "HSM-74", "MH-60R Seahawk", "Maritime patrol", "10 Jun 14:32"],
  ["pk", "VFA-125", "F-35C Lightning II", "Carrier air wing", "10 Jun 12:18"],
  ["rm", "VRC-30", "C-2A Greyhound", "Logistics support", "10 Jun 14:17"],
  ["pk", "HSC-28", "MH-60S Knighthawk", "Personnel recovery", "10 Jun 09:21"],
  ["pk", "VP-47", "P-8A Poseidon", "ISR / ASW", "09 Jun 20:12"],
  ["rm", "VAW-123", "E-2D Advanced Hawkeye", "Battle management", "09 Jun 11:06"],
  ["pk", "VFA-213", "F/A-18E Super Hornet", "Strike / CAS", "10 Jun 16:01"],
  ["rm", "VXE-1", "MQ-25A Stingray", "ISR / UAS", "08 Jun 08:33"],
];

const ops = [
  ["MH-60R Seahawks", "Avionics modernization", "NAS Norfolk", "10 Jun", "Complete"],
  ["F-35C Lightning II", "Engine module swap", "NAWC Patuxent", "10 Jun", "Complete"],
  ["C-2A Greyhound", "Scheduled phase maint.", "NAS North Island", "09 Jun", "Complete"],
  ["P-8A Poseidon", "Mission system upgrade", "NAS Jacksonville", "09 Jun", "In progress"],
  ["E-2D Advanced Hawkeye", "Radar and comms update", "NAWC Lakehurst", "08 Jun", "Complete"],
  ["MQ-25A Stingray", "UAS control system", "NAS Patuxent", "08 Jun", "In progress"],
];

const kpis = [
  ["342", "Aircraft operational", "+12%"],
  ["86", "Ongoing modifications", "+5%"],
  ["132", "Active test and evaluation", "+12%"],
  ["221", "Maintenance actions", "+15%"],
  ["281", "NAVAIR civilians", "+8%"],
];

const tape = [
  "P-8 at Rota executes a multinational exercise",
  "F-35C flight clears for carrier qualification",
  "HSC GOA deploys to INDOPACOM",
  "Weather status: green",
  "P-8 enters phase IV test window",
  "C-40A maintenance milestone complete",
];

export function NavyHome({ onProject }: { onProject: () => void }) {
  return (
    <section className="army-home navy-home view active">
      <div className="navy-tape">
        {tape.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <div className="army-kpis">
        {kpis.map(([n, label, delta]) => (
          <article key={label}><b>{n}</b><span>{label}</span><em>{delta}</em></article>
        ))}
      </div>
      <div className="army-hero">
        <img src="/navy-hero.jpg" alt="" />
        <div className="army-hero-copy">
          <h2>
            RIGHT SOLUTION.
            <br />
            RIGHT LOCATION.
            <br />
            MISSION READY.
          </h2>
          <p>Delivering air power, readiness, and support to the warfighter across the globe. Anytime, anywhere.</p>
        </div>
        <div className="army-call a">P-8A mission support<span>ISR // INDOPACOM</span></div>
        <div className="army-call b">F-35C operational testing<span>VX-9 // Atlantic</span></div>
        <div className="army-call c">Mission readiness<span>People, platforms, and support. Anytime, anywhere.</span></div>
        <div className="army-call d">C-40A fleet support<span>Airlift // Europe</span></div>
        <button type="button" className="army-dash" onClick={onProject}>Explore the mission</button>
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
          <header><h3>Active operational units</h3><button type="button" onClick={onProject}>View all</button></header>
          <table>
            <thead><tr><th></th><th>Unit</th><th>Platform</th><th>Mission</th><th>Last activity</th></tr></thead>
            <tbody>
              {units.map((row) => (
                <tr key={row[1]} onClick={onProject}>
                  <td><i className={row[0] === "pk" ? "pk" : "rm"} /></td>
                  <td>{row[1]}</td>
                  <td>{row[2]}</td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <section className="army-status">
          <header><h3>Selected asset detail</h3><em>Mission capable</em></header>
          <div className="army-part">
            <img src="/assets/am-hinge.jpg" alt="" />
            <div>
              <strong>F-35C IOC-410</strong>
              <span>Enhancing readiness · NAS Lemoore</span>
              <button type="button" onClick={onProject}>View flight history</button>
            </div>
          </div>
          <dl>
            <div><b>1,321</b><span>Flight hours</span></div>
            <div><b>$28.4M</b><span>Lifecycle cost</span></div>
            <div><b>42</b><span>Days since depot</span></div>
          </dl>
        </section>
        <section>
          <header><h3>Recent sustainment</h3></header>
          <ul>
            {ops.map(([asset, op, where, when, status]) => (
              <li key={asset + op}>
                <b>{asset}</b>
                <time className={status === "Complete" ? "done" : ""}>{status}</time>
                <span>{op} · {where} · {when}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
