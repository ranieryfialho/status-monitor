
export function Footer() {
  return (
    <footer className="w-full py-6 mt-auto border-t border-border/10 bg-background/50 backdrop-blur-sm">
      <div className="container flex items-center justify-center gap-1 text-sm text-muted-foreground">
        <span>Desenvolvido por</span>
        
        <a 
          href="https://rafiweb.com.br/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 hover:underline underline-offset-4"
        >
          Raniery Fialho
        </a>
      </div>
    </footer>
  )
}