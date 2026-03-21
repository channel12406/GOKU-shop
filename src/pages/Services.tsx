import { motion } from "framer-motion";
import { Zap, Shield, Clock, MessageSquare, Gift, Headphones } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { openWhatsApp } from "@/lib/whatsapp";
import { addOrder } from "@/lib/firebase";

const services = [
  {
    icon: Zap,
    title: "Recharge Express",
    desc: "Recevez vos diamants, CP, UC ou Robux en moins de 5 minutes. Traitement automatique et instantané.",
    price: "À partir de 1 000 FCFA",
  },
  {
    icon: Shield,
    title: "Garantie de Sécurité",
    desc: "Transactions 100% sécurisées. Protection des données et garantie de remboursement.",
    price: "Inclus",
  },
  {
    icon: Clock,
    title: "Support 24/7",
    desc: "Notre équipe est disponible 24h/24 et 7j/7 pour vous aider via WhatsApp.",
    price: "Gratuit",
  },
  {
    icon: MessageSquare,
    title: "Assistance Personnalisée",
    desc: "Besoin d'aide pour choisir votre pack? Nous vous guidons pas à pas.",
    price: "Sur WhatsApp",
  },
  {
    icon: Gift,
    title: "Bonus & Promotions",
    desc: "Profitez de bonus exclusifs et de réductions sur vos recharges régulières.",
    price: "Variable",
  },
  {
    icon: Headphones,
    title: "Service Client Dédié",
    desc: "Une équipe dédiée pour répondre à toutes vos questions et besoins.",
    price: "Inclus",
  },
];

export default function Services() {
  const handleOrder = (title: string, price: string) => {
    addOrder({
      productName: title,
      price,
      quantity: 1,
      createdAt: new Date().toISOString(),
      status: "pending",
    }).catch(console.error);
    openWhatsApp(
      `Hello GOKU Shop! I'm interested in your "${title}" service. I'd like to get more information. Thank you!`
    );
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="Services" title="Nos Services de Recharge" subtitle="Des services rapides, sécurisés et disponibles 24/7 pour tous vos jeux préférés." />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-all group shadow-card flex flex-col"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <s.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{s.desc}</p>
                <p className="text-primary font-semibold text-sm mb-4">{s.price}</p>
                <button
                  onClick={() => handleOrder(s.title, s.price)}
                  className="w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Commander via WhatsApp
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
