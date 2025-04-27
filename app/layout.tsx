

export const metadata = {
  title: "Keetlo - Smart Editor",
  description: "A powerful and beautiful text editor built with TipTap and Tailwind.",
  generator: "Keetlo @ Sornnacha Buranapongwattana",
  icons: {
    icon: "/icon.png", 
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
