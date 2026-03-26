import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-title",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Acción Alvarado | Agrupación Política Vecinal",
  description: "Plataforma institucional de Acción Alvarado. Reporta problemáticas urbanas y mantente informado.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="font-sans min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
        <div className="fixed top-0 left-0 w-full h-1 z-[100] pointer-events-none">
           <div id="scroll-progress" className="h-full bg-primary-500 w-0 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
        </div>
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <script dangerouslySetInnerHTML={{ __html: `
          window.onscroll = function() {
            var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            var scrolled = (winScroll / height) * 100;
            var bar = document.getElementById("scroll-progress");
            if (bar) bar.style.width = scrolled + "%";
          };
        `}} />
      </body>
    </html>
  );
}
