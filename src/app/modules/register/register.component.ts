import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  @Input() login: () => void;
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.createForm();
   }

   createForm() {
     this.registerForm = this.fb.group({
       email: ['', Validators.required ],
       firstName: ['', Validators.required ],
       lastName: ['', Validators.required ],
       password: ['', Validators.required ],
       passwordConfirm: ['', Validators.required ],
     });
   }

   tryRegister(value){
    this.authService.doSignUp(value)
      .then(res => {
        this.errorMessage = "";
        this.router.navigate(['/recipes']);
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
      });
  }
}