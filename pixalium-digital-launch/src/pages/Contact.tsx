import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { openWhatsApp } from "@/lib/whatsapp";
import { addContactMessage } from "@/lib/firebase";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  service: z.string().min(1, "Please select a service"),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

const serviceOptions = [
  "Recharge Free Fire Diamants",
  "Recharge Call of Duty CP",
  "Recharge PUBG UC",
  "Recharge Roblox Robux",
  "Recharge Mobile Legends Diamonds",
  "Recharge Genshin Impact",
  "Autre Jeu",
  "Support / Problème Technique",
];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    addContactMessage({
      name: form.name,
      email: form.email,
      service: form.service,
      message: form.message,
      createdAt: new Date().toISOString(),
      read: false,
    }).catch(console.error);
    openWhatsApp(
      `Hello GOKU Shop!\n\nNom: ${form.name}\nEmail: ${form.email}\nService: ${form.service}\n\nMessage:\n${form.message}`
    );
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm";

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading badge="Contact" title="Besoin d'Aide ?" subtitle="Une question sur votre recharge ? Notre équipe est là pour vous aider." />

          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-2xl font-semibold text-foreground mb-6">Informations de Contact</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Localisation</p>
                    <p className="text-muted-foreground text-sm">BENIN</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">WhatsApp (24/7)</p>
                    <p className="text-muted-foreground text-sm">+229 51 10 45 75</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground text-sm">support@gokushop.bj</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-card rounded-xl border border-border/50">
                <h4 className="font-semibold text-foreground mb-3">⏰ Temps de Réponse</h4>
                <p className="text-muted-foreground text-sm">
                  Notre équipe support est disponible 24h/24 et 7j/7 via WhatsApp. 
                  Nous répondons généralement en moins de 5 minutes pendant nos heures d'ouverture.
                </p>
              </div>
            </motion.div>

            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card space-y-4"
            >
              <div>
                <input
                  type="text"
                  placeholder="Nom Complet"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className={inputClass}
                  maxLength={100}
                />
                {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Adresse Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className={inputClass}
                  maxLength={255}
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
              <div>
                <select
                  value={form.service}
                  onChange={(e) => setForm({ ...form, service: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Sélectionnez un Service</option>
                  {serviceOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.service && <p className="text-destructive text-xs mt-1">{errors.service}</p>}
              </div>
              <div>
                <textarea
                  placeholder="Votre Message"
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className={inputClass + " resize-none"}
                  maxLength={2000}
                />
                {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Envoyer via WhatsApp
              </button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
}
