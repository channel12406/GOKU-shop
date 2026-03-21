import { Link } from "react-router-dom";
import gokuProfile from "@/assets/profil goku shop.jpeg";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export default function Logo({ size = "md", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-14 h-14"
  };

  return (
    <Link to="/" className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-primary/50`}>
        <img 
          src={gokuProfile} 
          alt="Goku Shop Logo"
          className="w-full h-full object-cover"
        />
      </div>
      {showText && (
        <span className="font-display font-bold text-lg text-foreground">
          GOKU<span className="text-gradient">Shop</span>
        </span>
      )}
    </Link>
  );
}