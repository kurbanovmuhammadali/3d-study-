import { motion } from "framer-motion";
import { Transmission3D } from "./3d/Transmission3D";
import { SystemPanel } from "./SystemPanel";
import { ControlPanel } from "./ControlPanel";
import { Button } from "./ui/button";

interface TransmissionModeProps {
  isActive: boolean;
  onClose: () => void;
  currentGear: number;
  onGearChange: (gear: number) => void;
  driveType: "FWD" | "RWD" | "AWD";
  onDriveTypeChange: (type: "FWD" | "RWD" | "AWD") => void;
}

export function TransmissionMode({
  isActive,
  onClose,
  currentGear,
  onGearChange,
  driveType,
  onDriveTypeChange,
}: TransmissionModeProps) {
  const gears = [1, 2, 3, 4, 5, 6];
  const driveTypes: ("FWD" | "RWD" | "AWD")[] = ["FWD", "RWD", "AWD"];

  return (
    <>
      {/* 3D Transmission View */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10"
        >
          <Transmission3D driveType={driveType} currentGear={currentGear} />
        </motion.div>
      )}

      {/* Info Panel */}
      <SystemPanel
        title="Transmission"
        description="Power transfer from engine to wheels"
        isOpen={isActive}
        onClose={onClose}
        variant="transmission"
      >
        <div className="space-y-4">
          {/* Current Gear Display */}
          <div className="glass-panel p-4 text-center">
            <span className="text-4xl font-bold text-transmission">{currentGear}</span>
            <span className="text-lg text-muted-foreground ml-2">Gear</span>
          </div>

          {/* Info Text */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              The <span className="text-transmission font-medium">transmission</span> transfers 
              engine power to the wheels through a series of gears.
            </p>
            <p>
              Lower gears provide more <span className="text-transmission font-medium">torque</span>, 
              higher gears allow for greater <span className="text-transmission font-medium">speed</span>.
            </p>
          </div>

          {/* Drive Type Info */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Current: {driveType}</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><strong>FWD</strong> - Front wheels powered</li>
              <li><strong>RWD</strong> - Rear wheels powered</li>
              <li><strong>AWD</strong> - All wheels powered</li>
            </ul>
          </div>
        </div>
      </SystemPanel>

      {/* Control Panel */}
      <ControlPanel isOpen={isActive}>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Gear:</span>
          {gears.map((gear) => (
            <Button
              key={gear}
              onClick={() => onGearChange(gear)}
              variant={currentGear === gear ? "default" : "outline"}
              size="sm"
              className={currentGear === gear ? "bg-transmission hover:bg-transmission/80" : ""}
            >
              {gear}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Drive:</span>
          {driveTypes.map((type) => (
            <Button
              key={type}
              onClick={() => onDriveTypeChange(type)}
              variant={driveType === type ? "default" : "outline"}
              size="sm"
              className={driveType === type ? "bg-transmission hover:bg-transmission/80" : ""}
            >
              {type}
            </Button>
          ))}
        </div>
      </ControlPanel>
    </>
  );
}
