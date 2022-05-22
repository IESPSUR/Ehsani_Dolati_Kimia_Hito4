export class ChatDTO{
    constructor(
    public usuarioOrigen: string,
    public usuarioDestinatario: string,
    public mensaje: string,
    public fecha?:string

) {

  }
}