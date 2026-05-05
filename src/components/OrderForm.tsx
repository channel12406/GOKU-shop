import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Gamepad2, MapPin, Phone, CreditCard, Percent, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAffiliateCodeByCode, incrementAffiliateCodeUsage } from "@/lib/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface OrderFormProps {
  productName: string;
  price: number;
  gameType: string;
  onClose: () => void;
}

const countries = [
  { code: "TG", name: "Togo", flag: "🇹🇬", currency: "FCFA" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫", currency: "FCFA" },
  { code: "BJ", name: "Bénin", flag: "🇧🇯", currency: "FCFA" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮", currency: "FCFA" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", currency: "NGN" },
];

const getGameIdLabel = (gameType: string) => {
  switch (gameType) {
    case "freefire":
      return "ID Free Fire";
    case "cod":
      return "COD UID";
    case "pubg":
      return "PUBG ID";
    case "roblox":
      return "Roblox Username";
    case "bloodstrike":
      return "Blood Strike ID";
    default:
      return "ID de Jeu";
  }
};

export default function OrderForm({ productName, price, gameType, onClose }: OrderFormProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gameId: "",
    username: "",
    country: "",
    phone: "",
  });
  const [affiliateCode, setAffiliateCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [codeError, setCodeError] = useState("");
  const [codeLoading, setCodeLoading] = useState(false);
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Écouter l'authentification
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsub;
  }, []);

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.gameId.trim()) {
      newErrors.gameId = "L'ID de jeu est requis";
    }
    
    if (!formData.username.trim()) {
      newErrors.username = "Le pseudo est requis";
    }
    
    if (!formData.country) {
      newErrors.country = "Le pays est requis";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Le numéro de téléphone est requis";
    } else if (!/^[0-9+\s]{8,15}$/.test(formData.phone)) {
      newErrors.phone = "Numéro invalide (8-15 chiffres)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleApplyAffiliateCode = async () => {
    if (!affiliateCode.trim()) {
      setCodeError("Veuillez entrer un code");
      return;
    }

    setCodeLoading(true);
    setCodeError("");

    try {
      console.log("Recherche du code:", affiliateCode.toUpperCase());
      const codeData = await getAffiliateCodeByCode(affiliateCode.toUpperCase());
      console.log("Code trouvé:", codeData);
      
      if (codeData) {
        // Vérifier si le code est proche de la limite
        const currentUsage = codeData.usageCount || 0;
        if (currentUsage >= 3) {
          setCodeError(`Attention : il ne reste que ${4 - currentUsage} utilisation(s) pour ce code`);
        }
        
        // Code valide
        const discountValue = (price * codeData.discountPercentage) / 100;
        console.log("Calcul de la réduction:", price, "x", codeData.discountPercentage, "% =", discountValue);
        setDiscountAmount(discountValue);
        setAppliedCode(codeData.code);
        setShowCodeInput(false);
        
        console.log("Réduction appliquée:", discountValue, "Nouveau prix:", price - discountValue);
        
        // Incrémenter l'utilisation du code
        await incrementAffiliateCodeUsage(codeData.id!);
      } else {
        // Vérifier si le code existe mais a atteint sa limite
        const { getAllAffiliateCodes } = await import("@/lib/firebase");
        const allCodes = await getAllAffiliateCodes();
        const existingCode = allCodes.find(c => c.code.toUpperCase() === affiliateCode.toUpperCase());
        
        if (existingCode) {
          if (existingCode.usageCount >= 4) {
            setCodeError("Ce code a atteint sa limite de 4 utilisations et n'est plus valide");
          } else if (!existingCode.isActive) {
            setCodeError("Ce code n'est plus actif");
          } else if (existingCode.expiresAt && new Date() > new Date(existingCode.expiresAt)) {
            setCodeError("Ce code est expiré");
          } else {
            setCodeError("Code invalide");
          }
        } else {
          setCodeError("Code invalide ou expiré");
        }
        
        setDiscountAmount(0);
        setAppliedCode(null);
      }
    } catch (error) {
      console.error("Erreur lors de la validation du code:", error);
      setCodeError("Une erreur est survenue");
    } finally {
      setCodeLoading(false);
    }
  };

  const handleRemoveCode = () => {
    setAffiliateCode("");
    setAppliedCode(null);
    setDiscountAmount(0);
    setShowCodeInput(true);
  };

  const handleSubmit = () => {
    // Navigate to payment page with order data
    const orderData = {
      ...formData,
      productName,
      price,
      gameType,
      timestamp: new Date().toISOString(),
      affiliateCode: appliedCode,
      discountAmount,
      finalPrice: price - discountAmount,
    };
    
    console.log("Données de commande:", orderData);
    console.log("Prix final calculé:", price - discountAmount);
    
    // Store in sessionStorage for payment page
    sessionStorage.setItem('currentOrder', JSON.stringify(orderData));
    navigate('/payment');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-card rounded-2xl border border-border/50 max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-card border-b border-border/50 p-4 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="font-display text-xl font-bold text-foreground">
              {step === 1 ? "Informations du Joueur" : "Paiement"}
            </h2>
            <p className="text-xs text-muted-foreground">{productName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4">
          <div className="flex gap-2">
            <div className={`flex-1 h-2 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-secondary'}`} />
            <div className={`flex-1 h-2 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-secondary'}`} />
          </div>
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Identification</span>
            <span>Paiement</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Game ID */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Gamepad2 className="w-4 h-4 inline mr-1" />
                  {getGameIdLabel(gameType)} *
                </label>
                <input
                  type="text"
                  value={formData.gameId}
                  onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                  placeholder="Entrez votre ID de jeu"
                  className={`w-full px-4 py-3 rounded-lg bg-secondary border ${
                    errors.gameId ? 'border-red-500' : 'border-border'
                  } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                />
                {errors.gameId && (
                  <p className="text-red-500 text-xs mt-1">{errors.gameId}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Pseudo *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Votre pseudo dans le jeu"
                  className={`w-full px-4 py-3 rounded-lg bg-secondary border ${
                    errors.username ? 'border-red-500' : 'border-border'
                  } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Pays *
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg bg-secondary border ${
                    errors.country ? 'border-red-500' : 'border-border'
                  } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                >
                  <option value="">Sélectionnez votre pays</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+228 XX XX XX XX"
                  className={`w-full px-4 py-3 rounded-lg bg-secondary border ${
                    errors.phone ? 'border-red-500' : 'border-border'
                  } text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50`}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Summary */}
              <div className="bg-secondary/50 rounded-lg p-4 mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Produit</span>
                  <span className="font-semibold text-foreground">{productName}</span>
                </div>
                <div className="flex justify-between items-center text-lg">
                  <span className="font-medium text-foreground">Total</span>
                  <span className="font-bold text-gradient">{price.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Continuer vers le paiement
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center py-8"
            >
              <div className="mb-6">
                <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
                <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                  Paiement Sécurisé
                </h3>
                <p className="text-muted-foreground">
                  Choisissez votre méthode de paiement
                </p>
              </div>

              <div className="bg-secondary/50 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Récapitulatif</p>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Sous-total</span>
                    <span className="font-semibold text-foreground">{price.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between items-center text-sm text-green-400">
                      <span>Réduction affiliation {appliedCode && `(${appliedCode})`}</span>
                      <span className="font-semibold">-{discountAmount.toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-2 mt-2">
                    <div className="flex justify-between items-center text-2xl">
                      <span className="font-bold text-foreground">Total</span>
                      <span className="font-bold text-gradient">
                        {(price - discountAmount).toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <button className="w-full py-4 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors">
                  📱 Mobile Money (TMoney / Moov)
                </button>
                <button className="w-full py-4 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors">
                  💳 Carte Bancaire
                </button>
                
                {/* Affiliate Code Section - Accessible to all users */}
                {true && (
                  <div className="mt-4">
                    {!showCodeInput && !appliedCode ? (
                      <button
                        type="button"
                        onClick={() => setShowCodeInput(true)}
                        className="w-full py-4 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-colors inline-flex items-center justify-center gap-2"
                      >
                        <Percent className="w-5 h-5" />
                        Code Promo / Parrainage
                      </button>
                    ) : showCodeInput && !appliedCode ? (
                      <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                          Code de Parrainage
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={affiliateCode}
                            onChange={(e) => setAffiliateCode(e.target.value.toUpperCase())}
                            placeholder="ENTREZ LE CODE"
                            className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border text-foreground uppercase focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                          <button
                            onClick={handleApplyAffiliateCode}
                            disabled={codeLoading || !affiliateCode.trim()}
                            className="px-4 py-2 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                          >
                            {codeLoading ? "..." : "Appliquer"}
                          </button>
                        </div>
                        {codeError && (
                          <div className="flex items-center gap-2 text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {codeError}
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setShowCodeInput(false);
                            setCodeError("");
                          }}
                          className="text-sm text-muted-foreground hover:text-foreground"
                        >
                          Annuler
                        </button>
                      </div>
                    ) : appliedCode ? (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2 text-green-400">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Code Appliqué</span>
                          </div>
                          <button
                            onClick={handleRemoveCode}
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            Supprimer
                          </button>
                        </div>
                        <p className="text-sm text-green-300">Code: {appliedCode}</p>
                        {discountAmount > 0 && (
                          <p className="text-sm text-green-300 mt-1">
                            Réduction: -{discountAmount.toLocaleString('fr-FR')} FCFA
                          </p>
                        )}
                      </div>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 rounded-lg bg-secondary border border-border text-foreground font-semibold hover:bg-secondary/80 transition-colors"
                >
                  Retour
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Payer Maintenant
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
