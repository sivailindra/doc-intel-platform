import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocIntel Platform — AI Document Intelligence for Enterprises",
  description: "Automate data extraction, validation & review from unstructured documents with 99% accuracy. Process 10× faster with DocIntel's AI-powered document intelligence platform.",
  keywords: ["document AI", "data extraction", "OCR", "document intelligence", "IDP", "AI document processing"],
  authors: [{ name: "DocIntel" }],
  openGraph: {
    title: "DocIntel Platform — AI Document Intelligence",
    description: "Automate data extraction from any document with 99% accuracy and 10× speed.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocIntel Platform — AI Document Intelligence",
    description: "Automate data extraction from any document with 99% accuracy and 10× speed.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
