import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        
        {/* Card de Teste */}
        <div className={cn(
          "p-8 rounded-lg border border-border bg-card text-card-foreground shadow-lg",
          "transform transition-all hover:scale-105" // Testando animações básicas
        )}>
          <h1 className="text-3xl font-bold text-primary mb-4">
            Status Monitor
          </h1>
          
          <p className="text-muted-foreground mb-6">
            Se você está vendo este cartão com um fundo branco (ou escuro, se seu sistema estiver em dark mode),
            bordas arredondadas e um título azul (cor primary), sua configuração está funcionando!
          </p>

          <div className="flex gap-4">
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Botão Principal
            </button>
            
            <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
              Botão Secundário
            </button>
          </div>
          
          <div className="mt-8 p-4 bg-muted rounded text-xs">
            <p><strong>Tailwind Version Check:</strong> Verifique no inspetor do navegador se as classes estão gerando CSS.</p>
          </div>
        </div>

      </div>
    </main>
  );
}