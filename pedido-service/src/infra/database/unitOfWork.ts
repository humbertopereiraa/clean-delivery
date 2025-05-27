import { IUnitOfWork } from "../../domain/contratos/iUnitOfWork"
import { IConexao } from "../../domain/contratos/iConexao"
import { ITransacao } from "../../domain/contratos/iTransacao"

export class UnitOfWork implements IUnitOfWork {

  private trx?: ITransacao

  constructor(private conexao: IConexao) { }

  public async start(): Promise<void> {
    this.trx = await this.conexao.transaction()
  }

  public async commit(): Promise<void> {
    this.verificarTransacao()
    await this.trx?.commit()
    this.limparTransacao()
  }

  public async rollback(): Promise<void> {
    this.verificarTransacao()
    await this.trx?.rollback()
    this.limparTransacao()
  }

  public getConnection(): ITransacao | IConexao {
    return this.trx ?? this.conexao
  }

  private verificarTransacao(): void {
    if (!this.trx) throw new Error("Nenhuma transação ativa.")
  }

  private limparTransacao(): void {
    this.trx = undefined
  }
}
