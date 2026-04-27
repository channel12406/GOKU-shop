import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, CheckCircle, XCircle, Trash2, Gamepad2 } from "lucide-react";
import { subscribeToRecords, updateRecord, deleteRecord, addTournament, type Tournament, type TournamentApplication } from "@/lib/firebase";

interface TournamentForm {
  name: string;
  game: string;
  description: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  entryFee: string;
  prizePool: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  image?: string;
}

export function AddTournamentForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState<TournamentForm>({
    name: "",
    game: "Free Fire",
    description: "",
    startDate: "",
    endDate: "",
    maxParticipants: 50,
    entryFee: "5000 FCFA",
    prizePool: "1000 Diamants + 20 000 FCFA",
    status: "upcoming",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      setError(null);
      console.log("🚀 Début de la création du tournoi...");
      console.log("Données du formulaire:", formData);
      
      const tournamentData = {
        name: formData.name,
        game: formData.game,
        description: formData.description,
        startDate: formData.startDate,
        endDate: formData.endDate,
        maxParticipants: formData.maxParticipants,
        entryFee: formData.entryFee,
        prizePool: formData.prizePool,
        status: formData.status,
        image: formData.image || undefined,
      };
      
      console.log("📤 Envoi des données à Firebase:", tournamentData);
      
      const result = await addTournament(tournamentData);
      console.log("✅ Tournoi créé avec succès:", result);
      
      setFormData({
        name: "",
        game: "Free Fire",
        description: "",
        startDate: "",
        endDate: "",
        maxParticipants: 50,
        entryFee: "5000 FCFA",
        prizePool: "1000 Diamants + 20 000 FCFA",
        status: "upcoming",
        image: "",
      });
      
      console.log("🔄 Réinitialisation du formulaire");
      onAdd();
    } catch (error) {
      console.error("❌ Erreur lors de la création du tournoi:", error);
      const errorMessage = error instanceof Error ? error.message : "Une erreur est survenue lors de la création du tournoi";
      setError(errorMessage);
      console.log("📝 Message d'erreur défini:", errorMessage);
    } finally {
      console.log("🏁 Fin du processus, setLoading(false)");
      setLoading(false);
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card mb-8"
    >
      <h3 className="font-display text-xl font-bold text-foreground mb-6">Créer un nouveau tournoi</h3>
      
      {error && (
        <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
          {error}
        </div>
      )}
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nom du tournoi</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={inputClass}
            placeholder="Ex: Tournoi Free Fire - Mars 2026"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Jeu</label>
          <select
            value={formData.game}
            onChange={(e) => setFormData(prev => ({ ...prev, game: e.target.value }))}
            className={inputClass}
            required
          >
            <option value="Free Fire">Free Fire</option>
            <option value="Call of Duty">Call of Duty Mobile</option>
            <option value="PUBG Mobile">PUBG Mobile</option>
            <option value="Roblox">Roblox</option>
            <option value="Mobile Legends">Mobile Legends</option>
            <option value="Genshin Impact">Genshin Impact</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date de début</label>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className={inputClass}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date de fin</label>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            className={inputClass}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nombre max de participants</label>
          <input
            type="number"
            value={formData.maxParticipants}
            onChange={(e) => setFormData(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 0 }))}
            className={inputClass}
            min="1"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Frais d'inscription</label>
          <input
            type="text"
            value={formData.entryFee}
            onChange={(e) => setFormData(prev => ({ ...prev, entryFee: e.target.value }))}
            className={inputClass}
            placeholder="Ex: 5000 FCFA"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Récompenses</label>
          <input
            type="text"
            value={formData.prizePool}
            onChange={(e) => setFormData(prev => ({ ...prev, prizePool: e.target.value }))}
            className={inputClass}
            placeholder="Ex: 50 000 FCFA, 1000 Diamants, Booyah Pass, 500 UC..."
            required
          />
          <p className="text-xs text-muted-foreground mt-1">Mentionnez toutes les récompenses possibles</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Statut</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
            className={inputClass}
            required
          >
            <option value="upcoming">À venir</option>
            <option value="ongoing">En cours</option>
            <option value="completed">Terminé</option>
            <option value="cancelled">Annulé</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-foreground mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className={`${inputClass} min-h-[100px]`}
          placeholder="Décrivez le tournoi : règles, format, récompenses..."
          required
        />
      </div>
      
      <div className="mt-4">
        <label className="block text-sm font-medium text-foreground mb-2">URL de l'image (optionnel)</label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
          className={inputClass}
          placeholder="https://exemple.com/tournoi.jpg"
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        {loading ? "Création en cours..." : "Créer le tournoi"}
      </button>
    </motion.form>
  );
}

export function TournamentApplicationsManager({ tournamentId }: { tournamentId: string }) {
  const [applications, setApplications] = useState<(TournamentApplication & { id: string })[]>([]);
  
  useEffect(() => {
    const unsub = subscribeToRecords<TournamentApplication>("tournamentApplications", (allApps) => {
      const filteredApps = allApps.filter(app => app.tournamentId === tournamentId);
      setApplications(filteredApps);
    });
    
    return unsub;
  }, [tournamentId]);
  
  const handleApprove = async (id: string) => {
    const { updateTournamentApplicationStatus } = await import("@/lib/firebase");
    await updateTournamentApplicationStatus(id, "approved");
  };
  
  const handleReject = async (id: string) => {
    const { updateTournamentApplicationStatus } = await import("@/lib/firebase");
    await updateTournamentApplicationStatus(id, "rejected");
  };
  
  return (
    <div className="mt-4 space-y-2">
      <h4 className="font-semibold text-foreground text-sm mb-2">Candidatures ({applications.length})</h4>
      
      {applications.length === 0 ? (
        <p className="text-muted-foreground text-xs">Aucune candidature pour ce tournoi.</p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {applications.map((app) => (
            <div key={app.id} className={`p-3 rounded-lg border text-xs ${
              app.status === 'approved' ? 'border-green-500/30 bg-green-500/5' :
              app.status === 'rejected' ? 'border-red-500/30 bg-red-500/5' :
              'border-border/50 bg-secondary/30'
            }`}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{app.userName}</p>
                  <p className="text-muted-foreground">{app.userEmail}</p>
                  {app.gameUserId && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Gamepad2 className="w-3 h-3" />
                      <span>ID Jeu: {app.gameUserId}</span>
                    </div>
                  )}
                  {app.teamName && <p className="text-muted-foreground">Équipe: {app.teamName}</p>}
                  <p className="text-muted-foreground mt-1">{new Date(app.appliedAt).toLocaleString('fr-FR')}</p>
                </div>
                <div className="flex flex-col gap-1">
                  {app.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="px-2 py-1 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors"
                      >
                        <CheckCircle className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="px-2 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <XCircle className="w-3 h-3" />
                      </button>
                    </>
                  )}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    app.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                    app.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                    'bg-orange-500/20 text-orange-400'
                  }`}>
                    {app.status === 'approved' ? 'Approuvé' : app.status === 'rejected' ? 'Rejeté' : 'En attente'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
