export class PostDTO{
    constructor(
    public id: number,
    public cabecera: string,
    public contenido: string,
    public foto: string,
    public nombreUsuario: string,
    public tipo: string) {

  }
}