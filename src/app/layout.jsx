import { cn } from "@/lib/utils";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata = {
  title: "GoQuant",
  description: "Market seasonality explorer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={cn("antialiased h-dvh w-dvw bg-accent md:p-4", geist.className)}
      >
        {children}
      </body>
    </html>
  );
}
