"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type MachineInfo = Record<string, string>
type Dimensions = Record<string, string>

type FeederData = {
  machineInfo: MachineInfo
  dimensions: Dimensions
}

type FormContextType = {
  feederData: Record<string, FeederData>
  currentFeederType: string
  nextFeederType: string
  previousFeederTypes: string[]

  getFeederData: (feederType: string) => FeederData
  updateFeederData: (feederType: string, data: FeederData) => void
  setCurrentFeederType: (feederType: string) => void
  setNextFeederType: (feederType: string) => void
  addPreviousFeederType: (feederType: string) => void
}

const defaultFeederData: FeederData = {
  machineInfo: {},
  dimensions: {},
}

const FormContext = createContext<FormContextType | undefined>(undefined)

export function FormProvider({ children }: { children: ReactNode }) {
  const [feederData, setFeederData] = useState<Record<string, FeederData>>({
    "bowl-feeder": {
      machineInfo: {
        machineNo: "",
        rotation: "",
        uph: "",
      },
      dimensions: {},
    },
    "linear-feeder": {
      machineInfo: {
        linearNo: "",
      },
      dimensions: {},
    },
   
  })

  const [currentFeederType, setCurrentFeederType] = useState("bowl-feeder")
  const [nextFeederType, setNextFeederType] = useState("")
  const [previousFeederTypes, setPreviousFeederTypes] = useState<string[]>([])

  const getFeederData = (feederType: string): FeederData => {
    return feederData[feederType] || { ...defaultFeederData }
  }

  const updateFeederData = (feederType: string, data: FeederData) => {
    setFeederData((prev) => ({
      ...prev,
      [feederType]: data,
    }))
  }

  const addPreviousFeederType = (feederType: string) => {
    setPreviousFeederTypes((prev) => [...prev, feederType])
  }

  return (
    <FormContext.Provider
      value={{
        feederData,
        currentFeederType,
        nextFeederType,
        previousFeederTypes,
        getFeederData,
        updateFeederData,
        setCurrentFeederType,
        setNextFeederType,
        addPreviousFeederType,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useFormContext() {
  const context = useContext(FormContext)
  if (context === undefined) {
    throw new Error("useFormContext must be used within a FormProvider")
  }
  return context
}
