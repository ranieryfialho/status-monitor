import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Footer } from "@/components/footer"; // <--- Import do Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Status Monitor",
  description: "Dashboard de monitoramento para clientes WordPress",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        suppressHydrationWarning={true}
        className={cn(inter.className, "min-h-screen flex flex-col bg-background text-foreground antialiased")}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" 
          enableSystem={false}
          disableTransitionOnChange
        >
          <main className="flex-1">
            {children}
          </main>
          
          <Footer />
          
        </ThemeProvider>
      </body>
    </html>
  );
}