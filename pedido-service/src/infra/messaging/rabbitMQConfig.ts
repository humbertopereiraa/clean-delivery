import { Configuracao } from "../../main/configuracao"
import { NRabbitMQAdapter } from "./rabbitMQAdapter"

export default function obterRabbitMQConfiguracao(): NRabbitMQAdapter.IConfiguracao {
  const  { mensageria: { rabbitmq } } = Configuracao
  return {
    url: rabbitmq.url,
    exchangeName: rabbitmq.exchangeName,
    exchangeType: rabbitmq.exchangeType,
    queue: rabbitmq.queue,
    routingKeys: rabbitmq.routingKeys,
  }
}