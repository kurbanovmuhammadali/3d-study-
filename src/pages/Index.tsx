import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cog, GitBranch, Fuel, ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { SketchfabEmbed } from "@/components/SketchfabEmbed";
import { HotspotButton } from "@/components/HotspotButton";
import { EngineMode } from "@/components/EngineMode";
import { TransmissionMode } from "@/components/TransmissionMode";
import { FuelSystemMode } from "@/components/FuelSystemMode";
import { Button } from "@/components/ui/button";

type SystemMode = "car" | "engine" | "transmission" | "fuel";

const Index = () => {
  const [currentMode, setCurrentMode] = useState<SystemMode>("car");
  
  // Engine state
  const [showPistonsOnly, setShowPistonsOnly] = useState(false);
  const [rpm, setRpm] = useState(2000);
  const [isEngineRunning, setIsEngineRunning] = useState(false);
  
  // Transmission state
  const [currentGear, setCurrentGear] = useState(1);
  const [driveType, setDriveType] = useState<"FWD" | "RWD" | "AWD">("RWD");
  
  // Fuel state
  const [isFuelFlowing, setIsFuelFlowing] = useState(false);
  const [showFuelPathOnly, setShowFuelPathOnly] = useState(false);

  const handleSystemSelect = (system: SystemMode) => {
    setCurrentMode(system);
  };

  const handleBackToCar = () => {
    setCurrentMode("car");
    // Reset states
    setShowPistonsOnly(false);
    setIsEngineRunning(false);
    setIsFuelFlowing(false);
    setShowFuelPathOnly(false);
  };

  const getSystemName = () => {
    switch (currentMode) {
      case "engine": return "Engine System";
      case "transmission": return "Transmission";
      case "fuel": return "Fuel System";
      default: return null;
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background glow effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 50%, hsl(186 100% 50% / 0.05) 0%, transparent 50%)"
        }}
      />

      {/* Header */}
      <Header currentSystem={getSystemName()} />

      {/* Back button when in system mode */}
      <AnimatePresence>
        {currentMode !== "car" && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="fixed top-24 right-4 z-40"
          >
            <Button
              onClick={handleBackToCar}
              variant="outline"
              className="gap-2 glass-panel border-primary/30 hover:border-primary/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Car
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 3D Viewer Area */}
      <div className="relative w-full h-screen pt-20">
        {/* Car Mode - Main Porsche View */}
        <AnimatePresence>
          {currentMode === "car" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              {/* Porsche 911 Embed */}
              <SketchfabEmbed
                modelId="877b1bc1739f4a2bb65d62fd7ffd9f75"
                title="Porsche 911 with interior"
              />

              {/* Interactive Hotspots */}
              <HotspotButton
                icon={Cog}
                label="Engine"
                position={{ x: "35%", y: "45%" }}
                variant="engine"
                onClick={() => handleSystemSelect("engine")}
                isActive={false}
              />
              <HotspotButton
                icon={GitBranch}
                label="Transmission"
                position={{ x: "50%", y: "65%" }}
                variant="transmission"
                onClick={() => handleSystemSelect("transmission")}
                isActive={false}
              />
              <HotspotButton
                icon={Fuel}
                label="Fuel System"
                position={{ x: "65%", y: "45%" }}
                variant="fuel"
                onClick={() => handleSystemSelect("fuel")}
                isActive={false}
              />

              {/* Welcome overlay */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 text-center"
              >
                <div className="glass-panel px-8 py-4">
                  <p className="text-lg font-medium text-foreground">
                    Click on any <span className="text-primary">glowing hotspot</span> to explore
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Rotate and zoom the 3D model to discover all systems
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Engine Mode */}
        <EngineMode
          isActive={currentMode === "engine"}
          onClose={handleBackToCar}
          showPistonsOnly={showPistonsOnly}
          onTogglePistons={() => setShowPistonsOnly(!showPistonsOnly)}
          rpm={rpm}
          onRpmChange={setRpm}
          isRunning={isEngineRunning}
          onToggleEngine={() => setIsEngineRunning(!isEngineRunning)}
        />

        {/* Transmission Mode */}
        <TransmissionMode
          isActive={currentMode === "transmission"}
          onClose={handleBackToCar}
          currentGear={currentGear}
          onGearChange={setCurrentGear}
          driveType={driveType}
          onDriveTypeChange={setDriveType}
        />

        {/* Fuel System Mode */}
        <FuelSystemMode
          isActive={currentMode === "fuel"}
          onClose={handleBackToCar}
          isFlowing={isFuelFlowing}
          onToggleFlow={() => setIsFuelFlowing(!isFuelFlowing)}
          showFuelPathOnly={showFuelPathOnly}
          onToggleFuelPath={() => setShowFuelPathOnly(!showFuelPathOnly)}
        />
      </div>
    </div>
  );
};

export default Index;
