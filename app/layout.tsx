"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { AbstraxionProvider } from "@burnt-labs/abstraxion";
import "@burnt-labs/abstraxion/dist/index.css";
import "@burnt-labs/ui/dist/index.css";

const inter = Inter({ subsets: ["latin"] });

// Example XION counter contract
const deployedContractAddress = "xion1x3sxr4wmug78yha27p6wpftt848x4nf6nhg2hfjvk89u2v8qr4hqyxc8ud";

export default function RootLayout({ children }: { children: React.ReactNode; }): JSX.Element {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AbstraxionProvider config={{ contracts: [deployedContractAddress] }} > {children} </AbstraxionProvider>
      </body>
    </html>
  );
}
