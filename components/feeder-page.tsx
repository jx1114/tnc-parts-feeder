"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { useFormContext } from "@/context/FormContext"
import NavigationMenu from "./navigation-menu"
import ModelViewer from "./model-viewer"
import { RefreshCw } from "lucide-react"


export type FeederPageProps = {
  title: string
  feederType: string
  imageSrc: string
  modelPath?: string
  dimensionDescriptions: Record<string, string>
  dimensionPositions: Record<string, { x: number; y: number }>
  nextPageRoute?: string
  previousPageRoute?: string
  machineInfoFields?: Array<{
    id: string
    label: string
    type: "text" | "select" | "number"
    options?: string[]
  }>
}

export default function FeederPage({
  title,
  feederType,
  imageSrc,
  modelPath = `/models/${feederType}.glb`,
  dimensionDescriptions,
  dimensionPositions,
  nextPageRoute,
  previousPageRoute,
  machineInfoFields = [
    { id: "machineNo", label: "Machine no.", type: "text" },
    {
      id: "rotation",
      label: "Rotation",
      type: "select",
      options: ["Clockwise", "Anti-clockwise"],
    },
    { id: "uph", label: "UPH", type: "number" },
  ],
}: FeederPageProps) {
  const { getFeederData, updateFeederData, setCurrentFeederType, setNextFeederType } = useFormContext()
  const feederData = getFeederData(feederType)

  const [currentDimension, setCurrentDimension] = useState<string | null>(null)
  const [dimensionValue, setDimensionValue] = useState("")
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showModelViewer, setShowModelViewer] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showFireworks, setShowFireworks] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  const allDimensionsFilled = () => {
    return Object.keys(dimensionDescriptions).every((key) => feederData.dimensions[key])
  }

  const machineInfoComplete = () => {
    return machineInfoFields.every((field) => {
      const value = feederData.machineInfo[field.id]
      return value !== undefined && value.trim() !== ""
    })
  }

  const clearCurrentPageData = () => {
    updateFeederData(feederType, {
      dimensions: {},
      machineInfo: {},
    })
  }

  const handleDimensionClick = (dimension: string) => {
    setCurrentDimension(dimension)
    setDimensionValue(feederData.dimensions[dimension] || "")
  }

  const handlePrint = () => {
    if (!machineInfoComplete()) {
      showTempError("Please fill in all machine information before printing.")
      return
    }
    if (!allDimensionsFilled()) {
      showTempError("Please fill in all dimensions before printing.")
      return
    }
    setShowError(false)
    window.print()
  }

  const handleNext = () => {
    if (!machineInfoComplete()) {
      showTempError("Please fill in all machine information before proceeding.")
      return
    }
    if (!allDimensionsFilled()) {
      showTempError("Please fill in all dimensions before proceeding.")
      return
    }
    if (nextPageRoute) {
      setCurrentFeederType(feederType)
      if (nextPageRoute.includes("/")) {
        const nextType = nextPageRoute.split("/").pop() || ""
        setNextFeederType(nextType)
      }
      router.push(nextPageRoute)
    }
  }

  const handleBack = () => {
    if (previousPageRoute) {
      router.push(previousPageRoute)
    }
  }

  const handleClearData = () => {
    clearCurrentPageData()
    showTempError("Data cleared successfully!", true)
  }

  const handleOkClick = () => {
    if (!machineInfoComplete()) {
      showTempError("Please fill in all machine information before continuing.")
      return
    }
    if (!allDimensionsFilled()) {
      showTempError("Please fill in all dimensions before continuing.")
      return
    }

    setShowSuccessModal(true)
}

  const showTempError = (message: string, isSuccess = false) => {
    setShowError(true)
    setErrorMessage(message)
    setTimeout(() => setShowError(false), isSuccess ? 3000 : 5000)
  }

  const getCurrentDate = () => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${day}/${month}/${year} at ${hours}:${minutes}`
  }

  const updateMachineInfo = (id: string, value: string) => {
    updateFeederData(feederType, {
      ...feederData,
      machineInfo: {
        ...feederData.machineInfo,
        [id]: value,
      },
    })
  }

  const updateDimension = (dimension: string, value: string) => {
    updateFeederData(feederType, {
      ...feederData,
      dimensions: {
        ...feederData.dimensions,
        [dimension]: value,
      },
    })
  }

  return (
    <>
      <NavigationMenu />
      <div className="bg-[#fdf5e6] min-h-screen w-[1050px] overflow-auto mx-auto p-4 print:p-0 light">
        <div ref={printRef} className="print-container flex flex-col h-[297mm] p-4 print:p-0 relative">
          <button
            onClick={handlePrint}
            className="absolute top-4 right-4 print:hidden bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
          >
            Save as PDF
          </button>

          <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

          {/* Machine Information */}
          <div className="border bg-[#fffafa] rounded-md p-3 mb-3">
            <h2 className="text-lg font-medium mb-2">Machine Information</h2>
            <div className="grid grid-cols-3 gap-4">
              {machineInfoFields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block mb-1 font-medium">{field.label}</label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={feederData.machineInfo[field.id] || ""}
                      onChange={(e) => updateMachineInfo(field.id, e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 ${!feederData.machineInfo[field.id] ? "border-red-500" : ""}`}
                    >
                      <option value="">Select</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={feederData.machineInfo[field.id] || ""}
                      onChange={(e) => updateMachineInfo(field.id, e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 ${!feederData.machineInfo[field.id] ? "border-red-500" : ""}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feeder Design */}
          <div className="border bg-[#fffafa] rounded-md p-4 flex-grow mb-3">
            <h2 className="text-lg font-medium mb-2">Feeder Design</h2>
            <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt="Dimension Drawing"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
              {Object.entries(dimensionPositions).map(([dim, { x, y }]) => (
                <button
                  key={dim}
                  onClick={() => handleDimensionClick(dim)}
                  className={`absolute text-xs flex items-center justify-center ${
                    feederData.dimensions[dim] ? "bg-white border-none text-black" : "bg-white border border-red-500 text-red-500"
                  }`}
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    width: "18px",
                    height: "18px",
                    fontSize: "10px",
                  }}
                >
                  {feederData.dimensions[dim] || dim}
                </button>
              ))}
            </div>

            {/* OK Button */}
            <div className="mt-4 flex justify-end space-x-2 print:hidden">
              

              <button
                    onClick={handleClearData}
                    className="bg-white border border-black text-black  px-4 py-2 rounded-md flex items-center"
                >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Data
                </button>

                <button
                onClick={handleOkClick}
                className="bg-black text-white px-4 py-2 rounded-md"
              >
                OK
              </button>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-auto">Generated on {getCurrentDate()}</div>


          {nextPageRoute && (
            <button
              onClick={handleNext}
              className="absolute bottom-4 right-4 print:hidden bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-md"
            >
              Next
            </button>
          )}

          {previousPageRoute && (
            <button
              onClick={handleBack}
              className="absolute bottom-4 left-4 print:hidden bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-md"
            >
              Back
            </button>
          )}
        </div>

        {/* Input Dialog */}
        {currentDimension && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-bold mb-4">
                Enter dimension {currentDimension}: {dimensionDescriptions[currentDimension]}
              </h3>
              <input
                type="number"
                value={dimensionValue}
                onChange={(e) => setDimensionValue(e.target.value)}
                placeholder="Enter value in mm"
                autoFocus
                className="w-full border rounded-md px-3 py-2 mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => {
                    const trimmedValue = dimensionValue.trim()
                    if (trimmedValue !== "") {
                      updateDimension(currentDimension, trimmedValue)
                    } else {
                      updateDimension(currentDimension, "")
                    }
                    setCurrentDimension(null)
                  }}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Toast */}
        {showError && (
          <div className={`fixed bottom-12 right-16 z-50 p-4 ${errorMessage.includes("cleared") ? "bg-green-50 border-green-500 text-green-600" : "bg-red-50 border-red-500 text-red-600"} rounded-md shadow-lg print:hidden max-w-xs`}>
            {errorMessage}
          </div>
        )}

{showSuccessModal && (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center print:hidden">
    <div className="relative bg-white p-6 rounded-lg w-[500px] shadow-lg text-center">
      {/* Close Button as X */}
      <button
        onClick={() => setShowSuccessModal(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-4">Congratulations! 🎊</h2>
      

      {/* Looping video */}
      <video
        src={`/hopper.mp4`}  ///${feederType}.mp4
        autoPlay
        loop
        muted
        playsInline
        className="w-full rounded-md mb-4"
      />

      {/* View 3D button only */}
      <button
        onClick={() => {
          setShowSuccessModal(false)
          setShowModelViewer(true)
        }}
        className="bg-black text-white px-6 py-2 rounded-md"
      >
        View 3D
      </button>
    </div>
  </div>
)}

        {/* Model Viewer */}
        {showModelViewer && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg w-[800px] h-[600px] relative">
              <ModelViewer
                modelPath={modelPath}
                isOpen={showModelViewer}
                onClose={() => setShowModelViewer(false)}
                onLoad={() => {}}
                dimensions={feederData.dimensions}
              />
              <button
                onClick={() => setShowModelViewer(false)}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md text-sm"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
