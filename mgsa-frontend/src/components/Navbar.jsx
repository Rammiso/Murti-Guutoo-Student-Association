import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/auth-context";
import LOGO from "../assets/logo-updated.png";
const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/resources", label: "Resources" },
  { to: "/contact", label: "Contact" },
  { to: "/gallery", label: "Gallery" },
  { to: "/payment", label: "Donation" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 10 + Math.random() * 8,
        size: ["sm", "", "", "lg"][Math.floor(Math.random() * 4)],
      })),
    []
  );

  const linkBase =
    "px-3 py-2 rounded-lg uppercase font-medium tracking-wide relative transition-all duration-300 ease-in-out";

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <motion.nav
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors ${
        scrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="relative group bg-[#0A0A0A]/90 text-white backdrop-blur-md shadow-lg border border-[#22C55E]/20">
        <div className="absolute inset-0 -z-10 particles">
          {particles.map((p) => (
            <span
              key={p.id}
              className={`particle accent ${p.size}`}
              style={{
                top: `${p.top}%`,
                left: `${p.left}%`,
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-6 relative">
          <div className="h-16 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-3"
            >
              <Link
                to="/"
                aria-label="MGSA Home"
                className="flex items-center gap-3"
              >
                <img
                  src={LOGO}
                  alt="logo"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-[#22C55E]/40"
                />
                <span className="text-xl font-extrabold tracking-widest text-white">
                  MURTI GUUTO STUDENTS
                </span>
              </Link>
            </motion.div>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((l, idx) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + idx * 0.06 }}
                >
                  <NavLink
                    to={l.to}
                    onClick={scrollToTop}
                    className={({ isActive }) => {
                      const active = isActive || location.pathname === l.to;
                      return [
                        linkBase,
                        active
                          ? "text-[#22C55E] font-semibold"
                          : "text-white/80 hover:text-[#22C55E]",
                      ].join(" ");
                    }}
                  >
                    <span className="relative">
                      {l.label}
                      <span
                        className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#22C55E] transition-all duration-300 ease-in-out ${
                          location.pathname === l.to
                            ? "w-full"
                            : "w-0 hover:w-full"
                        }`}
                      />
                    </span>
                  </NavLink>
                </motion.div>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {isAdmin ? (
                    <>
                      <NavLink
                        to="/admin"
                        onClick={scrollToTop}
                        className={({ isActive }) => {
                          const active =
                            isActive || location.pathname === "/admin";
                          return [
                            linkBase,
                            active
                              ? "text-[#22C55E] font-semibold"
                              : "text-white/80 hover:text-[#22C55E]",
                          ].join(" ");
                        }}
                      >
                        <span className="inline-flex items-center gap-2">
                          Admin Dashboard
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-white border border-[#22C55E]/30">
                            Admin
                          </span>
                        </span>
                      </NavLink>
                      <NavLink
                        to="/profile"
                        onClick={scrollToTop}
                        className={({ isActive }) => {
                          const active =
                            isActive || location.pathname === "/profile";
                          return [
                            linkBase,
                            active
                              ? "text-[#22C55E] font-semibold"
                              : "text-white/80 hover:text-[#22C55E]",
                          ].join(" ");
                        }}
                      >
                        Profile
                      </NavLink>
                    </>
                  ) : (
                    <NavLink
                      to="/profile"
                      onClick={scrollToTop}
                      className={({ isActive }) => {
                        const active =
                          isActive || location.pathname === "/profile";
                        return [
                          linkBase,
                          active
                            ? "text-[#22C55E] font-semibold"
                            : "text-white/80 hover:text-[#22C55E]",
                        ].join(" ");
                      }}
                    >
                      Profile
                    </NavLink>
                  )}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={logout}
                    className="px-4 py-2 rounded-full bg-[#22C55E] text-white shadow transition-all duration-300 ease-in-out hover:bg-[#16A34A] hover:scale-105"
                  >
                    Logout
                  </motion.button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={scrollToTop}
                    className={({ isActive }) => {
                      const active = isActive || location.pathname === "/login";
                      return [
                        linkBase,
                        active
                          ? "text-[#22C55E] font-semibold"
                          : "text-white/80 hover:text-[#22C55E]",
                      ].join(" ");
                    }}
                  >
                    Login
                  </NavLink>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-full border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all duration-300 ease-in-out"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden p-2 rounded-lg bg-black/50 text-white border border-[#22C55E]/20 backdrop-blur-md z-[9999]"
              >
                {open ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <path d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="w-6 h-6"
                  >
                    <path d="M3 6h18M3 12h18M3 18h18" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                key="mobile"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="md:hidden absolute top-16 left-0 right-0 z-50 mx-4 rounded-2xl p-4 backdrop-blur-md bg-[#0A0A0A]/90 shadow-lg shadow-[#22C55E]/20 border border-[#22C55E]/20"
              >
                <ul className="grid gap-2">
                  {navLinks.map((l) => (
                    <li key={l.to}>
                      <NavLink
                        to={l.to}
                        onClick={() => {
                          setOpen(false);
                          scrollToTop();
                        }}
                        className={({ isActive }) => {
                          const active = isActive || location.pathname === l.to;
                          return [
                            "block",
                            linkBase,
                            active
                              ? "text-[#22C55E] font-semibold"
                              : "text-white/80 hover:text-[#22C55E]",
                          ].join(" ");
                        }}
                      >
                        <span className="relative">
                          {l.label}
                          <span
                            className={`absolute -bottom-1 left-0 h-[2px] rounded-full bg-[#22C55E] transition-all duration-300 ease-in-out ${
                              location.pathname === l.to
                                ? "w-full"
                                : "w-0 hover:w-full"
                            }`}
                          />
                        </span>
                      </NavLink>
                    </li>
                  ))}
                  <li className="mt-2 flex items-center gap-2">
                    {user ? (
                      <>
                        {isAdmin ? (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setOpen(false)}
                              className={`${linkBase}`}
                            >
                              <span className="inline-flex items-center gap-2">
                                Admin Dashboard
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#22C55E]/15 text-white border border-[#22C55E]/30">
                                  Admin
                                </span>
                              </span>
                            </Link>
                            <Link
                              to="/profile"
                              onClick={() => setOpen(false)}
                              className={`${linkBase}`}
                            >
                              Profile
                            </Link>
                          </>
                        ) : (
                          <Link
                            to="/profile"
                            onClick={() => setOpen(false)}
                            className={`${linkBase}`}
                          >
                            Profile
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setOpen(false);
                            logout();
                          }}
                          className="ml-auto px-4 py-2 rounded-full bg-[#22C55E] text-white shadow transition-all duration-300 ease-in-out hover:bg-[#16A34A] hover:scale-105"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          onClick={() => setOpen(false)}
                          className={`${linkBase}`}
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          onClick={() => setOpen(false)}
                          className="px-4 py-2 rounded-full border border-[#22C55E] text-[#22C55E] hover:bg-[#22C55E] hover:text-white transition-all duration-300 ease-in-out"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
            <div className="animated-gradient w-full h-full" />
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
