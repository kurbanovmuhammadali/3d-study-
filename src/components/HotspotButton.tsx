import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface HotspotButtonProps {
  icon: LucideIcon;
  label: string;
  position: { x: string; y: string };
  variant: "engine" | "transmission" | "fuel";
  onClick: () => void;
  isActive: boolean;
}

const variantStyles = {
  engine: {
    bg: "bg-engine/20",
    border: "border-engine/50",
    glow: "shadow-[0_0_20px_hsl(25_100%_50%/0.5)]",
    text: "text-engine",
  },
  transmission: {
    bg: "bg-transmission/20",
    border: "border-transmission/50",
    glow: "shadow-[0_0_20px_hsl(280_100%_60%/0.5)]",
    text: "text-transmission",
  },
  fuel: {
    bg: "bg-fuel/20",
    border: "border-fuel/50",
    glow: "shadow-[0_0_20px_hsl(120_100%_45%/0.5)]",
    text: "text-fuel",
  },
};

export function HotspotButton({
  icon: Icon,
  label,
  position,
  variant,
  onClick,
  isActive,
}: HotspotButtonProps) {
  const styles = variantStyles[variant];

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        absolute z-20 flex flex-col items-center gap-2 group
        ${isActive ? "scale-110" : ""}
      `}
      style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)" }}
    >
      {/* Pulse ring */}
      <motion.div
        className={`absolute w-14 h-14 rounded-full ${styles.bg} ${styles.border} border`}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Main button */}
      <div
        className={`
          relative w-14 h-14 rounded-full backdrop-blur-xl 
          border ${styles.border} ${styles.bg}
          flex items-center justify-center
          transition-all duration-300
          ${isActive ? styles.glow : ""}
          group-hover:${styles.glow}
        `}
      >
        <Icon className={`w-6 h-6 ${styles.text}`} />
      </div>

      {/* Label */}
      <motion.span
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className={`
          text-xs font-medium px-3 py-1 rounded-full
          backdrop-blur-xl ${styles.bg} ${styles.border} border
          ${styles.text} whitespace-nowrap
        `}
      >
        {label}
      </motion.span>
    </motion.button>
  );
}
