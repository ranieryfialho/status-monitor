export interface UpdateLog {
  plugin: string;
  versao: string;
  data: string;
}

export interface InstalledPlugin {
  nome: string;
  versao: string;
  autor: string;
}

export interface BackupItem {
  data: string;
  tamanho: string;
  tipo: string;
  link?: string; // Opcional, pois pode não ter link
}

export interface WPMonitorResponse {
  sistema: {
    nome_site: string;
    url: string;
    wp_version: string;
    php: string;
    ip: string;
    tema?: {
      nome: string;
      versao: string;
    };
  };
  plugins_instalados?: InstalledPlugin[];
  logs_recentes: UpdateLog[];
  backup: {
    ativo: boolean;
    historico?: BackupItem[];
  };
}