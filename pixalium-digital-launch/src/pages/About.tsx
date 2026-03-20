import { motion } from "framer-motion";
import { Target, Eye, Heart } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";

const values = [
  { icon: Target, title: "Mission", desc: "Fournir aux gamers africains une plateforme fiable et abordable pour recharger leurs jeux préférés : Free Fire, Call of Duty, PUBG, Roblox et plus encore." },
  { icon: Eye, title: "Vision", desc: "Devenir la plateforme de recharge de jeux mobiles n°1 en Afrique de l'Ouest, reconnue pour sa rapidité, sa sécurité et son service client exceptionnel." },
  { icon: Heart, title: "Valeurs", desc: "Rapidité, sécurité, accessibilité et satisfaction client. Nous nous engageons à offrir la meilleure expérience de recharge avec un support disponible 24/7." },
];

export default function About() {
  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="À Propos" title="Qui Sommes-Nous" subtitle="GOKU Shop est votre plateforme de confiance pour recharger tous vos jeux mobiles préférés." />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <p className="text-muted-foreground leading-relaxed text-lg">
              Fondée avec la passion du gaming et l'objectif de rendre les recharges de jeux accessibles 
              à tous les gamers africains, GOKU Shop est basée au BENIN et dessert toute l'Afrique de l'Ouest. 
              Notre plateforme vous permet de recharger instantanément vos diamants Free Fire, CP Call of Duty, 
              UC PUBG, Robux Roblox et bien plus encore, aux meilleurs prix et avec un service client disponible 24/7.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 text-center shadow-card"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <v.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{v.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
