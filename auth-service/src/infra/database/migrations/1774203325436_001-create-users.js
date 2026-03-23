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
  // 1. Criar ENUM 
  pgm.createType('role_user', ['cliente', 'entregador', 'admin']);

  // 2. Criar tabela 
  pgm.createTable('usuarios', {
    id: {
      type: 'uuid',
      primaryKey: true,
    },
    nome: {
      type: 'varchar(150)',
      notNull: true,
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true,
    },
    senha: {
      type: 'varchar(255)',
      notNull: true,
    },
    cpf: {
      type: 'char(11)',
      notNull: true,
      unique: true,
    },
    role: {
      type: 'role_user',
      notNull: true,
    },
    criado_em: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
    atualizado_em: {
      type: 'timestamptz',
      default: pgm.func('current_timestamp'),
    },
  });

  // 3. Índices
  pgm.createIndex('usuarios', 'email', {
    name: 'idx_users_email',
  });

  pgm.createIndex('usuarios', 'role', {
    name: 'idx_users_role',
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => { 
   pgm.dropIndex('usuarios', 'email', {
    name: 'idx_users_email',
  });

  pgm.dropIndex('usuarios', 'role', {
    name: 'idx_users_role',
  });

  pgm.dropTable('usuarios');

  pgm.dropType('role_user');
};
