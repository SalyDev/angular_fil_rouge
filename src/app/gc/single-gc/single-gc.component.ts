import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Competence } from 'src/app/modeles/Competence';
import { GroupeCompetences } from 'src/app/modeles/GroupeCompetences';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-gc',
  templateUrl: './single-gc.component.html',
  styleUrls: ['./single-gc.component.css']
})
export class SingleGcComponent implements OnInit {

  constructor(private userService: UserService, private activatedRouter: ActivatedRoute, private formBuilder: FormBuilder, private router: Router) { }
  private id = this.activatedRouter.snapshot.params['id'];
  gcUrl = environment.apiUrl + '/admin/groupe_competences/' + this.id;
  gcForm: FormGroup;
  gc: GroupeCompetences;
  competencesOfGc: any[] = [];
  selectable = true;
  removable = true;
  competenceControl = new FormControl([]);
  isAddingExistingCompetence: boolean = false;
  isAddingNewCompetence: boolean = false;
  existingCompetences: Competence[] = [];
  competencesIri: any[] = [];

  // chips new competences
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  newCompetences: string[] = [];
  ngOnInit(): void {
    this.getGC();
  }

  // on recupere le groupe le competences ainsi que ses competences
  getGC() {
    this.userService.view(this.gcUrl).subscribe(
      gc => {
        this.gc = gc;
        this.competencesOfGc = gc.competences;
        this.gcForm = this.formBuilder.group({
          'libelle': [gc.libelle, Validators.required],
          'descriptif': [gc.descriptif, Validators.required],
          'competences': ['', Validators.required]
        })
        const competenceUrl = environment.apiUrl + '/admin/competences';
        this.userService.get(competenceUrl).subscribe(
          (competences) => {
            competences.forEach(competence => {
              let isContain: boolean = false;
              this.competencesOfGc.forEach(element => {
                if (competence.libelle == element.libelle) {
                  isContain = true;
                }
              });
              if (!isContain) {
                this.existingCompetences.push(competence);
              }
            });
          }
        )
      },
      error => console.log(error)
    )
  }

  // fonction pour la suppression d'une competence chips
  remove(competence: any, tableau: any[]) {
    this.userService.removeFirst(tableau, competence);
  }

  removeCompetenceOfGc(competence) {
    this.userService.removeFirst(this.competencesOfGc, competence);
    this.existingCompetences.push(competence);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    let compLibelle: string[] = [];
    this.competencesOfGc.forEach(competence => {
      compLibelle.push(competence.libelle);
    });

    // Ajout d'une new competence chips
    if (this.newCompetences.indexOf(value) == -1 && compLibelle.indexOf(value) == -1) {
      if ((value || '').trim()) {
        this.newCompetences.push(value);
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  isAddingExistingCompetences() {
    this.isAddingExistingCompetence = !this.isAddingExistingCompetence;
  }

  isAddingNewCompetences() {
    this.isAddingNewCompetence = !this.isAddingNewCompetence;
  }

  transformToIri(competencesArray,) {
    competencesArray.forEach(competence => {
      let iri = environment.apiUrl + '/admin/competences/' + competence.id;
      if (this.competencesIri.indexOf(iri) == -1) {
        this.competencesIri.push(iri);
      }
    });
  }

  onSubmitForm() {
    // on recupere les competences du competenceControl(competences existantes ajoutées)
    this.transformToIri(this.competenceControl.value);

    // on recupere les competences du competencesOfGc(anciennes competences du gc)
    this.transformToIri(this.competencesOfGc);

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

    const body = {
      'libelle': this.gc.libelle,
      'descriptif': this.gc.descriptif,
      'competences': this.competencesIri
    }
    // on envoie les donnees vers le serveur
    this.userService.update(this.gcUrl, body).subscribe(
      (sucess) => {
        console.log(sucess)
        this.router.navigate(['default/groupe_competences']);
      },
      (error) => console.log(error)
    )
  }

  // fonction pour l'annulation de la modification
  onCancelUpdate() {
    this.router.navigate(['default/groupe_competences']);
  }
}
