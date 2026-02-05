import { motion } from "framer-motion";
import { Play, Pause, Eye, Layers } from "lucide-react";
import { SketchfabEmbed } from "./SketchfabEmbed";
import { SystemPanel } from "./SystemPanel";
import { ControlPanel } from "./ControlPanel";
import { Slider } from "./ui/slider";
import { Button } from "./ui/button";

interface EngineModeProps {
  isActive: boolean;
  onClose: () => void;
  showPistonsOnly: boolean;
  onTogglePistons: () => void;
  rpm: number;
  onRpmChange: (value: number) => void;
  isRunning: boolean;
  onToggleEngine: () => void;
}

export function EngineMode({
  isActive,
  onClose,
  showPistonsOnly,
  onTogglePistons,
  rpm,
  onRpmChange,
  isRunning,
  onToggleEngine,
}: EngineModeProps) {
  const engineModelId = "be81c8572c8842a4b90e3f42e68e3e27";
  const pistonModelId = "7ac7605efbe1450780ea38d5d906374a";

  return (
    <>
      {/* 3D Model View */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10"
        >
          <SketchfabEmbed
            modelId={showPistonsOnly ? pistonModelId : engineModelId}
            title={showPistonsOnly ? "Engine Pistons" : "4 Cylinder Engine"}
          />
        </motion.div>
      )}

      {/* Info Panel */}
      <SystemPanel
        title="Engine System"
        description="Explore the heart of the vehicle"
        isOpen={isActive}
        onClose={onClose}
        variant="engine"
      >
        <div className="space-y-4">
          {/* RPM Display */}
          <div className="glass-panel p-4 text-center">
            <span className="text-4xl font-bold text-engine">{rpm}</span>
            <span className="text-lg text-muted-foreground ml-2">RPM</span>
          </div>

          {/* Info Text */}
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              The <span className="text-engine font-medium">internal combustion engine</span> converts 
              fuel into mechanical energy through controlled explosions.
            </p>
            <p>
              Each <span className="text-engine font-medium">piston</span> goes through 4 strokes: 
              Intake → Compression → Power → Exhaust
            </p>
          </div>

          {/* Engine Parts List */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Key Components:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-engine" />
                Pistons & Cylinders
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-engine" />
                Crankshaft
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-engine" />
                Camshaft & Valves
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-engine" />
                Spark Plugs
              </li>
            </ul>
          </div>
        </div>
      </SystemPanel>

      {/* Control Panel */}
      <ControlPanel isOpen={isActive}>
        <Button
          onClick={onToggleEngine}
          className={`gap-2 ${isRunning ? "bg-engine hover:bg-engine/80" : "bg-muted hover:bg-muted/80"}`}
        >
          {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isRunning ? "Stop Engine" : "Start Engine"}
        </Button>

        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">RPM</span>
          <Slider
            value={[rpm]}
            onValueChange={(v) => onRpmChange(v[0])}
            min={800}
            max={8000}
            step={100}
            className="w-40"
          />
        </div>

        <Button
          onClick={onTogglePistons}
          variant="outline"
          className={`gap-2 ${showPistonsOnly ? "border-engine text-engine" : ""}`}
        >
          {showPistonsOnly ? <Layers className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showPistonsOnly ? "Full Engine" : "Pistons Only"}
        </Button>
      </ControlPanel>
    </>
  );
}
