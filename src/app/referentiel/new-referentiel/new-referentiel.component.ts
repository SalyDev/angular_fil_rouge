import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { GroupeCompetences } from 'src/app/modeles/GroupeCompetences';
import { CustomValidatorsService } from 'src/app/_services/custom-validators.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-referentiel',
  templateUrl: './new-referentiel.component.html',
  styleUrls: ['./new-referentiel.component.css']
})
export class NewReferentielComponent implements OnInit {
  referentielUrl = environment.apiUrl + '/admin/referentiels';
  gcLibelles: string[] = [];
  referentielForm: FormGroup;
  critereEvaluationList: string[] = [];
  critereAdmissionList: string[] = [];
  groupeCompetences: string;
  critereAdmission: string = '';
  critereEvaluation: string = '';
  tab: string[];

  addOnBlur = true;
  separatorKeysCodes = [COMMA, ENTER];
  removable = true;
  constructor(private userService: UserService, private formBuilder: FormBuilder, private customValidatorsService: CustomValidatorsService, private router: Router) { }

  ngOnInit(): void {
    this.getGc();
    this.initForm();
  }

  gcControl = new FormControl([]);

  // on recupere l'ensemble des groupe de competences
  getGc() {
    const urlGc = environment.apiUrl + '/admin/groupe_competences';
    this.userService.get(urlGc).subscribe(
      gc => {
        gc.forEach(element => {
          this.gcLibelles.push(element.libelle);
        });
      }
    )
  }

  initForm() {
    this.referentielForm = this.formBuilder.group({
      'libelle': ['', Validators.required],
      'presentation': ['', Validators.required],
      'critereEvaluation': [''],
      'critereAdmission': [''],
      'programme': ['', this.customValidatorsService.requiredFileType(['pdf'])]
    })
  }

  remove(element, tableau) {
    this.userService.removeFirst(tableau, element);
  }

  addCe(event: MatChipInputEvent) {
    this.userService.addChip(event, this.critereEvaluationList);
  }

  addCa(event: MatChipInputEvent) {
    this.userService.addChip(event, this.critereAdmissionList);
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.referentielForm.get('programme').setValue(file);
    }
  }

  // fonction pour mettre la premiere lettre d'une chaine 
  makeFistLetterToUpperCase(chaine: string) {
    return chaine.charAt(0).toUpperCase() + chaine.slice(1);
  }

  // soumission du formulaire
  onSubmitForm() {
    this.critereEvaluation = this.critereAdmission = "";
    // groupeCompetences => contient la concatenation des gc selectionnés separés d'espace
    // on verifie si groupeCompetences ne contient pas deja la chaine
    // transformé un tableau en chaine
    this.gcControl.value.forEach(gc => {
      this.groupeCompetences = this.groupeCompetences + ',' + gc;
    });
    this.critereEvaluationList.forEach(element => {
      this.critereEvaluation = this.critereEvaluation + ' ' + this.makeFistLetterToUpperCase(element) + '. ';
    });
    this.referentielForm.get('critereEvaluation').setValue(this.critereEvaluation);

    this.critereAdmissionList.forEach(element => {
      this.critereAdmission = this.critereAdmission + ' ' + this.makeFistLetterToUpperCase(element) + '. ';
    });
    this.referentielForm.get('critereAdmission').setValue(this.critereAdmission);

    const formdata = new FormData();
    let keys = ['libelle', 'presentation', 'critereEvaluation', 'critereAdmission', 'programme'];
    keys.forEach(key => {
      formdata.append(key, this.referentielForm.get(key).value);
    });
    formdata.append('groupeCompetences', this.groupeCompetences);

    // envoie des donnees vers le serveur
    this.userService.add(this.referentielUrl, formdata).subscribe(
      (sucess) => {
        this.router.navigate(['default/referentiels']);
      },
      (error) => console.log(error)
    );
  }

  onCancelAdd(){
    this.router.navigate(['default/referentiels']);
  }
}
