import { useState } from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Phone, Flag, MessageSquare, Trophy } from "lucide-react";
import { addTournamentApplication } from "@/lib/firebase";
import type { Tournament } from "@/lib/firebase";

interface TournamentRegistrationModalProps {
  tournament: Tournament & { id: string };
  onClose: () => void;
  onSuccess: () => void;
}

export default function TournamentRegistrationModal({ tournament, onClose, onSuccess }: TournamentRegistrationModalProps) {
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    country: "BJ",
    teamName: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const application = await addTournamentApplication({
        tournamentId: tournament.id,
        userId: `user_${Date.now()}`, // ID temporaire pour les utilisateurs non connectés
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        country: formData.country,
        teamName: formData.teamName || undefined,
        message: formData.message || undefined,
        status: "pending",
        appliedAt: new Date().toISOString()
      });

      // Sauvegarder l'application dans localStorage pour le suivi utilisateur
      const storedApplications = localStorage.getItem('userTournamentApplications');
      const applications = storedApplications ? JSON.parse(storedApplications) : [];
      
      // Ajouter la nouvelle application avec son ID
      const newApplication = {
        id: application.key, // Firebase key
        tournamentId: tournament.id,
        userId: `user_${Date.now()}`,
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        country: formData.country,
        teamName: formData.teamName || undefined,
        message: formData.message || undefined,
        status: "pending" as const,
        appliedAt: new Date().toISOString()
      };
      
      applications.push(newApplication);
      localStorage.setItem('userTournamentApplications', JSON.stringify(applications));

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-gradient-card rounded-2xl border border-border/50 shadow-card w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  Inscription au Tournoi
                </h3>
                <p className="text-xs text-muted-foreground">{tournament.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-secondary border border-border hover:bg-accent transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tournament Info */}
          <div className="mb-6 p-4 bg-secondary/50 rounded-lg border border-border/50">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground">Jeu:</span>
                <p className="font-medium text-foreground">{tournament.game}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Frais:</span>
                <p className="font-medium text-foreground">{tournament.entryFee}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Cagnotte:</span>
                <p className="font-medium text-primary">{tournament.prizePool}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Participants:</span>
                <p className="font-medium text-foreground">max {tournament.maxParticipants}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <User className="w-4 h-4" /> Nom Complet
              </label>
              <input
                type="text"
                required
                placeholder="Votre nom complet"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Mail className="w-4 h-4" /> Email
              </label>
              <input
                type="email"
                required
                placeholder="votre@email.com"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Phone className="w-4 h-4" /> Téléphone
              </label>
              <input
                type="tel"
                required
                placeholder="+229 XX XX XX XX"
                value={formData.userPhone}
                onChange={(e) => setFormData({ ...formData, userPhone: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Flag className="w-4 h-4" /> Pays
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className={inputClass}
              >
                <option value="BJ">🇧🇯 Bénin</option>
                <option value="TG">🇹🇬 Togo</option>
                <option value="CI">🇨🇮 Côte d'Ivoire</option>
                <option value="BF">🇧🇫 Burkina Faso</option>
                <option value="SN">🇸🇳 Sénégal</option>
                <option value="ML">🇲🇱 Mali</option>
                <option value="NE">🇳🇪 Niger</option>
                <option value="CM">🇨🇲 Cameroun</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <Trophy className="w-4 h-4" /> Nom de l'Équipe (optionnel)
              </label>
              <input
                type="text"
                placeholder="Nom de votre équipe"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                <MessageSquare className="w-4 h-4" /> Message (optionnel)
              </label>
              <textarea
                rows={3}
                placeholder="Informations supplémentaires..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground mb-4">
                En soumettant cette inscription, vous acceptez que l'administrateur du tournoi 
                examine votre demande. Vous recevrez une réponse par email dans les plus brefs délais.
              </p>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? "Inscription en cours..." : "Soumettre la demande"}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}
