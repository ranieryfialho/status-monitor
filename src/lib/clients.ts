export interface SiteConfig {
  id: string;         // Identificador único do site (usado na URL)
  name: string;       // Nome do site (ex: Padaria do João)
  url: string;        // URL do WordPress
  apiToken: string;   // Token do plugin deste site específico
}

// Define a estrutura do CLIENTE (O Gestor/Dono da conta)
export interface ClientUser {
  slug: string;       // Login do gestor (ex: gestor-pedro)
  name: string;       // Nome do gestor
  accessCode: string; // Senha de acesso
  sites: SiteConfig[]; // Lista de sites que ele gerencia
}

// BANCO DE DADOS SIMULADO ATUALIZADO
export const CLIENTS: ClientUser[] = [
  {
    slug: 'dra-alice',
    name: 'Dra. Alice Cunha',
    accessCode: 'alice123',
    sites: [
      {
        id: 'site-principal',
        name: 'Clínica Dra. Alice',
        url: 'https://dralaicecunha.com.br',
        apiToken: 'minha_chave_super_secreta_123'
      }
    ]
  },
  {
    slug: 'agencia-foco',
    name: 'Agência Foco (Gestor Pedro)',
    accessCode: 'pedro123',
    sites: [
      {
        id: 'padaria-central',
        name: 'Padaria Central',
        url: 'https://padariacentral.com.br',
        apiToken: 'token_padaria_123'
      },
      {
        id: 'loja-tenis',
        name: 'Sport Shoes',
        url: 'https://lojasportshoes.com.br',
        apiToken: 'token_loja_123'
      }
    ]
  }
];

export function getClientByCode(code: string) {
  return CLIENTS.find(client => client.accessCode === code);
}

export function getClientBySlug(slug: string) {
  return CLIENTS.find(client => client.slug === slug);
}