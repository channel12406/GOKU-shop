import { useState, useEffect } from "react";
import { 
  User, Trophy, ShoppingBag, Star, Gamepad2, Calendar, MapPin, Phone, Mail, Edit2, Save, X, Award, TrendingUp, 
  CheckCircle, Target, Crown, Shield, Zap, Medal, Gem, Rocket, Flame, Heart, Sparkles, Verified, Lock, LogOut
} from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { 
  getDatabase, 
  ref, 
  get, 
  set, 
  update,
  onValue 
} from "firebase/database";

// Avatars professionnels avec emojis/stickers
const PROFESSIONAL_AVATARS = [
  { id: 1, emoji: "👨‍💼", name: "Business", color: "bg-blue-500" },
  { id: 2, emoji: "👩‍💼", name: "Business Woman", color: "bg-purple-500" },
  { id: 3, emoji: "🎮", name: "Gamer", color: "bg-green-500" },
  { id: 4, emoji: "🏆", name: "Champion", color: "bg-yellow-500" },
  { id: 5, emoji: "⚡", name: "Lightning", color: "bg-orange-500" },
  { id: 6, emoji: "🔥", name: "Fire", color: "bg-red-500" },
  { id: 7, emoji: "💎", name: "Diamond", color: "bg-cyan-500" },
  { id: 8, emoji: "🚀", name: "Rocket", color: "bg-indigo-500" },
  { id: 9, emoji: "⭐", name: "Star", color: "bg-yellow-400" },
  { id: 10, emoji: "👑", name: "Crown", color: "bg-purple-600" },
  { id: 11, emoji: "🛡️", name: "Shield", color: "bg-gray-600" },
  { id: 12, emoji: "🎯", name: "Target", color: "bg-red-600" },
  { id: 13, emoji: "🏅", name: "Medal", color: "bg-amber-500" },
  { id: 14, emoji: "💫", name: "Sparkle", color: "bg-pink-500" },
  { id: 15, emoji: "❤️", name: "Heart", color: "bg-rose-500" },
  { id: 16, emoji: "🌟", name: "Shining Star", color: "bg-yellow-300" }
];

// Fonctions Firebase pour la gestion des profils
const saveUserProfile = async (userId: string, profileData: any) => {
  try {
    const db = getDatabase();
    const profileRef = ref(db, `userProfiles/${userId}`);
    
    const fullProfileData = {
      ...profileData,
      updatedAt: new Date().toISOString(),
      lastActive: new Date().toISOString()
    };
    
    await set(profileRef, fullProfileData);
    console.log('Profil sauvegardé avec succès:', fullProfileData);
    return true;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error);
    return false;
  }
};

const loadUserProfile = async (userId: string) => {
  try {
    const db = getDatabase();
    const profileRef = ref(db, `userProfiles/${userId}`);
    const snapshot = await get(profileRef);
    
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error);
    return null;
  }
};

export default function ProfilePro() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(PROFESSIONAL_AVATARS[0]);
  const [formData, setFormData] = useState({
    displayName: '',
    userId: '',
    country: '',
    phone: '',
    bio: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Charger le profil depuis Firebase
        const savedProfile = await loadUserProfile(user.uid);
        
        if (savedProfile) {
          setFormData({
            displayName: savedProfile.displayName || user.displayName || '',
            userId: user.uid || '',
            country: savedProfile.country || '',
            phone: savedProfile.phone || '',
            bio: savedProfile.bio || ''
          });
          
          // Restaurer l'avatar sélectionné
          if (savedProfile.avatar) {
            const avatar = PROFESSIONAL_AVATARS.find(a => a.id === savedProfile.avatar.id);
            if (avatar) setSelectedAvatar(avatar);
          }
        } else {
          // Créer un profil par défaut
          setFormData({
            displayName: user.displayName || '',
            userId: user.uid || '',
            country: '',
            phone: '',
            bio: ''
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSaveProfile = async () => {
    if (!currentUser) return;
    
    setSaveLoading(true);
    try {
      const profileData = {
        ...formData,
        avatar: selectedAvatar,
        email: currentUser.email,
        totalOrders: 0,
        totalSpent: 0,
        tournamentParticipations: 0,
        tournamentWins: 0,
        level: 1,
        experience: 0,
        isVerified: false,
        isPremium: false,
        joinDate: new Date().toISOString(),
        stats: {
          gamesPlayed: 0,
          winRate: 0,
          favoriteGame: '',
          totalPlayTime: 0
        }
      };
      
      const success = await saveUserProfile(currentUser.uid, profileData);
      if (success) {
        setIsEditing(false);
        // Afficher un message de succès
        alert('Profil sauvegardé avec succès !');
      } else {
        alert('Erreur lors de la sauvegarde du profil');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la sauvegarde du profil');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleAvatarSelect = (avatar: any) => {
    setSelectedAvatar(avatar);
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      // Redirection automatique vers la page d'accueil
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  if (!currentUser) {
    return (
      <Layout>
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Veuillez vous connecter</h2>
              <p className="text-muted-foreground">Vous devez être connecté pour voir votre profil.</p>
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <SectionHeading 
            badge="Profil Professionnel" 
            title="Mon Espace" 
            subtitle="Gérez votre profil professionnel et vos informations" 
          />

          <div className="max-w-5xl mx-auto mt-12 px-2 sm:px-4">
            {/* Carte principale du profil */}
            <div className="bg-gradient-to-br from-card to-card/80 rounded-3xl border border-border/50 shadow-2xl overflow-hidden">
              {/* Header avec email et bouton Sign Out */}
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 sm:p-6 border-b border-border/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-muted-foreground">Statut: Actif</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                      <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium text-primary truncate max-w-[150px] sm:max-w-none">{currentUser.email}</span>
                      <Verified className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 text-sm font-medium hover:bg-destructive/20 transition-colors w-full sm:w-auto justify-center"
                    >
                      <LogOut className="w-4 h-4" />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-8">
                {/* Section Avatar et infos principales */}
                <div className="grid lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
                  {/* Avatar */}
                  <div className="text-center lg:col-span-3 lg:col-span-1 order-1 lg:order-1">
                    <div className="relative inline-block mb-4">
                      <div className={`w-24 h-24 sm:w-32 sm:h-32 ${selectedAvatar.color} rounded-2xl mx-auto mb-4 flex items-center justify-center text-4xl sm:text-6xl shadow-lg transform hover:scale-105 transition-transform`}>
                        {selectedAvatar.emoji}
                      </div>
                      
                      {isEditing && (
                        <button
                          className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full hover:scale-110 transition-transform shadow-lg"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold mb-2">
                      {formData.displayName || 'Utilisateur'}
                    </h3>
                    
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                      <span className="font-bold text-yellow-500 text-sm sm:text-base">Niveau 1</span>
                      <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400" />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span>Membre depuis aujourd'hui</span>
                    </div>
                  </div>

                  {/* Formulaire d'édition */}
                  <div className="lg:col-span-3 lg:col-span-2 order-2 lg:order-2">
                    {isEditing ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Nom complet
                            </label>
                            <input
                              type="text"
                              value={formData.displayName}
                              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              placeholder="Entrez votre nom complet"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              ID Utilisateur
                            </label>
                            <input
                              type="text"
                              value={formData.userId}
                              disabled
                              className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-muted-foreground cursor-not-allowed font-mono text-sm"
                              placeholder="ID automatique"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Pays
                            </label>
                            <select
                              value={formData.country}
                              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            >
                              <option value="">Sélectionnez votre pays</option>
                              <option value="Bénin">🇧🇯 Bénin</option>
                              <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                              <option value="France">🇫🇷 France</option>
                              <option value="Canada">🇨🇦 Canada</option>
                              <option value="Belgique">🇧🇪 Belgique</option>
                              <option value="Suisse">🇨🇭 Suisse</option>
                              <option value="Mali">🇲🇱 Mali</option>
                              <option value="Sénégal">🇸🇳 Sénégal</option>
                              <option value="Togo">🇹🇬 Togo</option>
                              <option value="Burkina Faso">🇧🇫 Burkina Faso</option>
                              <option value="Niger">🇳🇪 Niger</option>
                              <option value="Guinée">🇬🇳 Guinée</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Téléphone
                            </label>
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                              placeholder="+229 XX XX XX XX"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Edit2 className="w-4 h-4" />
                            Bio
                          </label>
                          <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                            placeholder="Parlez-nous de vous..."
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 bg-secondary/30 rounded-xl">
                            <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                              <User className="w-4 h-4" />
                              Nom complet
                            </label>
                            <div className="text-lg font-medium">
                              {formData.displayName || 'Non renseigné'}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-secondary/30 rounded-xl">
                            <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              ID Utilisateur
                            </label>
                            <div className="text-lg font-mono text-sm">
                              {formData.userId || 'Non disponible'}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-secondary/30 rounded-xl">
                            <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Pays
                            </label>
                            <div className="text-lg font-medium flex items-center gap-2">
                              {formData.country ? (
                                <>
                                  <span>{formData.country}</span>
                                  <MapPin className="w-4 h-4 text-primary" />
                                </>
                              ) : (
                                'Non renseigné'
                              )}
                            </div>
                          </div>
                          
                          <div className="p-4 bg-secondary/30 rounded-xl">
                            <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Téléphone
                            </label>
                            <div className="text-lg font-medium flex items-center gap-2">
                              {formData.phone ? (
                                <>
                                  <span>{formData.phone}</span>
                                  <Phone className="w-4 h-4 text-primary" />
                                </>
                              ) : (
                                'Non renseigné'
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {formData.bio && (
                          <div className="p-4 bg-secondary/30 rounded-xl">
                            <label className="block text-sm font-medium mb-2 text-muted-foreground flex items-center gap-2">
                              <Edit2 className="w-4 h-4" />
                              Bio
                            </label>
                            <div className="text-lg">{formData.bio}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Sélection des avatars */}
                {isEditing && (
                  <div className="mb-8">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      Choisissez votre avatar professionnel
                    </h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3">
                      {PROFESSIONAL_AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          onClick={() => handleAvatarSelect(avatar)}
                          className={`relative group transition-all duration-200 ${
                            selectedAvatar.id === avatar.id 
                              ? 'scale-110 ring-2 ring-primary ring-offset-2' 
                              : 'hover:scale-105'
                          }`}
                        >
                          <div className={`w-12 h-12 sm:w-16 sm:h-16 ${avatar.color} rounded-xl flex items-center justify-center text-xl sm:text-2xl shadow-md group-hover:shadow-lg transition-shadow`}>
                            {avatar.emoji}
                          </div>
                          {selectedAvatar.id === avatar.id && (
                            <div className="absolute -top-1 -right-1 bg-primary text-white rounded-full p-1">
                              <CheckCircle className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statistiques */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <ShoppingBag className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-blue-600">0</div>
                    <div className="text-sm text-blue-600 font-medium">Commandes</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-2xl border border-yellow-200 dark:border-yellow-800">
                    <Trophy className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-yellow-600">0</div>
                    <div className="text-sm text-yellow-600 font-medium">Victoires</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl border border-green-200 dark:border-green-800">
                    <Gamepad2 className="w-10 h-10 text-green-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-green-600">0</div>
                    <div className="text-sm text-green-600 font-medium">Tournois</div>
                  </div>
                  
                  <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <TrendingUp className="w-10 h-10 text-purple-600 mx-auto mb-3" />
                    <div className="text-3xl font-bold text-purple-600">0%</div>
                    <div className="text-sm text-purple-600 font-medium">Win Rate</div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-4">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {saveLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                            Sauvegarde en cours...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Sauvegarder mon profil
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="flex-1 py-4 px-6 bg-gradient-to-r from-secondary to-secondary/80 text-secondary-foreground rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                      >
                        <X className="w-5 h-5" />
                        Annuler
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                    >
                      <Edit2 className="w-5 h-5" />
                      Modifier mon profil professionnel
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
