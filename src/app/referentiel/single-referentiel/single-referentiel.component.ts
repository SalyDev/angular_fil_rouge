import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupeCompetences } from 'src/app/modeles/GroupeCompetences';
import { Referentiel } from 'src/app/modeles/Referentiel';
import { AlertService } from 'src/app/_services/alert.service';
import { CustomValidatorsService } from 'src/app/_services/custom-validators.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-single-referentiel',
    templateUrl: './single-referentiel.component.html',
    styleUrls: ['./single-referentiel.component.css']
})
export class SingleReferentielComponent implements OnInit {

    gcLibelles: string[] = [];
    referentielForm: FormGroup;
    critereEvaluationList: string[] = [];
    critereAdmissionList: string[] = [];
    groupeCompetences: string;
    critereAdmission: string = '';
    critereEvaluation: string = '';
    tab: string[];
    gcList: GroupeCompetences[] = [];
    isAddingGc = false;
    referentiel: Referentiel;

    addOnBlur = true;
    separatorKeysCodes = [COMMA, ENTER];
    removable = true;
    isNotFound = false;
    constructor(private userService: UserService, private formBuilder: FormBuilder, private customValidatorsService: CustomValidatorsService, private router: Router, private activatedRoute: ActivatedRoute, private alertService: AlertService) { }

    id = this.activatedRoute.snapshot.params['id'];
    referentielUrl = environment.apiUrl + '/admin/referentiels/' + this.id;
    ngOnInit(): void {
        this.getReferentiel();
    }

    //   on recupere le referentiel courant
    getReferentiel() {
        this.userService.view(this.referentielUrl).subscribe(
            (referentiel) => {
                this.referentiel = referentiel;
                this.referentielForm = this.formBuilder.group({
                    'libelle': [referentiel.libelle, Validators.required],
                    'presentation': [referentiel.presentation, Validators.required],
                    'critereEvaluation': [''],
                    'critereAdmission': [''],
                    'programme': ['']
                });
                this.cutStringByPeriod(referentiel.critereEvaluation, this.critereEvaluationList);
                this.cutStringByPeriod(referentiel.critereAdmission, this.critereAdmissionList);
                this.gcList = referentiel.groupeCompetences;
                // on recupere les gc qui ne sont pas deja ajoutés dans le referentiel
                const urlGc = environment.apiUrl + '/admin/groupe_competences';
                this.userService.get(urlGc).subscribe(
                    gc => {
                        gc.forEach(element => {
                            let isContain = false;
                            this.gcList.forEach(defaultGc => {
                                if (element.libelle == defaultGc.libelle) {
                                    isContain = true;
                                }
                            });
                            if (!isContain) {
                                this.gcLibelles.push(element.libelle);
                            }
                        });
                    }
                )
            },
            () => this.isNotFound = true
        )
    }

    gcControl = new FormControl([]);
    remove(element: any, tableau: any) {
        this.userService.removeFirst(tableau, element);
    }

    //   suppression de gc par defaut (chips)
    removeGc(element: GroupeCompetences) {
        this.userService.removeFirst(this.gcList, element);
        this.gcLibelles.push(element.libelle);
    }

    addCe(event: MatChipInputEvent) {
        this.userService.addChip(event, this.critereEvaluationList);
    }

    addCa(event: MatChipInputEvent) {
        this.userService.addChip(event, this.critereAdmissionList);
    }

    onFileSelect(event: any) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.referentielForm.get('programme').setValidators(this.customValidatorsService.requiredFileType(['pdf']));
            this.referentielForm.get('programme').setValue(file);
        }
    }

    // fonction pour mettre la premiere lettre d'une chaine 
    makeFistLetterToUpperCase(chaine: string) {
        return chaine.charAt(0).toUpperCase() + chaine.slice(1);
    }

    AddOtherGc() {
        this.isAddingGc = !this.isAddingGc;
    }

    // soumission du formulaire
    onSubmitForm() {
        this.critereEvaluation = this.critereAdmission = this.groupeCompetences = "";
        // groupeCompetences => contient la concatenation des gc selectionnés separés d'espace
        // on verifie si groupeCompetences ne contient pas deja la chaine
        // transformé un tableau en chaine
        this.gcControl.value.forEach(gc => {
            this.groupeCompetences = this.groupeCompetences + ',' + gc;
        });

        this.gcList.forEach(gc => {
            this.groupeCompetences = this.groupeCompetences + ',' + gc.libelle;
        });
        console.log(this.groupeCompetences);

        this.critereEvaluationList.forEach(element => {
            this.critereEvaluation = this.critereEvaluation + this.makeFistLetterToUpperCase(element) + '.';
        });

        this.critereAdmissionList.forEach(element => {
            this.critereAdmission = this.critereAdmission + this.makeFistLetterToUpperCase(element) + '.';
        });

        const formdata = new FormData();
        let keys = ['libelle', 'presentation', 'programme'];
        keys.forEach(key => {
            formdata.append(key, this.referentielForm.get(key).value);
        });
        formdata.append('groupeCompetences', this.groupeCompetences);
        formdata.append('critereEvaluation', this.critereEvaluation);
        formdata.append('critereAdmission', this.critereAdmission);
        formdata.append('_method', 'PUT');
        this.userService.add(this.referentielUrl, formdata).subscribe(
            () => {
                this.router.navigate(['default/referentiels']);
                this.alertService.showMsg('Référentiel modifié avec succès');
            },
            (error) => {
                const ereur = this.userService.handleError(error);
                this.alertService.showErrorMsg(ereur);
            }
        );
    }

    onCancelAdd() {
        this.router.navigate(['default/referentiels']);
    }

    cutStringByPeriod(chaine:string, collection:string[]) {
        if (chaine != '') {
            const tab = chaine.split('.');
            tab.forEach(element => {
                if (element != '') {
                    collection.push(element);
                }
            });
        }
    }

    onCancelUpdate() {
        this.router.navigate(['default/referentiels']);
    }
}
