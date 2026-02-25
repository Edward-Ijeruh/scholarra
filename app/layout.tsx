import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

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
      <body className="antialiased font-poppins">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
