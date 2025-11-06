import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { Sparkles, Eye, EyeOff } from "lucide-react";

const ZONES = {
  "West Hararghe": [
    "Mieso",
    "Doba",
    "Tulo",
    "Mesela",
    "Chiro",
    "Anchar",
    "Guba Koricha",
    "Habro",
    "Daro Lebu",
    "Boke",
    "Kuni",
    "Gemches",
    "Chiro Zuria",
    "Bedesa",
  ],
  "East Hararghe": [
    "Kombolcha",
    "Jarso",
    "Gursum",
    "Babile",
    "Fedis",
    "Haramaya",
    "Kurfa Chele",
    "Kersa",
    "Meta",
    "Goro Gutu",
    "Deder",
    "Melka Belo",
    "Bedeno",
    "Midga Tola",
    "Chinaksan",
    "Girawa",
    "Gola Oda",
    "Meyu",
  ],
  "Dire Dawa": ["Dire Dawa City"],
  Harar: [
    "Harar City",
    "Abadir",
    "Aboker",
    "Hakim",
    "JinElla",
    "Shenkor",
    "Sofi",
    "Erer",
    "Dire Teyara",
  ],
};

const COLLEGES = {
  FRESHMAN: ["Social Science", "Natural Science"],
  "Business & Economics": ["Accounting", "Economics", "Management"],
  "Computing & Informatics": [
    "Computer Science",
    "Information Systems",
    "Information Science",
    "Information Technology",
    "Software Engineering",
  ],
  "Agriculture & Environmental Sciences": [
    "Agro-Economics",
    "Agro-Business",
    "Plant Sciences",
    "Environmental Science",
  ],

  "Social Sciences & Humanities": ["Sociology", "Psychology", "English"],
  Law: ["LL.B"],
  "Veterinary Medicine": ["Veterinary Medicine"],
  "Natural & Computational Sciences": [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
  ],

  "Haramaya Institute of Technology": [
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
  ],
};

const YEARS = ["Freshman", "2nd", "3rd", "4th", "5th"];

const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useAuth();
  const [form, setForm] = useState({
    fname: "",
    mname: "",
    lname: "",
    gender: "",
    studentId: "",
    zone: "",
    woreda: "",
    year: "",
    college: "",
    department: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const woredas = useMemo(
    () => (form.zone ? ZONES[form.zone] : []),
    [form.zone]
  );
  const departments = useMemo(
    () => (form.college ? COLLEGES[form.college] : []),
    [form.college]
  );

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({
      ...f,
      [name]: value,
      ...(name === "zone" ? { woreda: "" } : {}),
      ...(name === "college" ? { department: "" } : {}),
    }));
  };

  const validateEmail = (email) => {
    // Email must end with @gmail.com
    const emailRegex = /^[^\s@]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    // Must be exactly 10 digits starting with 09 or 07
    const phoneRegex = /^(09|07)\d{8}$/;
    return phoneRegex.test(phone);
  };

  const handleEmailBlur = () => {
    if (form.email && !validateEmail(form.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid Gmail address (e.g., name@gmail.com)",
      }));
    } else {
      setErrors((prev) => {
        const { email, ...rest } = prev;
        return rest;
      });
    }
  };

  const handlePhoneBlur = () => {
    if (form.phone && !validatePhone(form.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Phone must start with 09 or 07 and be exactly 10 digits",
      }));
    } else {
      setErrors((prev) => {
        const { phone, ...rest } = prev;
        return rest;
      });
    }
  };

  const validate = () => {
    const err = {};

    // Name validation
    if (!form.fname || form.fname.trim().length < 2) {
      err.fname = "First name must be at least 2 characters";
    }
    if (form.lname && form.lname.trim().length < 2) {
      err.lname = "Last name must be at least 2 characters";
    }

    // Email validation
    if (!form.email) {
      err.email = "Email is required";
    } else if (!/^[^\s@]+@gmail\.com$/.test(form.email)) {
      err.email = "Please enter a valid Gmail address (e.g., name@gmail.com)";
    }

    // Phone validation
    if (!form.phone) {
      err.phone = "Phone number is required";
    } else if (!validatePhone(form.phone)) {
      err.phone = "Phone must start with 09 or 07 and be exactly 10 digits";
    }

    // Student ID validation
    if (!form.studentId) {
      err.studentId = "Student ID is required";
    } else if (form.studentId.trim().length < 5) {
      err.studentId = "Student ID must be at least 5 characters";
    }

    // Password validation
    if (!form.password) {
      err.password = "Password is required";
    } else if (form.password.length < 6) {
      err.password = "Password must be at least 6 characters";
    }

    if (!form.confirm) {
      err.confirm = "Please confirm your password";
    } else if (form.password !== form.confirm) {
      err.confirm = "Passwords do not match";
    }

    // Dropdown validations
    if (!form.zone) err.zone = "Please select a zone";
    if (!form.woreda) err.woreda = "Please select a woreda";
    if (!form.college) err.college = "Please select a college";
    if (!form.department) err.department = "Please select a department";
    if (!form.year) err.year = "Please select year of study";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      setError("Please fill in all required fields correctly");
      return;
    }

    try {
      await register({
        email: form.email,
        password: form.password,
        studentId: form.studentId,
        fname: form.fname,
        lname: form.lname || "",
        mname: form.mname || "",
        phone: form.phone || "",
        gender: form.gender,
        zone: form.zone,
        woreda: form.woreda,
        year: form.year,
        college: form.college,
        department: form.department,
      });
      // Navigation is handled by AuthContext
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0B0E14] via-[#1a1f2e] to-[#0f1419]"
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(0, 255, 198, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Orbs */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          x: [0, 20, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute top-20 left-20 w-96 h-96 bg-[#22C55E]/10 blur-3xl rounded-full"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          x: [0, -20, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="pointer-events-none absolute bottom-20 right-20 w-96 h-96 bg-[#00FFC6]/10 blur-3xl rounded-full"
      />

      {/* Glassmorphic Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-[90%] max-w-[900px] rounded-2xl border-2 border-[#22C55E]/30 bg-gradient-to-br from-[#1a1f2e]/90 to-[#0f1419]/90 backdrop-blur-xl shadow-2xl shadow-[#22C55E]/10 p-8 md:p-10"
      >
        {/* Glowing Border Effect */}
        <div className="pointer-events-none absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#22C55E]/20 via-[#00FFC6]/20 to-[#22C55E]/20 blur-sm" />

        <div className="relative">
          {/* Logo with Pulse Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                  "0 0 40px rgba(34, 197, 94, 0.5)",
                  "0 0 20px rgba(34, 197, 94, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#22C55E] to-[#00FFC6] flex items-center justify-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="text-white" size={32} />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Header */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-center bg-gradient-to-r from-[#22C55E] via-[#00FFC6] to-[#22C55E] bg-clip-text text-transparent mb-2"
          >
            Create Your MGSA Account
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center text-gray-400 text-sm mb-8"
          >
            Join the Murti Guuto Students Association network
          </motion.p>

          <form
            onSubmit={submit}
            className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              ["fname", "First Name *"],
              ["mname", "Middle Name"],
              ["lname", "Last Name"],
            ].map(([name, placeholder, type], idx) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className="col-span-1"
              >
                <input
                  name={name}
                  type={type || "text"}
                  value={form[name]}
                  onChange={onChange}
                  placeholder={placeholder}
                  className={`w-full rounded-xl border-2 px-4 py-3 outline-none transition-all duration-300 ${
                    errors[name]
                      ? "border-red-500/50 bg-red-500/5 text-red-400 placeholder-red-400/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                      : "border-[#22C55E]/30 bg-[#0B0E14]/50 text-[#E0E0E0] placeholder-gray-500 focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                  }`}
                />
                {errors[name] && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-red-600 mt-1"
                  >
                    {errors[name]}
                  </motion.p>
                )}
              </motion.div>
            ))}

            {/* Email Field with Advanced Validation */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.09 }}
              className="col-span-1"
            >
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                onBlur={handleEmailBlur}
                placeholder="Email *"
                className={`w-full rounded-xl border-2 px-4 py-3 outline-none transition-all duration-300 ${
                  errors.email
                    ? "border-red-500/50 bg-red-500/5 text-red-400 placeholder-red-400/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "border-[#22C55E]/30 bg-[#0B0E14]/50 text-[#E0E0E0] placeholder-gray-500 focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                }`}
              />
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </motion.div>

            {/* Phone Number Field */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 }}
              className="col-span-1"
            >
              <input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={onChange}
                onBlur={handlePhoneBlur}
                placeholder="Phone Number *"
                pattern="^(09|07)\d{8}$"
                maxLength="10"
                className={`w-full rounded-xl border-2 px-4 py-3 outline-none transition-all duration-300 ${
                  errors.phone
                    ? "border-red-500/50 bg-red-500/5 text-red-400 placeholder-red-400/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "border-[#22C55E]/30 bg-[#0B0E14]/50 text-[#E0E0E0] placeholder-gray-500 focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                }`}
              />
              {errors.phone && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.phone}
                </motion.p>
              )}
              {!errors.phone && form.phone && (
                <p className="text-xs text-gray-600 mt-1">Format: 09XXXXXXXX</p>
              )}
            </motion.div>

            {/* Student ID Field */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="col-span-1"
            >
              <input
                name="studentId"
                type="text"
                value={form.studentId}
                onChange={onChange}
                placeholder="Student ID Number *"
                className={`w-full rounded-xl border-2 px-4 py-3 outline-none transition-all duration-300 ${
                  errors.studentId
                    ? "border-red-500/50 bg-red-500/5 text-red-400 placeholder-red-400/50 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "border-[#22C55E]/30 bg-[#0B0E14]/50 text-[#E0E0E0] placeholder-gray-500 focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                }`}
              />
              {errors.studentId && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.studentId}
                </motion.p>
              )}
              {!errors.studentId && !form.studentId && (
                <p className="text-xs text-gray-500 mt-1">Example: 0000/15</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <select
                name="gender"
                value={form.gender}
                onChange={onChange}
                className={`w-full rounded-xl border-2 px-4 py-3 outline-none transition-all duration-300 ${
                  errors.gender
                    ? "border-red-500/50 bg-red-500/5 text-red-400 focus:border-red-500 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                    : "border-[#22C55E]/30 bg-[#0B0E14]/50 text-[#E0E0E0] focus:border-[#22C55E] focus:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                }`}
              >
                <option value="">Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <select
                name="year"
                value={form.year}
                onChange={onChange}
                className={`w-full rounded-xl border ${
                  errors.year ? "border-red-400" : "border-white/40"
                } bg-white/70 px-3 py-2.5 text-gray-800 outline-none focus:ring-2 focus:ring-mgsa-accent ring-offset-2`}
              >
                <option value="">Year of Study</option>
                {YEARS.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
              {errors.year && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.year}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <select
                name="zone"
                value={form.zone}
                onChange={onChange}
                className={`w-full rounded-xl border ${
                  errors.zone ? "border-red-400" : "border-white/40"
                } bg-white/70 px-3 py-2.5 text-gray-800 outline-none focus:ring-2 focus:ring-mgsa-accent ring-offset-2`}
              >
                <option value="">Zone</option>
                {Object.keys(ZONES).map((z) => (
                  <option key={z}>{z}</option>
                ))}
              </select>
              {errors.zone && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.zone}
                </motion.p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <select
                name="woreda"
                value={form.woreda}
                onChange={onChange}
                disabled={!form.zone}
                className={`w-full rounded-xl border ${
                  errors.woreda ? "border-red-400" : "border-white/40"
                } bg-white/70 px-3 py-2.5 text-gray-800 outline-none focus:ring-2 focus:ring-mgsa-accent ring-offset-2 disabled:opacity-60`}
              >
                <option value="">Woreda</option>
                {woredas.map((w) => (
                  <option key={w}>{w}</option>
                ))}
              </select>
              {errors.woreda && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.woreda}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <select
                name="college"
                value={form.college}
                onChange={onChange}
                className={`w-full rounded-xl border ${
                  errors.college ? "border-red-400" : "border-white/40"
                } bg-white/70 px-3 py-2.5 text-gray-800 outline-none focus:ring-2 focus:ring-mgsa-accent ring-offset-2`}
              >
                <option value="">College</option>
                {Object.keys(COLLEGES).map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              {errors.college && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.college}
                </motion.p>
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <select
                name="department"
                value={form.department}
                onChange={onChange}
                disabled={!form.college}
                className={`w-full rounded-xl border ${
                  errors.department ? "border-red-400" : "border-white/40"
                } bg-white/70 px-3 py-2.5 text-gray-800 outline-none focus:ring-2 focus:ring-mgsa-accent ring-offset-2 disabled:opacity-60`}
              >
                <option value="">Department</option>
                {departments.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              {errors.department && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.department}
                </motion.p>
              )}
            </motion.div>

            {/* Password fields at the end */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  placeholder="Password *"
                  className={`w-full rounded-xl border ${
                    errors.password ? "border-red-400" : "border-white/40"
                  } bg-white/70 pl-3 pr-12 py-2.5 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-mgsa-accent ring-offset-2 focus:scale-[1.01] transition`}
                />
                <button
                  type="button"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 inset-y-0 grid place-items-center bg-transparent text-gray-500 hover:text-mgsa-accent hover:scale-105 transition-all duration-300"
                >
                  {showPass ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M2.3 2.3 1 3.6l4 4A13.6 13.6 0 0 0 1 12c2.3 4.5 7 7 11 7 2.1 0 4.1-.6 5.9-1.7l3.5 3.5 1.3-1.3L2.3 2.3ZM12 17c-2.8 0-5.4-1.7-7.5-5 1-.9 2-1.7 3.1-2.3l2 2A3.5 3.5 0 0 0 12 15a3.5 3.5 0 0 0 3.3-2.3l2 2c-1.6 1.5-3.3 2.3-5.3 2.3Zm0-10c2.8 0 5.4 1.7 7.5 5-.6.6-1.2 1.2-1.9 1.7l1.1 1.1c1-.8 1.9-1.7 2.7-2.8-2.3-4.5-7-7-11-7-1.7 0-3.3.4-4.8 1l1.2 1.2C8.9 5.4 10.4 5 12 5Zm0 2a3 3 0 0 0-2.7 1.7l3.9 3.9A3 3 0 0 0 12 7Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 5c-4 0-8.7 2.5-11 7 2.3 4.5 7 7 11 7s8.7-2.5 11-7c-2.3-4.5-7-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5A2.5 2.5 0 1 0 12 8a2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="col-span-1"
            >
              <div className="relative">
                <input
                  name="confirm"
                  type={showConfirm ? "text" : "password"}
                  value={form.confirm}
                  onChange={onChange}
                  placeholder="Confirm Password *"
                  className={`w-full rounded-xl border ${
                    errors.confirm ? "border-red-400" : "border-white/40"
                  } bg-white/70 pl-3 pr-12 py-2.5 text-gray-800 placeholder-gray-500 outline-none focus:ring-2 focus:ring-mgsa-accent ring-offset-2 focus:scale-[1.01] transition`}
                />
                <button
                  type="button"
                  aria-label={showConfirm ? "Hide password" : "Show password"}
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 inset-y-0 grid place-items-center bg-transparent text-gray-500 hover:text-mgsa-accent hover:scale-105 transition-all duration-300"
                >
                  {showConfirm ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M2.3 2.3 1 3.6l4 4A13.6 13.6 0 0 0 1 12c2.3 4.5 7 7 11 7 2.1 0 4.1-.6 5.9-1.7l3.5 3.5 1.3-1.3L2.3 2.3ZM12 17c-2.8 0-5.4-1.7-7.5-5 1-.9 2-1.7 3.1-2.3l2 2A3.5 3.5 0 0 0 12 15a3.5 3.5 0 0 0 3.3-2.3l2 2c-1.6 1.5-3.3 2.3-5.3 2.3Zm0-10c2.8 0 5.4 1.7 7.5 5-.6.6-1.2 1.2-1.9 1.7l1.1 1.1c1-.8 1.9-1.7 2.7-2.8-2.3-4.5-7-7-11-7-1.7 0-3.3.4-4.8 1l1.2 1.2C8.9 5.4 10.4 5 12 5Zm0 2a3 3 0 0 0-2.7 1.7l3.9 3.9A3 3 0 0 0 12 7Z" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5"
                    >
                      <path d="M12 5c-4 0-8.7 2.5-11 7 2.3 4.5 7 7 11 7s8.7-2.5 11-7c-2.3-4.5-7-7-11-7Zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5A2.5 2.5 0 1 0 12 8a2.5 2.5 0 0 0 0 5Z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirm && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-red-600 mt-1"
                >
                  {errors.confirm}
                </motion.p>
              )}
            </motion.div>

            <div className="md:col-span-2 mt-2">
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-white text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-gradient-to-r from-mgsa-dark to-mgsa-accent text-white font-semibold py-2.5 shadow-md hover:shadow-[0_0_20px_rgba(232,97,125,0.5)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Registering...</span>
                  </>
                ) : (
                  "Register"
                )}
              </motion.button>
              <p className="text-center text-sm text-white mt-3">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="underline decoration-white/50 hover:decoration-white"
                >
                  Login here
                </a>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
