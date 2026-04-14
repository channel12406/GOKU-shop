// Game recharge data and configurations
import garenaIcon from "@/assets/icon du jeu garena.png";
import codIcon from "@/assets/icon du jeu call of duty.png";
import robloxIcon from "@/assets/icon d jeu roblox.png";
import bloodStrikeIcon from "@/assets/icon du jeu blood strike.png";
import pubgIcon from "@/assets/icon pubg mobile.png";
import codTokenIcon from "@/assets/icon de jeton call of duty.png";
import robloxTokenIcon from "@/assets/icon de jeton roblox.png";
import bloodStrikeTokenIcon from "@/assets/icon de jeton strike.png";
import booyahPassIcon from "@/assets/icon booya pass garena.png";
import weeklySubIcon from "@/assets/icon abonnement hebdomadaire.png";
import monthlySubIcon from "@/assets/icon abonnement mensuel.png";
import levelUpPassIcon from "@/assets/icon level up pass.png";
import freefireCover from "@/assets/couverture de recharge freefire.png";
import codCover from "@/assets/couverture call of duty.png";
import robloxCover from "@/assets/couverture roblox.png";
import bloodStrikeCover from "@/assets/couverture bloude stack.png";
import weeklySubCover from "@/assets/couverture abonnement hebdomadaire.png";
import monthlySubCover from "@/assets/couverture abonnement mensuel.png";
import booyahPassCover from "@/assets/couverture booya pass.png";
import levelUpPassCover from "@/assets/couverture level up pass.png";
import pubgCover from "@/assets/couverture pubg uc.jpg";

// UC Icon for PUBG (using public folder)
const ucIcon = "/uc-icon.svg";

export interface Game {
  id: string;
  name: string;
  icon: string;
  iconImage?: string; // Path to actual icon image
  tokenIcon?: string; // Icon for currency/token
  serviceIcons?: { // Icons for specific services
    booyahPass?: string;
    weeklySubscription?: string;
    monthlySubscription?: string;
    levelUpPass?: string;
  };
  serviceCovers?: { // Cover images for specific services
    booyahPass?: string;
    weeklySubscription?: string;
    monthlySubscription?: string;
    levelUpPass?: string;
  };
  coverImage?: string; // Cover image for the game
  gradient: string;
  description: string;
  popular: boolean;
}

export const games: Game[] = [
  {
    id: "freefire",
    name: "Free Fire",
    icon: "🔥",
    iconImage: garenaIcon, // Garena Free Fire icon
    tokenIcon: undefined, // Will use emoji 💎
    serviceIcons: {
      booyahPass: booyahPassIcon,
      weeklySubscription: weeklySubIcon,
      monthlySubscription: monthlySubIcon,
      levelUpPass: levelUpPassIcon,
    },
    serviceCovers: {
      booyahPass: booyahPassCover,
      weeklySubscription: weeklySubCover,
      monthlySubscription: monthlySubCover,
      levelUpPass: levelUpPassCover,
    },
    coverImage: freefireCover,
    gradient: "from-orange-500 to-red-600",
    description: "Diamonds recharge for Free Fire",
    popular: true,
  },
  {
    id: "cod",
    name: "Call of Duty Mobile",
    icon: "💀",
    iconImage: codIcon, // Call of Duty icon
    tokenIcon: codTokenIcon, // CP Points icon
    coverImage: codCover,
    gradient: "from-green-500 to-emerald-700",
    description: "CP (COD Points) recharge",
    popular: true,
  },
  {
    id: "pubg",
    name: "PUBG Mobile",
    icon: "🎯",
    iconImage: pubgIcon, // PUBG Mobile icon
    tokenIcon: ucIcon, // UC icon
    coverImage: pubgCover, // PUBG UC cover image
    gradient: "from-yellow-500 to-orange-600",
    description: "UC (Unknown Cash) recharge",
    popular: true,
  },
  {
    id: "roblox",
    name: "Roblox",
    icon: "🤖",
    iconImage: robloxIcon, // Roblox icon
    tokenIcon: robloxTokenIcon, // Robux icon
    coverImage: robloxCover,
    gradient: "from-red-500 to-gray-800",
    description: "Robux recharge",
    popular: true,
  },
  {
    id: "bloodstrike",
    name: "Blood Strike",
    icon: "⚔️",
    iconImage: bloodStrikeIcon, // Blood Strike icon
    tokenIcon: bloodStrikeTokenIcon, // Gold icon
    coverImage: bloodStrikeCover,
    gradient: "from-red-600 to-red-800",
    description: "Gold recharge",
    popular: false,
  },
];

export const rechargePackages = {
  freefire: [
    { diamonds: 110, price: 800, bonus: 0, label: "110 Diamants" },
    { diamonds: 231, price: 1600, bonus: 0, label: "231 Diamants" },
    { diamonds: 341, price: 2300, bonus: 0, label: "341 Diamants" },
    { diamonds: 572, price: 3400, bonus: 0, label: "572 Diamants" },
    { diamonds: 700, price: 4800, bonus: 0, label: "700 Diamants" },
    { diamonds: 840, price: 5500, bonus: 0, label: "840 Diamants" },
    { diamonds: 1000, price: 6500, bonus: 0, label: "1000 Diamants" },
    { diamonds: 1500, price: 9800, bonus: 0, label: "1500 Diamants" },
    { diamonds: 2000, price: 12800, bonus: 0, label: "2000 Diamants" },
    { diamonds: 2500, price: 16000, bonus: 0, label: "2500 Diamants" },
    { diamonds: 3000, price: 19500, bonus: 0, label: "3000 Diamants" },
    { diamonds: 4000, price: 26500, bonus: 0, label: "4000 Diamants" },
    { diamonds: 5000, price: 29500, bonus: 0, label: "5000 Diamants" },
    { diamonds: 6000, price: 32500, bonus: 0, label: "6000 Diamants" },
  ],
  freefireSubscription: [
    { name: "Abonnement Hebdomadaire", price: 1600, duration: "7 jours", benefits: ["Diamants quotidiens", "Avantages VIP"] },
    { name: "Abonnement Mensuel", price: 6600, duration: "30 jours", benefits: ["Diamants quotidiens", "Avantages VIP premium", "Réductions exclusives"] },
  ],
  freefireOther: [
    { name: "Booyah Pass", price: 1500, description: "Pass de saison avec récompenses exclusives" },
    { name: "Level Up Pass", price: 2800, description: "Accélérateur de progression" },
  ],
  roblox: [
    { robux: 40, price: 500, bonus: 0, label: "40 Jetons" },
    { robux: 80, price: 800, bonus: 0, label: "80 Jetons" },
    { robux: 500, price: 3400, bonus: 0, label: "500 Jetons" },
    { robux: 1000, price: 6700, bonus: 0, label: "1000 Jetons" },
    { robux: 2000, price: 12800, bonus: 0, label: "2000 Jetons" },
    { robux: 3000, price: 19500, bonus: 0, label: "3000 Jetons" },
    { robux: 4000, price: 25800, bonus: 0, label: "4000 Jetons" },
    { robux: 5250, price: 32500, bonus: 0, label: "5250 Jetons" },
  ],
  cod: [
    { cp: 80, price: 900, bonus: 0, label: "80 CP" },
    { cp: 420, price: 3900, bonus: 0, label: "400 CP" },
    { cp: 880, price: 7400, bonus: 0, label: "800 CP" },
    { cp: 2000, price: 17800, bonus: 0, label: "2000 CP" },
    { cp: 5000, price: 33500, bonus: 0, label: "5000 CP" },
    { cp: 10800, price: 60000, bonus: 0, label: "10800 CP" },
  ],
  bloodstrike: [
    { gold: 51, price: 500, bonus: 0, label: "51 Gold" },
    { gold: 105, price: 700, bonus: 0, label: "105 Gold" },
    { gold: 320, price: 2000, bonus: 0, label: "320 Gold" },
    { gold: 540, price: 3000, bonus: 0, label: "540 Gold" },
    { gold: 1100, price: 5800, bonus: 0, label: "1100 Gold" },
    { gold: 2260, price: 11500, bonus: 0, label: "2260 Gold" },
    { gold: 3360, price: 17100, bonus: 0, label: "3360 Gold" },
    { gold: 5800, price: 28500, bonus: 0, label: "5800 Gold" },
  ],
  pubg: [
    { uc: 60, price: 900, bonus: 0, label: "60 UC" },
    { uc: 120, price: 1800, bonus: 0, label: "120 UC" },
    { uc: 240, price: 2400, bonus: 0, label: "240 UC" },
    { uc: 325, price: 3600, bonus: 0, label: "325 UC" },
    { uc: 385, price: 4500, bonus: 0, label: "385 UC" },
    { uc: 660, price: 6200, bonus: 0, label: "660 UC" },
    { uc: 720, price: 7900, bonus: 0, label: "720 UC" },
    { uc: 1800, price: 25000, bonus: 0, label: "1800 UC" },
    { uc: 2460, price: 31000, bonus: 0, label: "2460 UC" },
    { uc: 3850, price: 29400, bonus: 0, label: "3850 UC" },
    { uc: 5650, price: 54000, bonus: 0, label: "5650 UC" },
    { uc: 8100, price: 60000, bonus: 0, label: "8100 UC" },
  ],
};
