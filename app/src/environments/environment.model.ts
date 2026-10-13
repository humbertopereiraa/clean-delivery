export interface Environment {
  production: boolean;

  apiAuthUrl: string;
  apiPedidoUrl: string;
  apiTimeout: number;

  appName: string;
  version: string;
}