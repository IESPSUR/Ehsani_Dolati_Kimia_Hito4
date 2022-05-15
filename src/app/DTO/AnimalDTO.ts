export class AnimalDTO{
    constructor(
    public dni: string,
    public fechaNacimiento: string,
    public nombre: string,
    public raza: string,
    public sexo: string,
    public ubicacion: string,
    public publicaciones_id:number) {

  }
}