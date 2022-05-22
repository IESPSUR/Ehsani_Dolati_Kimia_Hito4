import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserDTO } from '../DTO/UserDTO';
import { EmailService } from '../services/email.service';
import { ImageService } from '../services/image.service';
import { UserService } from '../services/user.service';
import * as bootstrap from 'bootstrap';
declare var $ :any;


@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  public contactForm: FormGroup;
  public nombreUsuario: string;
  public title: string = "Contact Us";
  public user: UserDTO;


  constructor(private _emailService: EmailService ,private _router: Router, public fb: FormBuilder, private _userService: UserService, public _imageService: ImageService) {
  }

  ngOnInit(): void {
      this.contactForm = this.fb.group({
        nombre: new FormControl('', [Validators.required]),
        correo: new FormControl('', [Validators.required, Validators.pattern(/^.+@[a-zA-Z0-9]+\.[a-zA-Z]+$/)]),
        titulo: new FormControl('', [Validators.required]),
        mensaje: new FormControl('', [Validators.required]),
      });
    }
  



  public enviar() {
    //Se envia un correo al admin
    this._emailService.createSendEmail(this.contactForm.value).subscribe(res=>{
      console.log(res);
      $('#modalEmailContact').modal('show');
    });

   setTimeout(function() {
      $('#modalEmailContact').modal('hide');
  }, 3000);
    this._router.navigate(['/posts/']);
  }


 
}
