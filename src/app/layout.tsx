import type { Metadata } from "next";
import { Inter, Urbanist } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import "./globals.css";

// Free stand-ins for the reference fonts: Urbanist ≈ Telegraf (display), Inter ≈ Haffer SQ (body).
const urbanist = Urbanist({
  variable: "--font-urbanist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Forward Deployed Engineer Program by Vishwa Mohan",
  description:
    "A live, mentor-led program that trains engineers to take AI from demo to production inside real businesses — discovery, build, deployment and ownership.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${urbanist.variable} ${inter.variable}`}>
      <body className="min-h-screen">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
