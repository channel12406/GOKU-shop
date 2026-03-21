import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Calendar, MapPin, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { subscribeToRecords, addTournamentApplication, type Tournament } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

export default function Tournaments() {
  const navigate = useNavigate();
  const [tournaments, setTournaments] = useState<(Tournament & { id: string })[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<Tournament & { id: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    teamName: "",
    message: "",
  });

  useEffect(() => {
    const unsub = subscribeToRecords<Tournament>("tournaments", (data) => {
      // Only show upcoming and ongoing tournaments
      const active = data.filter(t => t.status === "upcoming" || t.status === "ongoing");
      setTournaments(active);
    });
    
    return unsub;
  }, []);

  const handleRegister = (tournament: Tournament & { id: string }) => {
    setSelectedTournament(tournament);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedTournament) return;
    
    try {
      await addTournamentApplication({
        tournamentId: selectedTournament.id,
        userId: "user-" + Date.now(), // In real app, use actual user ID
        userName: formData.userName,
        userEmail: formData.userEmail,
        userPhone: formData.userPhone,
        teamName: formData.teamName || undefined,
        message: formData.message || undefined,
        status: "pending",
      });
      
      alert("Votre candidature a été soumise avec succès ! L'administrateur la examinera bientôt.");
      setShowForm(false);
      setFormData({
        userName: "",
        userEmail: "",
        userPhone: "",
        teamName: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading 
            badge="Tournois" 
            title="Participez aux Tournois" 
            subtitle="Affrontez d'autres joueurs et remportez des prix incroyables sur vos jeux préférés." 
          />

          {/* Tournaments Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {tournaments.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground text-lg">Aucun tournoi disponible pour le moment.</p>
                <p className="text-muted-foreground text-sm mt-2">Revenez bientôt pour de nouveaux tournois !</p>
              </div>
            ) : (
              tournaments.map((tournament, i) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="bg-gradient-card rounded-2xl p-6 border border-border/50 hover:border-primary/30 transition-all shadow-card flex flex-col"
                >
                  {tournament.image && (
                    <div className="mb-4">
                      <img 
                        src={tournament.image} 
                        alt={tournament.name} 
                        className="w-full h-40 object-cover rounded-lg border border-border/50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-primary" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {tournament.status === 'upcoming' ? 'À venir' : 'En cours'}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">{tournament.name}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4 flex-1">{tournament.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span>{tournament.game}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="w-3 h-3 text-primary" />
                      <span>{tournament.maxParticipants} participants max</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3 text-primary" />
                      <span>Du {new Date(tournament.startDate).toLocaleDateString('fr-FR')} au {new Date(tournament.endDate).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-border/50 pt-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-muted-foreground">Frais d'inscription</span>
                      <span className="text-sm font-semibold text-foreground">{tournament.entryFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Cagnotte</span>
                      <span className="text-lg font-bold text-gradient">{tournament.prizePool}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleRegister(tournament)}
                    disabled={tournament.status !== "upcoming"}
                    className="w-full py-2.5 rounded-lg bg-gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> 
                    {tournament.status === "upcoming" ? "S'inscrire maintenant" : "Inscriptions fermées"}
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Registration Modal */}
      {showForm && selectedTournament && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-card w-full max-w-md relative">
            <button 
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 p-1 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Inscription au tournoi
            </h3>
            <p className="text-muted-foreground text-sm mb-4">{selectedTournament.name}</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                  className={inputClass}
                  placeholder="Votre nom"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={formData.userEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                  className={inputClass}
                  placeholder="votre@email.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone / WhatsApp</label>
                <input
                  type="tel"
                  value={formData.userPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, userPhone: e.target.value }))}
                  className={inputClass}
                  placeholder="+228 XX XX XX XX"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom de l'équipe (optionnel)</label>
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => setFormData(prev => ({ ...prev, teamName: e.target.value }))}
                  className={inputClass}
                  placeholder="Nom de votre équipe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message (optionnel)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className={`${inputClass} min-h-[80px]`}
                  placeholder="Informations complémentaires..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Soumettre ma candidature
              </button>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
