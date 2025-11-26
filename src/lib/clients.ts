export interface ClientConfig {
  slug: string;       // O ID que vai na URL (ex: /dashboard/dra-alice)
  name: string;       // Nome exibido na tela
  accessCode: string; // A senha que o cliente digita no login
  apiUrl: string;     // A URL base do WordPress
  apiToken: string;   // O token definido dentro do Plugin PHP
}

// SIMULAÇÃO DE BANCO DE DADOS
// Aqui você adicionará manualmente seus clientes
export const CLIENTS: ClientConfig[] = [
  {
    slug: 'dra-alice',
    name: 'Dra. Alice Cunha',
    accessCode: 'alice123', // Senha para teste
    apiUrl: 'https://dralaicecunha.com.br',
    apiToken: 'minha_chave_super_secreta_123' // Deve bater com o plugin PHP
  },
  // Você pode adicionar mais clientes aqui depois
];

export function getClientByCode(code: string) {
  return CLIENTS.find(client => client.accessCode === code);
}