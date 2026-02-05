import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface SystemPanelProps {
  title: string;
  description: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
  variant: "engine" | "transmission" | "fuel";
}

const variantStyles = {
  engine: {
    accent: "border-engine/30",
    title: "text-engine",
  },
  transmission: {
    accent: "border-transmission/30",
    title: "text-transmission",
  },
  fuel: {
    accent: "border-fuel/30",
    title: "text-fuel",
  },
};

export function SystemPanel({
  title,
  description,
  children,
  isOpen,
  onClose,
  variant,
}: SystemPanelProps) {
  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`
            fixed left-4 top-24 z-30 w-80 max-h-[calc(100vh-8rem)]
            glass-panel border-l-4 ${styles.accent}
            overflow-y-auto
          `}
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className={`text-2xl font-bold ${styles.title}`}>{title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted/50 transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4">{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
