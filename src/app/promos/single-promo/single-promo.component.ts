import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Referentiel } from 'src/app/modeles/Referentiel';
import { CustomValidatorsService } from 'src/app/_services/custom-validators.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-promo',
  templateUrl: './single-promo.component.html',
  styleUrls: ['./single-promo.component.css']
})
export class SinglePromoComponent implements OnInit {
  promoForm: FormGroup;
  referentiels: Referentiel[] = [];
  imgSource: any;

  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private userService: UserService, private router: Router, private customValidatorsService: CustomValidatorsService) { }
  url = environment.apiUrl + '/admin/promos/' + this.activatedRoute.snapshot.params['id'];

  ngOnInit(): void {
    this.initForm();
    this.getReferentiels();
  }

  initForm() {
    this.userService.view(this.url).subscribe(
      (promo) => {
        this.promoForm = this.formBuilder.group({
          'titre': [promo.titre, Validators.required],
          'langue': [promo.langue, Validators.required],
          'description': [promo.description, Validators.required],
          'lieu': [promo.lieu],
          'referenceagate': [promo.referenceagate],
          'choixdefabrique': [promo.choixdefabrique, Validators.required],
          'datedebut': [promo.datedebut, Validators.required],
          'datefin': [promo.datefin, Validators.required],
          'referentiel': [promo.referentiel.libelle, Validators.required],
        });
        this.imgSource = 'data:image/jpg;base64,' + promo.avatar;
      },
      (error) => console.log(error)
    )

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

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.promoForm.addControl('avatar', this.formBuilder.control('', [this.customValidatorsService.requiredFileType(['jpg', 'jpeg', 'png'])]));
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
    const keys = ["titre", "lieu", "referenceagate", "langue", "description", "choixdefabrique", "referentiel"];
    keys.forEach((valeur) => {
      formData.append(valeur, this.promoForm.get(valeur).value);
    })
    if(this.promoForm.get('avatar')){
      formData.append('avatar', this.promoForm.get('avatar').value);
    }
    formData.append('_method', 'PUT');

    // on fait corresponndre la clé 'groupes' de formData a la chaine apprenants qui contiennent 
    // la liste des mails des apprenants 

    this.userService.add(this.url, formData).subscribe(
      () => {
        this.router.navigate(['default/promos'])
      },
      (error) => {
        console.log(error);
        // this.error = error.error.detail;
        ;
      }
    );
  }

  // fonction our l'annulation de la modification
  onCanvelUpdate(){
    this.router.navigate(['default/promos'])
  }

}
