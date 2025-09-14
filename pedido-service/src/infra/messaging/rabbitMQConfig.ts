import { Configuracao } from "../../main/configuracao"

export interface IRabbitMQConfiguracao {
  url: string
  exchangeName: string
  exchangeType: string,
  queue: string
  routingKeys: string
}

export default function obterRabbitMQConfiguracao(): IRabbitMQConfiguracao {
  const { mensageria: { rabbitmq } } = Configuracao
  return {
    url: rabbitmq.url,
    exchangeName: rabbitmq.exchangeName,
    exchangeType: rabbitmq.exchangeType,
    queue: rabbitmq.queue,
    routingKeys: rabbitmq.routingKeys,
  }
}