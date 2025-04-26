export interface IEncrypter {
  encryptPassword(password: string): string
  comparePassword(password: string, encryptedPassword: string): Promise<boolean>
}