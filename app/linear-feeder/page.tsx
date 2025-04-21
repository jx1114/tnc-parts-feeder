import FeederConfiguration from "@/components/feeder-configuration"

// Define machine info fields for linear feeder
const machineInfoFields = [
  {
    id: "machineNo",
    label: "Machine no.",
    type: "text" as const,
    required: true,
  },
  {
    id: "linearNo",
    label: "Linear no.",
    type: "text" as const,
    required: true,
  },
]

// Define dimensions for linear feeder
const dimensions = [
  { id: "A", description: "Height", x: 48.5, y: 28 },
  { id: "B", description: "Linear track length", x: 64, y: 7 },
  { id: "C", description: "Base width", x: 36.7, y: 78 },
  { id: "D", description: "Track width", x: 65, y: 57 },
  { id: "E", description: "Total width", x: 47, y: 93.5 },
  { id: "F", description: "Actuator height", x: 82, y: 89.5 },
  
]

export default function LinearFeederPage() {
  return (
    <FeederConfiguration
      title="Linear Feeder Configuration Report"
      machineInfoFields={machineInfoFields}
      dimensions={dimensions}
      imagePath="/linear-feeder.jpeg"
      imageAlt="Linear Feeder Dimension Drawing"
    />
  )
}
