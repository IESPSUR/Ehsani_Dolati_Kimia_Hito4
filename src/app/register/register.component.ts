import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder,FormControl,FormGroup,ValidationErrors,ValidatorFn,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { UserDTO } from '../DTO/UserDTO';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerForm: FormGroup= new FormGroup({
      nombreUsuario: new FormControl('', [Validators.required]),
      contrasenia: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      correo: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]+$/)]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      file: new FormControl()
  });
  public nombreUsuario: string;
  public title: string = "Register";
  public user: UserDTO;


  constructor(private actRout: ActivatedRoute, private _router: Router, public fb: FormBuilder, private _userService: UserService, public _imageService: ImageService) {
     this.nombreUsuario = this.actRout.snapshot.params['nombreUsuario']||"";
     if(this.nombreUsuario){
       this.title="Edit your profile";
     }
  }

  ngOnInit(): void {
    if (this.nombreUsuario) {
      this.procesarDatos();
    }
  }

  private async procesarDatos() {
    //Obtener usuario para cargarlo en el formulario
      var service = this._userService.obtenerUsuario(this.nombreUsuario);
      this.user = await lastValueFrom(service);
      this.procesarForm();
    }
  


  public crearEditar() {
    if (this.nombreUsuario) {
      this._userService.update(this.registerForm.value).subscribe(data => {
        this._imageService.imageUploadAction().subscribe();
        this._router.navigate(['/myProfile/']);
      });
    } else {
      this._userService.addUser(this.registerForm.value).subscribe(data => {
        sessionStorage.setItem("nombreUsuario", data.nombreUsuario);
        sessionStorage.setItem("tipo", "usuario");

        this._imageService.imageUploadAction().subscribe();
        this._router.navigate(['/posts/']);
      });
    }
  }


  public procesarForm() {
    this.registerForm = this.fb.group({
      nombreUsuario: new FormControl(this.user.nombreUsuario, [Validators.required]),
      contrasenia: new FormControl(this.user.contrasenia, [Validators.required]),
      dni: new FormControl(this.user.dni, [Validators.required,Validators.pattern(/^[0-9]{7}/)]),
      nombre: new FormControl(this.user.nombre, [Validators.required]),
      apellido: new FormControl(this.user.apellido, [Validators.required]),
      correo: new FormControl(this.user.correo, [Validators.required, Validators.pattern(/^.+@[a-zA-Z0-9]+\.[a-zA-Z]+$/)]),
      fechaNacimiento: new FormControl(this.user.fechaNacimiento, [Validators.required]),
      file: new FormControl(this.user.foto)

    });
  }

  


}
