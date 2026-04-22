// import type React from "react"
// import "./globals.css"
// import { Inter } from "next/font/google"
// import { ThemeProvider } from "@/components/theme-provider"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "World Trip Link - Travel Booking",
//   description: "Book cabs, buses and explore top destinations",
//     generator: 'v0.dev'
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
//           {children}
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }
// import './globals.css'


import type { ReactNode } from "react";
import "./globals.css";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"] });

// ✅ SEO metadata including canonical support
export const metadata = {
  title: "World Trip Link - Travel Booking",
  description: "Book cabs, buses and explore top destinations",
  generator: "v0.dev",
  verification: {
    google: "nooTES92rJXZ6TyoRfoRQ9skQ5tGbWRAfnGPiOByhbI",
  },
  metadataBase: new URL("https://api.worldtriplink.com"),
  alternates: {
    canonical: "https://www.worldtriplink.com/cities/Cab-Service-Chandarpur",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MXV3Z6XSB4"
          strategy="afterInteractive"
        />

        <Script id="google-analytics" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-MXV3Z6XSB4');
  `}
        </Script>

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
