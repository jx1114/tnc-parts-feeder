"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useFormContext } from "@/context/FormContext"
import NavigationMenu from "./navigation-menu"

export type FeederPageProps = {
  title: string
  feederType: string
  imageSrc: string
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
  const printRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const allDimensionsFilled = () => {
    return Object.keys(dimensionDescriptions).every((key) => feederData.dimensions[key])
  }

  const machineInfoComplete = () => {
    return machineInfoFields.every((field) => {
      const value = feederData.machineInfo[field.id]
      return value !== undefined && value.trim() !== ""
    })
  }

  const handleDimensionClick = (dimension: string) => {
    setCurrentDimension(dimension)
    setDimensionValue(feederData.dimensions[dimension] || "")
  }

  const handlePrint = () => {
    if (!machineInfoComplete()) {
      setShowError(true)
      setErrorMessage("Please fill in all machine information before printing.")
      setTimeout(() => setShowError(false), 5000)
      return
    }

    if (!allDimensionsFilled()) {
      setShowError(true)
      setErrorMessage("Please fill in all dimensions before printing.")
      setTimeout(() => setShowError(false), 5000)
      return
    }

    setShowError(false)
    window.print()
  }

  const handleNext = () => {
    if (!machineInfoComplete()) {
      setShowError(true)
      setErrorMessage("Please fill in all machine information before proceeding.")
      setTimeout(() => setShowError(false), 5000)
      return
    }

    if (!allDimensionsFilled()) {
      setShowError(true)
      setErrorMessage("Please fill in all dimensions before proceeding.")
      setTimeout(() => setShowError(false), 5000)
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
      <div className="min-h-screen flex flex-col items-center p-4 print:p-0 mx-auto light">
        <div ref={printRef} className="print-container flex flex-col h-[297mm] p-4 print:p-0 relative">
          <button
            onClick={handlePrint}
            className="absolute top-4 right-4 print:hidden bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
          >
            Save as PDF
          </button>

          <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

          {/* Machine Info Section */}
          <div className="border rounded-md p-3 mb-3" style={{ flex: "1" }}>
            <h2 className="text-lg font-medium mb-2">Machine Information</h2>
            <div className="grid grid-cols-3 gap-4">
              {machineInfoFields.map((field) => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="block mb-1 font-medium">
                    {field.label}
                  </label>
                  {field.type === "select" ? (
                    <select
                      id={field.id}
                      value={feederData.machineInfo[field.id] || ""}
                      onChange={(e) => updateMachineInfo(field.id, e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 ${
                        !feederData.machineInfo[field.id] ? "border-red-500" : ""
                      }`}
                    >
                      <option value="">Select</option>
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      value={feederData.machineInfo[field.id] || ""}
                      onChange={(e) => updateMachineInfo(field.id, e.target.value)}
                      className={`w-full border rounded-md px-3 py-2 ${
                        !feederData.machineInfo[field.id] ? "border-red-500" : ""
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Feeder Design Section */}
          <div className="border rounded-md p-3 mb-3" style={{ flex: "3" }}>
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
                    feederData.dimensions[dim]
                      ? "bg-white border-none text-black"
                      : "bg-white border border-red-500 text-red-500"
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
          </div>

          {/* Dimensions Summary */}
          <div className="border rounded-md p-3" style={{ flex: "2" }}>
            <h2 className="text-lg font-medium mb-2">Dimensions Summary</h2>
            <div className="grid grid-cols-4 gap-1">
              {Object.keys(dimensionDescriptions).map((dim) => (
                <div key={dim} className="border rounded-md p-1">
                  <div className="flex items-start">
                    <span
                      className={
                        feederData.dimensions[dim] ? "font-bold text-black mr-1" : "font-bold text-red-500 mr-1"
                      }
                    >
                      {dim}
                    </span>
                    <span className="text-right text-xs text-gray-500 ml-auto truncate" style={{ fontSize: "9px" }}>
                      {dimensionDescriptions[dim]}
                    </span>
                  </div>
                  <div className={`${feederData.dimensions[dim] ? "text-black" : "text-red-500"} text-xs`}>
                    {feederData.dimensions[dim] ? `${feederData.dimensions[dim]} mm` : "--------"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-auto">Generated on {getCurrentDate()}</div>

          {/* Navigation Buttons */}
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

        {/* Input Dimension Dialog */}
        {currentDimension && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-bold mb-4">
                Enter dimension {currentDimension}: {dimensionDescriptions[currentDimension]}
              </h3>
              <input
                type="number"
                value={dimensionValue}
                onChange={(e) => {
                  const newValue = e.target.value
                  setDimensionValue(newValue)
                  updateDimension(currentDimension, newValue)
                }}
                placeholder="Enter value in mm"
                autoFocus
                className="w-full border rounded-md px-3 py-2 mb-4"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setCurrentDimension(null)}
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
          <div className="fixed bottom-12 right-16 z-50 p-4 bg-red-50 border-2 border-red-500 text-red-600 rounded-md shadow-lg print:hidden max-w-xs">
            {errorMessage}
          </div>
        )}
      </div>
    </>
  )
}
