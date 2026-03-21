import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle, Gamepad2, Zap, Crown, TrendingUp } from "lucide-react";
import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import OrderForm from "@/components/OrderForm";
import { rechargePackages, games } from "@/lib/games";

interface Package {
  diamonds?: number;
  robux?: number;
  cp?: number;
  uc?: number;
  gold?: number;
  price: number;
  bonus?: number;
  label?: string;
  name?: string;
  duration?: string;
  benefits?: string[];
  description?: string;
}

export default function RechargePage() {
  const [selectedGame, setSelectedGame] = useState("freefire");
  const [selectedCategory, setSelectedCategory] = useState<"diamonds" | "subscription" | "other">("diamonds");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<{ name: string; price: number } | null>(null);

  const handleOrder = (packageName: string, price: number) => {
    setCurrentOrder({ name: packageName, price });
    setShowOrderForm(true);
  };

  return (
    <Layout>
      <section className="py-24 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <SectionHeading 
            badge="Boutique" 
            title="Choisissez Votre Pack" 
            subtitle="Sélectionnez votre jeu et le pack de recharge souhaité. Paiement sécurisé et livraison rapide." 
          />

          {/* Game Selector with Cover Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">
            {games.filter(g => ["freefire", "roblox", "cod", "bloodstrike"].includes(g.id)).map((game) => (
              <button
                key={game.id}
                onClick={() => setSelectedGame(game.id)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 group ${
                  selectedGame === game.id
                    ? `border-primary shadow-2xl scale-105`
                    : "border-border/50 hover:border-primary/30 opacity-70 hover:opacity-100"
                }`}
              >
                {/* Cover Image */}
                <div className="aspect-[4/3] w-full overflow-hidden bg-gradient-card">
                  {game.coverImage ? (
                    <img 
                      src={game.coverImage} 
                      alt={`${game.name} cover`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${game.gradient} flex items-center justify-center`}>
                      <span className="text-6xl">{game.icon}</span>
                    </div>
                  )}
                </div>
                
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-t ${game.gradient} opacity-80 group-hover:opacity-90 transition-opacity`}></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {game.iconImage && (
                    <img 
                      src={game.iconImage} 
                      alt={`${game.name} icon`}
                      className="w-16 h-16 object-contain mb-3 drop-shadow-lg"
                    />
                  )}
                  <h3 className="font-display text-xl font-bold text-white text-center drop-shadow-lg">
                    {game.name}
                  </h3>
                </div>
                
                {/* Selected Indicator */}
                {selectedGame === game.id && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Category Tabs for Free Fire */}
          {selectedGame === "freefire" && (
            <div className="flex gap-2 justify-center mb-8">
              <button
                onClick={() => setSelectedCategory("diamonds")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "diamonds"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                💎 Diamants
              </button>
              <button
                onClick={() => setSelectedCategory("subscription")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "subscription"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                📅 Abonnements
              </button>
              <button
                onClick={() => setSelectedCategory("other")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === "other"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                🎁 Autres Services
              </button>
            </div>
          )}

          {/* Packages Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Free Fire Diamonds */}
            {selectedGame === "freefire" && selectedCategory === "diamonds" &&
              rechargePackages.freefire.map((pkg, i) => (
                <PackageCard
                  key={i}
                  pkg={pkg}
                  type="diamonds"
                  index={i}
                  onOrder={handleOrder}
                  popular={[6, 7, 8].includes(i)}
                  gameIcon={games.find(g => g.id === "freefire")?.tokenIcon}
                  coverImage={games.find(g => g.id === "freefire")?.coverImage}
                />
              ))
            }
            
            {/* Free Fire Subscriptions */}
            {selectedGame === "freefire" && selectedCategory === "subscription" &&
              rechargePackages.freefireSubscription.map((pkg, i) => (
                <SubscriptionCard
                  key={i}
                  pkg={pkg}
                  index={i}
                  onOrder={handleOrder}
                  popular={i === 1}
                  serviceIcon={i === 0 ? games.find(g => g.id === "freefire")?.serviceIcons?.weeklySubscription : games.find(g => g.id === "freefire")?.serviceIcons?.monthlySubscription}
                  coverImage={games.find(g => g.id === "freefire")?.coverImage}
                />
              ))
            }
            
            {/* Free Fire Other Services */}
            {selectedGame === "freefire" && selectedCategory === "other" &&
              rechargePackages.freefireOther.map((pkg, i) => (
                <OtherServiceCard
                  key={i}
                  pkg={pkg}
                  index={i}
                  onOrder={handleOrder}
                  serviceIcon={i === 0 ? games.find(g => g.id === "freefire")?.serviceIcons?.booyahPass : games.find(g => g.id === "freefire")?.serviceIcons?.levelUpPass}
                  coverImage={games.find(g => g.id === "freefire")?.coverImage}
                />
              ))
            }
            
            {/* Roblox */}
            {selectedGame === "roblox" &&
              rechargePackages.roblox.map((pkg, i) => (
                <PackageCard
                  key={i}
                  pkg={pkg}
                  type="robux"
                  index={i}
                  onOrder={handleOrder}
                  popular={[2, 3].includes(i)}
                  gameIcon={games.find(g => g.id === "roblox")?.tokenIcon}
                  coverImage={games.find(g => g.id === "roblox")?.coverImage}
                />
              ))
            }
            
            {/* Call of Duty */}
            {selectedGame === "cod" &&
              rechargePackages.cod.map((pkg, i) => (
                <PackageCard
                  key={i}
                  pkg={pkg}
                  type="cp"
                  index={i}
                  onOrder={handleOrder}
                  popular={[2, 3].includes(i)}
                  gameIcon={games.find(g => g.id === "cod")?.tokenIcon}
                  coverImage={games.find(g => g.id === "cod")?.coverImage}
                />
              ))
            }
            
            {/* Blood Strike */}
            {selectedGame === "bloodstrike" &&
              rechargePackages.bloodstrike.map((pkg, i) => (
                <PackageCard
                  key={i}
                  pkg={pkg}
                  type="gold"
                  index={i}
                  onOrder={handleOrder}
                  popular={[4, 5, 6].includes(i)}
                  gameIcon={games.find(g => g.id === "bloodstrike")?.tokenIcon}
                  coverImage={games.find(g => g.id === "bloodstrike")?.coverImage}
                />
              ))
            }
          </div>
        </div>
      </section>

      {/* Order Form Modal */}
      {showOrderForm && currentOrder && (
        <OrderForm
          productName={currentOrder.name}
          price={currentOrder.price}
          gameType={selectedGame}
          onClose={() => {
            setShowOrderForm(false);
            setCurrentOrder(null);
          }}
        />
      )}
    </Layout>
  );
}

function PackageCard({ pkg, type, index, onOrder, popular, gameIcon, coverImage }: { 
  pkg: Package; 
  type: "diamonds" | "robux" | "cp" | "gold" | "uc";
  index: number;
  onOrder: (name: string, price: number) => void;
  popular?: boolean;
  gameIcon?: string;
  coverImage?: string;
}) {
  const getCurrency = () => {
    if ("diamonds" in pkg) return `${pkg.diamonds} ${type === "diamonds" ? "D" : "J"}`;
    if ("robux" in pkg) return `${pkg.robux} Jetons`;
    if ("cp" in pkg) return `${pkg.cp} CP`;
    if ("gold" in pkg) return `${pkg.gold} Gold`;
    if ("uc" in pkg) return `${pkg.uc} UC`;
    return "";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`bg-gradient-card rounded-2xl overflow-hidden border relative flex flex-col ${
        popular ? "border-primary/50 shadow-glow" : "border-border/50"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Populaire
          </span>
        </div>
      )}

      {/* Cover Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-card">
        {coverImage ? (
          <>
            <img 
              src={coverImage} 
              alt="Game cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br opacity-50`}></div>
        )}
        
        {/* Currency Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {gameIcon ? (
            <img src={gameIcon} alt="Currency" className="w-20 h-20 object-contain drop-shadow-lg" />
          ) : (
            <span className="text-6xl drop-shadow-lg">💎</span>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-center mb-4">
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">{getCurrency()}</h3>
          {pkg.label && (
            <p className="text-sm text-muted-foreground">{pkg.label}</p>
          )}
        </div>

        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gradient mb-1">
            {pkg.price.toLocaleString('fr-FR')} FCFA
          </div>
          {pkg.bonus && pkg.bonus > 0 && (
            <p className="text-xs text-green-500 font-semibold">+{pkg.bonus} bonus</p>
          )}
        </div>

        <button
          onClick={() => onOrder(getCurrency(), pkg.price)}
          className="mt-auto w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Commander
        </button>
      </div>
    </motion.div>
  );
}

function SubscriptionCard({ pkg, index, onOrder, popular, serviceIcon, coverImage }: {
  pkg: Package;
  index: number;
  onOrder: (name: string, price: number) => void;
  popular?: boolean;
  serviceIcon?: string;
  coverImage?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`bg-gradient-card rounded-2xl overflow-hidden border relative flex flex-col ${
        popular ? "border-primary/50 shadow-glow" : "border-border/50"
      }`}
    >
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="bg-gradient-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full inline-flex items-center gap-1">
            <Crown className="w-3 h-3" /> Recommandé
          </span>
        </div>
      )}

      {/* Cover Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-card">
        {coverImage ? (
          <>
            <img 
              src={coverImage} 
              alt="Game cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br opacity-50`}></div>
        )}
        
        {/* Service Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {serviceIcon ? (
            <img src={serviceIcon} alt="Service icon" className="w-20 h-20 object-contain drop-shadow-lg" />
          ) : (
            <Zap className="w-16 h-16 text-primary drop-shadow-lg" />
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">Durée: {pkg.duration}</p>
        </div>

        {pkg.benefits && (
          <ul className="space-y-2 mb-6 flex-1">
            {pkg.benefits.map((benefit, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gradient">
            {pkg.price?.toLocaleString('fr-FR')} FCFA
          </div>
        </div>

        <button
          onClick={() => onOrder(pkg.name || "", pkg.price || 0)}
          className="mt-auto w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" /> S'abonner
        </button>
      </div>
    </motion.div>
  );
}

function OtherServiceCard({ pkg, index, onOrder, serviceIcon, coverImage }: {
  pkg: Package;
  index: number;
  onOrder: (name: string, price: number) => void;
  serviceIcon?: string;
  coverImage?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-gradient-card rounded-2xl overflow-hidden border border-border/50 flex flex-col"
    >
      {/* Cover Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-card">
        {coverImage ? (
          <>
            <img 
              src={coverImage} 
              alt="Game cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
          </>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br opacity-50`}></div>
        )}
        
        {/* Service Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {serviceIcon ? (
            <img src={serviceIcon} alt="Service icon" className="w-20 h-20 object-contain drop-shadow-lg" />
          ) : (
            <Gift className="w-16 h-16 text-primary drop-shadow-lg" />
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-4">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </div>

        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gradient">
            {pkg.price?.toLocaleString('fr-FR')} FCFA
          </div>
        </div>

        <button
          onClick={() => onOrder(pkg.name || "", pkg.price || 0)}
          className="mt-auto w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" /> Acheter
        </button>
      </div>
    </motion.div>
  );
}

function Gift({ className, ...props }: any) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
    </svg>
  );
}
