import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";
import logo from "../assets/logo-updated.png";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
  { to: "/gallery", label: "Gallery" },
  { to: "/register", label: "Register" },
  { to: "/login", label: "Login" },
];

const iconClass = "w-5 h-5";

const Footer = () => {
  const year = new Date().getFullYear();
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="mt-14 text-white"
    >
      <div className="relative bg-gradient-to-b from-[#0A0A0A] to-[#111827] border-t border-[#22C55E]/20 overflow-hidden">
        {/* Animated particles */}
        <div className="pointer-events-none absolute inset-0">
          {[...Array(14)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute block w-1 h-1 bg-white/50 rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: "0 0 6px rgba(255,255,255,0.6)",
              }}
              animate={{
                y: [0, -10, 0],
                x: [0, 6, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 6 + Math.random() * 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
        {/* Faint grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #ffffff, #ffffff 1px, transparent 1px, transparent 24px), repeating-linear-gradient(90deg, #ffffff, #ffffff 1px, transparent 1px, transparent 24px)",
            backgroundSize: "auto",
          }}
          aria-hidden="true"
        />

        <div className="relative px-6 md:px-16 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <motion.img
                  whileHover={{ scale: 1.06 }}
                  src={logo}
                  alt="MGSA Logo"
                  className="w-14 h-14 md:w-16 md:h-16 rounded"
                />
                <span className="text-xl md:text-2xl font-semibold">
                  MURTI GUUTO STUDENTS ASSOCIATION
                </span>
              </div>
              <p className="text-white/80">
                We fosters academic excellence, unity, and leadership at
                Haramaya University through mentorship, resources, and
                community.
              </p>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
              <ul className="grid grid-cols-2 gap-2">
                {links.map((l, i) => (
                  <motion.li
                    key={l.to}
                    initial={{ opacity: 0, y: 6 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      to={l.to}
                      className="group inline-flex items-center gap-1 text-[#22C55E] hover:text-[#86EFAC] transition-colors"
                    >
                      <span>{l.label}</span>
                      <span className="ml-1 block h-px w-0 bg-current transition-all duration-300 group-hover:w-8" />
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Social & Contact */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="space-y-3"
            >
              <h3 className="text-lg font-semibold">Contact</h3>
              <div className="text-white/80 space-y-1">
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block w-5 h-5 rounded bg-white/10" />
                  Haramaya University, Oromia, Ethiopia
                </p>
                <p className="flex items-start gap-2">
                  <span className="mt-0.5 inline-block w-5 h-5 rounded bg-white/10" />
                  mgsa.association@gmail.com
                </p>
              </div>

              <div className="pt-2 flex items-center gap-3">
                {[
                  { n: "facebook", Icon: Facebook },
                  { n: "twitter", Icon: Twitter },
                  { n: "instagram", Icon: Instagram },
                  { n: "linkedin", Icon: Linkedin },
                  { n: "telegram", Icon: Send },
                ].map(({ n, Icon }) => (
                  <motion.a
                    key={n}
                    href="#"
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    whileTap={{ scale: 0.96 }}
                    className="bg-white/10 hover:bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/30 rounded-full w-10 h-10 flex items-center justify-center transition-all hover:shadow-lg hover:shadow-[#22C55E]/40"
                    aria-label={n}
                  >
                    <Icon className={iconClass} />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="px-6 md:px-16 py-4 text-center text-sm text-white/80 space-y-3"
          >
            <span>
              © {year}{" "}
              <span className="relative inline-block">
                Murti Guto Students Association
                <span className="absolute left-0 -bottom-0.5 w-full h-0.5 bg-[#22C55E]/80" />
              </span>
              . All Rights Reserved.
            </span>

            {/* Developer Team Credit */}
            <div className="text-xs text-white/70 space-y-1">
              <p className="flex items-center justify-center gap-2 flex-wrap">
                <span>Built with</span>
                <span className="text-red-400 animate-pulse">❤️</span>
                <span>by Murti Guutoo Developer Team:</span>
              </p>
              <p className="flex items-center justify-center gap-2 flex-wrap">
                {[
                  { name: "Musab Hassen", url: "https://portfolio-placeholder.com" },
                  { name: "Yihune Belay", url: "https://portfolio-placeholder.com" },
                  { name: "Ezedin Jemal", url: "https://portfolio-placeholder.com" },
                  { name: "Sultan Adinan", url: "https://portfolio-placeholder.com" },
                  { name: "Nadhi Amayu", url: "https://portfolio-placeholder.com" },
                  { name: "Gifti Hussein", url: "https://portfolio-placeholder.com" },
                ].map((member, index, array) => (
                  <span key={member.name} className="inline-flex items-center gap-2">
                    <motion.a
                      href={member.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      className="text-white/90 hover:text-[#E8617D] transition-all duration-300 relative group"
                    >
                      {member.name}
                      <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-gradient-to-r from-[#E8617D] to-[#FF6B9D] group-hover:w-full transition-all duration-300 shadow-[0_0_8px_rgba(232,97,125,0.6)]" />
                    </motion.a>
                    {index < array.length - 1 && (
                      <span className="text-[#22C55E]/50">•</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
          </motion.div>

          {/* Animated gradient bar */}
          <motion.div
            className="h-0.5 w-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #22C55E, #86EFAC, #22C55E)",
              backgroundSize: "200% 100%",
            }}
            animate={{ backgroundPositionX: ["0%", "100%", "0%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
        </div>

        {/* Back to top */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: showTop ? 1 : 0, y: showTop ? 0 : 10 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-6 right-6 z-20 bg-[#22C55E] text-white rounded-full w-12 h-12 shadow-lg shadow-[#22C55E]/40 hover:bg-[#16A34A] transition-colors"
          aria-label="Back to top"
        >
          ↑
        </motion.button>
      </div>
    </motion.footer>
  );
};

export default Footer;
