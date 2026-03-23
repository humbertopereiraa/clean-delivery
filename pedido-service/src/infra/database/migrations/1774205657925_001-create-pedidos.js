/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  // 1. ENUM: status_pedido
  pgm.createType('status_pedido', [
    'preparando',
    'pronto',
    'em_entrega',
    'entregue',
  ]);

  // 2. Tabela: pedidos
  pgm.createTable('pedidos', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    cliente_id: {
      type: 'uuid',
      notNull: true,
    },
    status: {
      type: 'status_pedido',
      notNull: true,
    },
    valor_entrega: {
      type: 'numeric',
      notNull: true,
    },
    criado_em: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    atualizado_em: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
  });

  // 3. Tabela: itens_pedido
  pgm.createTable('itens_pedido', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    pedido_id: {
      type: 'uuid',
      notNull: true,
      references: 'pedidos',
      onDelete: 'cascade',
    },
    nome: {
      type: 'text',
      notNull: true,
    },
    quantidade: {
      type: 'integer',
      notNull: true,
      check: 'quantidade > 0',
    },
    preco: {
      type: 'numeric',
      notNull: true,
      check: 'preco >= 0',
    },
  });

  // 4. Tabela: enderecos_entrega
  pgm.createTable('enderecos_entrega', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    pedido_id: {
      type: 'uuid',
      notNull: true,
      references: 'pedidos',
      onDelete: 'cascade',
    },
    rua: { type: 'text', notNull: true },
    numero: { type: 'text', notNull: true },
    bairro: { type: 'text', notNull: true },
    cidade: { type: 'text', notNull: true },
    estado: { type: 'text', notNull: true },
    cep: { type: 'text', notNull: true },
    complemento: { type: 'text' },
    nome_destinatario: { type: 'text', notNull: true },
    telefone_destinatario: { type: 'text', notNull: true },
  });

  // 5. ENUM: status_entrega
  pgm.createType('status_entrega', [
    'aceita',
    'em_transito',
    'entregue',
  ]);

  // 6. Tabela: entregas
  pgm.createTable('entregas', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    pedido_id: {
      type: 'uuid',
      notNull: true,
      unique: true,
      references: 'pedidos',
      onDelete: 'cascade',
    },
    entregador_id: {
      type: 'uuid',
      notNull: true,
    },
    status: {
      type: 'status_entrega',
      notNull: true,
    },
    aceita_em: {
      type: 'timestamptz',
      default: pgm.func('now()'),
    },
    entregue_em: {
      type: 'timestamptz',
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('entregas');
  pgm.dropType('status_entrega');

  pgm.dropTable('enderecos_entrega');
  pgm.dropTable('itens_pedido');
  pgm.dropTable('pedidos');

  pgm.dropType('status_pedido');
};
