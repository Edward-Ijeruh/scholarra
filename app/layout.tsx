import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scholarra",
  description:
    "Scholarra helps Nigerian students discover scholarships, grants, and academic opportunities in one organized place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
