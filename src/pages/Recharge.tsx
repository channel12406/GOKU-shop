import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, CheckCircle, Gamepad2, Zap, Crown, TrendingUp, Trophy } from "lucide-react";
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
    if ("diamonds" in pkg) return `${pkg.diamonds} Diamants`;
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
  pkg: { name: string; price: number; duration: string; benefits: string[] };
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
      className="bg-gradient-card rounded-2xl overflow-hidden border border-border/50 flex flex-col"
    >
      {/* Cover Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-card">
        {coverImage ? (
          <>
            <img 
              src={coverImage} 
              alt="Subscription cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-purple-500/20 to-blue-500/20"></div>
        )}
        
        {/* Service Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {serviceIcon ? (
            <img src={serviceIcon} alt="Service" className="w-20 h-20 object-contain drop-shadow-lg" />
          ) : (
            <span className="text-6xl drop-shadow-lg">📅</span>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-center mb-4">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">{pkg.duration}</p>
        </div>

        <div className="mb-4 flex-1">
          <ul className="space-y-2">
            {pkg.benefits.map((benefit, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" /> {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center mb-4">
          <div className="text-2xl font-bold text-gradient mb-1">
            {pkg.price.toLocaleString('fr-FR')} FCFA
          </div>
        </div>

        <button
          onClick={() => onOrder(pkg.name, pkg.price)}
          className="mt-auto w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" /> S'abonner
        </button>
      </div>
    </motion.div>
  );
}

function OtherServiceCard({ pkg, index, onOrder, popular, serviceIcon, coverImage }: {
  pkg: { name: string; price: number; description: string };
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
      className="bg-gradient-card rounded-2xl overflow-hidden border border-border/50 flex flex-col"
    >
      {/* Cover Image Section */}
      <div className="relative h-48 overflow-hidden bg-gradient-card">
        {coverImage ? (
          <>
            <img 
              src={coverImage} 
              alt="Service cover"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-90"></div>
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-green-500/20"></div>
        )}
        
        {/* Service Icon Overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          {serviceIcon ? (
            <img src={serviceIcon} alt="Service" className="w-20 h-20 object-contain drop-shadow-lg" />
          ) : (
            <span className="text-6xl drop-shadow-lg">🎁</span>
          )}
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-center mb-4">
          <h3 className="font-display text-xl font-bold text-foreground mb-2">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground">{pkg.description}</p>
        </div>

        <div className="text-center mb-4 flex-1">
          <div className="text-2xl font-bold text-gradient">
            {pkg.price.toLocaleString('fr-FR')} FCFA
          </div>
        </div>

        <button
          onClick={() => onOrder(pkg.name, pkg.price)}
          className="mt-auto w-full py-3 rounded-lg bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
        >
          <Gamepad2 className="w-4 h-4" /> Commander
        </button>
      </div>
    </motion.div>
  );
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

  const gameData = games.find(g => g.id === selectedGame);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12 max-w-7xl mx-auto">
            {games.filter(g => ["freefire", "roblox", "cod", "pubg", "bloodstrike"].includes(g.id)).map((game) => (
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
                      <CheckCircle className="w-5 h-5" />
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
                  gameIcon={gameData?.tokenIcon}
                  coverImage={gameData?.coverImage}
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
                  serviceIcon={i === 0 ? gameData?.serviceIcons?.weeklySubscription : gameData?.serviceIcons?.monthlySubscription}
                  coverImage={i === 0 ? gameData?.serviceCovers?.weeklySubscription : gameData?.serviceCovers?.monthlySubscription}
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
                  popular={false}
                  serviceIcon={i === 0 ? gameData?.serviceIcons?.booyahPass : gameData?.serviceIcons?.levelUpPass}
                  coverImage={i === 0 ? gameData?.serviceCovers?.booyahPass : gameData?.serviceCovers?.levelUpPass}
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
            
            {/* PUBG Mobile */}
            {selectedGame === "pubg" &&
              rechargePackages.pubg.map((pkg, i) => (
                <PackageCard
                  key={i}
                  pkg={pkg}
                  type="uc"
                  index={i}
                  onOrder={handleOrder}
                  popular={[6, 7, 9].includes(i)}
                  gameIcon={games.find(g => g.id === "pubg")?.tokenIcon}
                  coverImage={games.find(g => g.id === "pubg")?.coverImage}
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
                  popular={[4, 5].includes(i)}
                  gameIcon={games.find(g => g.id === "bloodstrike")?.tokenIcon}
                  coverImage={games.find(g => g.id === "bloodstrike")?.coverImage}
                />
              ))
            }
          </div>
        </div>
      </section>

      {showOrderForm && currentOrder && (
        <OrderForm
          productName={currentOrder.name}
          price={currentOrder.price}
          gameType="freefire"
          onClose={() => setShowOrderForm(false)}
        />
      )}
    </Layout>
  );
}
