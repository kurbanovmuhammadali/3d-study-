import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Text } from "@react-three/drei";
import * as THREE from "three";

interface WheelProps {
  position: [number, number, number];
  isPowered: boolean;
  speed: number;
}

function Wheel({ position, isPowered, speed }: WheelProps) {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!wheelRef.current) return;
    wheelRef.current.rotation.x = clock.getElapsedTime() * speed;
  });

  return (
    <group position={position}>
      <group ref={wheelRef} rotation={[0, 0, Math.PI / 2]}>
        {/* Tire */}
        <mesh>
          <torusGeometry args={[0.35, 0.15, 16, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        
        {/* Rim */}
        <mesh>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial 
            color={isPowered ? "#a855f7" : "#444"} 
            metalness={0.9} 
            roughness={0.1}
            emissive={isPowered ? "#a855f7" : "#000"}
            emissiveIntensity={isPowered ? 0.3 : 0}
          />
        </mesh>
        
        {/* Spokes */}
        {[0, 1, 2, 3, 4].map((i) => (
          <mesh key={i} rotation={[0, (i * Math.PI * 2) / 5, 0]} position={[0, 0, 0]}>
            <boxGeometry args={[0.04, 0.02, 0.4]} />
            <meshStandardMaterial color="#666" metalness={0.8} />
          </mesh>
        ))}
      </group>
      
      {/* Power indicator glow */}
      {isPowered && (
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#a855f7" distance={1} />
      )}
    </group>
  );
}

function Axle({ 
  startPos, 
  endPos, 
  isPowered 
}: { 
  startPos: [number, number, number]; 
  endPos: [number, number, number]; 
  isPowered: boolean;
}) {
  const length = Math.sqrt(
    Math.pow(endPos[0] - startPos[0], 2) +
    Math.pow(endPos[1] - startPos[1], 2) +
    Math.pow(endPos[2] - startPos[2], 2)
  );
  
  const midPoint: [number, number, number] = [
    (startPos[0] + endPos[0]) / 2,
    (startPos[1] + endPos[1]) / 2,
    (startPos[2] + endPos[2]) / 2,
  ];

  return (
    <mesh position={midPoint} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.03, 0.03, length, 16]} />
      <meshStandardMaterial 
        color={isPowered ? "#a855f7" : "#555"} 
        metalness={0.8}
        emissive={isPowered ? "#a855f7" : "#000"}
        emissiveIntensity={isPowered ? 0.2 : 0}
      />
    </mesh>
  );
}

function Driveshaft({ isPowered, speed }: { isPowered: boolean; speed: number }) {
  const shaftRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!shaftRef.current || !isPowered) return;
    shaftRef.current.rotation.z = clock.getElapsedTime() * speed * 2;
  });

  return (
    <mesh ref={shaftRef} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.04, 0.04, 2.5, 16]} />
      <meshStandardMaterial 
        color={isPowered ? "#a855f7" : "#444"} 
        metalness={0.9}
        emissive={isPowered ? "#a855f7" : "#000"}
        emissiveIntensity={isPowered ? 0.3 : 0}
      />
    </mesh>
  );
}

function Differential({ position, isPowered }: { position: [number, number, number]; isPowered: boolean }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial 
        color={isPowered ? "#a855f7" : "#333"} 
        metalness={0.8}
        emissive={isPowered ? "#a855f7" : "#000"}
        emissiveIntensity={isPowered ? 0.4 : 0}
      />
    </mesh>
  );
}

function GearBox({ currentGear, speed }: { currentGear: number; speed: number }) {
  const gearRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!gearRef.current) return;
    gearRef.current.rotation.y = clock.getElapsedTime() * speed;
  });

  return (
    <group position={[0, 0.3, 0]}>
      {/* Gearbox housing */}
      <mesh>
        <boxGeometry args={[0.4, 0.3, 0.5]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Visible gears */}
      <group ref={gearRef} position={[0, 0, 0.3]}>
        {[0.08, 0.1, 0.12, 0.14, 0.16, 0.18].map((size, i) => (
          <mesh 
            key={i} 
            position={[0, 0, i * 0.08 - 0.2]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[size, 0.02, 8, currentGear === i + 1 ? 20 : 16]} />
            <meshStandardMaterial 
              color={currentGear === i + 1 ? "#a855f7" : "#444"} 
              metalness={0.9}
              emissive={currentGear === i + 1 ? "#a855f7" : "#000"}
              emissiveIntensity={currentGear === i + 1 ? 0.5 : 0}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

function CarBody() {
  return (
    <group position={[0, 0.6, 0]}>
      {/* Car body outline */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[1.2, 0.3, 2.8]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.3} />
      </mesh>
      
      {/* Cabin */}
      <mesh position={[0, 0.45, -0.2]}>
        <boxGeometry args={[1, 0.3, 1.2]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

interface Transmission3DProps {
  driveType: "FWD" | "RWD" | "AWD";
  currentGear: number;
}

export function Transmission3D({ driveType, currentGear }: Transmission3DProps) {
  const speed = currentGear * 1.5;
  const frontPowered = driveType === "FWD" || driveType === "AWD";
  const rearPowered = driveType === "RWD" || driveType === "AWD";

  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-background/50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[3, 2, 3]} />
        <OrbitControls enablePan enableZoom enableRotate />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#a855f7" />
        
        <group rotation={[0, 0.2, 0]}>
          <CarBody />
          
          {/* Front wheels */}
          <Wheel position={[-0.8, 0, 1]} isPowered={frontPowered} speed={speed} />
          <Wheel position={[0.8, 0, 1]} isPowered={frontPowered} speed={speed} />
          
          {/* Rear wheels */}
          <Wheel position={[-0.8, 0, -1]} isPowered={rearPowered} speed={speed} />
          <Wheel position={[0.8, 0, -1]} isPowered={rearPowered} speed={speed} />
          
          {/* Front axle */}
          <Axle startPos={[-0.8, 0, 1]} endPos={[0.8, 0, 1]} isPowered={frontPowered} />
          
          {/* Rear axle */}
          <Axle startPos={[-0.8, 0, -1]} endPos={[0.8, 0, -1]} isPowered={rearPowered} />
          
          {/* Differentials */}
          {frontPowered && <Differential position={[0, 0, 1]} isPowered={frontPowered} />}
          {rearPowered && <Differential position={[0, 0, -1]} isPowered={rearPowered} />}
          
          {/* Center driveshaft for RWD/AWD */}
          {(driveType === "RWD" || driveType === "AWD") && (
            <Driveshaft isPowered={true} speed={speed} />
          )}
          
          {/* Gearbox */}
          <GearBox currentGear={currentGear} speed={speed} />
          
          {/* Labels */}
          <Text
            position={[0, -0.5, 1.5]}
            fontSize={0.15}
            color={frontPowered ? "#a855f7" : "#666"}
          >
            FRONT
          </Text>
          <Text
            position={[0, -0.5, -1.5]}
            fontSize={0.15}
            color={rearPowered ? "#a855f7" : "#666"}
          >
            REAR
          </Text>
        </group>
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0f" />
        </mesh>
      </Canvas>
    </div>
  );
}
