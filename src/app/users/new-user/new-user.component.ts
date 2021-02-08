import { V } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomValidatorsService } from 'src/app/_services/custom-validators.service';
import { environment } from 'src/environments/environment';
import { Profil } from '../../modeles/Profil';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  userForm: FormGroup;
  public error:any;
  profils:Profil[]=[];
  imgSource;
  private profilUrl = environment.apiUrl+'/admin/profils';
  constructor(private formBuilder: FormBuilder, private userService: UserService, private customValidatorsService: CustomValidatorsService) {}
  hide:boolean = true;
  errorAvatarMsg:string;
  isSelectedAvatar:boolean = true;
  isSelectedValidFile: boolean =true;
  ngOnInit(): void {
    this.initForm();
    // on recupere la liste des profils pour le select profil
    this.userService.get(this.profilUrl).subscribe(profils => {
      this.profils = profils;
    });
  }

  get form(){
    return this.userForm.controls;
  }

  initForm(){
    this.userForm = this.formBuilder.group({
      "nom":['', Validators.required],
      "prenom":['', Validators.required],
      "email":['', Validators.required],
      "password":['', [Validators.required, Validators.pattern(/[0-9a-zA-Z]{6,}/)]],
      "genre":['',Validators.required],
      "profil":['',Validators.required],
      "avatar":['',[Validators.required, this.customValidatorsService.requiredFileType(['jpg','jpeg'])]]
    });
  }

  onFileSelect(event){
    // this.form.avatar.validator('avatar', Validators.required);
    this.isSelectedAvatar=true;
    // const file=""
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
       if (file.type && file.type.indexOf('image') === -1) {
         this.imgSource = "";
         this.isSelectedValidFile = false;
        return;
      }
      this.userForm.get('avatar').setValue(file);
 

    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      this.imgSource = event.target.result;
    });
    reader.readAsDataURL(file);
  }
  }

  onSubmitForm(){
    const formData = new FormData();
    // on definit l'url d'envoie selon le profil sélectionné
    const userUrl = environment.apiUrl+"/admin/"+(this.userForm.get('profil').value).toLowerCase()+'s';
    const keys =["prenom", "nom", "email", "password", "genre", "avatar"];
    keys.forEach((valeur)=>{
      formData.append(valeur, this.userForm.get(valeur).value);
    })

    this.userService.add(userUrl, formData).subscribe(
      data => console.log(data),
      error => {
        console.log(error);
        this.error = error.error.detail;
        ;
      }
    );
  }
}
