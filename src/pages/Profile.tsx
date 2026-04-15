import { useState, useEffect } from "react";
import { User, Trophy, ShoppingBag, Star, Gamepad2, Calendar, MapPin, Phone, Mail, Edit2, Save, X, Award, TrendingUp, CheckCircle, Target, Crown } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function Profile() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

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
            subtitle="Bienvenue sur votre profil utilisateur" 
          />

          <div className="max-w-4xl mx-auto mt-12">
            <div className="bg-gradient-card rounded-2xl border border-border/50 p-8">
              <div className="text-center mb-8">
                <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <User className="w-16 h-16 text-primary" />
                </div>
                
                <h3 className="text-3xl font-bold mb-2">
                  {currentUser.displayName || currentUser.email?.split('@')[0] || 'Utilisateur'}
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

              <div className="border-t border-border/50 pt-6">
                <h4 className="text-lg font-bold mb-4">Informations du compte</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{currentUser.email}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Membre depuis aujourd'hui
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Modifier le profil (Bientôt disponible)
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
