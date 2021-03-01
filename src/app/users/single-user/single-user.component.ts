import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Profilsortie } from 'src/app/modeles/Profilsortie';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';
import { CustomValidatorsService } from 'src/app/_services/custom-validators.service';
import { environment } from 'src/environments/environment';
import { User } from '../../modeles/User';
import { UserService } from '../../_services/user.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {
  public user: User;
  hide: boolean;
  public userForm: FormGroup;
  private userUrl = "url";
  public tab: any;
  imgSource: any;
  ps: Profilsortie[] = [];
  isNotFound: boolean = false;
  currentUserId: number;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private router: Router, private customValidatorsService: CustomValidatorsService, private alertService: AlertService, private authService: AuthService) { }
  // on recupere l'id contenu dans l'url
  private id = this.activatedRoute.snapshot.params['id'];

  get form() {
    return this.userForm.controls;
  }

  // on recurepere le user connecté
  getCurrentUser(){
    this.authService.getUserInfos().subscribe(
      (user) => {
        this.currentUserId = user.id;
      }
    )
  }
  ngOnInit(): void {
    this.getCurrentUser();
    this.getProfilSorties();

    const userUrl = environment.apiUrl + "/users/" + this.id;
    this.userService.view(userUrl).subscribe(
      user => {
        this.user = user;
        let itemPs = {
          id: null,
          libelle: null
        };
        // on recupere le profil de sortie actuel du user
        if (user.profilsortie) {
          const userPs = (user.profilsortie).split('/')
          itemPs = this.ps.find(
            (item) => {
              return item.id = userPs[userPs.length - 1];
            }
          )
        }
        this.userForm = this.formBuilder.group({
          "nom": [user.nom, Validators.required],
          "prenom": [user.prenom, Validators.required],
          "email": [user.email, Validators.required],
          "telephone": [user.telephone],
          "adresse": [user.adresse],
          "profilsortie": [itemPs.libelle],
          "genre": [user.genre, Validators.required]
        });
        this.imgSource = 'data:image/jpg;base64,' + user.avatar;
      },
      () => this.isNotFound = true
    );
  }

  onFileSelect(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.userForm.addControl('avatar', this.formBuilder.control('', [Validators.required, this.customValidatorsService.requiredFileType(['jpg', 'jpeg', 'png'])]));
      this.userForm.get('avatar').setValue(file);
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        this.imgSource = event.target.result;
      });
      reader.readAsDataURL(file);
    }
  }

  onSubmitForm() {
    console.log(this.currentUserId);
    // return;
    // console.log(this.user.id);
    const prefix = ((this.user.roles[0]).slice(5, (this.user.roles[0]).length) + 's').toLocaleLowerCase();
    this.userUrl = environment.apiUrl + '/admin/' + prefix + '/' + this.user.id;
    const formData = new FormData();
    const keys = ["prenom", "nom", "email", "telephone", "adresse", "genre", "profilsortie"];
    keys.forEach((valeur) => {
      if (this.userForm.get(valeur).value) {
        formData.append(valeur, this.userForm.get(valeur).value);
      }
    })
    if (this.userForm.get('avatar')) {
      formData.append('avatar', this.userForm.get('avatar').value);
    }
    formData.append('_method', 'PUT');
    this.userService.add(this.userUrl, formData).subscribe(
      () => {
        this.router.navigate(['default/users']);
        this.alertService.showMsg('Utilisateur modifié avec succès');
        if(this.user.id==this.currentUserId){
          // this.SidenavComponent.getTheUser();
          // this.authService.nexUser(editedUser);
          this.userService.view(this.userUrl).subscribe(
            (user) => {
              // console.log(user);
              this.authService.nexUser(user);
            },
            error=>console.log(error)
          )
        }

        // console.log(editedUser.avatar);
        // console.log(this.userForm.get('avatar').value);
      },
      (error) => {
        const ereur = this.userService.handleError(error);
        this.alertService.showErrorMsg(ereur);
      }
    );
  }

  // on recupere les profils de sortie pour les apprenants
  getProfilSorties() {
    const psUrl = environment.apiUrl + "/admin/profilsorties";
    this.userService.get(psUrl).subscribe(
      ps => {
        this.ps = ps;
      },
    )
  }

  onCancelEdit(){
    this.router.navigate(['default/users']);
  }
}
