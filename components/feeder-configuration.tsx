"use client"

import { useState, useRef } from "react"
import Image from "next/image"

// Define types for the component props
export interface MachineInfoField {
  id: string
  label: string
  type: "text" | "select" | "number"
  options?: string[] // For select fields
  required?: boolean
}

export interface DimensionPosition {
  id: string
  description: string
  x: number
  y: number
}

export interface FeederConfigurationProps {
  title: string
  machineInfoFields: MachineInfoField[]
  dimensions: DimensionPosition[]
  imagePath: string
  imageAlt: string
}

export default function FeederConfiguration({
  title,
  machineInfoFields,
  dimensions,
  imagePath,
  imageAlt,
}: FeederConfigurationProps) {
  // State for machine info fields
  const [machineInfo, setMachineInfo] = useState<Record<string, string>>({})

  // State for dimensions
  const [dimensionValues, setDimensionValues] = useState<Record<string, string>>({})
  const [currentDimension, setCurrentDimension] = useState<string | null>(null)
  const [dimensionValue, setDimensionValue] = useState("")

  // Error handling
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const printRef = useRef<HTMLDivElement>(null)

  // Create a map of dimension descriptions for easy access
  const dimensionDescriptions = dimensions.reduce(
    (acc, dim) => {
      acc[dim.id] = dim.description
      return acc
    },
    {} as Record<string, string>,
  )

  // Check if all dimensions are filled
  const allDimensionsFilled = () => {
    return dimensions.every((dim) => dimensionValues[dim.id])
  }

  // Fix the machineInfoComplete function to properly check required fields
  const machineInfoComplete = () => {
    return machineInfoFields
      .filter((field) => field.required !== false)
      .every((field) => {
        const value = machineInfo[field.id]
        return value !== undefined && value.trim() !== ""
      })
  }

  // Handle dimension button click
  const handleDimensionClick = (dimension: string) => {
    setCurrentDimension(dimension)
    setDimensionValue(dimensionValues[dimension] || "")
  }

  // Handle machine info field change
  const handleMachineInfoChange = (id: string, value: string) => {
    setMachineInfo((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  // Handle print/save as PDF
  const handlePrint = () => {
    if (!machineInfoComplete()) {
      setShowError(true)
      setErrorMessage("Please fill in all required machine information before printing.")
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

  // Format current date as DD/MM/YYYY
  const getCurrentDate = () => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")

    return `${day}/${month}/${year} at ${hours}:${minutes}`
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 print:p-0 mx-auto light">
      <div ref={printRef} className="print-container flex flex-col h-[297mm] p-4 print:p-0 relative">
        <button
          onClick={handlePrint}
          className="absolute top-4 right-4 print:hidden bg-black hover:bg-gray-800 text-white px-3 py-1 rounded-md text-sm"
        >
          Save as PDF
        </button>

        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

        {/* Machine Information */}
        <div className="border rounded-md p-3 mb-3" style={{ flex: "1" }}>
          <h2 className="text-lg font-medium mb-2">Machine Information</h2>
          <div className="grid grid-cols-4 gap-4">
            {machineInfoFields.map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block mb-1 font-medium">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={machineInfo[field.id] || ""}
                    onChange={(e) => handleMachineInfoChange(field.id, e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 ${
                      field.required !== false && !machineInfo[field.id] ? "border-red-500" : ""
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
                    value={machineInfo[field.id] || ""}
                    onChange={(e) => handleMachineInfoChange(field.id, e.target.value)}
                    className={`w-full border rounded-md px-3 py-2 ${
                      field.required !== false && !machineInfo[field.id] ? "border-red-500" : ""
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Feeder Design */}
        <div className="border rounded-md p-3 mb-3" style={{ flex: "3" }}>
          <h2 className="text-lg font-medium mb-2">Feeder Design</h2>
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src={imagePath || "/placeholder.svg"}
              alt={imageAlt}
              fill
              style={{ objectFit: "contain" }}
              priority
            />

            {/* Dimension Buttons */}
            {dimensions.map((dim) => (
              <button
                key={dim.id}
                onClick={() => handleDimensionClick(dim.id)}
                className={`absolute text-xs flex items-center justify-center ${
                  dimensionValues[dim.id]
                    ? "bg-white border-none text-black"
                    : "bg-white border border-red-500 text-red-500"
                }`}
                style={{
                  left: `${dim.x}%`,
                  top: `${dim.y}%`,
                  transform: "translate(-50%, -50%)",
                  width: "18px",
                  height: "18px",
                  fontSize: "10px",
                }}
              >
                {dimensionValues[dim.id] || dim.id}
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions Summary */}
        <div className="border rounded-md p-3" style={{ flex: "2" }}>
          <h2 className="text-lg font-medium mb-2">Dimensions Summary</h2>
          <div className="grid grid-cols-4 gap-1">
            {dimensions.map((dim) => (
              <div key={dim.id} className="border rounded-md p-1">
                <div className="flex items-start">
                  <span
                    className={dimensionValues[dim.id] ? "font-bold text-black mr-1" : "font-bold text-red-500 mr-1"}
                  >
                    {dim.id}
                  </span>
                  <span className="text-right text-xs text-gray-500 ml-auto truncate" style={{ fontSize: "9px" }}>
                    {dim.description}
                  </span>
                </div>
                <div className={`${dimensionValues[dim.id] ? "text-black" : "text-red-500"} text-xs`}>
                  {dimensionValues[dim.id] ? `${dimensionValues[dim.id]} mm` : "Not set"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-auto">Generated on {getCurrentDate()}</div>

        {/* Dimension Input Dialog */}
        {currentDimension && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden"
            onClick={(e) => {
              // Close the dialog when clicking the overlay (not the dialog itself)
              if (e.target === e.currentTarget) {
                setCurrentDimension(null)
              }
            }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-80" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-bold mb-4">
                Enter dimension {currentDimension}: {dimensionDescriptions[currentDimension]}
              </h3>
              <input
                type="number"
                value={dimensionValue}
                onChange={(e) => {
                  const newValue = e.target.value
                  setDimensionValue(newValue)
                  setDimensionValues((prev) => ({
                    ...prev,
                    [currentDimension]: newValue,
                  }))
                }}
                placeholder="Enter value in mm"
                autoFocus
                className="w-full border rounded-md px-3 py-2 mb-4"
              />
              
            </div>
          </div>
        )}
      </div>

      {/* Error Toast */}
      {showError && (
        <div className="fixed bottom-12 right-16 z-50 p-4 bg-red-50 border-2 border-red-500 text-red-600 rounded-md shadow-lg print:hidden max-w-xs">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
