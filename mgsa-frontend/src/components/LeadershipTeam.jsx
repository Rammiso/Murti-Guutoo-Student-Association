import { motion } from "framer-motion";
import ANAS from "../assets/Profile_Pictures/anas.png";
import ABDUNASIR from "../assets/Profile_Pictures/abdunasir.png";
import YONAS from "../assets/Profile_Pictures/abel.png";
const leaders = [
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
];

const LeadershipTeam = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            MGSA Leadership Team
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-[#22C55E] to-[#16A34A] rounded-full" />
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Meet the dedicated leaders driving our association forward
          </p>
        </motion.div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {leaders.map((leader, idx) => (
            <motion.div
              key={leader.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="group relative rounded-2xl border border-[#22C55E]/30 bg-white/5 backdrop-blur-md p-6 shadow-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all duration-300"
            >
              {/* Glow effect */}
              <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#22C55E]/20 via-[#16A34A]/20 to-[#22C55E]/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative">
                {/* Photo */}
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#22C55E] to-[#16A34A] blur opacity-75" />
                    <img
                      src={leader.photo}
                      alt={leader.name}
                      className="relative w-24 h-24 rounded-full object-cover border-2 border-[#22C55E]/50"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {leader.name}
                  </h3>
                  <p className="text-[#22C55E] font-semibold mb-4">
                    {leader.role}
                  </p>

                  {/* Contact Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2 text-white/80">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-[#22C55E]"
                      >
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
                      </svg>
                      <span>{leader.telegram}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-white/80">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4 text-[#22C55E]"
                      >
                        <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.05-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 7a1 1 0 0 1 1-1h2.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.24 1.05Z" />
                      </svg>
                      <span>{leader.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LeadershipTeam;
