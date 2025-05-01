import { JwtTokenAdapter } from '../../src/infra/token/jwtTokenAdapter'

describe('JwtTokenAdapter - integração real', () => {
  const chavePrivada = 'chave-super-secreta'

  it('Deve gerar um token JWT válido: ', async () => {
    const sut = new JwtTokenAdapter()
    const token = await sut.gerar({ userId: '123' }, chavePrivada)

    expect(typeof token).toBe('string')
    expect(token.split('.').length).toBe(3)
  })

  it('Deve verificar um token válido: ', async () => {
    const sut = new JwtTokenAdapter()
    const token = await sut.gerar({ userId: '123' }, chavePrivada)
    const result = await sut.verificar(token, chavePrivada)

    expect(result).toBe(true)
  })

  it('Deve verificar um token com "Bearer" e espaços: ', async () => {
    const sut = new JwtTokenAdapter()
    const token = await sut.gerar({ userId: '123' }, chavePrivada)
    const tokenComBearer = `Bearer   ${token}  `
    const result = await sut.verificar(tokenComBearer, chavePrivada)

    expect(result).toBe(true)
  })

  it('Deve retornar false ao verificar com chave incorreta: ', async () => {
    const sut = new JwtTokenAdapter()
    const token = await sut.gerar({ userId: '123' }, chavePrivada)
    const result = await sut.verificar(token, 'chave-incorreta')

    expect(result).toBe(false)
  })

  it('Deve gerar um token com expiração e ser válido antes de expirar: ', async () => {
    const sut = new JwtTokenAdapter()
    const token = await sut.gerar({ userId: '123' }, chavePrivada, { expiresIn: '1s' })

    const result = await sut.verificar(token, chavePrivada)
    expect(result).toBe(true)
  })

  it('Deve retornar false para token expirado: ', async () => {
    const sut = new JwtTokenAdapter()
    const token = await sut.gerar({ userId: '123' }, chavePrivada, { expiresIn: '1ms' })

    // Espera o token expirar
    await new Promise((res) => setTimeout(res, 10))

    const result = await sut.verificar(token, chavePrivada)
    expect(result).toBe(false)
  })

  it('Deve retornar false para token malformado: ', async () => {
    const sut = new JwtTokenAdapter()
    const result = await sut.verificar('Bearer isso-nao-é-um-token', chavePrivada)
    expect(result).toBe(false)
  })

  it('Deve gerar e verificar token com payload complexo: ', async () => {
    const sut = new JwtTokenAdapter()
    const payload = {
      id: 1,
      dados: { nome: 'João', permissoes: ['admin', 'user'] }
    }

    const token = await sut.gerar(payload, chavePrivada)
    const result = await sut.verificar(token, chavePrivada)

    expect(result).toBe(true)
  })
})