"use client"

import { useRouter } from "next/navigation"
import NavigationMenu from "@/components/navigation-menu"
import Image from "next/image"

export default function WelcomePage() {
  const router = useRouter()

  return (
    <>
      <NavigationMenu />
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="max-w-4xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to TNC Feeder Configuration Tool</h1>

            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1">
                <Image
                  src="/set-c.jpeg"
                  alt="Feeder Configuration"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover w-full h-auto"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-gray-700 mb-4">
                  This tool helps you configure and document various feeder types for your manufacturing process.
                </p>
                <p className="text-gray-700 mb-4">
                  Use the navigation menu above to select either a single feeder type or a predefined set of feeders.
                </p>
                <p className="text-gray-700 mb-6">
                  Once configured, you can save the specifications as a PDF for documentation and manufacturing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Single Feeders</h2>
                <p className="text-gray-600 mb-4">Configure individual feeder types:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/single/bowl")}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-50 rounded border transition-colors"
                  >
                    Bowl Feeder
                  </button>
                  <button
                    onClick={() => router.push("/single/linear")}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-50 rounded border transition-colors"
                  >
                    Linear Feeder
                  </button>
                  <button
                    onClick={() => router.push("/single/hopper")}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-50 rounded border transition-colors"
                  >
                    Hopper
                  </button>
                </div>
              </div>
              <div className="bg-gray-100 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-2">Feeder Sets</h2>
                <p className="text-gray-600 mb-4">Configure predefined combinations of feeders:</p>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/set/set-a")}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-50 rounded border transition-colors"
                  >
                    Set A (Bowl + Linear)
                  </button>
                  <button
                    onClick={() => router.push("/set/set-b")}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-50 rounded border transition-colors"
                  >
                    Set B (Bowl + Hopper)
                  </button>
                  <button
                    onClick={() => router.push("/set/set-c")}
                    className="block w-full text-left px-4 py-2 bg-white hover:bg-gray-50 rounded border transition-colors"
                  >
                    Set C (Bowl + Linear + Hopper)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
