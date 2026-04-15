import { useState, useEffect } from "react";
import { User, Trophy, ShoppingBag, Star, Gamepad2, Calendar, MapPin, Phone, Mail, Edit2, Save, X, Award, TrendingUp, CheckCircle, Target, Crown, Camera } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Avatars prédéfinis
const DEFAULT_AVATARS = [
  "/avatars/avatar1.png",
  "/avatars/avatar2.png", 
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png",
  "/avatars/avatar7.png",
  "/avatars/avatar8.png"
];

export default function ProfileComplete() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0]);
  const [formData, setFormData] = useState({
    displayName: '',
    userId: '',
    country: '',
    phone: ''
  });

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        setFormData({
          displayName: user.displayName || '',
          userId: user.uid || '',
          country: '',
          phone: ''
        });
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const handleSaveProfile = () => {
    // Simulation de sauvegarde
    console.log('Profil sauvegardé:', formData);
    setIsEditing(false);
  };

  const handleAvatarSelect = (avatar: string) => {
    setSelectedAvatar(avatar);
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
            badge="Profil" 
            title="Mon Espace" 
            subtitle="Gérez votre profil et vos informations personnelles" 
          />

          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8">
              {/* Section Avatar */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {selectedAvatar ? (
                      <img 
                        src={selectedAvatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '';
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <User className="w-16 h-16 text-primary" />
                    )}
                  </div>
                  
                  {isEditing && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="absolute bottom-2 right-2 bg-primary text-white p-2 rounded-full hover:opacity-90 transition-opacity"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h3 className="text-3xl font-bold mb-2">
                  {formData.displayName || currentUser.email?.split('@')[0] || 'Utilisateur'}
                </h3>
                
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{currentUser.email}</span>
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <Target className="w-5 h-5 text-yellow-500" />
                  <span className="font-bold text-yellow-500">Niveau 1</span>
                </div>
              </div>

              {/* Sélection Avatar */}
              {isEditing && (
                <div className="mb-8">
                  <h4 className="text-lg font-bold mb-4">Choisir un avatar</h4>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {DEFAULT_AVATARS.map((avatar, index) => (
                      <button
                        key={index}
                        onClick={() => handleAvatarSelect(avatar)}
                        className={`w-16 h-16 rounded-full border-2 transition-all ${
                          selectedAvatar === avatar 
                            ? 'border-primary scale-110' 
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <img 
                          src={avatar} 
                          alt={`Avatar ${index + 1}`}
                          className="w-full h-full rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = '';
                            e.currentTarget.style.backgroundColor = '#f3f4f6';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Formulaire d'édition */}
              <div className="space-y-6">
                {isEditing ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Nom complet</label>
                      <input
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Entrez votre nom"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">ID Utilisateur</label>
                      <input
                        type="text"
                        value={formData.userId}
                        disabled
                        className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-muted-foreground cursor-not-allowed"
                        placeholder="ID automatique"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Pays</label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Sélectionnez votre pays</option>
                        <option value="Bénin">Bénin</option>
                        <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                        <option value="France">France</option>
                        <option value="Canada">Canada</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Mali">Mali</option>
                        <option value="Sénégal">Sénégal</option>
                        <option value="Togo">Togo</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Niger">Niger</option>
                        <option value="Guinée">Guinée</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Téléphone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="+229 XXXXXXXX"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">Nom complet</label>
                      <div className="px-4 py-3 bg-secondary/50 border border-border rounded-lg">
                        {formData.displayName || 'Non renseigné'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">ID Utilisateur</label>
                      <div className="px-4 py-3 bg-secondary/50 border border-border rounded-lg font-mono text-sm">
                        {formData.userId || 'Non disponible'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">Pays</label>
                      <div className="px-4 py-3 bg-secondary/50 border border-border rounded-lg flex items-center gap-2">
                        {formData.country ? (
                          <>
                            <MapPin className="w-4 h-4" />
                            {formData.country}
                          </>
                        ) : (
                          'Non renseigné'
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2 text-muted-foreground">Téléphone</label>
                      <div className="px-4 py-3 bg-secondary/50 border border-border rounded-lg flex items-center gap-2">
                        {formData.phone ? (
                          <>
                            <Phone className="w-4 h-4" />
                            {formData.phone}
                          </>
                        ) : (
                          'Non renseigné'
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Statistiques */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <ShoppingBag className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Commandes</div>
                </div>
                
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Victoires</div>
                </div>
                
                <div className="text-center p-4 bg-secondary/50 rounded-lg">
                  <Gamepad2 className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">0</div>
                  <div className="text-sm text-muted-foreground">Tournois</div>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Sauvegarder
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 px-6 bg-secondary text-secondary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      Annuler
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Modifier mon profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
