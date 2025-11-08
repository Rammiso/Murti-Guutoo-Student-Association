import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/auth-context";
import {
  Target,
  Users,
  HeartHandshake,
  GraduationCap,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import TIMG from "../assets/logo-1.png";
const TEAM_IMG = TIMG;
import MISSION_IMG from "../assets/logo-updated.png";

// Gallery images for mission cards
import IMG1 from "../assets/Gallery/IMG_9248.JPG";
import IMG2 from "../assets/Gallery/IMG_9250.JPG";
import IMG3 from "../assets/Gallery/IMG_9371.JPG";
import IMG4 from "../assets/Gallery/IMG_9255.JPG";
import IMG5 from "../assets/Gallery/IMG_9238.JPG";
import IMG6 from "../assets/Gallery/IMG_9360.JPG";
import MUSAB from "../assets/Profile_Pictures/Musab.jpg";
import ANAS from "../assets/Profile_Pictures/anas.png";
import ABDUNASIR from "../assets/Profile_Pictures/abdunasir.png";
import YONAS from "../assets/Profile_Pictures/abel.png";
const About = () => {
  const { user } = useAuth();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particleCount = 22;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: 0.25 + Math.random() * 0.25,
    }));

    let rafId;
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -5) p.x = width + 5;
        if (p.x > width + 5) p.x = -5;
        if (p.y < -5) p.y = height + 5;
        if (p.y > height + 5) p.y = -5;

        ctx.beginPath();
        ctx.fillStyle = `rgba(34,197,94,${p.a})`;
        ctx.shadowColor = "rgba(34,197,94,0.4)";
        ctx.shadowBlur = 6;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      rafId = requestAnimationFrame(draw);
    };

    const resize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", resize);
    draw();
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      {/* Animated particles background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 opacity-40 pointer-events-none"
        style={{ width: "100%", height: "100%" }}
        aria-hidden="true"
      />

      {/* Gradient accents */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-[#22C55E]/10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-[#16A34A]/10 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="relative z-10">
        {/* Hero Banner */}
        <section className="relative overflow-hidden">
          <div className="relative z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-block relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/80 via-[#0A0A0A]/50 to-transparent backdrop-blur-md rounded-2xl -z-10" />
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight px-6 py-4">
                  About{" "}
                  <span className="relative inline-block">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#86efac]">
                      Murti Guuto
                    </span>
                    <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#22C55E] to-[#86efac] blur-sm rounded-full" />
                    <span className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#22C55E] to-[#86efac] rounded-full" />
                  </span>{" "}
                  Students Association (MGSA)
                </h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="mt-6 text-white/70 text-base sm:text-lg md:text-xl max-w-3xl mx-auto"
              >
                Empowering Knowledge. Building Unity. Inspiring Growth.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Who We Are */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="order-2 md:order-1"
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold font-serif mb-6 tracking-wide leading-tight">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#86efac]">
                    Who We Are
                  </span>
                </h2>
                <p className="text-white/80 leading-relaxed tracking-wide text-base sm:text-lg font-light">
                  The{" "}
                  <span className="text-[#22C55E] font-semibold">
                    Murti Guuto Students Association (MGSA)
                  </span>{" "}
                  is a student-led organization established in 2011(E.C) by
                  students from East and West Hararghe at Haramaya University.
                  We are committed to empowering students academically,
                  socially, and morally through tutorial programs, study
                  material sharing, community service, and financial support for
                  students in need. Rooted in a spirit of unity and service,
                  MGSA works to ensure that no student is left behind due to
                  lack of resources or support. Through collaboration,
                  mentorship, and volunteerism, we strive to build a community
                  of capable, compassionate, and responsible future leaders.
                </p>
                <p className="mt-4 text-white/70 leading-relaxed tracking-wide text-base sm:text-lg font-light">
                  Our initiatives focus on learning support, peer collaboration,
                  and empowering students to lead with purpose and integrity.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="order-1 md:order-2 flex justify-center"
              >
                <div className="relative group">
                  {/* Glowing border effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-3xl blur-xl opacity-50 group-hover:opacity-100 transition-all duration-500" />
                  <img
                    src={MISSION_IMG}
                    alt="Students collaborating and learning together"
                    className="relative w-80 md:w-96 lg:w-[450px] h-auto rounded-3xl shadow-2xl border-2 border-[#22C55E]/30 object-cover transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(34,197,94,0.4)]"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Mission & Vision */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white"
              >
                Our Mission & Vision
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 h-1 w-28 mx-auto bg-gradient-to-r from-[#22C55E] to-[#86efac] rounded-full"
              />
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                className="mt-6 text-white/70 text-base sm:text-lg"
              >
                We cultivate leadership, unity, and academic excellence through
                supportive programs and community.
              </motion.p>
            </div>
            <div className="max-w-6xl mx-auto">
              {/* Mission grid */}
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.1 }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.1 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  {
                    title: "Empower Through Education",
                    desc: "Strengthen students’ academic success through tutorials, shared resources, and peer learning.",
                    icon: <GraduationCap className="w-6 h-6" />,
                    bgImage: IMG1,
                  },
                  {
                    title: "Unity in Purpose",
                    desc: "Unite students from East and West Hararghe under shared values of cooperation, respect, and mutual growth.",
                    icon: <Users className="w-6 h-6" />,
                    bgImage: IMG2,
                  },
                  {
                    title: "Serve with Compassion",
                    desc: "Support students in need through fundraising, mentorship, and community-driven assistance programs.",
                    icon: <HeartHandshake className="w-6 h-6" />,
                    bgImage: IMG3,
                  },
                  {
                    title: "Lead with Integrity",
                    desc: "Build responsible leaders who embody discipline, commitment, and service to others.",
                    icon: <Target className="w-6 h-6" />,
                    bgImage: IMG4,
                  },
                  {
                    title: "Expand Knowledge Access",
                    desc: "Collect, produce, and share handouts, references, and materials to make learning resources accessible to all.",
                    icon: <BookOpen className="w-6 h-6" />,
                    bgImage: IMG5,
                  },
                  {
                    title: "Engage the Community",
                    desc: "Collaborate with local communities through outreach and social impact initiatives that promote education and unity.",
                    icon: <Lightbulb className="w-6 h-6" />,
                    bgImage: IMG6,
                  },
                ].map((m) => (
                  <motion.div
                    key={m.title}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      show: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="group relative overflow-hidden rounded-2xl border border-[#22C55E]/20 hover:border-[#22C55E]/60 shadow-xl hover:shadow-[0_0_30px_rgba(34,197,94,0.4)] transition-all duration-500 ease-in-out"
                  >
                    {/* Background image */}
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${m.bgImage})` }}
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-[#0A0A0A]/70" />

                    {/* Frosted glass gradient layer */}
                    <div className="absolute inset-0 bg-white/5 backdrop-blur-md" />

                    {/* Content */}
                    <div className="relative p-6 h-full flex flex-col">
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#22C55E]/20 border border-[#22C55E]/40 text-[#22C55E] shadow-lg mb-4">
                        {m.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 relative">
                        {m.title}
                        <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-[#22C55E] to-transparent rounded-full" />
                      </h3>
                      <p className="text-white/80 text-sm leading-relaxed">
                        {m.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Join Our Journey - Only show if user is not logged in */}
        {!user && (
          <section className="py-14 md:py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="text-2xl sm:text-3xl md:text-4xl font-bold text-white"
                >
                  Be part of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22C55E] to-[#86efac]">
                    MGSA
                  </span>{" "}
                  — where students grow, connect, and lead together.
                </motion.h3>
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                  className="mt-8"
                >
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-[#22C55E] to-[#16A34A] shadow-lg hover:shadow-[0_0_25px_rgba(34,197,94,0.5)] transition-all duration-300 ease-in-out hover:scale-105"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                    Join Now
                  </Link>
                </motion.div>
              </div>
            </div>
          </section>
        )}
        {/* Our Leadership Team */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white inline-block relative"
              >
                Our Leadership Team
              </motion.h3>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-1 w-40 mx-auto mt-4 rounded-full bg-gradient-to-r from-[#22C55E] to-[#86efac]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  role: "President",
                  name: "Anes Mohammed",
                  phone: "+251-915-204-646",
                  photo: ANAS,
                },
                {
                  role: "Vice President",
                  name: "Abdunasir Ahmed",
                  phone: "+251-986-682-323",
                  photo: ABDUNASIR,
                },
                {
                  role: "Secretary",
                  name: "Yonas Shemekit",
                  phone: "+251-9XX-XXX-XXX",
                  photo: YONAS,
                },

                {
                  role: "Female Affairs Head",
                  name: "Hawi Ahmed",
                  phone: "+251-9XX-XXX-XXX",
                  photo: "https://randomuser.me/api/portraits/women/39.jpg",
                },
                {
                  role: "Auditor Head",
                  name: "Firomsa Abduraman",
                  phone: "+251-9XX-XXX-XXX",
                  photo: "https://randomuser.me/api/portraits/men/45.jpg",
                },
                {
                  role: "Public Relation Affairs Head",
                  name: "Obsaa Mohammed",
                  phone: "+251-9XX-XXX-XXX",
                  photo: "https://randomuser.me/api/portraits/men/46.jpg",
                },
                {
                  role: "Academic Affairs Head",
                  name: "Ezedin Aliyi",
                  phone: "+251-947-408-085",
                  photo: "https://randomuser.me/api/portraits/men/52.jpg",
                },
                {
                  role: "Financial and Charity Affairs Head",
                  name: "Mahdi Jemal",
                  phone: "+251-9XX-XXX-XXX",
                  photo: "https://randomuser.me/api/portraits/men/53.jpg",
                },
              ].map((m, i) => (
                <motion.div
                  key={m.role}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="group relative rounded-2xl border border-[#22C55E]/30 bg-white/5 backdrop-blur-md p-6 text-center shadow-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300"
                >
                  {/* Glow effect */}
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#22C55E]/20 via-[#16A34A]/20 to-[#22C55E]/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="relative inline-block mb-4">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] blur opacity-75" />
                      <img
                        src={m.photo}
                        alt={`${m.name} - ${m.role}`}
                        className="relative w-24 h-24 rounded-full object-cover border-2 border-[#22C55E]/50"
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {m.name}
                    </h4>
                    <p className="text-[#22C55E] font-medium mb-2">{m.role}</p>
                    <p className="text-white/60 text-sm">{m.phone}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Team Section */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-[#E8617D] via-[#FF6B9D] to-[#E8617D] bg-clip-text text-transparent">
                  👨‍💻 Murti Guutoo Developer Team
                </span>
              </h2>
              <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto">
                The passionate team behind this Website Project.
              </p>
            </motion.div>

            {/* Developer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  name: "Musab Hassen",
                  role: "Frontend & Backend Developer",
                  photo: MUSAB,
                  portfolio: "#",
                },
                {
                  name: "Yihune Belay",
                  role: "Frontend & Backend Developer",
                  photo: "https://i.pravatar.cc/300?img=33",
                  portfolio: "https://portfolio-placeholder.com",
                },
                {
                  name: "Ezedin Jemal",
                  role: "Frontend & Backend Developer",
                  photo: "https://i.pravatar.cc/300?img=1",
                  portfolio: "https://portfolio-placeholder.com",
                },
                {
                  name: "Sultan Adinan",
                  role: "Frontend & Backend Developer",
                  photo: "https://i.pravatar.cc/300?img=52",
                  portfolio: "https://portfolio-placeholder.com",
                },
                {
                  name: "Nadhi Amayu",
                  role: "Frontend & Backend Developer",
                  photo: "https://i.pravatar.cc/300?img=54",
                  portfolio: "https://portfolio-placeholder.com",
                },
                {
                  name: "Gifti Hussein",
                  role: "Frontend & Backend Developer",
                  photo: "https://i.pravatar.cc/300?img=2",
                  portfolio: "https://portfolio-placeholder.com",
                },
              ].map((dev, i) => (
                <motion.a
                  key={dev.name}
                  href={dev.portfolio}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    ease: "easeOut",
                    delay: i * 0.1,
                  }}
                  whileHover={{ scale: 1.03 }}
                  className="group relative rounded-2xl border border-[#E8617D]/30 bg-white/5 backdrop-blur-md p-6 text-center shadow-xl hover:shadow-[0_0_20px_rgba(232,97,125,0.4)] transition-all duration-300 cursor-pointer"
                >
                  {/* Enhanced Glow effect with pink/red accent */}
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#E8617D]/20 via-[#FF6B9D]/20 to-[#E8617D]/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <div className="relative inline-block mb-4">
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#E8617D] to-[#FF6B9D] blur opacity-75" />
                      <img
                        src={dev.photo}
                        alt={`${dev.name} - ${dev.role}`}
                        className="relative w-24 h-24 rounded-full object-cover border-2 border-[#E8617D]/50"
                      />
                    </div>
                    <h4 className="text-lg font-semibold text-white mb-1">
                      {dev.name}
                    </h4>
                    <p className="text-[#E8617D] font-medium mb-2">
                      {dev.role}
                    </p>
                    <p className="text-white/60 text-sm">Portfolio →</p>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
