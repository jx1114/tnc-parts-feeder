"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define dimension descriptions
const dimensionDescriptions: Record<string, string> = {
  A: "Height",
  B: "Linear track length",
  C: "Base height",
  D: "Track width",
  E: "Base width",
  F: "Actuator height",
  G: "Total height",
  H: "Floor clearance",
  I: "Base depth",
  J: "Hopper height",
  K: "Hopper width",
  L: "Total width",
  M: "Top width",
  N: "Inner width",
  O: "Bowl height",
  P: "Total height with bowl",
}

export default function PartCustomization() {
  const [machineNo, setMachineNo] = useState("")
  const [rotation, setRotation] = useState("Clockwise")
  const [uph, setUph] = useState("")
  const [dimensions, setDimensions] = useState<Record<string, string>>({})
  const [currentDimension, setCurrentDimension] = useState<string | null>(null)
  const [dimensionValue, setDimensionValue] = useState("")
  const [showError, setShowError] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // Check if all dimensions are filled
  const allDimensionsFilled = () => {
    return Object.keys(dimensionDescriptions).every((key) => dimensions[key])
  }

  // Handle dimension button click
  const handleDimensionClick = (dimension: string) => {
    setCurrentDimension(dimension)
    setDimensionValue(dimensions[dimension] || "")
  }

  // Save dimension value
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

  // Handle print/save as PDF
  const handlePrint = () => {
    if (!allDimensionsFilled()) {
      setShowError(true)
      toast({
        title: "Error",
        description: "Please fill in all dimensions before printing.",
        variant: "destructive",
      })
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

  // Define dimension button positions as percentages of the image
  const dimensionPositions: Record<string, { x: number; y: number }> = {
    A: { x: 14.4, y: 40.7 },
    B: { x: 14.4, y: 45.4 },
    C: { x: 11.1, y: 48.9 },
    D: { x: 39.8, y: 50.7 },
    E: { x: 53.8, y: 50.7 },
    F: { x: 11.1, y: 60.7 },
    G: { x: 66.9, y: 60.7 },
    H: { x: 11.1, y: 67.3 },
    I: { x: 66.9, y: 67.3 },
    J: { x: 66.9, y: 55.9 },
    K: { x: 46.1, y: 51.6 },
    L: { x: 93.1, y: 49.8 },
    M: { x: 46.1, y: 29.8 },
    N: { x: 46.1, y: 31.8 },
    O: { x: 72.4, y: 42.5 },
    P: { x: 72.4, y: 40.1 },
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 print:p-0 mx-auto light">
      <Toaster />

      {/* A4 Container */}
      <div ref={printRef} className="print-container flex flex-col h-[297mm] p-4 print:p-0 relative">
        {/* Save as PDF Button - Top Right Corner */}
        <Button
          onClick={handlePrint}
          className="absolute top-4 right-4 print:hidden bg-black hover:bg-gray-800 text-white"
        >
          Save as PDF
        </Button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-center mb-4">Feeder Configuration Report</h1>

        {/* Machine Information - 1/6 of the page */}
        <div className="border rounded-md p-3 mb-3" style={{ flex: "1" }}>
          <h2 className="text-lg font-medium mb-2">Machine Information</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="machine-no" className="block mb-1 font-medium">
                Machine no.
              </label>
              <Input
                id="machine-no"
                value={machineNo}
                onChange={(e) => setMachineNo(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="rotation" className="block mb-1 font-medium">
                Rotation
              </label>
              <Select value={rotation} onValueChange={setRotation}>
                <SelectTrigger id="rotation" className="w-full">
                  <SelectValue placeholder="Select rotation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Clockwise">Clockwise</SelectItem>
                  <SelectItem value="Anti-clockwise">Anti-clockwise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="uph" className="block mb-1 font-medium">
                UPH
              </label>
              <Input id="uph" value={uph} onChange={(e) => setUph(e.target.value)} className="w-full" />
            </div>
          </div>
        </div>

        {/* Feeder Design - 3/6 of the page */}
        <div className="border rounded-md p-3 mb-3" style={{ flex: "3" }}>
          <h2 className="text-lg font-medium mb-2">Feeder Design</h2>
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src="/dimension-drawing.jpg"
              alt="Dimension Drawing"
              fill
              style={{ objectFit: "contain" }}
              priority
            />

            {/* Dimension Buttons - positioned relative to the image */}
            {Object.entries(dimensionPositions).map(([dim, { x, y }]) => (
              <button
                key={dim}
                onClick={() => handleDimensionClick(dim)}
                className={`absolute text-xs flex items-center justify-center ${
                  dimensions[dim]
                    ? "bg-transparent border-none text-black"
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

        {/* Dimensions Summary - 2/6 of the page */}
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

        {/* Generated Date */}
        <div className="text-center text-sm text-gray-500 mt-auto">Generated on {getCurrentDate()}</div>

        {/* Dimension Input Dialog */}
        {currentDimension && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 print:hidden">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80">
              <h3 className="text-lg font-bold mb-4">
                Enter dimension {currentDimension}: {dimensionDescriptions[currentDimension]}
              </h3>
              <Input
                type="number"
                value={dimensionValue}
                onChange={(e) => setDimensionValue(e.target.value)}
                placeholder="Enter value in mm"
                autoFocus
                className="mb-4"
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setCurrentDimension(null)}>
                  Cancel
                </Button>
                <Button onClick={saveDimension}>Save</Button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {showError && !allDimensionsFilled() && (
          <Alert variant="destructive" className="mt-2 print:hidden">
            <AlertDescription>Please fill in all dimensions before printing.</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
