import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Balatro",
  description: "Copia de Balatro",
  icons: {
    icon: "https://cdn2.steamgriddb.com/icon/6c3ee6dcff80d34567671bce66bc911e/32/256x256.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main lang="es" className={`${geistSans.variable} ${geistMono.variable} w-dvw h-dvh antialiased bgImg1`}>
        {children}
    </main>
  );
}
