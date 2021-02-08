import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';
import { Referentiel } from 'src/app/modeles/Referentiel';
import { Router } from '@angular/router';
import { CustomValidatorsService } from 'src/app/_services/custom-validators.service';



@Component({
  selector: 'app-new-promo',
  templateUrl: './new-promo.component.html',
  styleUrls: ['./new-promo.component.css']
})
export class NewPromoComponent implements OnInit {
  imgSource: any;
  promoForm: FormGroup;
  referentiels: Referentiel[] = [];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private customValidatorsService: CustomValidatorsService) { }

  ngOnInit(): void {
    this.initForm();
    this.getReferentiels();
  }

  initForm() {
    this.promoForm = this.formBuilder.group({
      'titre': ['', Validators.required],
      'langue': ['', Validators.required],
      'description': ['', Validators.required],
      'avatar': ['', this.customValidatorsService.requiredFileType(['png', 'jpeg', 'jpg'])],
      'lieu': '',
      'referenceagate': '',
      'choixdefabrique': ['Sonatel Academy', Validators.required],
      'datedebut': [new Date, Validators.required],
      'datefin': [new Date, Validators.required],
      'referentiel': ['', Validators.required],
    })
  }

  get form() {
    return this.promoForm.controls;
  }

  // selection de l'avatar de la promo
  onFileSelect(event: any) {

    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.promoForm.get('avatar').setValue(file);
      const reader = new FileReader();
      reader.addEventListener('load', (event) => {
        this.imgSource = event.target.result;
      });
      reader.readAsDataURL(file);
    }
  }

  onSubmitForm() {
    const formData = new FormData();
    const promoUrl = environment.apiUrl + '/admin/promos';
    const keys = ["titre", "lieu", "referenceagate", "langue", "description", "avatar", "choixdefabrique", "referentiel"];
    keys.forEach((valeur) => {
      formData.append(valeur, this.promoForm.get(valeur).value);
    })

    // on fait corresponndre la clé 'groupes' de formData a la chaine apprenants qui contiennent 
    // la liste des mails des apprenants 

    this.userService.add(promoUrl, formData).subscribe(
      data => {
        this.router.navigate(['default/promos'])
      },
      error => {
        console.log(error);
        // this.error = error.error.detail;
        ;
      }
    );
  }

  // fonction pour l'annulation de l'ajout
  onCancelAdd() {
    this.router.navigate(['default/promos'])
  }

  // on recupere les referentiels dans notre BD
  getReferentiels() {
    const refUrl = environment.apiUrl + '/admin/referentiels';
    this.userService.get(refUrl).subscribe(
      (referentiels) => {
        this.referentiels = referentiels;
      },
      (error) => {
        console.log(error);
      }
    )
  }


}
