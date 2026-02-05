import { motion } from "framer-motion";
import { Droplets, Play, Pause, Eye } from "lucide-react";
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
      {/* Conceptual Fuel System View */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <div className="relative w-full max-w-4xl h-96">
            <svg viewBox="0 0 800 400" className="w-full h-full">
              {/* Fuel Tank */}
              <motion.rect
                x="50"
                y="200"
                width="120"
                height="150"
                rx="15"
                fill={isFlowing ? "hsl(120 100% 45% / 0.2)" : "hsl(120 100% 45% / 0.1)"}
                stroke="hsl(120 100% 45%)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              />
              <text x="110" y="280" textAnchor="middle" fill="hsl(120 100% 45%)" fontSize="14" fontWeight="bold">
                FUEL TANK
              </text>
              
              {/* Fuel level animation */}
              {isFlowing && (
                <motion.rect
                  x="55"
                  y="220"
                  width="110"
                  rx="10"
                  fill="hsl(120 100% 45% / 0.4)"
                  initial={{ height: 125 }}
                  animate={{ height: [125, 100, 125] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              )}

              {/* Fuel Pump */}
              <motion.circle
                cx="250"
                cy="275"
                r="35"
                fill="none"
                stroke="hsl(120 100% 45%)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.2 } }}
              />
              <text x="250" y="280" textAnchor="middle" fill="hsl(120 100% 45%)" fontSize="10">
                PUMP
              </text>
              {isFlowing && (
                <motion.circle
                  cx="250"
                  cy="275"
                  r="25"
                  fill="none"
                  stroke="hsl(120 100% 45%)"
                  strokeWidth="3"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "250px 275px" }}
                />
              )}

              {/* Fuel Line from tank to pump */}
              <motion.path
                d="M170 275 L215 275"
                stroke="hsl(120 100% 45%)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
              />
              {isFlowing && (
                <motion.circle
                  r="4"
                  fill="hsl(120 100% 60%)"
                  initial={{ x: 170, y: 275 }}
                  animate={{ x: [170, 215, 170] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              )}

              {/* Fuel Rail */}
              <motion.rect
                x="350"
                y="130"
                width="200"
                height="30"
                rx="5"
                fill="none"
                stroke="hsl(120 100% 45%)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
              />
              <text x="450" y="150" textAnchor="middle" fill="hsl(120 100% 45%)" fontSize="12">
                FUEL RAIL
              </text>

              {/* Fuel line from pump to rail */}
              <motion.path
                d="M285 275 L320 275 L320 145 L350 145"
                stroke="hsl(120 100% 45%)"
                strokeWidth="6"
                strokeLinecap="round"
                fill="none"
              />
              {isFlowing && (
                <motion.circle
                  r="4"
                  fill="hsl(120 100% 60%)"
                >
                  <animateMotion
                    dur="2s"
                    repeatCount="indefinite"
                    path="M285 275 L320 275 L320 145 L350 145"
                  />
                </motion.circle>
              )}

              {/* Injectors */}
              {[0, 1, 2, 3].map((i) => (
                <g key={i}>
                  <motion.rect
                    x={370 + i * 45}
                    y="160"
                    width="20"
                    height="40"
                    rx="3"
                    fill={isFlowing ? "hsl(120 100% 45% / 0.3)" : "none"}
                    stroke="hsl(120 100% 45%)"
                    strokeWidth="2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { delay: 0.4 + i * 0.1 } }}
                  />
                  {isFlowing && (
                    <motion.line
                      x1={380 + i * 45}
                      y1="200"
                      x2={380 + i * 45}
                      y2="240"
                      stroke="hsl(120 100% 60%)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: [0, 1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                    />
                  )}
                </g>
              ))}
              <text x="450" y="220" textAnchor="middle" fill="hsl(120 100% 45%)" fontSize="10">
                INJECTORS
              </text>

              {/* Engine Block (combustion) */}
              <motion.rect
                x="360"
                y="250"
                width="180"
                height="100"
                rx="10"
                fill={isFlowing ? "hsl(25 100% 50% / 0.2)" : "none"}
                stroke="hsl(25 100% 50%)"
                strokeWidth="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.6 } }}
              />
              <text x="450" y="305" textAnchor="middle" fill="hsl(25 100% 50%)" fontSize="14" fontWeight="bold">
                COMBUSTION
              </text>
              {isFlowing && (
                <motion.circle
                  cx="450"
                  cy="300"
                  r="20"
                  fill="hsl(25 100% 50% / 0.5)"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}

              {/* Exhaust */}
              <motion.path
                d="M540 300 L620 300 L680 300"
                stroke="hsl(0 0% 50%)"
                strokeWidth="8"
                strokeLinecap="round"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.7 } }}
              />
              {isFlowing && (
                <>
                  <motion.circle
                    r="6"
                    fill="hsl(0 0% 60%)"
                    initial={{ x: 540, y: 300 }}
                    animate={{ x: [540, 680], opacity: [1, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                  />
                  <motion.circle
                    r="4"
                    fill="hsl(0 0% 50%)"
                    initial={{ x: 540, y: 300 }}
                    animate={{ x: [540, 700], y: [300, 280], opacity: [0.8, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.3 }}
                  />
                </>
              )}
              <text x="700" y="305" textAnchor="start" fill="hsl(0 0% 60%)" fontSize="12">
                EXHAUST
              </text>

              {/* Labels */}
              <text x="50" y="50" fill="hsl(120 100% 45%)" fontSize="18" fontWeight="bold">
                Fuel System Flow
              </text>
            </svg>
          </div>
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
