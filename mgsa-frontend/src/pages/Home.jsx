import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/auth-context";
import HERO_LOCAL from "../assets/photo_2025-10-28_16-54-40.jpg";
import { BookOpen, Users, Bell, Award, CalendarDays, Gift } from "lucide-react";
import LOGO from "../assets/logo-updated.png";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { useCallback } from "react";

// Gallery images for feature cards
import FEATURE_IMG1 from "../assets/Gallery/IMG_9259.JPG";
import FEATURE_IMG2 from "../assets/Gallery/IMG_9207.JPG";
import FEATURE_IMG3 from "../assets/Gallery/IMG_9370.JPG";
import FEATURE_IMG4 from "../assets/Gallery/IMG_9371.JPG";
import FEATURE_IMG5 from "../assets/Gallery/IMG_9255.JPG";
import FEATURE_IMG6 from "../assets/Gallery/Picture-1.png";
const HERO_BG =
  "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80";
const STUDENT_IMG =
  "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1000&q=80";

const Home = () => {
  const { user } = useAuth();

  // Initialize particles
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  // Section-level particle config (background)
  const sectionParticlesConfig = {
    particles: {
      number: { value: 40, density: { enable: true, value_area: 800 } },
      color: { value: ["#22C55E", "#67E8F9"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.3,
        random: true,
        anim: { enable: true, speed: 0.5, opacity_min: 0.1, sync: false },
      },
      size: {
        value: 3,
        random: true,
        anim: { enable: true, speed: 2, size_min: 0.5, sync: false },
      },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
    retina_detect: true,
  };

  // Card-level particle config (foreground overlay)
  const cardParticlesConfig = {
    particles: {
      number: { value: 15, density: { enable: true, value_area: 400 } },
      color: { value: ["#22C55E", "#67E8F9"] },
      shape: { type: "circle" },
      opacity: {
        value: 0.2,
        random: true,
        anim: { enable: true, speed: 0.3, opacity_min: 0.05, sync: false },
      },
      size: {
        value: 2,
        random: true,
        anim: { enable: true, speed: 1.5, size_min: 0.3, sync: false },
      },
      line_linked: { enable: false },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
      },
    },
    interactivity: {
      events: { onhover: { enable: false }, onclick: { enable: false } },
    },
    retina_detect: true,
  };

  return (
    <div className="flex flex-col w-full max-w-full">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] grid place-items-center overflow-hidden text-white">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center blur-sm"
          style={{ backgroundImage: `url(${HERO_LOCAL})` }}
          aria-hidden="true"
        />
        {/* Soft dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-2 sm:px-4">
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
              {/* Text content on the left */}
              <div className="text-white text-center lg:text-left lg:ml-10">
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight"
                >
                  Welcome to{" "}
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-white/80 backdrop-blur-sm text-mgsa-accent shadow-sm ring-1 ring-mgsa-accent/20">
                    Murti Guto
                  </span>{" "}
                  Student's Association
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.1 }}
                  className="mt-4 max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg md:text-xl text-white/90"
                >
                  Empowering Students from Hararge at Haramaya University.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut", delay: 0.2 }}
                  className="mt-8 flex flex-col sm:flex-row items-center lg:items-start gap-3 sm:gap-4 justify-center lg:justify-start"
                >
                  {!user && (
                    <Link
                      to="/register"
                      className="group inline-flex items-center justify-center px-6 py-3 rounded-full text-white font-semibold bg-mgsa-accent hover:bg-mgsa-accent hover:text-white shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-105"
                    >
                      Join Now
                      <span className="ml-2 transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </Link>
                  )}
                  <Link
                    to="/about"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-mgsa-accent text-mgsa-accent bg-white hover:bg-mgsa-accent hover:text-white transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    Learn More
                  </Link>
                </motion.div>
              </div>

              {/* Logo on the right - small and circular */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeInOut", delay: 0.15 }}
                className="flex justify-center lg:justify-end lg:mr-10"
              >
                <motion.img
                  src={LOGO}
                  alt="Logo"
                  className="w-48 h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 object-contain"
                  style={{
                    filter: "drop-shadow(0 0 40px rgba(34,197,94,0.4))",
                  }}
                  animate={{
                    y: [0, -8, 0],
                  }}
                  whileHover={{
                    scale: 1.05,
                    filter: "drop-shadow(0 0 50px rgba(34,197,94,0.7))",
                  }}
                  transition={{
                    y: {
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                    scale: {
                      duration: 0.5,
                      ease: "easeInOut",
                    },
                    filter: {
                      duration: 0.5,
                      ease: "easeInOut",
                    },
                  }}
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Subtle gradient accents */}
        <div className="pointer-events-none absolute -top-10 -left-16 h-72 w-72 bg-[rgba(34,197,94,0.25)] blur-3xl rounded-full" />
        <div className="pointer-events-none absolute -bottom-10 -right-16 h-72 w-72 bg-[rgba(134,239,172,0.25)] blur-3xl rounded-full" />

        {/* Particle overlay */}
        <div className="particles" aria-hidden="true">
          <div
            className="particle sm"
            style={{
              top: "18%",
              left: "12%",
              animationDelay: "0s",
              animationDuration: "13s",
            }}
          />
          <div
            className="particle"
            style={{
              top: "28%",
              left: "36%",
              animationDelay: "2s",
              animationDuration: "14s",
            }}
          />
          <div
            className="particle accent lg"
            style={{
              top: "46%",
              left: "18%",
              animationDelay: "1s",
              animationDuration: "12s",
            }}
          />
          <div
            className="particle sm"
            style={{
              top: "62%",
              left: "8%",
              animationDelay: "3s",
              animationDuration: "15s",
            }}
          />
          <div
            className="particle accent"
            style={{
              top: "22%",
              left: "78%",
              animationDelay: "1.5s",
              animationDuration: "12.5s",
            }}
          />
          <div
            className="particle lg"
            style={{
              top: "70%",
              left: "66%",
              animationDelay: "2.5s",
              animationDuration: "13.5s",
            }}
          />
          <div
            className="particle"
            style={{
              top: "40%",
              left: "88%",
              animationDelay: "0.8s",
              animationDuration: "12s",
            }}
          />
        </div>
      </section>

      {/* About teaser / Features */}
      <section className="relative py-16 px-4 md:px-8 bg-[#0B0E14] overflow-hidden">
        {/* Section-level particle background */}
        <div className="absolute inset-0 z-0">
          <Particles
            id="section-particles"
            init={particlesInit}
            options={sectionParticlesConfig}
            className="absolute inset-0"
          />
        </div>

        {/* Dark neon decorative background */}
        <div className="pointer-events-none absolute inset-0 opacity-20 z-0">
          <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#22C55E]/30 blur-3xl rounded-full" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#00FFC6]/20 blur-3xl rounded-full" />
        </div>

        <div className="relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10 md:mb-14">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#E0E0E0]"
            >
              Learn. Connect. Grow.
            </motion.h2>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="mt-2 inline-block h-1 w-28 bg-gradient-to-r from-[#22C55E] to-[#00FFC6] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.6)]"
            />
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, ease: "easeInOut", delay: 0.05 }}
              className="mt-4 text-gray-400"
            >
              Empowering students from East & West Hararge through
              collaboration, knowledge, and leadership.
            </motion.p>
          </div>

          {/* features grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mx-4"
          >
            {[
              {
                title: "Access Study Resources",
                desc: "Get curated notes, past exams, and study materials for your department.",
                icon: <BookOpen className="w-6 h-6" />,
                bgImage: FEATURE_IMG1,
              },
              {
                title: "Connect with Peers",
                desc: "Meet and collaborate with fellow MGSA members from across Haramaya University.",
                icon: <Users className="w-6 h-6" />,
                bgImage: FEATURE_IMG2,
              },
              {
                title: "Stay Informed",
                desc: "Get updates on association events, announcements, and academic opportunities.",
                icon: <Bell className="w-6 h-6" />,
                bgImage: FEATURE_IMG3,
              },
              {
                title: "Leadership & Mentorship",
                desc: "Learn from senior students and mentors who guide your academic journey.",
                icon: <Award className="w-6 h-6" />,
                bgImage: FEATURE_IMG4,
              },
              {
                title: "Events & Activities",
                desc: "Join community gatherings, seminars, and MGSA-sponsored programs.",
                icon: <CalendarDays className="w-6 h-6" />,
                bgImage: FEATURE_IMG5,
              },
              {
                title: "Scholarships & Support",
                desc: "Access financial aid information and academic support initiatives.",
                icon: <Gift className="w-6 h-6" />,
                bgImage: FEATURE_IMG6,
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                whileHover={{ scale: 1.05 }}
                className="group relative overflow-hidden rounded-2xl p-6 md:p-8 backdrop-blur-md bg-white/5 border border-[#22C55E]/40 hover:border-[#22C55E]/80 shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:shadow-[0_0_30px_rgba(34,197,94,0.7)] transition-all duration-500 ease-in-out"
              >
                {/* Background image with blur */}
                <div
                  className="absolute inset-0 bg-cover bg-center blur-sm opacity-30 group-hover:opacity-40 group-hover:scale-105 transition-all duration-700"
                  style={{
                    backgroundImage: `url(${f.bgImage})`,
                  }}
                />

                {/* Card-level particle overlay */}
                <div className="absolute inset-0 z-0">
                  <Particles
                    id={`card-particles-${f.title}`}
                    init={particlesInit}
                    options={cardParticlesConfig}
                    className="absolute inset-0"
                  />
                </div>

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#22C55E]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content container */}
                <div className="relative z-10 h-full flex flex-col min-h-[240px]">
                  {/* Icon with glow effect */}
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/50 text-[#22C55E] shadow-[0_0_15px_rgba(34,197,94,0.5)] backdrop-blur-sm group-hover:bg-[#22C55E]/30 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] transition-all duration-300">
                      {f.icon}
                    </div>
                  </div>

                  {/* Text content */}
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl md:text-2xl font-bold text-[#F3F4F6] mb-3 group-hover:text-[#22C55E] transition-colors duration-300">
                      {f.title}
                    </h3>
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                      {f.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* small note or caption */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeInOut", delay: 0.1 }}
            className="mt-10 text-center"
          >
            <p className="text-sm text-gray-500">
              Built by the community, for the community — discover what MGSA
              offers.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
