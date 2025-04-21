import FeederConfiguration from "@/components/feeder-configuration"

// Define machine info fields for bowl feeder
const machineInfoFields = [
  {
    id: "machineNo",
    label: "Machine no.",
    type: "text" as const,
    required: true,
  },
  {
    id: "rotation",
    label: "Rotation",
    type: "select" as const,
    options: ["Clockwise", "Anti-clockwise"],
    required: true,
  },
  {
    id: "uph",
    label: "UPH",
    type: "number" as const,
    required: true,
  },
]

// Define dimensions for bowl feeder
const dimensions = [
  { id: "A", description: "Height", x: 15.7, y: 29.4 },
  { id: "B", description: "Linear track length", x: 19.8, y: 42 },
  { id: "C", description: "Base height", x: 19.1, y: 51.4 },
  { id: "D", description: "Track width", x: 28.6, y: 50.2 },
  { id: "E", description: "Base width", x: 33.9, y: 52.5 },
  { id: "F", description: "Actuator height", x: 19.6, y: 85.2 },
  { id: "G", description: "Total height", x: 41.5, y: 83.1 },
  { id: "H", description: "Floor clearance", x: 18.4, y: 98.7 },
  { id: "I", description: "Base depth", x: 43.2, y: 98.8 },
  { id: "J", description: "Hopper height", x: 43.5, y: 67.2 },
  { id: "K", description: "Hopper width", x: 31.8, y: 55.5 },
  { id: "L", description: "Total width", x: 59.2, y: 51.6 },
  { id: "M", description: "Top width", x: 29.8, y: 1.5 },
  { id: "N", description: "Inner width", x: 31.8, y: 4.3 },
  { id: "O", description: "Bowl height", x: 42, y: 33.5 },
  { id: "P", description: "Total height with bowl", x: 45.4, y: 29 },
]

export default function BowlFeederPage() {
  return (
    <FeederConfiguration
      title="Bowl Feeder Configuration Report"
      machineInfoFields={machineInfoFields}
      dimensions={dimensions}
      imagePath="/dimension-drawing.jpeg"
      imageAlt="Bowl Feeder Dimension Drawing"
    />
  )
}
