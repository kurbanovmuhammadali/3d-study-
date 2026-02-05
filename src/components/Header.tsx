import { motion } from "framer-motion";

interface HeaderProps {
  currentSystem: string | null;
}

export function Header({ currentSystem }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-40 glass-panel mx-4 mt-4 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-primary font-bold text-xl">⚙</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">How Cars Work</h1>
            <p className="text-xs text-muted-foreground">Interactive 3D Learning</p>
          </div>
        </div>

        {/* Current System Indicator */}
        {currentSystem && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">
              Exploring: {currentSystem}
            </span>
          </motion.div>
        )}

        {/* Future menu placeholder */}
        <nav className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Cars
          </span>
          <span className="text-sm text-muted-foreground/50">Airplanes</span>
          <span className="text-sm text-muted-foreground/50">Rockets</span>
        </nav>
      </div>
    </motion.header>
  );
}
