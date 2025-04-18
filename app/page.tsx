"use client"

import { useState, useRef } from "react"
import Image from "next/image"

const dimensionDescriptions: Record<string, string> = {
  A: "", B: "", C: "", D: "", E: "", F: "", G: "", H: "",
  I: "", J: "", K: "", L: "", M: "", N: "", O: "", P: ""
}

export default function PartCustomization() {
  const [machineNo, setMachineNo] = useState("")
  const [rotation, setRotation] = useState("")
  const [uph, setUph] = useState("")
  const [dimensions, setDimensions] = useState<Record<string, string>>({})
  const [currentDimension, setCurrentDimension] = useState<string | null>(null)
  const [dimensionValue, setDimensionValue] = useState("")
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  const allDimensionsFilled = () => {
    return Object.keys(dimensionDescriptions).every((key) => dimensions[key])
  }

  const machineInfoComplete = () => {
    return machineNo.trim() !== "" && rotation.trim() !== "" && uph.trim() !== ""
  }

  const handleDimensionClick = (dimension: string) => {
    setCurrentDimension(dimension)
    setDimensionValue(dimensions[dimension] || "")
  }

  const saveDimension = () => {
    if (currentDimension && dimensionValue) {
      setDimensions({
        ...dimensions,
        [currentDimension]: dimensionValue,
      })
      setCurrentDimension(null)
      setDimensionValue("")
    }
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

  const getCurrentDate = () => {
    const now = new Date()
    const day = String(now.getDate()).padStart(2, "0")
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const year = now.getFullYear()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${day}/${month}/${year} at ${hours}:${minutes}`
  }

  const dimensionPositions: Record<string, { x: number; y: number }> = {
    A: { x: 15.7, y: 29.4 }, B: { x: 19.8, y: 42 }, C: { x: 19.1, y: 51.4 },
    D: { x: 28.6, y: 50.2 }, E: { x: 33.9, y: 52.5 }, F: { x: 19.6, y: 85.2 },
    G: { x: 41.5, y: 83.1 }, H: { x: 18.4, y: 98.7 }, I: { x: 43.2, y: 98.8 },
    J: { x: 43.5, y: 67.2 }, K: { x: 31.8, y: 55.5 }, L: { x: 59.2, y: 51.6 },
    M: { x: 29.8, y: 1.5 }, N: { x: 31.8, y: 4.3 }, O: { x: 42, y: 33.5 },
    P: { x: 45.4, y: 29 },
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

        <h1 className="text-2xl font-bold text-center mb-4">Feeder Configuration Report</h1>

        {/* Machine Info Section */}
        <div className="border rounded-md p-3 mb-3" style={{ flex: "1" }}>
          <h2 className="text-lg font-medium mb-2">Machine Information</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="machine-no" className="block mb-1 font-medium">Machine no.</label>
              <input
                id="machine-no"
                value={machineNo}
                onChange={(e) => setMachineNo(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${
                  machineNo.trim() === "" ? "border-red-500" : ""
                }`}
              />
            </div>
            <div>
              <label htmlFor="rotation" className="block mb-1 font-medium">Rotation</label>
              <select
                id="rotation"
                value={rotation}
                onChange={(e) => setRotation(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${
                  rotation.trim() === "" ? "border-red-500" : ""
                }`}
              >
                <option value="">Select</option>
                <option value="Clockwise">Clockwise</option>
                <option value="Anti-clockwise">Anti-clockwise</option>
              </select>
            </div>
            <div>
              <label htmlFor="uph" className="block mb-1 font-medium">UPH</label>
              <input
                id="uph"
                value={uph}
                onChange={(e) => setUph(e.target.value)}
                className={`w-full border rounded-md px-3 py-2 ${
                  uph.trim() === "" ? "border-red-500" : ""
                }`}
              />
            </div>
          </div>
        </div>

        {/* Feeder Design Section */}
        <div className="border rounded-md p-3 mb-3" style={{ flex: "3" }}>
          <h2 className="text-lg font-medium mb-2">Feeder Design</h2>
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src="/dimension-drawing.jpeg"
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
                  dimensions[dim]
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
                {dimensions[dim] || dim}
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
                  <span className={dimensions[dim] ? "font-bold text-black mr-1" : "font-bold text-red-500 mr-1"}>
                    {dim}
                  </span>
                  <span className="text-right text-xs text-gray-500 ml-auto truncate" style={{ fontSize: "9px" }}>
                    {dimensionDescriptions[dim]}
                  </span>
                </div>
                <div className={`${dimensions[dim] ? "text-black" : "text-red-500"} text-xs`}>
                  {dimensions[dim] ? `${dimensions[dim]} mm` : "--------"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center text-sm text-gray-500 mt-auto">Generated on {getCurrentDate()}</div>

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
                onChange={(e) => setDimensionValue(e.target.value)}
                placeholder="Enter value in mm"
                autoFocus
                className="w-full border rounded-md px-3 py-2 mb-4"
              />
              <div className="flex justify-end space-x-2">
                <button onClick={() => setCurrentDimension(null)} className="px-4 py-2 border rounded-md hover:bg-gray-100">
                  Cancel
                </button>
                <button onClick={saveDimension} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Toast */}
      {showError && (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-red-50 border-2 border-red-500 text-red-600 rounded-md shadow-lg print:hidden max-w-xs">
          {errorMessage}
        </div>
      )}
    </div>
  )
}
