import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Calendar, MapPin, AlertCircle, Gamepad2, Clock, CheckCircle } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import TournamentRegistrationModal from "@/components/TournamentRegistrationModal";
import { subscribeToRecords, addTournamentApplication, type Tournament, type TournamentApplication } from "@/lib/firebase";

interface TournamentRegistration extends Tournament {
  id: string;
}



export default function Tournaments() {
  const [tournaments, setTournaments] = useState<(Tournament & { id: string })[]>([]);
  const [userApplications, setUserApplications] = useState<TournamentApplication[]>([]);
  const [selectedTournament, setSelectedTournament] = useState<(Tournament & { id: string }) | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);





  useEffect(() => {
    const unsub = subscribeToRecords<Tournament>("tournaments", (data) => {
      const active = data.filter(t => t.status === "upcoming" || t.status === "ongoing");
      setTournaments(active);
    });
    
    return unsub;
  }, []);

  useEffect(() => {
    // Charger les applications de l'utilisateur (simulé avec localStorage)
    const storedApplications = localStorage.getItem('userTournamentApplications');
    if (storedApplications) {
      setUserApplications(JSON.parse(storedApplications));
    }

    // Écouter les changements dans Firebase pour mettre à jour localStorage
    const unsub = subscribeToRecords("tournamentApplications", (allApps: any[]) => {
      const storedApplications = localStorage.getItem('userTournamentApplications');
      const userApps = storedApplications ? JSON.parse(storedApplications) : [];
      
      // Mettre à jour les statuts des applications de l'utilisateur
      const updatedApps = userApps.map((userApp: any) => {
        const firebaseApp = allApps.find(app => app.id === userApp.id);
        if (firebaseApp && firebaseApp.status !== userApp.status) {
          return { ...userApp, status: firebaseApp.status };
        }
        return userApp;
      });
      
      // Sauvegarder les applications mises à jour
      localStorage.setItem('userTournamentApplications', JSON.stringify(updatedApps));
      setUserApplications(updatedApps);
    });
    
    return unsub;
  }, []);

  const handleRegister = (tournament: Tournament & { id: string }) => {
    setSelectedTournament(tournament);
    setShowRegistrationModal(true);
  };

  const handleRegistrationSuccess = () => {
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const isUserApplied = (tournamentId: string) => {
    return userApplications.some(app => app.tournamentId === tournamentId);
  };

  const getApplicationStatus = (tournamentId: string) => {
    const application = userApplications.find(app => app.tournamentId === tournamentId);
    return application?.status || null;
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

          {/* Success Message */}
          {showSuccessMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <h4 className="font-semibold text-green-400">Demande envoyée avec succès !</h4>
                  <p className="text-sm text-green-300">Votre inscription est en attente de validation par l'administrateur.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <div className="max-w-3xl mx-auto mb-12 p-6 bg-gradient-card rounded-2xl border border-border/50">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-foreground mb-2">Comment Participer</h3>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur "S'inscrire" pour soumettre votre demande. L'administrateur examinera votre inscription et vous recevrez une réponse par email. En attente de validation, vous ne verrez plus les détails du tournoi.
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
              tournaments.map((tournament, i) => {
                const isApplied = isUserApplied(tournament.id);
                const applicationStatus = getApplicationStatus(tournament.id);
                
                // Si l'utilisateur a postulé et est en attente, afficher un état d'attente
                if (isApplied && applicationStatus === 'pending') {
                  return (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="bg-gradient-card rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all shadow-card flex flex-col"
                    >
                      <div className="flex items-center justify-center mb-4">
                        <Clock className="w-12 h-12 text-yellow-500" />
                      </div>
                      
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
                        Inscription en Attente
                      </h3>
                      <p className="text-muted-foreground text-sm text-center mb-4">
                        Votre demande de participation est en cours de validation par l'administrateur.
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <div className="text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-medium">
                            <Clock className="w-3 h-3" />
                            En attente de validation
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
                
                // Si l'utilisateur a été approuvé
                if (isApplied && applicationStatus === 'approved') {
                  return (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.05 }}
                      className="bg-gradient-card rounded-2xl p-6 border border-green-500/30 hover:border-green-500/50 transition-all shadow-card flex flex-col"
                    >
                      <div className="flex items-center justify-center mb-4">
                        <CheckCircle className="w-12 h-12 text-green-500" />
                      </div>
                      
                      <h3 className="font-display text-xl font-semibold text-foreground mb-2 text-center">
                        Inscription Validée
                      </h3>
                      <p className="text-muted-foreground text-sm text-center mb-4">
                        Félicitations ! Votre participation au tournoi a été validée.
                      </p>
                      
                      <div className="mt-auto pt-4 border-t border-border/50">
                        <div className="text-center">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Inscription approuvée
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                }
                
                // Affichage normal du tournoi pour les utilisateurs non inscrits
                return (
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
                );
              })
            )}
          </div>
          
          {/* Registration Modal */}
          {showRegistrationModal && selectedTournament && (
            <TournamentRegistrationModal
              tournament={selectedTournament}
              onClose={() => setShowRegistrationModal(false)}
              onSuccess={handleRegistrationSuccess}
            />
          )}
        </div>
      </section>



    </Layout>
  );
}
