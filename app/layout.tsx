import type React from "react"
import type { Metadata } from "next"
import NavigationBar from "@/components/navigation-bar"
import "./globals.css"

export const metadata: Metadata = {
  title: "Feeder Configuration Tool",
  description: "Machine part customization application",
}

// Define navigation items
const navItems = [
  { label: "Bowl Feeder", href: "/bowl-feeder" },
  { label: "Linear Feeder", href: "/linear-feeder" },
]

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <NavigationBar items={navItems} />
        <main className="w-full max-w-full overflow-x-hidden">{children}</main>
      </body>
    </html>
  )
}
