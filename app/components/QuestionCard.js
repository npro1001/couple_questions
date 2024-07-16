"use client";

import React, { useState, useEffect } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Text, Html} from '@react-three/drei';
import { TextureLoader } from 'three/src/loaders/TextureLoader';

function QuestionCard() {
  const [text, setText] = useState('Lets run it!');
  const [rotation, setRotation] = useState([0, 0, 0]);
  const texture = useLoader(TextureLoader, './texture4.jpeg'); // Assuming you have a card texture

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      setRotation([y *  0.2, x * 0.2, 0]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
        <ambientLight />
        <pointLight position={[14, 8, 10]} />
        <OrbitControls minDistance={10} maxDistance={10} enableZoom={false} enablePan={false} enableRotate={false}/> {/* Lock zoom */}
        <mesh rotation={rotation}> {/* Apply rotation to the mesh */}
          <boxGeometry args={[8, 4, 0.1]} />
          <meshStandardMaterial map={texture} />
          <Html position={[0, 0, 0.5]} // Position the button slightly below the text
                transform
                occlude>
            <div className="flex flex-col items-center">
              <p className="text-base-300 text-3xl">{text}</p>
              <button className="btn btn-xs btn-accent hover:btn-primary">
                New Game
              </button>
            </div>
          </Html>        </mesh>
      </Canvas>
  );
}

export default QuestionCard;