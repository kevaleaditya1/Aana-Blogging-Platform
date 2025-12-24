"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

function PenguinModel() {
    const meshRef = useRef<THREE.Group>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (event: MouseEvent) => {
            // Convert mouse position to normalized device coordinates (-1 to +1)
            setMousePosition({
                x: (event.clientX / window.innerWidth) * 2 - 1,
                y: -(event.clientY / window.innerHeight) * 2 + 1,
            });
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    useEffect(() => {
        const loader = new OBJLoader();
        loader.load(
            "/3d-models/aana.obj",
            (object) => {
                // Create materials for different parts
                const pinkMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffc0cb, // Pink for hat
                    roughness: 0.5,
                    metalness: 0.1,
                });

                const whiteMaterial = new THREE.MeshStandardMaterial({
                    color: 0xf5f5f5, // White for body/face
                    roughness: 0.6,
                    metalness: 0.1,
                });

                const grayMaterial = new THREE.MeshStandardMaterial({
                    color: 0x808080, // Gray for wings
                    roughness: 0.7,
                    metalness: 0.2,
                });

                const yellowMaterial = new THREE.MeshStandardMaterial({
                    color: 0xffeb3b, // Yellow for dress
                    roughness: 0.5,
                    metalness: 0.1,
                });

                const orangeMaterial = new THREE.MeshStandardMaterial({
                    color: 0xff9800, // Orange for beak
                    roughness: 0.6,
                    metalness: 0.1,
                });

                // Apply materials to different parts based on mesh index
                let meshIndex = 0;
                object.traverse((child) => {
                    if (child instanceof THREE.Mesh) {
                        // Assign materials based on mesh order (approximate)
                        if (meshIndex === 0) {
                            child.material = pinkMaterial; // Hat
                        } else if (meshIndex === 1) {
                            child.material = whiteMaterial; // Face/body
                        } else if (meshIndex === 2 || meshIndex === 3) {
                            child.material = grayMaterial; // Wings
                        } else if (meshIndex === 4) {
                            child.material = yellowMaterial; // Dress
                        } else {
                            child.material = whiteMaterial; // Default
                        }
                        meshIndex++;
                    }
                });

                // Scale and position the model
                object.scale.set(1.5, 1.5, 1.5);
                object.position.set(0, 0, 0);

                if (meshRef.current) {
                    meshRef.current.add(object);
                }
            },
            undefined,
            (error) => {
                console.error("Error loading OBJ:", error);
            }
        );
    }, []);

    // Make penguin look at mouse (inverted direction)
    useFrame(() => {
        if (meshRef.current) {
            // Invert the rotation to look in the correct direction
            const targetRotationY = -mousePosition.x * 0.5;
            const targetRotationX = -mousePosition.y * 0.3;

            meshRef.current.rotation.y += (targetRotationY - meshRef.current.rotation.y) * 0.1;
            meshRef.current.rotation.x += (targetRotationX - meshRef.current.rotation.x) * 0.1;
        }
    });

    return <group ref={meshRef} />;
}

export function PenguinViewer() {
    return (
        <div className="fixed top-4 right-4 w-48 h-48 md:w-64 md:h-64 z-50 pointer-events-none">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                style={{ background: "transparent" }}
            >
                <Suspense fallback={null}>
                    {/* Lighting */}
                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 5, 5]} intensity={1} />
                    <pointLight position={[-5, -5, -5]} intensity={0.5} />
                    <spotLight position={[0, 10, 0]} intensity={0.5} angle={0.3} />

                    {/* 3D Model */}
                    <PenguinModel />
                </Suspense>
            </Canvas>
        </div>
    );
}
