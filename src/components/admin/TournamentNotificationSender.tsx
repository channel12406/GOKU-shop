import { useState } from "react";
import { Send, Bell, Clock, Users, CheckCircle } from "lucide-react";
import { sendTournamentNotification } from "@/lib/firebase";

interface TournamentNotificationSenderProps {
  tournamentId: string;
  tournamentName: string;
}

export default function TournamentNotificationSender({ tournamentId, tournamentName }: TournamentNotificationSenderProps) {
  const [roomId, setRoomId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const handleSendNotification = async () => {
    if (!roomId.trim()) {
      setMessage("Veuillez entrer l'ID de la chambre du tournoi");
      setMessageType("error");
      return;
    }

    if (!password.trim()) {
      setMessage("Veuillez entrer le mot de passe du tournoi");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const notificationData = `${roomId}|${password}`;
      const notificationCount = await sendTournamentNotification(tournamentId, notificationData);
      setMessage(`Notification envoyée avec succès à ${notificationCount} participant(s) !`);
      setMessageType("success");
      setRoomId("");
      setPassword("");
    } catch (error) {
      console.error("Error sending tournament notification:", error);
      setMessage("Erreur lors de l'envoi de la notification. Veuillez réessayer.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-blue-500" />
        <h4 className="font-semibold text-foreground">Notification Tournoi</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-blue-500/10 px-2 py-1 rounded-full">
          <Clock className="w-3 h-3" />
          <span>10 min avant</span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        Envoyez l'ID de la chambre et le mot de passe à tous les participants acceptés 10 minutes avant le début du tournoi.
      </p>

      <div className="space-y-2 mb-3">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="ID de la chambre du tournoi"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <input
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe du tournoi"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={handleSendNotification}
          disabled={loading || !roomId.trim() || !password.trim()}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Envoi...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Envoyer la notification
            </>
          )}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
          messageType === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" :
          messageType === "error" ? "bg-red-500/10 text-red-400 border border-red-500/20" :
          "bg-blue-500/10 text-blue-400 border border-blue-500/20"
        }`}>
          {messageType === "success" && <CheckCircle className="w-4 h-4" />}
          {messageType === "error" && <Bell className="w-4 h-4" />}
          {messageType === "info" && <Bell className="w-4 h-4" />}
          {message}
        </div>
      )}

      <div className="mt-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="w-3 h-3" />
          <span>Seuls les participants avec le statut "Approuvé" recevront la notification</span>
        </div>
      </div>
    </div>
  );
}
