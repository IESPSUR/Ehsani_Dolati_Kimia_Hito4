export class UserDTO{
    constructor(
    public nombreUsuario: string,
    public contrasenia: string,
    public dni: string,
    public nombre: string,
    public apellido: string,
    public correo: string,
    public fechaNacimiento: string,
    public foto: string,
    public tipo: string,
    public deleted: number) {
  }
}