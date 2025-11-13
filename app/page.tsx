"use client"

import type React from "react"
import { useState, useEffect, useRef, useContext, createContext } from "react"
import { motion, AnimatePresence, useScroll } from "framer-motion"
import {
  Menu,
  X,
  Sun,
  Moon,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Activity,
  Music,
  Gamepad2,
  Headphones,
  Tv,
  Loader2,
} from "lucide-react"

// ============================================================================
// CUSTOM CURSOR COMPONENT
// ============================================================================

const CustomCursor: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })

      const target = e.target as HTMLElement
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a") ||
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA"

      setIsHovering(!!isInteractive)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <>
      {/* Outer ring cursor - cyan accent */}
      <motion.div
        ref={cursorRef}
        className="fixed w-8 h-8 border-2 border-cyan-400 dark:border-cyan-300 rounded-full pointer-events-none z-[9999] mix-blend-screen"
        animate={{
          x: mousePosition.x - 16,
          y: mousePosition.y - 16,
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      />

      {/* Inner dot cursor - cyan accent */}
      <motion.div
        ref={dotRef}
        className="fixed w-2 h-2 bg-cyan-400 dark:bg-cyan-300 rounded-full pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ type: "spring", stiffness: 800, damping: 35 }}
      />
    </>
  )
}

// ============================================================================
// THEME CONTEXT
// ============================================================================

interface ThemeContextType {
  isDark: boolean
  setIsDark: (value: boolean) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}

// ============================================================================
// THEME PROVIDER
// ============================================================================

const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")

    if (savedTheme === "dark") {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }

    setIsInitialized(true)
  }, [])

  const handleThemeToggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem("theme", newIsDark ? "dark" : "light")

    if (newIsDark) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        setIsDark: handleThemeToggle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

// ============================================================================
// HEADER COMPONENT
// ============================================================================

const Header: React.FC = () => {
  const { isDark, setIsDark } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    element?.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  return (
    <motion.header
      className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-cyan-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
          >
            Portfolio
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {["Home", "About", "Roadmap", "Projects", "Contact"].map((item) => (
              <motion.button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-gray-700 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.button>
            ))}
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              onClick={() => setIsDark()}
              className="p-2 rounded-lg hover:bg-cyan-100 dark:hover:bg-cyan-900/30 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Toggle dark mode"
            >
              {isDark ? <Sun className="w-5 h-5 text-cyan-400" /> : <Moon className="w-5 h-5 text-cyan-500" />}
            </motion.button>

            {/* Mobile Menu Button */}
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Toggle menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
            >
              <div className="flex flex-col gap-3">
                {["Home", "About", "Roadmap", "Projects", "Contact"].map((item) => (
                  <motion.button
                    key={item}
                    onClick={() => scrollToSection(item.toLowerCase())}
                    className="text-left text-gray-700 dark:text-gray-300 hover:text-cyan-500 py-2"
                    whileHover={{ x: 4 }}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}

// ============================================================================
// HERO SECTION
// ============================================================================

const HeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Hi, I'm lquan
        </motion.h1>

        <motion.p
          className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Senior Front-End Engineer & UI/UX Designer
        </motion.p>

        <motion.p
          className="text-lg text-gray-500 dark:text-gray-500 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          I craft beautiful, performant digital experiences using React, TypeScript, and modern web technologies.
          Passionate about accessibility and pixel-perfect design.
        </motion.p>

        {/* Social Links */}
        <motion.div
          className="flex justify-center gap-6 mb-12 flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: Github, href: "#", label: "GitHub" },
            { icon: Linkedin, href: "#", label: "LinkedIn" },
            { icon: Mail, href: "#", label: "Email" },
          ].map((social) => (
            <motion.a
              key={social.label}
              href={social.href}
              className="p-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 dark:hover:text-white transition-colors"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title={social.label}
            >
              <social.icon className="w-6 h-6" />
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Button - cyan accent */}
        <motion.button
          onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get In Touch
        </motion.button>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-16"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          <ChevronDown className="w-6 h-6 mx-auto text-cyan-400" />
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// INTRODUCTION SECTION
// ============================================================================

const IntroductionSection: React.FC = () => {
  const features = [
    {
      icon: Sparkles,
      title: "Modern Design",
      description: "Crafted with attention to detail and modern design principles for exceptional user experiences.",
    },
    {
      icon: ExternalLink,
      title: "Performance First",
      description: "Optimized for speed and efficiency, ensuring fast load times and smooth interactions.",
    },
    {
      icon: Github,
      title: "Open Source",
      description: "Passionate about contributing to the community and building tools that help others.",
    },
  ]

  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-900 dark:text-white">About This Portfolio</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Welcome to my digital space. This portfolio showcases my journey as a front-end engineer, highlighting my
            expertise in building scalable, accessible, and visually stunning web applications.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <feature.icon className="w-12 h-12 text-gray-900 dark:text-white mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 md:p-12 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">My Expertise</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>React & TypeScript for robust, type-safe applications</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>Responsive design and mobile-first development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>Web accessibility (WCAG) and semantic HTML</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>Performance optimization and best practices</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">What I Offer</h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>Custom web applications tailored to your needs</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>UI/UX design and component systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>Code reviews and technical mentoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-900 dark:text-white font-bold mt-1">•</span>
                  <span>Consulting on architecture and scalability</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

// ============================================================================
// ROADMAP SECTION
// ============================================================================

interface RoadmapItem {
  year: string
  title: string
  description: string
}

const roadmapData: RoadmapItem[] = [
  {
    year: "2020",
    title: "Started My Journey",
    description: "Began learning React and modern web development",
  },
  {
    year: "2021",
    title: "First Production App",
    description: "Launched my first full-stack application with 10k+ users",
  },
 
]

const RoadmapSection: React.FC = () => {
  return (
    <section id="roadmap" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-16 text-center text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          My Journey
        </motion.h2>

        <div className="relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-400" />

          {/* Timeline Items */}
          <div className="space-y-12">
            {roadmapData.map((item, index) => (
              <motion.div
                key={index}
                className={`flex gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                {/* Content */}
                <div className="flex-1 md:text-right">
                  <motion.div
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
                    whileHover={{ y: -5 }}
                  >
                    <div className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{item.year}</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                  </motion.div>
                </div>

                {/* Dot */}
                <div className="hidden md:flex justify-center">
                  <motion.div
                    className="w-4 h-4 bg-gray-900 dark:bg-white rounded-full ring-4 ring-white dark:ring-gray-900"
                    whileHover={{ scale: 1.5 }}
                  />
                </div>

                {/* Spacer */}
                <div className="flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// PROJECTS SECTION (MARQUEE - WITHOUT SCROLL BUTTONS)
// ============================================================================

interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
}

const projectsData: Project[] = [
  {
    id: "1",
    title: "Reverse 1999 Discord RPC",
    description: "Custom Discord Rich Presence for Reverse 1999",
    image: "/reverse1999discordrpc.png",
    tags: ["JavaScript"],
    liveUrl: "#",
    githubUrl: "https://github.com/lquan-tech/Reverse1999-Discord-RPC",
  },
  {
    id: "2",
    title: "Design System",
    description: "Comprehensive component library with 100+ components",
    image: "/design-system-components.png",
    tags: ["React", "TypeScript", "Storybook"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "3",
    title: "Analytics Dashboard",
    description: "Real-time data visualization and reporting platform",
    image: "/analytics-dashboard.png",
    tags: ["React", "D3.js", "WebSocket"],
    liveUrl: "#",
    githubUrl: "#",
  },
  {
    id: "4",
    title: "Mobile App",
    description: "Cross-platform mobile application with offline support",
    image: "/mobile-app-interface.png",
    tags: ["React Native", "Firebase", "Redux"],
    liveUrl: "#",
    githubUrl: "#",
  },
]

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  return (
    <motion.div
      className="flex-shrink-0 w-96 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow border border-gray-200 dark:border-gray-700"
      whileHover={{ y: -5 }}
    >
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{project.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4">
          <motion.a
            href={project.liveUrl}
            className="flex items-center gap-2 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 font-semibold"
            whileHover={{ x: 4 }}
          >
            Live <ExternalLink className="w-4 h-4" />
          </motion.a>
          <motion.a
            href={project.githubUrl}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold"
            whileHover={{ x: 4 }}
          >
            GitHub <ExternalLink className="w-4 h-4" />
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

const ProjectsSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-12 text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Featured Projects
        </motion.h2>

        <div className="relative">
          {/* Scroll Container - Horizontal scroll without buttons */}
          <motion.div
            ref={containerRef}
            className="flex gap-6 overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ scrollBehavior: "smooth" }}
          >
            {projectsData.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// LANYARD STATUS COMPONENT - ENHANCED VERSION
// ============================================================================

interface LanyardDataResponse {
  discord_user: {
    id: string
    username: string
    avatar: string
    discriminator: string
    global_name: string | null
    avatar_decoration_data?: {
      asset: string
      sku_id: string
    }
  }
  discord_status: "online" | "idle" | "dnd" | "offline"
  activities: Array<{
    id: string
    name: string
    type: 0 | 1 | 2 | 3 | 4 | 5
    state?: string
    details?: string
    timestamps?: {
      start?: number
      end?: number
    }
    assets?: {
      large_image?: string
      large_text?: string
      small_image?: string
      small_text?: string
    }
    application_id?: string
    created_at: number
  }>
  spotify: {
    track_id: string
    timestamps: {
      start: number
      end: number
    }
    song: string
    artist: string
    album_art_url: string
    album: string
  } | null
  listening_to_spotify: boolean
  primary_guild?: {
    tag: string
    identity_guild_id: string
    badge?: string
  }
  collectibles?: {
    nameplate?: {
      label: string
      sku_id: string
      asset: string
      palette: string
    }
  }
}

const LanyardStatus: React.FC = () => {
  const [data, setData] = useState<LanyardDataResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const fetchLanyard = async () => {
      try {
        const response = await fetch("https://api.lanyard.rest/v1/users/809322893942849587")
        const json = await response.json()

        if (json.success && json.data) {
          setData(json.data)
          setError(false)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error("Failed to fetch Lanyard data:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchLanyard()
    const interval = setInterval(fetchLanyard, 30000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (data?.listening_to_spotify && data.spotify) {
      const updateProgress = () => {
        const now = Date.now()
        const start = data.spotify!.timestamps.start
        const end = data.spotify!.timestamps.end
        const total = end - start
        const elapsed = now - start
        const percentage = Math.min(100, Math.max(0, (elapsed / total) * 100))
        setProgress(percentage)
      }

      updateProgress()
      const progressInterval = setInterval(updateProgress, 1000)
      return () => clearInterval(progressInterval)
    }
  }, [data?.listening_to_spotify, data?.spotify])

  const statusColors = {
    online: "#23a55a",
    idle: "#f0b232",
    dnd: "#f23f43",
    offline: "#80848e",
  }

  const statusLabels = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline",
  }

  const getActivityIcon = (type: number) => {
    switch (type) {
      case 0:
        return Gamepad2
      case 1:
        return Tv
      case 2:
        return Music
      case 3:
        return Tv
      case 5:
        return Gamepad2
      default:
        return Activity
    }
  }

  const getActivityType = (type: number) => {
    switch (type) {
      case 0:
        return "Playing"
      case 1:
        return "Streaming"
      case 2:
        return "Listening to"
      case 3:
        return "Watching"
      case 5:
        return "Competing in"
      default:
        return "Activity"
    }
  }

  const getElapsedTime = (startTimestamp: number) => {
    const elapsed = Date.now() - startTimestamp
    const hours = Math.floor(elapsed / 3600000)
    const minutes = Math.floor((elapsed % 3600000) / 60000)
    const seconds = Math.floor((elapsed % 60000) / 1000)

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")} elapsed`
    }
    if (minutes > 0) {
      return `${minutes}:${seconds.toString().padStart(2, "0")} elapsed`
    }
    return `00:${seconds.toString().padStart(2, "0")} elapsed`
  }

  const formatSpotifyTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/5 dark:bg-gray-800/50 rounded-xl"
      >
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
          <span className="text-gray-600 dark:text-gray-300">Loading Discord status...</span>
        </div>
      </motion.div>
    )
  }

  if (error || !data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-8 bg-white/5 dark:bg-gray-800/50 rounded-xl"
      >
        <div className="text-center py-8">
          <p className="text-gray-600 dark:text-gray-400">Unable to load Discord status</p>
        </div>
      </motion.div>
    )
  }

  const avatarUrl = `https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`
  const decorationUrl = data.discord_user.avatar_decoration_data
    ? `https://cdn.discordapp.com/avatar-decoration-presets/${data.discord_user.avatar_decoration_data.asset}.png?size=160&passthrough=true`
    : null
  const customActivity = data.activities.find((a) => a.type === 4)
  const mainActivity = data.activities.find((a) => a.type !== 4 && a.name !== "Spotify")

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="bg-white/5 dark:bg-gray-800/50 rounded-xl p-6 relative overflow-hidden border border-cyan-200/20 dark:border-cyan-700/20">
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundSize: "10px 10px",
          }}
        />

        <div className="relative z-10">
          <div className="flex gap-4 mb-4">
            <div className="relative flex-shrink-0">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative cursor-pointer"
                onClick={() => window.open(`https://discord.com/users/${data.discord_user.id}`, "_blank")}
              >
                {decorationUrl && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 0.7 }}
                    className="absolute -inset-8 pointer-events-none z-10"
                  >
                    <img
                      src={decorationUrl || "/placeholder.svg"}
                      alt="Avatar Decoration"
                      className="w-[160px] h-[160px] object-contain"
                      style={{ imageRendering: "crisp-edges" }}
                    />
                  </motion.div>
                )}

                <div className="relative z-0 w-24 h-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  <img
                    src={avatarUrl || "/placeholder.svg"}
                    alt="Discord Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>

                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-[5px] flex items-center justify-center z-20"
                  style={{
                    backgroundColor: statusColors[data.discord_status],
                    borderColor: "hsl(var(--background))",
                    boxShadow: `0 0 15px ${statusColors[data.discord_status]}80`,
                  }}
                />
              </motion.div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="mb-2">
                <h3 className="text-xl font-bold truncate flex items-center gap-2 text-gray-900 dark:text-white">
                  {data.discord_user.global_name || data.discord_user.username}
                  {data.discord_user.avatar_decoration_data && <Sparkles className="w-4 h-4 text-cyan-500" />}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">@{data.discord_user.username}</p>
              </div>

              {data.primary_guild && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-100/20 dark:bg-cyan-900/30 border border-cyan-300/40 dark:border-cyan-600/40 mb-2"
                >
                  <span className="text-xs font-bold text-cyan-700 dark:text-cyan-300">{data.primary_guild.tag}</span>
                </motion.div>
              )}

              <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full bg-white/10 dark:bg-gray-700/50 border border-cyan-200/30 dark:border-cyan-700/30">
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColors[data.discord_status] }}
                />
                <span className="text-xs font-medium text-gray-900 dark:text-white">
                  {statusLabels[data.discord_status]}
                </span>
              </div>

              {customActivity && customActivity.state && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-3 bg-white/5 dark:bg-gray-700/30 rounded-lg border border-cyan-200/20 dark:border-cyan-700/20"
                >
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
                    {customActivity.state}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-300/20 dark:bg-gray-600/20 my-4" />
          <div className="space-y-3">
            <AnimatePresence mode="wait">
              {mainActivity && (
                <motion.div
                  key={mainActivity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 dark:bg-gray-700/50 rounded-xl p-4 border border-cyan-200/20 dark:border-cyan-700/20"
                >
                  <div className="flex gap-3">
                    {mainActivity.assets?.large_image && (
                      <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-600">
                          <img
                            src={
                              mainActivity.assets.large_image.startsWith("mp:")
                                ? `https://media.discordapp.net/${mainActivity.assets.large_image.slice(3)}`
                                : `https://cdn.discordapp.com/app-assets/${mainActivity.application_id}/${mainActivity.assets.large_image}.png`
                            }
                            alt={mainActivity.assets.large_text || mainActivity.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {mainActivity.assets.small_image && (
                          <div
                            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 overflow-hidden bg-white dark:bg-gray-800"
                            style={{ borderColor: "hsl(var(--background))" }}
                          >
                            <img
                              src={`https://cdn.discordapp.com/app-assets/${mainActivity.application_id}/${mainActivity.assets.small_image}.png`}
                              alt={mainActivity.assets.small_text || ""}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                        {mainActivity.name}
                      </div>
                      {mainActivity.details && (
                        <div className="text-sm text-gray-700 dark:text-gray-300 truncate mb-0.5">
                          {mainActivity.details}
                        </div>
                      )}
                      {mainActivity.state && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 truncate">{mainActivity.state}</div>
                      )}
                      {mainActivity.timestamps?.start && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {getElapsedTime(mainActivity.timestamps.start)}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {data.listening_to_spotify && data.spotify && (
                <motion.div
                  key="spotify"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-white/5 dark:bg-gray-700/50 rounded-xl p-4 border border-[#1DB954]/30 hover:border-[#1DB954]/50 transition-colors"
                >
                  <div className="flex gap-3 mb-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={data.spotify.album_art_url || "/placeholder.svg"}
                          alt={data.spotify.album}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, -5, 0],
                        }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#1DB954] rounded-full border-2 flex items-center justify-center shadow-lg"
                        style={{ borderColor: "hsl(var(--background))" }}
                      >
                        <Music className="w-3 h-3 text-white" />
                      </motion.div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1DB954] mb-1 flex items-center gap-1">
                        <Headphones className="w-3 h-3" />
                        Listening to Spotify
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-0.5">
                        {data.spotify.song}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 truncate">by {data.spotify.artist}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 truncate">on {data.spotify.album}</div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-1 bg-gray-300/30 dark:bg-gray-600/30 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#1DB954] rounded-full"
                        style={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-500">
                      <span>{formatSpotifyTime(Date.now() - data.spotify.timestamps.start)}</span>
                      <span>{formatSpotifyTime(data.spotify.timestamps.end - data.spotify.timestamps.start)}</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 pt-3 border-t border-gray-300/20 dark:border-gray-600/20">
            <div className="flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-500">
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                Discord Status
              </span>
              <span>Updates every 30s</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// CONTACT SECTION
// ============================================================================

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    return newErrors
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = validateForm()

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true)
      setFormData({ name: "", email: "", message: "" })
      setTimeout(() => setSubmitted(false), 3000)
    } else {
      setErrors(newErrors)
    }
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.h2
          className="text-4xl sm:text-5xl font-bold mb-8 text-center text-gray-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Get In Touch
        </motion.h2>

        <motion.p
          className="text-center text-gray-600 dark:text-gray-400 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          Have a project in mind? Let's collaborate and create something amazing together.
        </motion.p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border ${
                  errors.name ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all`}
                placeholder="Your name"
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border ${
                  errors.email ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 transition-all`}
                placeholder="your@email.com"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 border ${
                  errors.message ? "border-red-500" : "border-gray-300 dark:border-gray-700"
                } text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 resize-none transition-all`}
                placeholder="Your message..."
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-error" : undefined}
              />
              {errors.message && (
                <p id="message-error" className="text-red-500 text-sm mt-1">
                  {errors.message}
                </p>
              )}
            </div>

            <motion.button
              type="submit"
              className="w-full px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Send Message
            </motion.button>

            <AnimatePresence>
              {submitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg text-center border border-green-300 dark:border-green-700"
                >
                  ✓ Message sent successfully! I'll get back to you soon.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Lanyard Status */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once:  true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Status</h3>
            <LanyardStatus />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ============================================================================
// FOOTER
// ============================================================================

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-gray-900 dark:bg-black text-white py-12 px-4 sm:px-6 lg:px-8"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4">lquan</h3>
            <p className="text-gray-400">Senior Front-End Engineer & UI/UX Designer</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#home" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-white transition-colors">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-white transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Follow</h4>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>© 2025 lquan. All rights reserved.</p>
        </div>
      </div>
    </motion.footer>
  )
}
  
// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  return (
    <ThemeProvider>
      <div className="bg-white dark:bg-gray-950 text-gray-900 dark:text-white transition-colors cursor-none">
        <CustomCursor />
        <Header />
        <HeroSection />
        <IntroductionSection />
        <RoadmapSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </div>
    </ThemeProvider>
  )
}