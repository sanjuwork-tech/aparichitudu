import { motion } from "framer-motion";

const realms = [
  { label: "Chapters I–VII", title: "The Hells", color: "#c94a4a", glow: "rgba(139,21,21,0.5)" },
  { label: "Chapters VII–XIII", title: "Rites for the Dead", color: "#c9a84c", glow: "rgba(180,130,40,0.4)" },
  { label: "Chapter XIV", title: "City of Justice", color: "#6eb4d8", glow: "rgba(70,140,190,0.4)" },
  { label: "Chapters XV–XVI", title: "Liberation", color: "#d4f0ff", glow: "rgba(180,220,255,0.35)" },
];

export function Introduction() {
  return (
    <section
      id="introduction"
      className="relative w-full flex items-center py-16 px-6 md:px-12 lg:px-24 overflow-hidden"
    >
      {/* Atmospheric side glow */}
      <div
        className="absolute left-0 inset-y-0 w-1/3 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(80,20,5,0.12) 0%, transparent 100%)",
        }}
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* Image panel — grayscale until hovered */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1 }}
          className="relative aspect-[3/4] w-full max-w-md mx-auto lg:mx-0 group"
          style={{ border: "1px solid rgba(201,168,76,0.15)" }}
        >
          <img
            src="/images/yama-court.png"
            alt="Yama's Court"
            className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1200"
          />
          {/* Hover: fire overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(100,20,5,0.5) 0%, transparent 60%)",
            }}
          />
          {/* Caption */}
          <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <p className="text-primary/70 font-serif text-xs tracking-widest uppercase">
              Yama's Court — Where Deeds Are Weighed
            </p>
          </div>
          {/* Corner ornaments */}
          <span className="absolute top-2 left-2 text-primary/20 text-sm">✦</span>
          <span className="absolute bottom-2 right-2 text-primary/20 text-sm">✦</span>
        </motion.div>

        {/* Text panel */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.1, delay: 0.15 }}
          className="flex flex-col space-y-8"
        >
          <div>
            <p className="text-primary/40 font-sans tracking-[0.4em] uppercase text-xs mb-3">
              Sacred Text
            </p>
            <h2 className="text-4xl md:text-5xl text-primary font-serif leading-tight">
              The Book of Death
            </h2>
          </div>

          <div className="text-foreground/65 font-sans font-light leading-relaxed space-y-5 text-base md:text-lg">
            <p>
              The Garuda Purana is one of the Mahā Purāṇas — a vast Sanskrit
              encyclopaedia of sacred knowledge. This translation focuses on the
              <em className="text-foreground/80 not-italic"> Uttara Khaṇḍa</em>, the second
              section: a dialogue between Viṣṇu and Garuḍa on death, the afterlife,
              and liberation.
            </p>
            <p>
              Portions are recited as funeral liturgy. Hell here is reformatory — not
              eternal. The soul is purified through suffering, then reborn. The final
              teaching is singular: <em className="text-primary/80">self-knowledge alone liberates</em>.
            </p>
          </div>

          {/* Realm map */}
          <div className="space-y-3">
            {realms.map((realm, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 p-3 group cursor-default"
                style={{ border: `1px solid ${realm.color}18` }}
                whileHover={{ borderColor: realm.color + "50", backgroundColor: realm.color + "08" }}
              >
                <div
                  className="w-1 h-8 flex-shrink-0 rounded-full"
                  style={{
                    background: realm.color,
                    boxShadow: `0 0 8px ${realm.glow}`,
                  }}
                />
                <div>
                  <p
                    className="font-serif text-sm"
                    style={{ color: realm.color }}
                  >
                    {realm.title}
                  </p>
                  <p className="text-foreground/35 text-xs font-sans mt-0.5">
                    {realm.label}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.6 }}
            className="text-xl md:text-2xl font-serif text-primary/65 italic border-l-2 border-primary/30 pl-6 mt-4"
          >
            "The fool, not knowing that the truth is seated in himself, is bewildered
            by the Shastras."
          </motion.blockquote>
        </motion.div>
      </div>
    </section>
  );
}
