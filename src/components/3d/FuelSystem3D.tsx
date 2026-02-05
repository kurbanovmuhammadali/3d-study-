import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface FuelParticleProps {
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  delay: number;
  isFlowing: boolean;
}

function FuelParticle({ startPos, endPos, delay, isFlowing }: FuelParticleProps) {
  const particleRef = useRef<THREE.Mesh>(null);
  const progress = useRef(delay);

  useFrame((_, delta) => {
    if (!particleRef.current || !isFlowing) return;
    
    progress.current += delta * 0.8;
    if (progress.current > 1) progress.current = 0;
    
    const t = progress.current;
    particleRef.current.position.lerpVectors(startPos, endPos, t);
    particleRef.current.visible = t > 0.05 && t < 0.95;
  });

  return (
    <mesh ref={particleRef} position={startPos}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshStandardMaterial 
        color="#22c55e" 
        emissive="#22c55e" 
        emissiveIntensity={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function FuelTank({ isFlowing }: { isFlowing: boolean }) {
  const fuelLevelRef = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!fuelLevelRef.current) return;
    // Subtle wave animation
    fuelLevelRef.current.position.y = -0.1 + Math.sin(clock.getElapsedTime() * 2) * 0.02;
  });

  return (
    <group position={[-2, 0, 0]}>
      {/* Tank shell */}
      <mesh>
        <boxGeometry args={[0.8, 0.5, 0.6]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.4} />
      </mesh>
      
      {/* Fuel level */}
      <mesh ref={fuelLevelRef} position={[0, -0.1, 0]}>
        <boxGeometry args={[0.7, 0.25, 0.5]} />
        <meshStandardMaterial 
          color="#22c55e" 
          transparent 
          opacity={0.7}
          emissive="#22c55e"
          emissiveIntensity={isFlowing ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Cap */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial color="#333" metalness={0.9} />
      </mesh>
    </group>
  );
}

function FuelPump({ isFlowing }: { isFlowing: boolean }) {
  const pumpRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pumpRef.current || !isFlowing) return;
    pumpRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 10) * 0.1;
  });

  return (
    <group position={[-1, 0, 0]}>
      <mesh ref={pumpRef}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 16]} />
        <meshStandardMaterial 
          color={isFlowing ? "#22c55e" : "#444"} 
          metalness={0.8}
          emissive={isFlowing ? "#22c55e" : "#000"}
          emissiveIntensity={isFlowing ? 0.4 : 0}
        />
      </mesh>
      
      {/* Motor */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.15]} />
        <meshStandardMaterial color="#222" metalness={0.7} />
      </mesh>
    </group>
  );
}

function FuelLine({ 
  points, 
  isFlowing 
}: { 
  points: [number, number, number][]; 
  isFlowing: boolean;
}) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      points.map(p => new THREE.Vector3(...p))
    );
  }, [points]);

  const particles = useMemo(() => {
    const result = [];
    for (let i = 0; i < 8; i++) {
      const start = curve.getPoint(0);
      const end = curve.getPoint(1);
      result.push({ start, end, delay: i / 8 });
    }
    return result;
  }, [curve]);

  return (
    <group>
      {/* Pipe */}
      <mesh>
        <tubeGeometry args={[curve, 20, 0.02, 8, false]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.6}
        />
      </mesh>
      
      {/* Fuel flow particles */}
      {isFlowing && particles.map((p, i) => (
        <FuelParticle 
          key={i} 
          startPos={p.start} 
          endPos={p.end} 
          delay={p.delay}
          isFlowing={isFlowing}
        />
      ))}
    </group>
  );
}

function Injector({ position, isFlowing }: { position: [number, number, number]; isFlowing: boolean }) {
  const sprayRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!sprayRef.current || !isFlowing) return;
    sprayRef.current.scale.y = 0.5 + Math.abs(Math.sin(clock.getElapsedTime() * 15)) * 0.5;
  });

  return (
    <group position={position}>
      {/* Injector body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.04, 0.03, 0.2, 16]} />
        <meshStandardMaterial color="#444" metalness={0.9} />
      </mesh>
      
      {/* Spray */}
      {isFlowing && (
        <group ref={sprayRef} position={[0, -0.2, 0]}>
          <mesh rotation={[0, 0, 0]}>
            <coneGeometry args={[0.1, 0.3, 16, 1, true]} />
            <meshStandardMaterial 
              color="#22c55e" 
              transparent 
              opacity={0.4}
              emissive="#22c55e"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}

function CombustionChamber({ isFlowing }: { isFlowing: boolean }) {
  const flameRef = useRef<THREE.PointLight>(null);
  const explosionRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!flameRef.current || !explosionRef.current) return;
    
    if (isFlowing) {
      const pulse = Math.abs(Math.sin(clock.getElapsedTime() * 8));
      flameRef.current.intensity = pulse * 3;
      explosionRef.current.scale.setScalar(0.5 + pulse * 0.5);
    } else {
      flameRef.current.intensity = 0;
      explosionRef.current.scale.setScalar(0);
    }
  });

  return (
    <group position={[1, 0, 0]}>
      {/* Cylinder */}
      <mesh>
        <cylinderGeometry args={[0.25, 0.25, 0.5, 32, 1, true]} />
        <meshStandardMaterial color="#1a1a2e" transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Combustion explosion */}
      <mesh ref={explosionRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial 
          color="#ff6b00" 
          emissive="#ff3300"
          emissiveIntensity={2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Flame light */}
      <pointLight ref={flameRef} position={[0, 0, 0]} color="#ff6600" distance={2} />
    </group>
  );
}

function Exhaust({ isFlowing }: { isFlowing: boolean }) {
  const smokeRefs = useRef<THREE.Mesh[]>([]);

  useFrame(({ clock }) => {
    smokeRefs.current.forEach((smoke, i) => {
      if (!smoke || !isFlowing) {
        if (smoke) smoke.visible = false;
        return;
      }
      smoke.visible = true;
      const t = ((clock.getElapsedTime() * 0.5 + i * 0.2) % 1);
      smoke.position.x = 2 + t * 1.5;
      smoke.position.y = Math.sin(t * Math.PI) * 0.2;
      smoke.scale.setScalar(t * 0.5 + 0.1);
      (smoke.material as THREE.MeshStandardMaterial).opacity = (1 - t) * 0.5;
    });
  });

  return (
    <group position={[2, -0.1, 0]}>
      {/* Exhaust pipe */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.1, 0.4, 16]} />
        <meshStandardMaterial color="#333" metalness={0.9} />
      </mesh>
      
      {/* Smoke particles */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) smokeRefs.current[i] = el; }}
          position={[0.3, 0, 0]}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#666" transparent opacity={0.3} />
        </mesh>
      ))}
    </group>
  );
}

interface FuelSystem3DProps {
  isFlowing: boolean;
  showFuelPathOnly: boolean;
}

export function FuelSystem3D({ isFlowing, showFuelPathOnly }: FuelSystem3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-background/50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 3, 5]} />
        <OrbitControls enablePan enableZoom enableRotate />
        
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, 3, -5]} intensity={0.4} color="#22c55e" />
        
        <group>
          {/* Fuel Tank */}
          <FuelTank isFlowing={isFlowing} />
          
          {/* Fuel line from tank to pump */}
          <FuelLine 
            points={[
              [-1.6, 0, 0],
              [-1.3, 0.2, 0],
              [-1.1, 0, 0]
            ]} 
            isFlowing={isFlowing}
          />
          
          {/* Fuel Pump */}
          <FuelPump isFlowing={isFlowing} />
          
          {/* Fuel line from pump to injectors */}
          <FuelLine 
            points={[
              [-0.9, 0, 0],
              [-0.4, 0.3, 0],
              [0.4, 0.3, 0],
              [0.6, 0.1, 0]
            ]} 
            isFlowing={isFlowing}
          />
          
          {/* Fuel rail with injectors */}
          <group position={[0.6, 0.1, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.6, 16]} />
              <meshStandardMaterial color="#22c55e" metalness={0.8} />
            </mesh>
            
            {[-0.2, 0, 0.2].map((z, i) => (
              <Injector key={i} position={[0, -0.15, z]} isFlowing={isFlowing} />
            ))}
          </group>
          
          {!showFuelPathOnly && (
            <>
              {/* Combustion Chamber */}
              <CombustionChamber isFlowing={isFlowing} />
              
              {/* Exhaust */}
              <Exhaust isFlowing={isFlowing} />
            </>
          )}
        </group>
        
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0f" />
        </mesh>
      </Canvas>
    </div>
  );
}
