import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Competence } from 'src/app/modeles/Competence';
import { GroupeCompetences } from 'src/app/modeles/GroupeCompetences';
import { AlertService } from 'src/app/_services/alert.service';
import { UserService } from 'src/app/_services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-single-competence',
  templateUrl: './single-competence.component.html',
  styleUrls: ['./single-competence.component.css']
})
export class SingleCompetenceComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private router: Router, private alertService: AlertService) { }
  competenceForm: FormGroup;
  // on initialise le control pour les groupes de competences
  gcControl = new FormControl([]);
  private id = +this.activatedRoute.snapshot.params['id'];
  competenceUrl = environment.apiUrl + '/admin/competences/' + this.id;
  competence: Competence;
  removable = true;
  isAddingGc = false;
  visible = true;
  groupeCompetences: string[] = [];
  gcOfCompetence: string[] = [];
  numberOfNiveaux = [1, 2, 3];
  niveaux: any[] = [];
  allGc: GroupeCompetences[] = [];
  body: any;
  levels: any[];
  isNotFound: boolean = false;

  ngOnInit(): void {
    this.userService.view(this.competenceUrl).subscribe(
      competence => {
        this.competence = competence;
        // on recupere chaque niveau de la competence
        this.niveaux = this.competence.niveaux;

        // on recupere les groupes de competences de la competence
        this.competence.groupeCompetences.forEach(element => {
          this.gcOfCompetence.push(element.libelle);
        });

        this.competenceForm = this.formBuilder.group({
          'libelle': [this.competence.libelle, Validators.required],
          'descriptif': [this.competence.descriptif, Validators.required],
        },
          () => this.alertService.showErrorMsg('Désolé, une ereur est survenue du serveur')
        )
        // on ajoute deux formControls : actions et critere_evaluation pour chaque niveau
        if (this.niveaux.length != 0) {
          this.niveaux.forEach((niveau, key) => {
            this.competenceForm.addControl('actions' + (key + 1), this.formBuilder.control(niveau.actions, Validators.required));
            this.competenceForm.addControl('critere_evaluation' + (key + 1), this.formBuilder.control(niveau.critereEvaluation, Validators.required));
          });
        }
        else {
          this.numberOfNiveaux.forEach((key) => {
            this.competenceForm.addControl('actions' + (key), this.formBuilder.control('', Validators.required));
            this.competenceForm.addControl('critere_evaluation' + (key), this.formBuilder.control('', Validators.required));
          })
        }
      },
      () => {
        this.isNotFound = true;
      }
    );
    this.getGc();
  }

  // on initilise gcControl par les gc par defaut de la competence
  gcList: string[] = this.groupeCompetences;

  // fonction pour la suppression d'un chip
  onGcRemoved(gc: string) {
    const addingGc = this.gcControl.value as string[];
    this.userService.removeFirst(addingGc, gc);
    this.userService.removeFirst(this.gcOfCompetence, gc)
    this.gcControl.setValue(addingGc); // To trigger change detection
  }

  onSubmitForm() {
    let updatedArrayGc: any[] = [];
    let niveauOfCompetences: any[] = [];
    const updatedNiveauxArray = [];
    // on ajoute les nvx grps de competences ajoutés
    if ((this.gcControl.value).length != 0) {
      this.gcControl.value.forEach(element => {
        if (this.gcOfCompetence.indexOf(element) == -1) {
          this.gcOfCompetence.push(element);
          this.userService.removeFirst(this.groupeCompetences, element)
        }
      });
    }
    this.gcOfCompetence.forEach(libelle => {
      this.allGc.forEach(element => {
        if (element.libelle == libelle) {
          updatedArrayGc.push('api/admin/groupe_competences/' + element.id);
        }
      });
    });
    // au lieu de recréer les niveaux on les modifie si this.niveaux.length!=0
    // on recupere le niveau par son id et on le modifie
    if (this.niveaux.length != 0) {
      this.niveaux.forEach((element, key) => {
        let url = environment.apiUrl + '/admin/niveaux/' + element.id;
        let updatedNiveau = {
          "actions": this.competenceForm.get('actions' + (key + 1)).value,
          "critereEvaluation": this.competenceForm.get('critere_evaluation' + (key + 1)).value,
        };
        this.userService.update(url, updatedNiveau).subscribe();
        updatedNiveauxArray.push(('api/admin/niveaux/' + element.id));
      });
      this.levels = updatedNiveauxArray;

    }
    // sinon on cree les niveau
    else {
      this.numberOfNiveaux.forEach(i => {
        let niveau = {
          "actions": this.competenceForm.get('actions' + i).value,
          "critereEvaluation": this.competenceForm.get('critere_evaluation' + i).value
        };
        niveauOfCompetences.push(niveau);
      });
      this.levels = niveauOfCompetences;
    }
    this.body = {
      "libelle": this.competenceForm.get('libelle').value,
      "descriptif": this.competenceForm.get('descriptif').value,
      "niveaux": this.levels,
      "groupeCompetences": updatedArrayGc
    };

    // envoie des donnees vers le serveur
    this.userService.update(this.competenceUrl, this.body).subscribe(
      () => {
        this.router.navigate(['default/competences']);
        this.alertService.showMsg('Compétence modifiée avec succès');
      },
      (error) => {
        const ereur = this.userService.handleError(error);
        this.alertService.showErrorMsg(ereur);
      }
    )
  }

  // on recupere l'ensemble des groupe de competences
  getGc() {
    const urlGc = environment.apiUrl + '/admin/groupe_competences';
    this.userService.get(urlGc).subscribe(
      gc => {
        this.allGc = gc;
        gc.forEach(element => {
          // on recupere le gc si et seulement s'il n'existe pas encore dans le tableau
          // groupeCompetences et gcOfCompetences
          // si le gc existe deja dans les gc du competences (gcOfCompetenc) on l'ajoute pas dans le tableau du gc à ajouter
          if (this.groupeCompetences.indexOf(element.libelle) == -1 && this.gcOfCompetence.indexOf(element.libelle) == -1) {
            this.groupeCompetences.push(element.libelle);
          }
        });
      }
    )
  }

  // fonction pour la suppression d'un gc(chips) du gcOfCompetence (les gc ajoutés au competences)
  // suppression d'un element d'un tableau
  remove(gc: string): void {
    const index = this.gcOfCompetence.indexOf(gc);
    if (index >= 0) {
      this.gcOfCompetence.splice(index, 1);
      this.groupeCompetences.push(gc);
    }
  }

  // affichage du champs d'ajout de nvx groupe de competences
  addGc() {
    this.isAddingGc = !this.isAddingGc;
  }

  // fonction pour l'annulation de la modification
  onCancelUpdate() {
    this.router.navigate(['default/competences']);
  }
}
