import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { LogOut, Package, MessageSquare, BarChart3, Trash2, Eye, CheckCircle, XCircle, Plus, Send, Megaphone, X, Trophy, Users, Percent, User as UserIcon, Shield, Calendar, MapPin, Phone, Mail, Crown, Gamepad2 } from "lucide-react";
import Layout from "@/components/Layout";
import {
  adminLogin, adminLogout, onAuthChange,
  subscribeToRecords, updateRecord, deleteRecord, addPortfolioProject, addProduct, addDownloadCode, addPromoCode, getAllPromoCodes, incrementPromoCodeUsage,
  addAffiliateCode, getAllAffiliateCodes, incrementAffiliateCodeUsage, setupTournamentCleanup, sendTournamentNotification,
  type Order, type ContactMessage, type PortfolioProject, type Product, type DownloadCode, type Tournament, type PromoCode, type AffiliateCode,
} from "@/lib/firebase";
import { sendNewsletter } from "@/lib/emailService";
import type { User } from "firebase/auth";
import { AddTournamentForm, TournamentApplicationsManager } from "@/components/admin/TournamentManagement";
import TournamentNotificationSender from "@/components/admin/TournamentNotificationSender";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: string;
  approved: boolean;
}

type Tab = "stats" | "orders" | "contacts" | "testimonials" | "promo" | "tournaments" | "affiliations" | "userProfiles";

interface PortfolioForm {
  title: string;
  description: string;
  category: string;
  images: string[];
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  subscribedAt: string;
}

interface PromoConfig {
  id: string;
  title: string;
  subtitle: string;
  code: string;
  discount: number;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

interface UserProfile {
  displayName: string;
  userId: string;
  email: string;
  country: string;
  phone: string;
  bio: string;
  avatar: {
    id: number;
    emoji: string;
    name: string;
    color: string;
  };
  totalOrders: number;
  totalSpent: number;
  tournamentParticipations: number;
  tournamentWins: number;
  level: number;
  experience: number;
  isVerified: boolean;
  isPremium: boolean;
  joinDate: string;
  updatedAt: string;
  lastActive: string;
  stats: {
    gamesPlayed: number;
    winRate: number;
    favoriteGame: string;
    totalPlayTime: number;
  };
}

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await adminLogin(email, password);
      onLogin();
    } catch {
      setError("Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-card rounded-2xl p-8 border border-border/50 shadow-card w-full max-w-md space-y-4"
      >
        <h2 className="font-display text-2xl font-bold text-foreground text-center mb-2">Admin Access</h2>
        <p className="text-muted-foreground text-sm text-center mb-4">Connectez-vous pour accéder au tableau de bord.</p>
        {error && <p className="text-destructive text-sm text-center">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
        <input type="password" placeholder="Mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </motion.form>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }: { label: string; value: number; icon: typeof Package }) {
  return (
    <div className="bg-gradient-card rounded-xl p-6 border border-border/50 shadow-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className="text-muted-foreground text-sm">{label}</span>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function AddPortfolioForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState<PortfolioForm>({
    title: "",
    description: "",
    category: "",
    images: [""],
  });
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addPortfolioProject({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ""),
        createdAt: new Date().toISOString(),
      });
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        images: [""],
      });
      
      onAdd(); // Refresh the portfolio list
    } catch (error) {
      console.error("Error adding project:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };
  
  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
    }
  };
  
  const updateImageField = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.map((img, i) => i === index ? value : img),
    }));
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card mb-8"
    >
      <h3 className="font-display text-xl font-bold text-foreground mb-6">Ajouter un projet au portfolio</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Titre du projet</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className={inputClass}
            placeholder="Ex: Site e-commerce pour restaurant"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className={`${inputClass} min-h-[100px]`}
            placeholder="Décrivez le projet en détail..."
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            className={inputClass}
            required
          >
            <option value="">Sélectionnez une catégorie</option>
            <option value="Web Design">Web Design</option>
            <option value="Développement Web">Développement Web</option>
            <option value="Application Mobile">Application Mobile</option>
            <option value="Design Graphique">Design Graphique</option>
            <option value="Architecture">Architecture</option>
            <option value="IA / LLM">IA / LLM</option>
            <option value="Autre">Autre</option>
          </select>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">Images (URLs)</label>
            <button
              type="button"
              onClick={addImageField}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-xs"
            >
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="url"
                  value={image}
                  onChange={(e) => updateImageField(index, e.target.value)}
                  className={inputClass}
                  placeholder="https://exemple.com/image.jpg"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="px-3 py-3 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le projet"}
        </button>
      </div>
    </motion.form>
  );
}

interface ProductForm {
  name: string;
  desc: string;
  price: string;
  category: string;
  images: string[];
  isSourceCode: boolean;
}

function AddProductForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState<ProductForm>({
    name: "",
    desc: "",
    price: "",
    category: "Web",
    images: ["", ""],
    isSourceCode: false,
  });
  const [loading, setLoading] = useState(false);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await addProduct({
        name: formData.name,
        desc: formData.desc,
        price: formData.price,
        category: formData.category,
        images: formData.images.filter(img => img.trim() !== ""),
        isSourceCode: formData.isSourceCode,
      });
      
      // Reset form
      setFormData({
        name: "",
        desc: "",
        price: "",
        category: "Web",
        images: ["", ""],
        isSourceCode: false,
      });
      
      onAdd(); // Refresh the products list
    } catch (error) {
      console.error("Error adding product:", error);
    } finally {
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
      <h3 className="font-display text-xl font-bold text-foreground mb-6">Ajouter un produit à la boutique</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nom du produit</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className={inputClass}
            placeholder="Ex: Site Web de l'entreprise"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={formData.desc}
            onChange={(e) => setFormData(prev => ({ ...prev, desc: e.target.value }))}
            className={`${inputClass} min-h-[100px]`}
            placeholder="Décrivez le produit en détail..."
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Prix</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className={inputClass}
              placeholder="Ex: 25 000 FCFA"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className={inputClass}
              required
            >
              <option value="Web">Web</option>
              <option value="IA">IA</option>
              <option value="Architecture">Architecture</option>
              <option value="Mobile">Mobile</option>
              <option value="Graphisme">Graphisme</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Images (URLs)</label>
          <div className="space-y-2">
            {formData.images.map((image, index) => (
              <input
                key={index}
                type="url"
                value={image}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  images: prev.images.map((img, i) => i === index ? e.target.value : img)
                }))}
                className={inputClass}
                placeholder={`URL de l'image ${index + 1} (Ex: https://exemple.com/image.jpg)`}
              />
            ))}
          </div>
        </div>
        
        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isSourceCode}
              onChange={(e) => setFormData(prev => ({ ...prev, isSourceCode: e.target.checked }))}
              className="rounded"
            />
            <span className="text-sm text-foreground">Ce produit est un code source téléchargeable</span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Ajout en cours..." : "Ajouter le produit"}
        </button>
      </div>
    </motion.form>
  );
}

interface DownloadCodeForm {
  fileName: string;
  filePath: string;
  expiresAt: string;
  file?: File;
}

function AddDownloadCodeForm({ onAdd }: { onAdd: () => void }) {
  const [formData, setFormData] = useState<DownloadCodeForm>({
    fileName: "",
    filePath: "",
    expiresAt: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const inputClass = "w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm";
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({
        ...prev,
        file: file,
        fileName: file.name, // Auto-populate filename
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    
    try {
      let filePath = formData.filePath;
      
      // If a file is provided, upload it to Firebase Storage
      if (formData.file) {
        // For now, we'll just use the external URL approach since we need to implement the upload properly
        // In a real scenario, we would upload the file to Firebase Storage here
        console.log("File to upload:", formData.file);
        filePath = formData.filePath; // Keep the URL approach for now
      }
      
      // Generate a random code
      const randomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
      
      await addDownloadCode({
        code: randomCode,
        fileName: formData.fileName,
        filePath: filePath,
        expiresAt: formData.expiresAt || undefined,
      });
      
      // Reset form
      setFormData({
        fileName: "",
        filePath: "",
        expiresAt: "",
      });
      
      onAdd(); // Refresh the download codes list
    } catch (error) {
      console.error("Error adding download code:", error);
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  };
  
  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card mb-8"
    >
      <h3 className="font-display text-xl font-bold text-foreground mb-6">Générer un code de téléchargement</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Nom du fichier</label>
          <input
            type="text"
            value={formData.fileName}
            onChange={(e) => setFormData(prev => ({ ...prev, fileName: e.target.value }))}
            className={inputClass}
            placeholder="Ex: template-ecommerce.zip"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Sélectionnez un fichier</label>
          <input
            type="file"
            accept=".zip,.rar,.tar,.gz,.7z,application/zip,application/x-rar-compressed,application/x-7z-compressed"
            onChange={handleFileChange}
            className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          {formData.file && (
            <p className="text-xs text-muted-foreground mt-2">Fichier sélectionné: {formData.file.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Ou entrez l'URL du fichier</label>
          <input
            type="url"
            value={formData.filePath}
            onChange={(e) => setFormData(prev => ({ ...prev, filePath: e.target.value }))}
            className={inputClass}
            placeholder="Ex: https://example.com/files/template-ecommerce.zip"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date d'expiration (optionnel)</label>
          <input
            type="datetime-local"
            value={formData.expiresAt}
            onChange={(e) => setFormData(prev => ({ ...prev, expiresAt: e.target.value }))}
            className={inputClass}
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Génération en cours..." : "Générer un code"}
        </button>
      </div>
    </motion.form>
  );
}

export default function Admin() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [tab, setTab] = useState<Tab>("stats");
  const [orders, setOrders] = useState<(Order & { id: string })[]>([]);
  const [contacts, setContacts] = useState<(ContactMessage & { id: string })[]>([]);
  const [testimonials, setTestimonials] = useState<(Testimonial & { id: string })[]>([]);
  const [promos, setPromos] = useState<PromoConfig[]>([]);
  const [tournaments, setTournaments] = useState<(Tournament & { id: string })[]>([]);
  const [affiliateCodes, setAffiliateCodes] = useState<(AffiliateCode & { id: string })[]>([]);
  const [userProfiles, setUserProfiles] = useState<(UserProfile & { id: string })[]>([]);
  const [expandedImage, setExpandedImage] = useState<{src: string, alt: string} | null>(null);
  
    
  // Pour la gestion de promo
  const [promoForm, setPromoForm] = useState<Omit<PromoConfig, 'id' | 'createdAt'>>({ 
    title: "", 
    subtitle: "", 
    code: "", 
    discount: 15, 
    endDate: "", 
    isActive: true 
  });

  // Pour la gestion des affiliations
  const [affiliateForm, setAffiliateForm] = useState<Omit<AffiliateCode, 'id' | 'createdAt' | 'usageCount'>>({ 
    code: "", 
    userId: "", 
    username: "", 
    discountPercentage: 15, 
    isActive: true,
    expiresAt: undefined,
    description: ""
  });

  useEffect(() => {
    const unsub = onAuthChange(setUser);
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub1 = subscribeToRecords<Order>("orders", setOrders);
    const unsub2 = subscribeToRecords<ContactMessage>("contacts", setContacts);
    const unsub3 = subscribeToRecords<Testimonial>("testimonials", setTestimonials);
    const unsub4 = subscribeToRecords<PromoConfig>("promos", setPromos);
    const unsub5 = subscribeToRecords<Tournament>("tournaments", setTournaments);
    const unsub6 = subscribeToRecords<UserProfile>("userProfiles", setUserProfiles);
    const unsub7 = subscribeToRecords<AffiliateCode>("affiliateCodes", setAffiliateCodes);
    
    // Activer le nettoyage automatique des tournois
    const cleanupTournaments = setupTournamentCleanup();
    
    return () => { 
      unsub1(); unsub2(); unsub3(); unsub4(); unsub5(); unsub6(); unsub7(); 
      cleanupTournaments(); 
    };
  }, [user]);

  if (user === undefined) {
    return <Layout><div className="min-h-[60vh] flex items-center justify-center"><p className="text-muted-foreground">Chargement...</p></div></Layout>;
  }

  if (!user) {
    return <Layout><AdminLogin onLogin={() => {}} /></Layout>;
  }

  const handleLogout = async () => {
    await adminLogout();
    navigate("/");
  };
  
    
  // Fonctions pour les promos
  const handleCreatePromo = async () => {
    if (!promoForm.title || !promoForm.code) return;
    
    try {
      await updateRecord(`promos/${Date.now()}`, {
        ...promoForm,
        createdAt: new Date().toISOString()
      });
      
      // Réinitialiser le formulaire
      setPromoForm({ 
        title: "", 
        subtitle: "", 
        code: "", 
        discount: 15, 
        endDate: "", 
        isActive: true 
      });
      
    } catch (error) {
      console.error("Erreur création promo:", error);
    }
  };
  
  const handleTogglePromo = async (promoId: string, currentStatus: boolean) => {
    try {
      await updateRecord(`promos/${promoId}`, { isActive: !currentStatus });
    } catch (error) {
      console.error("Erreur activation/désactivation:", error);
    }
  };
  
  // Fonctions pour les affiliations
  const handleCreateAffiliate = async () => {
    if (!affiliateForm.code || !affiliateForm.username) return;
    
    try {
      await addAffiliateCode({
        code: affiliateForm.code,
        userId: "user-" + Date.now(), // Sera remplacé par le vrai userID en prod
        username: affiliateForm.username,
        discountPercentage: affiliateForm.discountPercentage,
        isActive: affiliateForm.isActive,
        expiresAt: affiliateForm.expiresAt,
        description: affiliateForm.description
      });
      
      // Réinitialiser le formulaire
      setAffiliateForm({ 
        code: "", 
        userId: "", 
        username: "", 
        discountPercentage: 15, 
        isActive: true,
        expiresAt: undefined,
        description: ""
      });
      
    } catch (error) {
      console.error("Erreur création affiliation:", error);
    }
  };
  
  const handleToggleAffiliateStatus = async (affiliateId: string, currentStatus: boolean) => {
    try {
      await updateRecord(`affiliateCodes/${affiliateId}`, { isActive: !currentStatus });
    } catch (error) {
      console.error("Erreur activation/désactivation:", error);
    }
  };
  const tabs: { key: Tab; label: string; icon: typeof Package }[] = [
    { key: "stats", label: "Statistiques", icon: BarChart3 },
    { key: "orders", label: "Commandes", icon: Package },
    { key: "contacts", label: "Messages", icon: MessageSquare },
    { key: "testimonials", label: "Témoignages", icon: MessageSquare },
    { key: "promo", label: "Promotions", icon: Megaphone },
    { key: "tournaments", label: "Tournois", icon: Trophy },
    { key: "affiliations", label: "Affiliations", icon: Percent },
    { key: "userProfiles", label: "Profils Utilisateurs", icon: UserIcon },
  ];

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const unreadContacts = contacts.filter((c) => !c.read).length;

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-3xl font-bold text-foreground">Tableau de bord</h1>
            <button onClick={handleLogout} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-sm">
              <LogOut className="w-4 h-4" /> Déconnexion
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  tab === t.key ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </div>

          {/* Stats */}
          {tab === "stats" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Commandes" value={orders.length} icon={Package} />
              <StatCard label="En attente" value={pendingOrders} icon={Package} />
              <StatCard label="Messages" value={contacts.length} icon={MessageSquare} />
              <StatCard label="Non lus" value={unreadContacts} icon={MessageSquare} />
            </div>
          )}

          {/* Orders */}
          {tab === "orders" && (
            <div className="space-y-3">
              {orders.length === 0 && <p className="text-muted-foreground text-center py-12">Aucune commande.</p>}
              {orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((o) => (
                <div key={o.id} className="bg-gradient-card rounded-xl p-5 border border-border/50 shadow-card flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{o.productName}</h3>
                    <p className="text-muted-foreground text-sm">{o.price} × {o.quantity}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(o.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => updateRecord(`orders/${o.id}`, { status: e.target.value })}
                      className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs"
                    >
                      <option value="pending">En attente</option>
                      <option value="confirmed">Confirmée</option>
                      <option value="completed">Terminée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                    <button onClick={() => deleteRecord(`orders/${o.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Contacts */}
          {tab === "contacts" && (
            <div className="space-y-3">
              {contacts.length === 0 && <p className="text-muted-foreground text-center py-12">Aucun message.</p>}
              {contacts.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((c) => (
                <div key={c.id} className={`bg-gradient-card rounded-xl p-5 border shadow-card ${c.read ? "border-border/50" : "border-primary/30"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">{c.name}</h3>
                        {!c.read && <span className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{c.email} — {c.service}</p>
                      <p className="text-sm text-muted-foreground mt-2">{c.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(c.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!c.read && (
                        <button onClick={() => updateRecord(`contacts/${c.id}`, { read: true })} className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors" title="Marquer comme lu">
                          <Eye className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => deleteRecord(`contacts/${c.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Testimonials */}
          {tab === "testimonials" && (
            <div className="space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Témoignages ({testimonials.length})</h3>
                
                {testimonials.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucun témoignage reçu.</p>
                ) : (
                  <div className="space-y-4">
                    {testimonials
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((testimonial) => (
                        <div key={testimonial.id} className={`p-5 rounded-xl border ${testimonial.approved ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 bg-secondary/30'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${testimonial.approved ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                  {testimonial.approved ? 'Approuvé' : 'En attente'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">{testimonial.role} chez {testimonial.company}</p>
                              <p className="text-sm text-muted-foreground mb-2">"{testimonial.content}"</p>
                              <div className="flex items-center gap-2 mb-2">
                                {'★'.repeat(testimonial.rating).split('').map((star, i) => (
                                  <span key={i} className="text-yellow-400">{star}</span>
                                ))}
                                <span className="text-xs text-muted-foreground ml-2">{new Date(testimonial.createdAt).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateRecord(`testimonials/${testimonial.id}`, { approved: !testimonial.approved })}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${testimonial.approved ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                              >
                                {testimonial.approved ? 'Désapprouver' : 'Approuver'}
                              </button>
                              <button 
                                onClick={() => deleteRecord(`testimonials/${testimonial.id}`)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Affiliations */}
          {tab === "affiliations" && (
            <div className="space-y-6">
              {/* Formulaire d'ajout */}
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Créer un Code d'Affiliation</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Code</label>
                    <input
                      type="text"
                      value={affiliateForm.code}
                      onChange={(e) => setAffiliateForm({...affiliateForm, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm uppercase"
                      placeholder="GUILD15"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Pourcentage de Réduction</label>
                    <input
                      type="number"
                      value={affiliateForm.discountPercentage}
                      onChange={(e) => setAffiliateForm({...affiliateForm, discountPercentage: parseInt(e.target.value) || 0})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="15"
                      min="0"
                      max="100"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Nom d'Utilisateur</label>
                    <input
                      type="text"
                      value={affiliateForm.username}
                      onChange={(e) => setAffiliateForm({...affiliateForm, username: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Ex: VS Guilde Partner"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Description (Optionnel)</label>
                    <textarea
                      value={affiliateForm.description}
                      onChange={(e) => setAffiliateForm({...affiliateForm, description: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Réduction exclusive pour les membres de la guilde..."
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date d'Expiration (Optionnel)</label>
                    <input
                      type="date"
                      value={affiliateForm.expiresAt?.split('T')[0] || ''}
                      onChange={(e) => setAffiliateForm({...affiliateForm, expiresAt: e.target.value ? new Date(e.target.value).toISOString() : undefined})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={affiliateForm.isActive}
                        onChange={(e) => setAffiliateForm({...affiliateForm, isActive: e.target.checked})}
                        className="rounded"
                      />
                      <span className="text-sm text-foreground">Actif</span>
                    </label>
                  </div>
                </div>
                
                <button
                  onClick={handleCreateAffiliate}
                  disabled={!affiliateForm.code || !affiliateForm.username}
                  className="w-full mt-4 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 inline-flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Créer le Code d'Affiliation
                </button>
              </div>
              
              {/* Liste des codes */}
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Codes d'Affiliation Actifs ({affiliateCodes.length})</h3>
                
                {affiliateCodes.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucun code d'affiliation créé.</p>
                ) : (
                  <div className="space-y-3">
                    {affiliateCodes.map((affiliate) => (
                      <div key={affiliate.id} className={`p-5 rounded-xl border ${affiliate.isActive ? 'border-green-500/30 bg-green-500/5' : 'border-border/50 bg-secondary/30'}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-semibold text-foreground text-lg">{affiliate.code}</h4>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${affiliate.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {affiliate.isActive ? 'Actif' : 'Inactif'}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Utilisateur: <span className="font-medium text-foreground">{affiliate.username}</span></p>
                            {affiliate.description && (
                              <p className="text-sm text-muted-foreground mb-2">"{affiliate.description}"</p>
                            )}
                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mt-3">
                              <div>
                                <span className="font-semibold text-foreground">Réduction:</span> <span className="text-primary font-bold">{affiliate.discountPercentage}%</span>
                              </div>
                              <div>
                                <span className="font-semibold text-foreground">Utilisations:</span> 
                                <span className={`font-bold ${(affiliate.usageCount || 0) >= 4 ? 'text-red-400' : (affiliate.usageCount || 0) >= 3 ? 'text-orange-400' : 'text-green-400'}`}>
                                  {affiliate.usageCount || 0}/4
                                </span>
                                {(affiliate.usageCount || 0) >= 4 && (
                                  <span className="ml-2 text-red-400 text-xs">(Limite atteinte)</span>
                                )}
                                {(affiliate.usageCount || 0) >= 3 && (affiliate.usageCount || 0) < 4 && (
                                  <span className="ml-2 text-orange-400 text-xs">(Presque plein)</span>
                                )}
                              </div>
                              {affiliate.expiresAt && (
                                <div>
                                  <span className="font-semibold text-foreground">Expire le:</span> {new Date(affiliate.expiresAt).toLocaleDateString('fr-FR')}
                                </div>
                              )}
                              <div>
                                <span className="font-semibold text-foreground">Créé le:</span> {new Date(affiliate.createdAt).toLocaleDateString('fr-FR')}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleToggleAffiliateStatus(affiliate.id!, affiliate.isActive)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${affiliate.isActive ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                            >
                              {affiliate.isActive ? 'Désactiver' : 'Activer'}
                            </button>
                            <button 
                              onClick={() => deleteRecord(`affiliateCodes/${affiliate.id}`)}
                              className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Promotions */}
          {tab === "promo" && (
            <div className="space-y-6">
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Créer une nouvelle promotion</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Titre</label>
                    <input
                      type="text"
                      value={promoForm.title}
                      onChange={(e) => setPromoForm({...promoForm, title: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="Offre spéciale Noël"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Code promo</label>
                    <input
                      type="text"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm({...promoForm, code: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                      placeholder="NOEL2026"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Réduction (%)</label>
                    <input
                      type="number"
                      value={promoForm.discount}
                      onChange={(e) => setPromoForm({...promoForm, discount: parseInt(e.target.value) || 0})}
                      min="1"
                      max="100"
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Date de fin</label>
                    <input
                      type="date"
                      value={promoForm.endDate}
                      onChange={(e) => setPromoForm({...promoForm, endDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-foreground mb-2">Sous-titre</label>
                  <input
                    type="text"
                    value={promoForm.subtitle}
                    onChange={(e) => setPromoForm({...promoForm, subtitle: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                    placeholder="Profitez de -15% sur tous nos services"
                  />
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={promoForm.isActive}
                      onChange={(e) => setPromoForm({...promoForm, isActive: e.target.checked})}
                      className="rounded"
                    />
                    <span className="text-sm text-foreground">Activer immédiatement</span>
                  </label>
                  
                  <button
                    onClick={handleCreatePromo}
                    disabled={!promoForm.title || !promoForm.code}
                    className="px-6 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Créer la promotion
                  </button>
                </div>
              </div>
              
              <div className="bg-gradient-card rounded-2xl p-6 border border-border/50 shadow-card">
                <h3 className="font-display text-xl font-bold text-foreground mb-4">Promotions actives ({promos.filter(p => p.isActive).length})</h3>
                
                {promos.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Aucune promotion créée.</p>
                ) : (
                  <div className="space-y-4">
                    {promos
                      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
                      .map((promo) => (
                        <div key={promo.id} className={`p-5 rounded-xl border ${promo.isActive ? 'border-primary/30 bg-primary/5' : 'border-border/50 bg-secondary/30'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="font-semibold text-foreground">{promo.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${promo.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                  {promo.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{promo.subtitle}</p>
                              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                <span className="font-mono bg-secondary px-2 py-1 rounded">{promo.code}</span>
                                <span>Réduction: {promo.discount}%</span>
                                <span>Fin: {new Date(promo.endDate).toLocaleDateString('fr-FR')}</span>
                                <span>Créée: {new Date(promo.createdAt).toLocaleDateString('fr-FR')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleTogglePromo(promo.id, promo.isActive)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${promo.isActive ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'}`}
                              >
                                {promo.isActive ? 'Désactiver' : 'Activer'}
                              </button>
                              <button 
                                onClick={() => deleteRecord(`promos/${promo.id}`)}
                                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    }
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Tournaments */}
          {tab === "tournaments" && (
            <div>
              <AddTournamentForm onAdd={() => {
                const unsub = subscribeToRecords<Tournament>("tournaments", setTournaments);
                return unsub;
              }} />
              
              <div className="space-y-4">
                {tournaments.length === 0 && <p className="text-muted-foreground text-center py-12">Aucun tournoi créé.</p>}
                {tournaments.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map((t) => (
                  <div key={t.id} className="bg-gradient-card rounded-xl p-5 border border-border/50 shadow-card">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Trophy className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold text-foreground text-lg">{t.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            t.status === 'upcoming' ? 'bg-blue-500/20 text-blue-400' :
                            t.status === 'ongoing' ? 'bg-green-500/20 text-green-400' :
                            t.status === 'completed' ? 'bg-gray-500/20 text-gray-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {t.status === 'upcoming' ? 'À venir' : t.status === 'ongoing' ? 'En cours' : t.status === 'completed' ? 'Terminé' : 'Annulé'}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{t.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                          <div>
                            <span className="font-semibold text-foreground">Jeu:</span> {t.game}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Participants:</span> {t.maxParticipants} max
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Frais:</span> {t.entryFee}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Récompenses:</span> {t.prizePool}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Début:</span> {new Date(t.startDate).toLocaleString('fr-FR')}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Fin:</span> {new Date(t.endDate).toLocaleString('fr-FR')}
                          </div>
                        </div>
                        
                        {/* Applications Manager */}
                        <TournamentApplicationsManager tournamentId={t.id} />
                        
                        {/* Tournament Notification Sender */}
                        <TournamentNotificationSender tournamentId={t.id} tournamentName={t.name} />
                      </div>
                      <div className="flex sm:flex-col gap-2">
                        <select
                          value={t.status}
                          onChange={(e) => updateRecord(`tournaments/${t.id}`, { status: e.target.value })}
                          className="px-3 py-1.5 rounded-lg bg-secondary border border-border text-foreground text-xs"
                        >
                          <option value="upcoming">À venir</option>
                          <option value="ongoing">En cours</option>
                          <option value="completed">Terminé</option>
                          <option value="cancelled">Annulé</option>
                        </select>
                        <button onClick={() => deleteRecord(`tournaments/${t.id}`)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* User Profiles */}
          {tab === "userProfiles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                  <UserIcon className="w-5 h-5" />
                  Profils Utilisateurs ({userProfiles.length})
                </h2>
              </div>
              
              <div className="grid gap-4">
                {userProfiles.map((profile, index) => (
                  <div key={`profile-${index}`} className="bg-gradient-card rounded-xl p-6 border border-border/50 shadow-card">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                      <div className="flex-1">
                        {/* Header du profil */}
                        <div className="flex items-start gap-4 mb-4">
                          <div className={`w-16 h-16 ${profile.avatar.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                            {profile.avatar.emoji}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg text-foreground">{profile.displayName}</h3>
                              {profile.isVerified && (
                                <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <Shield className="w-3 h-3" />
                                  Vérifié
                                </div>
                              )}
                              {profile.isPremium && (
                                <div className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  <Crown className="w-3 h-3" />
                                  Premium
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{profile.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Gamepad2 className="w-4 h-4" />
                              <span>ID Jeu: Masqué pour la sécurité</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Informations personnelles */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Pays:</span>
                              <span className="font-medium">{profile.country || 'Non renseigné'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Téléphone:</span>
                              <span className="font-medium">{profile.phone || 'Non renseigné'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Inscription:</span>
                              <span className="font-medium">{new Date(profile.joinDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Dernière activité:</span>
                              <span className="font-medium">{new Date(profile.lastActive).toLocaleDateString('fr-FR')}</span>
                            </div>
                          </div>
                        </div>
                        
                        {profile.bio && (
                          <div className="mb-4">
                            <p className="text-sm text-muted-foreground mb-1">Bio:</p>
                            <p className="text-sm">{profile.bio}</p>
                          </div>
                        )}
                        
                        {/* Statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-lg font-bold text-primary">{profile.totalOrders}</div>
                            <div className="text-xs text-muted-foreground">Commandes</div>
                          </div>
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-lg font-bold text-primary">{profile.totalSpent}F</div>
                            <div className="text-xs text-muted-foreground">Dépensé</div>
                          </div>
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-lg font-bold text-primary">{profile.tournamentParticipations}</div>
                            <div className="text-xs text-muted-foreground">Tournois</div>
                          </div>
                          <div className="text-center p-3 bg-secondary/50 rounded-lg">
                            <div className="text-lg font-bold text-primary">{profile.tournamentWins}</div>
                            <div className="text-xs text-muted-foreground">Victoires</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Image Modal */}
          {expandedImage && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                 onClick={() => setExpandedImage(null)}>
              <div className="relative max-w-4xl max-h-[90vh] w-auto">
                <button 
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
                  onClick={(e) => { e.stopPropagation(); setExpandedImage(null); }}
                  aria-label="Close image"
                >
                  <X className="w-8 h-8" />
                </button>
                <img 
                  src={expandedImage.src} 
                  alt={expandedImage.alt} 
                  className="max-w-full max-h-[90vh] object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
