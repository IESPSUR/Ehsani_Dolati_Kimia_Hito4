import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { LoginDTO } from '../DTO/LoginDTO';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public user:LoginDTO;
  public loginForm:FormGroup;
  public title:string = "Login";
  public loginFallo:boolean=false;

  constructor(private _router: Router,private _userService: UserService,public fb:FormBuilder) {
  }

  ngOnInit(): void {
    this.loginForm=this.fb.group({
      nombreUsuario: new FormControl('', [Validators.required]),
      contrasenia: new FormControl('', [Validators.required]),

    });
  }

 
  private obtenerUsuario(user : LoginDTO) {
    this._userService.obtenerParaLogin(user).subscribe(data => {
      if(data!=null){
         this.user = new LoginDTO(data.nombreUsuario ,data.contrasenia,data.tipo);
         sessionStorage.setItem("nombreUsuario",this.user.nombreUsuario);
         sessionStorage.setItem("tipo",this.user.tipo);
         this._router.navigate(['/posts/']);
         return this.user;
      }else{
        this.loginFallo=true; 
        return this.user;
      }
    })
   

  }

  public entrar() {
    this.obtenerUsuario(new LoginDTO(this.loginForm.value.nombreUsuario ,this.loginForm.value.contrasenia, "" ));
  }

}
