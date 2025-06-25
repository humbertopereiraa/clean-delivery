export interface ICache {
  obter<T>(chave: string): Promise<T | null>
  salvar<T>(chave: string, valor: T, tempoExpiracaoEmSegundos?: number): Promise<void>
  deletar(chave: string): Promise<void>
  desconectar(): Promise<void> 
}
