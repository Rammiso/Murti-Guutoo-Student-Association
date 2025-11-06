import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQ = () => {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "Who can join MGSA?",
      a: "Any student from East or West Hararge studying at Haramaya University.",
    },
    {
      q: "Is there a membership fee?",
      a: "No, joining MGSA is completely free.",
    },
    {
      q: "What kind of resources can I access?",
      a: "Study materials, past exams, and notes categorized by course and year.",
    },
    {
      q: "Do I need an account to download files?",
      a: "Yes, only registered and logged-in students can download resources.",
    },
    {
      q: "How can I contact MGSA?",
      a: "Use the Contact page or email us at mgsa.association@gmail.com.",
    },
  ];

  const toggle = (i) => setOpen((v) => (v === i ? null : i));

  return (
    <div className="min-h-[70vh] bg-mgsa-bgSubtle">
      {/* Hero */}
      <section className="text-center pt-10 md:pt-14">
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-mgsa-dark to-mgsa-accent"
        >
          Frequently Asked Questions
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut", delay: 0.05 }}
          className="mt-2 text-gray-700"
        >
          Find quick answers to common questions about MGSA.
        </motion.p>
      </section>

      {/* FAQ List */}
      <section className="py-10 md:py-14">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-3">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={item.q}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className={`cursor-pointer rounded-xl border p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:scale-[1.01] ${
                    isOpen ? "border-mgsa-accent/50 bg-mgsa-accent/5" : "border-[#E5E7EB] bg-white"
                  }`}
                  onClick={() => toggle(i)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold text-gray-900 text-left">{item.q}</h3>
                    {/* Chevron icon */}
                    <motion.svg
                      initial={false}
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-mgsa-accent shrink-0"
                    >
                      <path d="M6.7 9.3 12 14.6l5.3-5.3 1.4 1.4L12 17.4 5.3 10.7z" />
                    </motion.svg>
                  </div>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 text-gray-700 leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
