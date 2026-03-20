import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Gamepad2, Shield, Clock, ArrowRight, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import Testimonials from "@/components/Testimonials";
import NewsletterSubscribe from "@/components/NewsletterSubscribe";
import { games } from "@/lib/games";

const features = [
  {
    icon: Zap,
    title: "Recharge Instantanée",
    desc: "Recevez vos diamants, CP, UC ou Robux en quelques minutes seulement.",
  },
  {
    icon: Shield,
    title: "100% Sécurisé",
    desc: "Transactions sécurisées et garantie de remboursement en cas de problème.",
  },
  {
    icon: Clock,
    title: "Support 24/7",
    desc: "Notre équipe est disponible 24h/24 et 7j/7 pour vous assister.",
  },
];

export default function Index() {
  return (
    <Layout>
      {/* SEO */}
      <title>GameRecharge BENIN - Recharge Free Fire, COD, PUBG, Roblox | Diamants, CP, UC, Robux</title>
      <meta name="description" content="Plateforme n°1 au BENIN pour recharger vos jeux préférés : Free Fire diamants, Call of Duty CP, PUBG UC, Roblox Robux. Recharge instantanée et sécurisée 24/7." />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-primary/20 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-[120px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wider uppercase mb-6">
                🎮 Recharge de Jeux Mobiles - Togo 🇹🇬
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
                Rechargez Vos{" "}
                <span className="text-gradient">Jeux Préférés</span>{" "}
                Instantanément
              </h1>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
                Free Fire diamants, Call of Duty CP, PUBG UC, Roblox Robux et plus encore. 
                Meilleurs prix au Togo, recharge rapide et sécurisée.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/recharge"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity shadow-glow"
                >
                  <Gamepad2 className="w-5 h-5" /> Recharger Maintenant <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/recharge"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-semibold hover:bg-secondary transition-colors"
                >
                  Voir la Boutique
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {games.slice(0, 4).map((game, idx) => (
                  <motion.div
                    key={game.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 + idx * 0.1 }}
                    className={`rounded-2xl p-6 bg-gradient-to-br ${game.gradient} shadow-card border border-border/50 flex items-center justify-center`}
                  >
                    {game.iconImage ? (
                      <img 
                        src={game.iconImage} 
                        alt={`${game.name} icon`}
                        className="w-full h-full object-contain max-w-[120px] max-h-[120px]"
                      />
                    ) : (
                      <span className="text-6xl">{game.icon}</span>
                    )}
                  </motion.div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Et beaucoup d'autres jeux disponibles...
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Games */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4">
          <SectionHeading 
            badge="Jeux Populaires" 
            title="Rechargez Vos Jeux Favoris" 
            subtitle="Sélectionnez votre jeu et choisissez le pack qui vous convient." 
          />
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {games.map((game, i) => (
              <Link
                key={game.id}
                to="/recharge"
                className={`group rounded-2xl p-6 bg-gradient-card border border-border/50 hover:border-primary/30 transition-all shadow-card hover:shadow-glow`}
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                  {game.iconImage && (
                    <img 
                      src={game.iconImage} 
                      alt={`${game.name} icon`}
                      className="w-10 h-10 object-contain"
                    />
                  )}
                  {!game.iconImage && <span className="text-3xl">{game.icon}</span>}
                </div>
                <h3 className="font-display text-base font-semibold text-foreground text-center mb-2">{game.name}</h3>
                <p className="text-muted-foreground text-xs text-center">{game.description}</p>
                {game.popular && (
                  <div className="mt-3 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3 h-3 text-primary" />
                    <span className="text-xs text-primary font-semibold">Populaire</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="Pourquoi Nous Choisir" title="Nos Avantages" subtitle="Une expérience de recharge rapide, sécurisée et sans tracas." />
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-gradient-card rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-colors group shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:shadow-glow transition-shadow">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <Testimonials />
    </Layout>
  );
}
