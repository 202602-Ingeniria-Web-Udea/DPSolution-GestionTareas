import type { Metadata } from "next";
import { Geist_Mono, Roboto, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const roboto = Roboto({ subsets: ["latin"], variable: "--font-sans" });

// Tipografía de títulos propia de DP Solutions: más geométrica y distintiva
// que la fuente de cuerpo, para que la marca se note en encabezados y
// elementos de énfasis sin sacrificar la legibilidad del contenido.
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestión de Tareas — DP Solutions",
  description: "Aplicación de administración de proyectos y tareas con roles ADMIN/USER.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        geistMono.variable,
        "font-sans",
        roboto.variable,
        spaceGrotesk.variable
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
