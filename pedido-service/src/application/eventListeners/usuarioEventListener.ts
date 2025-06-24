import { ILogger } from "../../domain/contratos/iLogger";
import { IMensageria } from "../../domain/event/iMensageria"
import { IEvento } from "../../domain/event/iPayload";

export default class UsuarioEventListener {
  constructor(private mensageria: IMensageria, private readonly logger: ILogger) { }

  public async iniciar(): Promise<void> {
    await this.mensageria.conectar()
    this.mensageria.escutarEventos().subscribe({
      next: (evento: IEvento) => {
        console.log(evento)
        //TODO: Chamar repositório Redis para inserir/atualizar/deletar usuário
      },
      error: (erro: any) => {
        this.logger.error('Erro ao escutar eventos de Mensageria', erro)
      },
    })
  }
}
