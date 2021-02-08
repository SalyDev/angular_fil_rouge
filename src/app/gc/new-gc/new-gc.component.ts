import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Competence } from 'src/app/modeles/Competence';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-new-gc',
  templateUrl: './new-gc.component.html',
  styleUrls: ['./new-gc.component.css']
})
export class NewGcComponent implements OnInit {
  gcForm: FormGroup;
  competenceControl = new FormControl([]);
  isAddingExistingCompetence: boolean = false;
  isAddingNewCompetence: boolean = false;
  existingCompetences: Competence[] = [];
  competencesIri: any[] = [];
  gcUrl = environment.apiUrl + '/admin/groupe_competences';

  // chips new competences
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  newCompetences: string[] = [];
  selectable = true;
  removable = true;
  addOnBlur = true;
  // chips new competences

  constructor(private userService: UserService, private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.getCompetences();
    this.initForm();
  }

  initForm() {
    this.gcForm = this.formBuilder.group({
      'libelle': ['', Validators.required],
      'descriptif': ['', Validators.required]
    })
  }

  isAddingExistingCompetences() {
    this.isAddingExistingCompetence = !this.isAddingExistingCompetence;
  }

  isAddingNewCompetences() {
    this.isAddingNewCompetence = !this.isAddingNewCompetence;
  }

  // on recupere l'ensemble des competences
  getCompetences() {
    const competenceUrl = environment.apiUrl + '/admin/competences';
    this.userService.get(competenceUrl).subscribe(
      (competences) => {
        this.existingCompetences = competences;
      }
    )
  }


  // fonction pour la suppression d'une competence existante(chips)
  onCompetenceRemoved(competence: string) {
    const addingCompetences = this.competenceControl.value as string[];
    this.userService.removeFirst(addingCompetences, competence);
    this.competenceControl.setValue(addingCompetences); // change detection
  }


    add(event: MatChipInputEvent){
      this.userService.addChip(event, this.newCompetences);
    }

  remove(competence: string): void {
    this.userService.removeFirst(this.newCompetences, competence);
  }

  // fonction pour la soumission du formulaire
  onSubmitForm() {
    // les iri des competences existants a partir de competenceControl
    this.competenceControl.value.forEach(competence => {
      let iri = environment.apiUrl + '/admin/competences/' + competence.id;
      if (this.competencesIri.indexOf(iri) == -1) {
        this.competencesIri.push(iri);
      }
    });

    // on recupere les new competences a creer
    this.newCompetences.forEach(libelle => {
      let mycompetence = {
        "libelle": libelle,
        "descriptif": "...",
        "etat": "incomplet",
      }
      // variable permettant de tester si la compétence à ajouter dans competencesIri
      // n'existe pas deja dans le tableau
      let isContain = false;
      this.competencesIri.forEach(competence => {
        if (competence.libelle && competence.libelle == libelle) {
          isContain = true;
        }
      });
      if (!isContain) {
        this.competencesIri.push(mycompetence);
      }
    });

    if(this.competencesIri.length==0){
      alert('Donner au moins une compétence');
      return;
    }

    const body = {
      'libelle': this.gcForm.get('libelle').value,
      'descriptif': this.gcForm.get('descriptif').value,
      'competences': this.competencesIri
    }
    //  on envoie les données au serveur
    this.userService.add(this.gcUrl, body).subscribe(
      (gc) => {
        console.log(gc);
        this.router.navigate(['default/groupe_competences']);
      },
      (error) => console.log(error)
    )
  }

  // fonction pour l'annulation de l'ajout
  onCancelAdd(){
    this.router.navigate(['default/groupe_competences']);
  }

}
