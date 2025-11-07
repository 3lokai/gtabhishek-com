import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gtabhishek.com"),
  title: {
    default: "GT Abhishek",
    template: "%s | GT Abhishek",
  },
  description:
    "Personal branding website for GT Abhishek - Developer, Designer, and Creative Professional",
  keywords: [
    "GT Abhishek",
    "Developer",
    "Designer",
    "Portfolio",
    "Personal Brand",
  ],
  authors: [{ name: "GT Abhishek" }],
  creator: "GT Abhishek",
  publisher: "GT Abhishek",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://gtabhishek.com",
    siteName: "GT Abhishek",
    title: "GT Abhishek",
    description:
      "Personal branding website for GT Abhishek - Developer, Designer, and Creative Professional",
    images: [
      {
        url: "/api/og?title=GT%20Abhishek&description=Developer%2C%20Designer%2C%20and%20Creative%20Professional",
        width: 1200,
        height: 630,
        alt: "GT Abhishek",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GT Abhishek",
    description:
      "Personal branding website for GT Abhishek - Developer, Designer, and Creative Professional",
    images: [
      "/api/og?title=GT%20Abhishek&description=Developer%2C%20Designer%2C%20and%20Creative%20Professional",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakartaSans.variable} ${robotoMono.variable} ${lora.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <QueryProvider>
            <ModalProvider>
              {children}
              <Toaster />
            </ModalProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
