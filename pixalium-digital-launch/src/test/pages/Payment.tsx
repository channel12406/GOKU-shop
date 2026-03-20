import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, Smartphone, Gift, CheckCircle, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { addOrder } from "@/lib/firebase";
import { openWhatsApp } from "@/lib/whatsapp";

interface OrderData {
  gameId: string;
  username: string;
  country: string;
  phone: string;
  productName: string;
  price: number;
  gameType: string;
  timestamp: string;
}

const countries: Record<string, { name: string; flag: string; methods: {name: string; number: string; operator: string}[] }> = {
  TG: { 
    name: "Togo", 
    flag: "🇹🇬", 
    methods: [
      { name: "Moov Money", number: "+228 97 01 58 75", operator: "Moov" },
      { name: "TMoney", number: "+228 97 01 58 75", operator: "Togo Telecom" }
    ] 
  },
  BF: { 
    name: "Burkina Faso", 
    flag: "🇧🇫", 
    methods: [
      { name: "Orange Money", number: "+226 54 02 52 52", operator: "Orange" },
      { name: "Moov Money", number: "+226 65 03 03 03", operator: "Moov" },
      { name: "MTN Mobile Money", number: "+226 70 70 70 70", operator: "MTN" }
    ] 
  },
  BJ: { 
    name: "Bénin", 
    flag: "🇧🇯", 
    methods: [
      { name: "MTN Mobile Money", number: "+229 01 51 10 45", operator: "MTN" },
      { name: "Moov Money", number: "+229 01 58 75 88", operator: "Moov" },
      { name: "Celtiis Cash", number: "+229 01 93 83 96", operator: "Celtiis" }
    ] 
  },
  CI: { 
    name: "Côte d'Ivoire", 
    flag: "🇨🇮", 
    methods: [
      { name: "Orange Money", number: "+225 07 07 07 07", operator: "Orange" },
      { name: "MTN Mobile Money", number: "+225 05 05 05 05", operator: "MTN" },
      { name: "Moov Money", number: "+225 04 04 04 04", operator: "Moov" },
      { name: "Wave", number: "+225 01 01 01 01", operator: "Wave" }
    ] 
  },
  NG: { 
    name: "Nigeria", 
    flag: "🇳🇬", 
    methods: [
      { name: "OPay", number: "NG-OPAY-001", operator: "OPay" },
      { name: "PalmPay", number: "NG-PALM-001", operator: "PalmPay" },
      { name: "Bank Transfer", number: "Contact Admin", operator: "Bank" }
    ] 
  },
};

export default function Payment() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('currentOrder');
    if (saved) {
      setOrderData(JSON.parse(saved));
    } else {
      navigate('/recharge');
    }
  }, []);

  const handleApplyPromoCode = () => {
    // Here you would validate the promo code with Firebase
    // For now, simulate a discount
    if (promoCode.toUpperCase() === "GUILD10") {
      setDiscount(10);
    } else if (promoCode.toUpperCase() === "GUILD20") {
      setDiscount(20);
    }
  };

  const calculateFinalPrice = () => {
    if (!orderData) return 0;
    return orderData.price * (1 - discount / 100);
  };

  const handlePayment = async () => {
    if (!orderData || !paymentMethod) return;
    
    setProcessing(true);

    try {
      // Save order to Firebase
      await addOrder({
        gameId: orderData.gameId,
        username: orderData.username,
        country: orderData.country,
        phone: orderData.phone,
        productName: orderData.productName,
        originalPrice: orderData.price,
        finalPrice: calculateFinalPrice(),
        discount: discount,
        paymentMethod,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      // Send WhatsApp confirmation
      const message = `
🎮 *NOUVELLE COMMANDE* 🎮

👤 Joueur: ${orderData.username}
🆔 ID: ${orderData.gameId}
🌍 Pays: ${countries[orderData.country]?.flag} ${countries[orderData.country]?.name}
📞 Téléphone: ${orderData.phone}

📦 Produit: ${orderData.productName}
💰 Prix: ${calculateFinalPrice().toLocaleString('fr-FR')} FCFA
${discount > 0 ? `🏷️ Réduction: ${discount}%\n` : ''}
💳 Paiement: ${paymentMethod}

Merci de traiter cette commande!
      `.trim();

      setTimeout(() => {
        openWhatsApp(message);
        sessionStorage.removeItem('currentOrder');
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error("Payment error:", error);
      alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setProcessing(false);
    }
  };

  if (!orderData) return null;

  const countryInfo = countries[orderData.country];

  return (
    <Layout>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-2xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-card rounded-2xl p-8 border border-border/50"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <CreditCard className="w-16 h-16 text-primary mx-auto mb-4" />
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                Paiement Sécurisé
              </h1>
              <p className="text-muted-foreground">
                Finalisez votre commande en toute sécurité
              </p>
            </div>

            {/* Order Summary */}
            <div className="bg-secondary/50 rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Résumé de la commande</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produit</span>
                  <span className="font-medium text-foreground">{orderData.productName}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Joueur</span>
                  <span className="font-medium text-foreground">{orderData.username}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID de jeu</span>
                  <span className="font-medium text-foreground">{orderData.gameId}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pays</span>
                  <span className="font-medium text-foreground">
                    {countryInfo?.flag} {countryInfo?.name}
                  </span>
                </div>
                
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-foreground">Total</span>
                    <div className="text-right">
                      {discount > 0 && (
                        <div className="text-sm text-muted-foreground line-through">
                          {orderData.price.toLocaleString('fr-FR')} FCFA
                        </div>
                      )}
                      <div className="font-bold text-gradient">
                        {calculateFinalPrice().toLocaleString('fr-FR')} FCFA
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-4">Méthode de paiement</h3>
              
              <div className="space-y-3">
                {countryInfo?.methods.map((method, index) => (
                  <button
                    key={index}
                    onClick={() => setPaymentMethod(method.name)}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      paymentMethod === method.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {method.name.includes("Mobile") || method.name.includes("Money") ? (
                          <Smartphone className="w-5 h-5 text-primary" />
                        ) : method.name.includes("Carte") || method.name.includes("Card") ? (
                          <CreditCard className="w-5 h-5 text-primary" />
                        ) : (
                          <Gift className="w-5 h-5 text-primary" />
                        )}
                        <div>
                          <span className="font-medium text-foreground block">{method.name}</span>
                          <span className="text-sm text-muted-foreground">{method.number}</span>
                        </div>
                      </div>
                      {paymentMethod === method.name && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div className="mb-6">
              <h3 className="font-semibold text-foreground mb-4">Code Promo / Parrainage</h3>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  placeholder="CODE PROMO"
                  className="flex-1 px-4 py-3 rounded-lg bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={handleApplyPromoCode}
                  className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
                >
                  Appliquer
                </button>
              </div>
              
              {discount > 0 && (
                <div className="mt-2 text-green-500 text-sm">
                  ✅ Réduction de {discount}% appliquée!
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handlePayment}
              disabled={!paymentMethod || processing}
              className="w-full py-4 rounded-xl bg-gradient-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-6 h-6" />
              {processing ? "Traitement..." : `Payer ${calculateFinalPrice().toLocaleString('fr-FR')} FCFA`}
            </button>

            {/* Security Notice */}
            <div className="mt-6 text-center text-xs text-muted-foreground">
              🔒 Paiement 100% sécurisé via WhatsApp • Vos données sont protégées
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
