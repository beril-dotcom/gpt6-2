import { useEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent, ReactNode } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Plus } from 'lucide-react'

const artworkRoot = '/original-south-florida'

const galleryImages = [
  { src: `${artworkRoot}/hero-sunset.webp`, alt: 'Fictional coastal city at sunset with two artists’ original characters' },
  { src: `${artworkRoot}/art-deco-motel.webp`, alt: 'Original art deco motel by the South Florida coast' },
  { src: `${artworkRoot}/partners-at-dusk.webp`, alt: 'Two original characters outside a roadside station at dusk' },
  { src: `${artworkRoot}/coastal-city-at-night.webp`, alt: 'Original neon-lit coastal city at night' },
]

const projects = [
  {
    number: '01',
    category: 'Environment study',
    name: 'Sunset District',
    description: 'A coastal skyline caught between the last warm light and the first neon reflections.',
    image: `${artworkRoot}/hero-sunset.webp`,
    alt: 'A fictional coastal skyline with palms, water, and a violet sunset',
    tone: 'plum',
  },
  {
    number: '02',
    category: 'Location concept',
    name: 'The Pink Motel',
    description: 'Art deco lines, tropical rain, and a roadside stop that glows long after sunset.',
    image: `${artworkRoot}/art-deco-motel.webp`,
    alt: 'A fictional pink art deco motel beside the ocean at dusk',
    tone: 'blue',
  },
  {
    number: '03',
    category: 'Character scene',
    name: 'Last Light, Eastbound',
    description: 'Two original characters look toward the city as the coast shifts into night.',
    image: `${artworkRoot}/partners-at-dusk.webp`,
    alt: 'Two fictional adult partners beside a car in a neon coastal city',
    tone: 'coral',
  },
]

const capabilities = [
  ['01', 'World building', 'Original environments, landmarks, and small details that make a place feel lived in.'],
  ['02', 'Lighting & rendering', 'Dusk, neon, reflections, and cinematic frames shaped around the feeling of a scene.'],
  ['03', 'Motion & art direction', 'Movement, pacing, and visual systems that give a digital world its own pulse.'],
]

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.72, delay, ease: [0.32, 0.72, 0, 1] }}
    >
      {children}
    </motion.div>
  )
}

function MagneticLink({ children, href, outline = false }: { children: ReactNode; href: string; outline?: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  function handlePointerMove(event: PointerEvent<HTMLAnchorElement>) {
    const bounds = ref.current?.getBoundingClientRect()
    if (!bounds) return
    setOffset({
      x: (event.clientX - bounds.left - bounds.width / 2) * 0.08,
      y: (event.clientY - bounds.top - bounds.height / 2) * 0.08,
    })
  }

  return (
    <motion.a
      ref={ref}
      className={`gta6-button${outline ? ' gta6-button--outline' : ''}`}
      href={href}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 240, damping: 18 }}
    >
      <span>{children}</span>
      <ArrowUpRight size={17} aria-hidden="true" />
    </motion.a>
  )
}

function MarqueeSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const firstRow = useRef<HTMLDivElement>(null)
  const secondRow = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const top = (sectionRef.current?.getBoundingClientRect().top ?? 0) + window.scrollY
        const distance = (window.scrollY - top + window.innerHeight) * 0.17
        if (firstRow.current) firstRow.current.style.transform = `translate3d(${distance - 90}px,0,0)`
        if (secondRow.current) secondRow.current.style.transform = `translate3d(${90 - distance}px,0,0)`
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const renderRow = (row: number) => (
    <div className="gallery-track" ref={row === 0 ? firstRow : secondRow}>
      {[0, 1, 2].map(copy => galleryImages.map((image, index) => (
        <figure className="gta6-card gallery-tile" key={`${row}-${copy}-${index}`}>
          <img className="gta6-card__image" src={image.src} alt={image.alt} loading="lazy" />
        </figure>
      )))}
    </div>
  )

  return (
    <section id="gallery" className="gallery-section" ref={sectionRef} aria-label="South Florida environment artwork">
      <div className="gta6-container gallery-heading">
        <p className="gta6-eyebrow">A FEW FRAMES FROM THE COAST</p>
        <span className="gallery-index">ORIGINAL ENVIRONMENT STUDIES · 01—04</span>
      </div>
      <div className="gallery-window">
        {renderRow(0)}
        {renderRow(1)}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1 - (projects.length - index - 1) * 0.025])

  return (
    <div className="project-card-wrap" ref={ref}>
      <motion.article className={`gta6-card project-card project-card--${project.tone}`} style={{ scale, top: `calc(5.5rem + ${index * 20}px)`, zIndex: index + 1 }}>
        <div className="project-card-image">
          <img className="gta6-card__image" src={project.image} alt={project.alt} loading="lazy" />
          <span className="project-image-index">{project.number} / 03</span>
          <span className="project-image-label">PERSONAL WORLD STUDY</span>
        </div>
        <div className="gta6-card__body project-card-body">
          <div className="project-meta"><span>{project.category}</span><ArrowUpRight size={19} aria-hidden="true" /></div>
          <div>
            <h3 className="gta6-display--card">{project.name}</h3>
            <p>{project.description}</p>
          </div>
          <span className="project-footer-label">3D ENVIRONMENT · ART DIRECTION</span>
        </div>
      </motion.article>
    </div>
  )
}

function App() {
  const [scrolled, setScrolled] = useState(false)
  const heroStyle = { '--gta6-hero-image': `url('${artworkRoot}/hero-sunset.webp')` } as CSSProperties

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <main className="gta6-theme site-shell">
      <section id="top" className="gta6-hero portfolio-hero" style={heroStyle}>
        <header className={`portfolio-nav${scrolled ? ' is-scrolled' : ''}`}>
          <a className="portfolio-brand" href="#top" aria-label="Jack 3D Creator home"><span className="brand-monogram">J<span>.</span></span><span>JACK<br />3D CREATOR</span></a>
          <nav aria-label="Main navigation">
            <a href="#about">About</a>
            <a href="#capabilities">Capabilities</a>
            <a href="#work">Selected worlds</a>
          </nav>
          <a className="nav-contact gta6-link" href="#contact">Let’s talk <ArrowUpRight size={15} aria-hidden="true" /></a>
        </header>

        <div className="gta6-hero__content hero-content">
          <motion.p className="gta6-eyebrow hero-eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            INDEPENDENT 3D ARTIST · ENVIRONMENT DESIGN
          </motion.p>
          <motion.h1 className="gta6-hero__title gta6-display--hero" initial={{ opacity: 0, y: 38 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.85, ease: [0.32, 0.72, 0, 1] }}>
            A WORLD<br /><span>AFTER DARK</span>
          </motion.h1>
          <motion.p className="hero-intro" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            Original 3D worlds shaped by tropical light, neon color, and the stories a place can hold.
          </motion.p>
          <motion.div className="hero-actions" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.64 }}>
            <MagneticLink href="#work">Explore selected worlds</MagneticLink>
            <MagneticLink href="#about" outline>About the artist</MagneticLink>
          </motion.div>
        </div>

        <div className="hero-bottomline"><span>FLORIDA · 25°46′ N</span><span>LIGHT FADES. THE CITY COMES ALIVE.</span></div>
        <a className="hero-scroll" href="#gallery"><span>Scroll to explore</span><ArrowDown size={15} aria-hidden="true" /></a>
        <span className="hero-edition">PORTFOLIO VOL. 01 <i /> 2026</span>
      </section>

      <MarqueeSection />

      <section id="about" className="gta6-section gta6-sunset about-section">
        <div className="gta6-container about-grid">
          <Reveal><p className="gta6-eyebrow">A NOTE FROM THE ARTIST</p></Reveal>
          <Reveal className="about-copy-wrap" delay={0.1}>
            <h2 className="gta6-display--section">I BUILD WORLDS THAT FEEL LIKE A MEMORY.</h2>
            <p className="gta6-copy about-copy">The last wash of pink on the skyline. A motel sign reflected in rain. A quiet road back toward the city. I’m Jack, a 3D creator exploring the atmosphere and character of places after dark.</p>
            <a className="gta6-link about-link" href="#contact">More about the work <ArrowUpRight size={16} aria-hidden="true" /></a>
          </Reveal>
        </div>
        <hr className="gta6-neon-rule about-rule" />
        <div className="gta6-container about-stats">
          <span>ENVIRONMENT ART</span><span>LIGHTING & RENDERING</span><span>VISUAL STORYTELLING</span>
        </div>
      </section>

      <section id="capabilities" className="gta6-section capability-section">
        <div className="gta6-container">
          <Reveal className="capability-heading"><p className="gta6-eyebrow">FROM FIRST SKETCH TO FINAL FRAME</p><h2 className="gta6-display--section">WHAT I BRING<br />INTO THE WORLD.</h2></Reveal>
          <div className="capability-grid">
            {capabilities.map(([number, title, description], index) => (
              <Reveal key={number} delay={index * 0.08}>
                <article className="gta6-card gta6-card--plum capability-card">
                  <div className="capability-top"><span>{number} / CAPABILITY</span><Plus size={18} aria-hidden="true" /></div>
                  <h3 className="gta6-display--card">{title}</h3>
                  <p>{description}</p>
                  <span className="capability-orbit" aria-hidden="true" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="work" className="gta6-section projects-section">
        <div className="gta6-container projects-heading">
          <Reveal><p className="gta6-eyebrow">SELECTED WORLDS · PERSONAL STUDIES</p></Reveal>
          <Reveal delay={0.08}><h2 className="gta6-display--section">SOMEWHERE BETWEEN<br />SUNSET AND NEON.</h2></Reveal>
          <Reveal delay={0.16}><p className="projects-intro">Small windows into an original coastal-city world and the places that make it feel real.</p></Reveal>
        </div>
        <div className="gta6-container project-stack">
          {projects.map((project, index) => <ProjectCard key={project.number} project={project} index={index} />)}
        </div>
      </section>

      <footer id="contact" className="portfolio-footer">
        <div className="gta6-container footer-main">
          <Reveal><p className="gta6-eyebrow">HAVE A WORLD IN MIND?</p></Reveal>
          <Reveal delay={0.08}><h2 className="gta6-display--section">LET’S MAKE<br />IT FEEL REAL.</h2></Reveal>
          <Reveal delay={0.16}><MagneticLink href="#work">Explore the selected worlds</MagneticLink></Reveal>
        </div>
        <div className="gta6-container footer-bottom"><span>JACK · 3D CREATOR</span><span>ORIGINAL SOUTH FLORIDA CONCEPT ART</span><a href="#top">BACK TO TOP ↑</a></div>
      </footer>
    </main>
  )
}

export default App
