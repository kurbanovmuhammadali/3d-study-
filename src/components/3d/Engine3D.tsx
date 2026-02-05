import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

interface PistonProps {
  position: [number, number, number];
  phase: number;
  rpm: number;
  isRunning: boolean;
}

function Piston({ position, phase, rpm, isRunning }: PistonProps) {
  const pistonRef = useRef<THREE.Group>(null);
  const rodRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!pistonRef.current || !isRunning) return;
    
    const speed = (rpm / 60) * Math.PI * 2;
    const time = clock.getElapsedTime();
    const offset = Math.sin(time * speed + phase) * 0.4;
    
    pistonRef.current.position.y = offset;
    
    if (rodRef.current) {
      rodRef.current.rotation.z = Math.sin(time * speed + phase) * 0.2;
    }
  });

  return (
    <group position={position}>
      {/* Cylinder wall */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.5, 32, 1, true]} />
        <meshStandardMaterial 
          color="#1a1a2e" 
          transparent 
          opacity={0.6} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Piston head */}
      <group ref={pistonRef}>
        <mesh position={[0, 0.3, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
          <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Piston rings */}
        {[0.35, 0.25, 0.15].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <torusGeometry args={[0.28, 0.02, 8, 32]} />
            <meshStandardMaterial color="#444" metalness={0.9} roughness={0.1} />
          </mesh>
        ))}
        
        {/* Connecting rod */}
        <mesh ref={rodRef} position={[0, -0.2, 0]}>
          <boxGeometry args={[0.08, 0.6, 0.08]} />
          <meshStandardMaterial color="#666" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Spark plug */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.2, 16]} />
        <meshStandardMaterial color="#ffdd00" emissive="#ff6600" emissiveIntensity={isRunning ? 0.5 : 0} />
      </mesh>
    </group>
  );
}

function Crankshaft({ rpm, isRunning }: { rpm: number; isRunning: boolean }) {
  const crankRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!crankRef.current || !isRunning) return;
    const speed = (rpm / 60) * Math.PI * 2;
    crankRef.current.rotation.z = clock.getElapsedTime() * speed;
  });

  return (
    <group ref={crankRef} position={[0, -0.8, 0]} rotation={[Math.PI / 2, 0, 0]}>
      {/* Main shaft */}
      <mesh>
        <cylinderGeometry args={[0.1, 0.1, 3, 32]} />
        <meshStandardMaterial color="#555" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Crank pins */}
      {[-1.1, -0.35, 0.35, 1.1].map((z, i) => (
        <group key={i} position={[0, 0, z]}>
          <mesh position={[0.15, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#ff6b35" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      
      {/* Counterweights */}
      {[-1.3, 0, 1.3].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.3, 0.15, 0.1]} />
          <meshStandardMaterial color="#444" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  );
}

function EngineBlock({ rpm, isRunning }: { rpm: number; isRunning: boolean }) {
  const phases = [0, Math.PI, Math.PI, 0]; // Firing order

  return (
    <group>
      {/* Engine block base */}
      <mesh position={[0, -0.3, 0]}>
        <boxGeometry args={[3.2, 0.6, 1]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Cylinder head */}
      <mesh position={[0, 1.4, 0]}>
        <boxGeometry args={[3.2, 0.3, 0.9]} />
        <meshStandardMaterial color="#222" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Pistons */}
      {[-1.1, -0.35, 0.35, 1.1].map((x, i) => (
        <Piston
          key={i}
          position={[x, 0.5, 0]}
          phase={phases[i]}
          rpm={rpm}
          isRunning={isRunning}
        />
      ))}
      
      {/* Crankshaft */}
      <Crankshaft rpm={rpm} isRunning={isRunning} />
      
      {/* Oil pan */}
      <mesh position={[0, -1.3, 0]}>
        <boxGeometry args={[3, 0.4, 0.8]} />
        <meshStandardMaterial color="#111" metalness={0.3} roughness={0.7} />
      </mesh>
    </group>
  );
}

interface Engine3DProps {
  rpm: number;
  isRunning: boolean;
  showPistonsOnly: boolean;
}

export function Engine3D({ rpm, isRunning, showPistonsOnly }: Engine3DProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-background to-background/50">
      <Canvas>
        <PerspectiveCamera makeDefault position={[4, 2, 4]} />
        <OrbitControls enablePan enableZoom enableRotate />
        
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, 3, -5]} intensity={0.5} color="#ff6b35" />
        <pointLight position={[0, 2, 0]} intensity={isRunning ? 1 : 0.3} color="#ff6b35" />
        
        <group rotation={[0.1, 0.3, 0]}>
          {showPistonsOnly ? (
            // Just pistons view
            <group>
              {[-1.1, -0.35, 0.35, 1.1].map((x, i) => (
                <Piston
                  key={i}
                  position={[x, 0.5, 0]}
                  phase={[0, Math.PI, Math.PI, 0][i]}
                  rpm={rpm}
                  isRunning={isRunning}
                />
              ))}
              <Crankshaft rpm={rpm} isRunning={isRunning} />
            </group>
          ) : (
            <EngineBlock rpm={rpm} isRunning={isRunning} />
          )}
        </group>
        
        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#0a0a0f" />
        </mesh>
      </Canvas>
    </div>
  );
}
