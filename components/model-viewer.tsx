"use client"

import { useState, useRef, useEffect, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, PerspectiveCamera } from "@react-three/drei"
import { X } from "lucide-react"
import * as THREE from "three"

type ModelViewerProps = {
  modelPath: string
  isOpen: boolean
  onClose: () => void
  onLoad: () => void;
}

function Model({ modelPath, onLoaded }: { modelPath: string; onLoaded: () => void }) {
    const { scene } = useGLTF(modelPath, true, undefined, () => {
      onLoaded()
    })
    const modelRef = useRef<THREE.Group>(null)
  
    // Define scales for each model
    const getScaleByModelPath = (path: string) => {
      if (path.includes("bowl")) return 0.005
      if (path.includes("linear")) return 0.015
      if (path.includes("hopper")) return 0.004
      if (path.includes("set-c")) return 0.005
      // add more models here later
      return 0.01 // default scale
    }
  
    const scale = getScaleByModelPath(modelPath)
  
    useEffect(() => {
      if (modelRef.current) {
        const box = new THREE.Box3().setFromObject(modelRef.current)
        const center = box.getCenter(new THREE.Vector3())
        modelRef.current.position.sub(center) // Center the model
      }
    }, [])
  
    useFrame(() => {
      if (modelRef.current) {
        modelRef.current.rotation.y += 0.002
      }
    })
  
    return (
      <group ref={modelRef}>
        <primitive object={scene} scale={scale} />
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
            <div className="text-lg font-medium"></div>
          </div>
        )}

        <Canvas shadows className="w-full h-full">
          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <Suspense fallback={null}>
            <Model modelPath={modelPath} onLoaded={() => setIsLoading(false)} />
            <Environment preset="warehouse" />
          </Suspense>
          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>

        <div className="absolute bottom-4 left-0 right-0 text-center text-sm text-gray-600 bg-white/80 py-2">
          Click and drag to rotate • Scroll to zoom • Shift + drag to pan
        </div>
      </div>
    </div>
  )
}
