import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, TrendingUp, Star, Check } from "lucide-react";
import OrderForm from "./OrderForm";

interface LevelOption {
  level: string;
  price: number;
  description: string;
  popular?: boolean;
  icon?: React.ReactNode;
}

interface LevelUpPassSelectorProps {
  onClose: () => void;
  gameType: string;
}

const freeFireLevels: LevelOption[] = [
  {
    level: "Niveau 6",
    price: 300,
    description: "Pass jusqu'au niveau 6",
    icon: <Star className="w-5 h-5" />
  },
  {
    level: "Niveau 10",
    price: 450,
    description: "Pass jusqu'au niveau 10",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    level: "Niveau 15",
    price: 450,
    description: "Pass jusqu'au niveau 15",
    icon: <Crown className="w-5 h-5" />
  },
  {
    level: "Niveau 20",
    price: 450,
    description: "Pass jusqu'au niveau 20",
    icon: <Star className="w-5 h-5" />
  },
  {
    level: "Niveau 25",
    price: 450,
    description: "Pass jusqu'au niveau 25",
    icon: <TrendingUp className="w-5 h-5" />
  },
  {
    level: "Niveau 30",
    price: 450,
    description: "Pass jusqu'au niveau 30",
    icon: <Crown className="w-5 h-5" />
  },
  {
    level: "Tous les niveaux",
    price: 2800,
    description: "Pass complet tous les niveaux (6, 10, 15, 20, 25, 30)",
    popular: true,
    icon: <Crown className="w-5 h-5" />
  }
];

export default function LevelUpPassSelector({ onClose, gameType }: LevelUpPassSelectorProps) {
  const [selectedLevel, setSelectedLevel] = useState<LevelOption | null>(null);
  const [showOrderForm, setShowOrderForm] = useState(false);

  const handleLevelSelect = (level: LevelOption) => {
    setSelectedLevel(level);
  };

  const handleOrder = () => {
    if (selectedLevel) {
      setShowOrderForm(true);
    }
  };

  const getOrderDetails = () => {
    if (!selectedLevel) return null;

    const price = selectedLevel.price;
    const name = `Level Up Pass - ${selectedLevel.level}`;

    return { name, price };
  };

  if (showOrderForm) {
    const orderDetails = getOrderDetails();
    if (!orderDetails) return null;

    return (
      <OrderForm
        onClose={() => {
          setShowOrderForm(false);
          onClose();
        }}
        productName={orderDetails.name}
        price={orderDetails.price}
        gameType={gameType}
      />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-card rounded-2xl border border-border/50 w-full max-w-4xl max-h-[95vh] overflow-y-auto mx-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-card border-b border-border/50 p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-display text-lg sm:text-2xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 flex-shrink-0" />
                <span className="truncate">Level Up Pass - Free Fire</span>
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base mt-1">
                Choisissez votre niveau de progression
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary rounded-lg transition-colors flex-shrink-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="grid gap-3 sm:gap-4 mb-6">
            {freeFireLevels.map((level, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleLevelSelect(level)}
                className={`relative p-4 sm:p-6 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedLevel?.level === level.level
                    ? 'border-primary bg-primary/10 shadow-glow'
                    : 'border-border/50 hover:border-primary/50 hover:bg-secondary/30'
                } ${level.popular ? 'ring-2 ring-yellow-500/20' : ''}`}
              >
                {level.popular && (
                  <div className="absolute -top-2 sm:-top-3 left-4 sm:left-6 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-medium">
                    Plus Populaire
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                      <div className="p-1.5 sm:p-2 bg-primary/20 rounded-lg text-primary">
                        {level.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-base sm:text-lg text-foreground">
                          {level.level}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {level.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="text-right sm:ml-4 flex-shrink-0">
                    <div className="text-lg sm:text-2xl font-bold text-primary">
                      {`${level.price} FCFA`}
                    </div>
                    {selectedLevel?.level === level.level && (
                      <div className="mt-1 sm:mt-2">
                        <Check className="w-4 h-4 sm:w-6 sm:h-6 text-green-500 mx-auto" />
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bouton de commande */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 sm:px-6 bg-secondary text-secondary-foreground rounded-xl font-medium hover:bg-secondary/80 transition-colors text-sm sm:text-base"
            >
              Annuler
            </button>
            <button
              onClick={handleOrder}
              disabled={!selectedLevel}
              className="flex-1 py-3 px-4 sm:px-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5" />
              Commander
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
