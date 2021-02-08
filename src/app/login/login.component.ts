import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup} from '@angular/forms';

import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  loginForm: FormGroup;
  public data:any;
  helper = new JwtHelperService();
  errorMsg: string;
  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    })
  }

  get form(){
    return this.loginForm.controls;
  }
 
  onSubmitForm(){
    const formValue = this.loginForm.value;
    if(this.loginForm.invalid){
      return;
    }
    this.authService.getConnection(formValue["email"], formValue["password"])
    .subscribe(data =>{ 
      // on verifie si le user est archivé ou pas grace à ses infos
      this.authService.getUserInfos().subscribe(
        user => {
          // si l'user existe
          if(user){
            const role = (user.roles)[0];
            if(role == 'ROLE_ADMIN'){
              this.router.navigate(['default']);
            }
          }
          else
          {
          // on supprime le token
          localStorage.removeItem('currentUser');
          // on envoie le msg d'erreur
          this.errorMsg = "Votre connexion a été bloquée. Veuillez contactez l'administrateur";
          }
        },
        error => {
          this.errorMsg = "Erreur temporaire du serveur. Veuillez reéssayer plud tard";
        }
      )
    },error => {
      this.errorMsg = "Login ou mot de passe incorrecte";
    });
  }
}
