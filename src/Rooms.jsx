import { useState } from 'react'
import { about, profile, projects, skills } from './content.js'

/* ─── Shared Badge ─── */
function Badge({ text, variant = 'default' }) {
  return <span className={`badge badge--${variant}`}>{text}</span>
}

/* ─── Project Card ─── */
function ProjectCard({ p, index }) {
  const [expanded, setExpanded] = useState(false)
  const tilt = `${(index % 2 ? 1 : -1) * (0.3 + (index % 3) * 0.2)}deg`
  return (
    <article
      className="card"
      style={{ '--tilt': tilt }}
      aria-label={p.title}
    >
      <span className="card-border" aria-hidden="true" />
      <div className="card-head">
        <span className="card-category">{p.category}</span>
        {p.badge && <Badge text={p.badge} variant={p.badgeVariant || (p.badge.includes('Latest') ? 'highlight' : 'subtle')} />}
        {p.status === 'in-progress' && <Badge text="Work in Progress" variant="warn" />}
      </div>
      <h3>{p.title}</h3>
      {p.image && (
        <div className="card-img-wrap">
          <img src={p.image} alt={`${p.title} preview`} className="card-image" loading="lazy" />
        </div>
      )}
      <p className="card-blurb">{p.blurb}</p>
      {expanded && (
        <ul className="card-detail">
          {p.description.map((d, i) => <li key={i}>{d}</li>)}
        </ul>
      )}
      <button
        className="card-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? 'Show less ↑' : 'Show more ↓'}
      </button>
      <ul className="tags">
        {p.tags.map((t) => <li key={t}>{t}</li>)}
      </ul>
      <div className="card-actions">
        {p.github && (
          <a className="btn-link" href={p.github} target="_blank" rel="noopener noreferrer">
            View on GitHub ↗
          </a>
        )}
        {p.demo ? (
          <a className="btn-link btn-link--accent" href={p.demo} target="_blank" rel="noopener noreferrer">
            Live Demo ↗
          </a>
        ) : null}
      </div>
    </article>
  )
}

/* ─── Work Room ─── */
function Work() {
  return (
    <>
      <h2>Selected Work</h2>
      <p className="lede">
        Projects across AI/ML, cybersecurity, web development, and Android — built to solve real problems.
      </p>
      <div className="cards">
        {projects.map((p, i) => <ProjectCard key={p.id} p={p} index={i} />)}
      </div>
    </>
  )
}

/* ─── Skills Room ─── */
function Skills() {
  return (
    <>
      <h2>Skills</h2>
      <p className="lede">Technologies and tools I've used across my projects.</p>
      <div className="skills-grid">
        {Object.values(skills).map((group) => (
          <div key={group.label} className="skill-group">
            <h3>{group.label}</h3>
            <ul className="tags big">
              {group.items.map((s) => <li key={s}>{s}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}

/* ─── Achievement Card ─── */
function AchievementCard({ ach, index }) {
  const tilt = `${(index % 2 ? 0.35 : -0.35)}deg`
  return (
    <article
      className={`card achievement-card ${ach.featured ? 'achievement-card--featured' : ''}`}
      style={{ '--tilt': tilt }}
      aria-label={ach.title}
    >
      <span className="card-border" aria-hidden="true" />
      <div className="card-head achievement-card-head">
        <div className="achievement-title-area">
          <span className="card-category">
            {ach.project} {ach.category ? `· ${ach.category}` : ''} · {ach.year}
          </span>
          <h3 className="achievement-card-title">{ach.title}</h3>
        </div>
        {ach.badge && (
          <div className="achievement-badge-wrap">
            <Badge
              text={ach.badge}
              variant={ach.badgeVariant || (ach.featured ? 'highlight' : 'subtle')}
            />
          </div>
        )}
      </div>
      <p className="card-blurb achievement-desc">{ach.description}</p>
    </article>
  )
}

/* ─── About Room ─── */
function About() {
  return (
    <>
      <h2>About</h2>
      <div className="two-col">
        <div>
          {about.bio.map((para, i) => <p key={i}>{para}</p>)}
          <div className="about-edu">
            <h3>Education</h3>
            <p className="edu-degree">{about.education.degree}</p>
            <p className="meta">{about.education.institution} · {about.education.status}</p>
          </div>
          <h3>Currently learning</h3>
          <ul className="tags">
            {about.currentlyLearning.map((s) => <li key={s}>{s}</li>)}
          </ul>
          <h3>Interests</h3>
          <ul className="interest-list">
            {about.interests.map((interest) => (
              <li key={interest}>{interest}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Hackathons & Achievements</h3>
          <div className="achievements-cards">
            {about.achievements && about.achievements.map((ach, idx) => (
              <AchievementCard key={ach.id} ach={ach} index={idx} />
            ))}
          </div>

          <h3>Experience</h3>
          <div className="experience-list">
            {about.experience.map((exp) => (
              <div key={exp.title} className="experience-item">
                <div className="experience-head">
                  <strong className="experience-title">{exp.title}</strong>
                  {exp.badge && <Badge text={exp.badge} variant={exp.badgeVariant || 'default'} />}
                </div>
                <span className="experience-org">{exp.organization}</span>
                {exp.type && <span className="experience-type-tag">{exp.type}</span>}
                <p className="experience-desc">{exp.description}</p>
                {exp.highlights && (
                  <ul className="experience-bullets">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <h3>Milestones & Timeline</h3>
          <ul className="timeline">
            {about.timeline.map((t, idx) => (
              <li key={t.when + t.what + idx} className={t.featured ? 'timeline-item--featured' : ''}>
                <span className="timeline-year">{t.when}</span>
                <div className="timeline-body">
                  <div className="timeline-title-row">
                    <strong className="timeline-title">{t.what}</strong>
                    {t.badge && (
                      <Badge
                        text={t.badge}
                        variant={t.badgeVariant || (t.featured ? 'highlight' : 'subtle')}
                      />
                    )}
                  </div>
                  <em className="timeline-org">{t.where}</em>
                  {t.detail && <p className="timeline-detail">{t.detail}</p>}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

/* ─── Contact Room ─── */
function Contact() {
  const [form, setForm] = useState({ name: '', message: '' })
  const submit = (e) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Hello from ${form.name || 'your portfolio visitor'}`)
    const body = encodeURIComponent(form.message)
    const mailto = profile.email
      ? `mailto:${profile.email}?subject=${subject}&body=${body}`
      : `mailto:?subject=${subject}&body=${body}`
    window.location.href = mailto
  }
  return (
    <>
      <h2>Say hello</h2>
      <p className="lede">{profile.availability}</p>
      <div className="two-col">
        <form onSubmit={submit} className="form">
          <label>
            Your name
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Your name"
              autoComplete="name"
            />
          </label>
          <label>
            Message
            <textarea
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tell me about your project or opportunity…"
            />
          </label>
          <button type="submit" className="btn">Open in email app</button>
        </form>
        <div>
          <h3>Find me online</h3>
          <ul className="socials">
            {profile.socials.map((s) => (
              <li key={s.label}>
                <a className="link" href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
          <p className="contact-note">
            I'm open to internship opportunities, collaborative projects, and conversations about AI/ML, software engineering, and full-stack development.
          </p>
        </div>
      </div>
    </>
  )
}

const VIEWS = { work: Work, about: About, skills: Skills, contact: Contact }

export default function Room({ id, onClose }) {
  const View = VIEWS[id]
  if (!View) return null
  return (
    <section className="room" role="dialog" aria-modal="true" aria-label={id}>
      <button className="back" onClick={onClose} aria-label="Back to hall">
        ← back to the hall
      </button>
      <div className="room-inner">
        <View />
      </div>
    </section>
  )
}

