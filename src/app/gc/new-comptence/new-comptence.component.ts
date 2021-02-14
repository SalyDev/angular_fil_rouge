import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GroupeCompetences } from 'src/app/modeles/GroupeCompetences';
import { AlertService } from 'src/app/_services/alert.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-comptence',
  templateUrl: './new-comptence.component.html',
  styleUrls: ['./new-comptence.component.css']
})
export class NewComptenceComponent implements OnInit {
  panelOpenState = false;
  numberOfNiveaux = [1, 2, 3];
  competenceForm: FormGroup;
  gcControl = new FormControl([]);
  gcLibelles: string[]= [];
  gcTab=[];
  competenceUrl = environment.apiUrl+'/admin/competences';
  groupeCompetences:GroupeCompetences[]=[];
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getGc();
    this.competenceForm = this.formBuilder.group({
      'libelle': ['', Validators.required],
      'descriptif': ['', Validators.required],
    });
    this.addNiveauxControl();
  }

  addNiveauxControl(){
    this.numberOfNiveaux.forEach((key) => {
    this.competenceForm.addControl('actions'+(key),this.formBuilder.control('', Validators.required));
    this.competenceForm.addControl('critere_evaluation'+(key),this.formBuilder.control('', Validators.required));
  });
  
}

  onSubmitForm() {
    (this.gcControl.value).forEach(element => {
        this.groupeCompetences.forEach(item => {
          if(element == item.libelle){
            this.gcTab.push('api/admin/groupe_competences/'+item.id);
          }
        });
    });
    let niveauOfCompetences: any[]=[];
    for (let i = 1; i < 4; i++) {
        niveauOfCompetences.push(
          {
            "actions": this.competenceForm.get('actions'+i).value,
            "critereEvaluation": this.competenceForm.get('critere_evaluation'+i).value
          }
        )
    }
    const body={
      "libelle":this.competenceForm.get('libelle').value,
      "descriptif":this.competenceForm.get('descriptif').value,
      "niveaux":niveauOfCompetences,
      "groupeCompetences":this.gcTab
    };

    // envoie des donnees vers le serveur
    this.userService.add(this.competenceUrl, body).subscribe(
      () => {
        this.router.navigate(['default/competences']);
        this.alertService.showMsg('Compétence ajoutée avec succès');
      },
      (error) => {
        const ereur = this.userService.handleError(error);
        this.alertService.showErrorMsg(ereur);
      }
    )
  }

  onCancelAdding() {
    this.router.navigate(['default/competences']);
  }

  // fonction pour la suppression d'un chip
  onGcRemoved(gc: string) {
    const addedGc = this.gcControl.value as string[];
    this.removeFirst(addedGc, gc);
    // on reinitialise la valeur de gcControl after la suppression
    this.gcControl.setValue(addedGc); 
  }

  // fonction pour la suppression d'un element d'un tableau
  private removeFirst<T>(array: T[], toRemove: T): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  gcList: string[] = this.gcLibelles;
    // on recupere l'ensemble des groupe de competences
    getGc(){
      const urlGc = environment.apiUrl+'/admin/groupe_competences';
      this.userService.get(urlGc).subscribe(
        gc => {
          gc.forEach(element => {
            this.groupeCompetences = gc;
            this.gcLibelles.push(element.libelle);
          });
        }
      )
    }
}
