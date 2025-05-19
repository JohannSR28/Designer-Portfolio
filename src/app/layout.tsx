// app/layout.js - Version JavaScript
import "./globals.css";

export const metadata = {
  title: "Portfolio - Paul Emmanuel Dato",
  description: "Portfolio professionnel",
  viewport: "width=device-width, initial-scale=1",
};

import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
