import { motion } from "framer-motion";
import { Settings, ArrowRight } from "lucide-react";
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
      {/* Conceptual Transmission View */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="relative w-full max-w-4xl h-96">
            {/* Animated Drivetrain Visualization */}
            <svg viewBox="0 0 800 300" className="w-full h-full">
              {/* Engine */}
              <motion.rect
                x="50"
                y="100"
                width="100"
                height="100"
                rx="10"
                fill="none"
                stroke="hsl(280 100% 60%)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <text x="100" y="155" textAnchor="middle" fill="hsl(280 100% 60%)" fontSize="14">
                Engine
              </text>

              {/* Gearbox */}
              <motion.rect
                x="200"
                y="110"
                width="80"
                height="80"
                rx="10"
                fill="none"
                stroke="hsl(280 100% 60%)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
              />
              <text x="240" y="155" textAnchor="middle" fill="hsl(280 100% 60%)" fontSize="14">
                Gear {currentGear}
              </text>

              {/* Power flow line */}
              <motion.line
                x1="150"
                y1="150"
                x2="200"
                y2="150"
                stroke="hsl(280 100% 60%)"
                strokeWidth="3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              />

              {/* Differential */}
              <motion.circle
                cx="400"
                cy="150"
                r="30"
                fill="none"
                stroke="hsl(280 100% 60%)"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
              />
              <text x="400" y="155" textAnchor="middle" fill="hsl(280 100% 60%)" fontSize="10">
                DIFF
              </text>

              {/* Driveshaft */}
              <motion.line
                x1="280"
                y1="150"
                x2="370"
                y2="150"
                stroke="hsl(280 100% 60%)"
                strokeWidth="3"
                strokeDasharray="5,5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />

              {/* Wheels based on drive type */}
              {(driveType === "FWD" || driveType === "AWD") && (
                <>
                  <motion.circle
                    cx="550"
                    cy="80"
                    r="40"
                    fill="none"
                    stroke="hsl(280 100% 60%)"
                    strokeWidth="3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2 / currentGear, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle
                    cx="550"
                    cy="220"
                    r="40"
                    fill="none"
                    stroke="hsl(280 100% 60%)"
                    strokeWidth="3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2 / currentGear, repeat: Infinity, ease: "linear" }}
                  />
                  <text x="550" y="85" textAnchor="middle" fill="hsl(280 100% 60%)" fontSize="10">
                    FRONT
                  </text>
                </>
              )}

              {(driveType === "RWD" || driveType === "AWD") && (
                <>
                  <motion.circle
                    cx="700"
                    cy="80"
                    r="40"
                    fill="none"
                    stroke="hsl(280 100% 60%)"
                    strokeWidth="3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2 / currentGear, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.circle
                    cx="700"
                    cy="220"
                    r="40"
                    fill="none"
                    stroke="hsl(280 100% 60%)"
                    strokeWidth="3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2 / currentGear, repeat: Infinity, ease: "linear" }}
                  />
                  <text x="700" y="85" textAnchor="middle" fill="hsl(280 100% 60%)" fontSize="10">
                    REAR
                  </text>
                </>
              )}

              {/* Power flow arrows */}
              <motion.path
                d="M430 150 L520 80"
                stroke="hsl(280 100% 60% / 0.5)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
              <motion.path
                d="M430 150 L520 220"
                stroke="hsl(280 100% 60% / 0.5)"
                strokeWidth="2"
                fill="none"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              />
            </svg>
          </div>
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
