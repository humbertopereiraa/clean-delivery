import { DeletarUsuario } from "../../src/aplication/usecases/deletarUsuario"
import Usuario from "../../src/domain/entities/usuario"
import { IUsuarioRepository } from "../../src/domain/repositories/iUsuarioRepository"

describe('DeletarUsuario UseCase', () => {
  let deletarUsuario: DeletarUsuario
  let usuarioRepository: jest.Mocked<IUsuarioRepository>

  beforeEach(() => {
    usuarioRepository = {
      buscarPorId: jest.fn(),
      deletar: jest.fn(),
    } as any

    deletarUsuario = new DeletarUsuario(usuarioRepository)
  })

  it('Deve deletar o usuário se ele existir: ', async () => {
    usuarioRepository.buscarPorId.mockResolvedValue({ id: '123', nome: 'Test' } as Usuario)
    usuarioRepository.deletar.mockResolvedValue()

    await expect(deletarUsuario.execute('123')).resolves.toBeUndefined()

    expect(usuarioRepository.buscarPorId).toHaveBeenCalledWith('123')
    expect(usuarioRepository.deletar).toHaveBeenCalledWith('123')
  })

  it('Deve lançar erro se o usuário não for encontrado: ', async () => {
    usuarioRepository.buscarPorId.mockResolvedValue(null as any)

    await expect(deletarUsuario.execute('123')).rejects.toThrow('Usuário não encontrado.')

    expect(usuarioRepository.buscarPorId).toHaveBeenCalledWith('123')
    expect(usuarioRepository.deletar).not.toHaveBeenCalled()
  })
})
