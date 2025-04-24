"use client"

import { useState, useRef, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from "@react-three/drei"
import { X } from "lucide-react"
import type * as THREE from "three"

type ModelViewerProps = {
  modelPath: string
  isOpen: boolean
  onClose: () => void
}

function Model({ modelPath }: { modelPath: string }) {
  const { scene, nodes, materials } = useGLTF(modelPath)
  const { camera } = useThree()
  const modelRef = useRef<THREE.Group>(null)

  // Center and scale the model
  useFrame(() => {
    if (modelRef.current) {
      // Gentle auto-rotation when not being controlled
      modelRef.current.rotation.y += 0.002
    }
  })

  return (
    <group ref={modelRef}>
      <primitive object={scene} scale={1.5} position={[0, -1, 0]} />
    </group>
  )
}

export default function ModelViewer({ modelPath, isOpen, onClose }: ModelViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 print:hidden">
      <div className="relative w-[90vw] h-[80vh] max-w-4xl bg-white rounded-lg overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 p-2 rounded-full hover:bg-white"
          aria-label="Close"
        >
          <X size={24} />
        </button>

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-lg font-medium">Loading 3D Model...</div>
          </div>
        )}

        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Suspense fallback={null}>
            <Model modelPath={modelPath} />
            <Environment preset="warehouse" />
          </Suspense>
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>

        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-600 bg-white/80 py-2">
          Click and drag to rotate • Scroll to zoom • Shift + drag to pan
        </div>
      </div>
    </div>
  )
}
