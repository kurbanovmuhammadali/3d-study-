import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface ControlPanelProps {
  children: ReactNode;
  isOpen: boolean;
}

export function ControlPanel({ children, isOpen }: ControlPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 glass-panel p-4"
        >
          <div className="flex items-center gap-6">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
