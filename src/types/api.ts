export interface UpdateLog {
  plugin: string;
  versao: string;
  data: string;
}

export interface WPMonitorResponse {
  sistema: {
    nome_site: string;
    url: string;
    wp_version: string;
    php: string;
    ip: string;
  };
  logs_recentes: UpdateLog[];
  backup: {
    ativo: boolean;
  };
}