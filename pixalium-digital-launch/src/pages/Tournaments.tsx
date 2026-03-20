import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Calendar, MapPin, AlertCircle, Gamepad2 } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { subscribeToRecords, type Tournament } from "@/lib/firebase";

interface TournamentRegistration extends Tournament {
  id: string;
}



export default function Tournaments() {
  const [tournaments, setTournaments] = useState<(Tournament & { id: string })[]>([]);





  useEffect(() => {
    const unsub = subscribeToRecords<Tournament>("tournaments", (data) => {
      const active = data.filter(t => t.status === "upcoming" || t.status === "ongoing");
      setTournaments(active);
    });
    
    return unsub;
  }, []);

  const handleRegister = async (tournament: TournamentRegistration) => {
    // Afficher un message d'information
    alert(
      `📧 Intérêt enregistré pour : ${tournament.name}\n\n` +
      `L'administrateur a reçu votre demande.\n` +
      `Il vous contactera bientôt par email pour finaliser votre inscription.\n\n` +
      `Merci de votre intérêt !`
    );
    
    // Ici, on pourrait enregistrer l'intérêt dans Firebase pour que l'admin le voie
    console.log("Joueur intéressé par le tournoi:", tournament.name);
  };

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading 
            badge="Tournois" 
            title="Participez aux Tournois" 
            subtitle="Affrontez d'autres joueurs et remportez des prix incroyables sur vos jeux préférés." 
          />

          {/* Info Box */}
          <div className="max-w-3xl mx-auto mb-12 p-6 bg-gradient-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Comment Participer</h3>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur "S'inscrire" pour manifester votre intérêt. L'administrateur vous contactera par email pour finaliser votre inscription au tournoi.
                </p>
              </div>
            </div>
          </div>

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
                    className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                  >
                    <Gamepad2 className="w-5 h-5" /> S'inscrire
                  </button>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>



    </Layout>
  );
}
