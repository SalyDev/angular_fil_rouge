import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Profilsortie } from 'src/app/modeles/Profilsortie';
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
  isSelectedValidFile: boolean = true;
  ps: Profilsortie[] = [];
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private router: Router, private customValidatorsService: CustomValidatorsService) { }
  // on recupere l'id contenu dans l'url
  private id = this.activatedRoute.snapshot.params['id'];

  get form() {
    return this.userForm.controls;
  }

  ngOnInit(): void {
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
      }
    );
  }

  onFileSelect(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];

      if (file.type && file.type.indexOf('image') === -1) {
        this.isSelectedValidFile = false;
        return;
      }
      this.userForm.addControl('avatar', this.formBuilder.control('', [Validators.required]));
      this.isSelectedValidFile = true;
      this.userForm.get('avatar').setValue(file);


      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        this.imgSource = event.target.result;
      });
      reader.readAsDataURL(file);
    }
  }

  onSubmitForm() {
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
      data => {
        this.router.navigate(['default/users']);
      },
      error => {
        console.log(error);
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
      error => {
        console.log(error);
      }
    )
  }

  
}
