import { motion } from "framer-motion";
import { Play, Pause, Eye } from "lucide-react";
import { FuelSystem3D } from "./3d/FuelSystem3D";
import { SystemPanel } from "./SystemPanel";
import { ControlPanel } from "./ControlPanel";
import { Button } from "./ui/button";

interface FuelSystemModeProps {
  isActive: boolean;
  onClose: () => void;
  isFlowing: boolean;
  onToggleFlow: () => void;
  showFuelPathOnly: boolean;
  onToggleFuelPath: () => void;
}

export function FuelSystemMode({
  isActive,
  onClose,
  isFlowing,
  onToggleFlow,
  showFuelPathOnly,
  onToggleFuelPath,
}: FuelSystemModeProps) {
  return (
    <>
      {/* 3D Fuel System View */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10"
        >
          <FuelSystem3D isFlowing={isFlowing} showFuelPathOnly={showFuelPathOnly} />
        </motion.div>
      )}

      {/* Info Panel */}
      <SystemPanel
        title="Fuel System"
        description="From tank to combustion"
        isOpen={isActive}
        onClose={onClose}
        variant="fuel"
      >
        <div className="space-y-4">
          {/* Status Display */}
          <div className="glass-panel p-4 text-center">
            <span className={`text-2xl font-bold ${isFlowing ? "text-fuel" : "text-muted-foreground"}`}>
              {isFlowing ? "FLOWING" : "STOPPED"}
            </span>
          </div>

          {/* Info Text */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              The <span className="text-fuel font-medium">fuel system</span> delivers 
              gasoline from the tank to the engine cylinders.
            </p>
            <p>
              Fuel is pressurized by the <span className="text-fuel font-medium">fuel pump</span> and 
              sprayed into cylinders by <span className="text-fuel font-medium">injectors</span>.
            </p>
          </div>

          {/* Flow Path */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Flow Path:</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Fuel Tank</li>
              <li>Fuel Pump</li>
              <li>Fuel Lines</li>
              <li>Fuel Rail</li>
              <li>Injectors</li>
              <li>Combustion Chamber</li>
              <li>Exhaust</li>
            </ol>
          </div>
        </div>
      </SystemPanel>

      {/* Control Panel */}
      <ControlPanel isOpen={isActive}>
        <Button
          onClick={onToggleFlow}
          className={`gap-2 ${isFlowing ? "bg-fuel hover:bg-fuel/80" : "bg-muted hover:bg-muted/80"}`}
        >
          {isFlowing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isFlowing ? "Stop Flow" : "Start Flow"}
        </Button>

        <Button
          onClick={onToggleFuelPath}
          variant="outline"
          className={`gap-2 ${showFuelPathOnly ? "border-fuel text-fuel" : ""}`}
        >
          <Eye className="w-4 h-4" />
          {showFuelPathOnly ? "Show All" : "Fuel Path Only"}
        </Button>
      </ControlPanel>
    </>
  );
}
