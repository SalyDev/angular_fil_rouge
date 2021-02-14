import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Profilsortie } from '../modeles/Profilsortie';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import Swal from 'sweetalert2'
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../modeles/User';

@Component({
  selector: 'app-profilsorties',
  templateUrl: './profilsorties.component.html',
  styleUrls: ['./profilsorties.component.css']
})
export class ProfilsortiesComponent implements OnInit {

  private profilsortieUrl = environment.apiUrl + '/admin/profilsorties';
  profilsorties: Profilsortie[];
  addNewPs: boolean;
  psForm: FormGroup;
  searchKey: string;
  libelleUpdated: string;
  apprenants: User[] = [];
  isShowDetails: boolean = false;

  @ViewChild(MatSort) sort: MatSort;

  // pagination de la table des profils
  dataSourceOne: MatTableDataSource<Profilsortie[]>;
  displayedColumnsOne: string[] = ['libelle', '$$edit'];
  @ViewChild('TableOnePaginator', { static: true }) tableOnePaginator: MatPaginator;

  // pagination de lat table des users
  dataSourceTwo: MatTableDataSource<User[]>;
  displayedColumnsTwo: string[] = ['avatar', 'nom'];
  @ViewChild('TableTwoPaginator', { static: true }) tableTwoPaginator: MatPaginator;

  constructor(private userService: UserService, public activatedRoute: ActivatedRoute, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getProfilsorties();
  }

  getProfilsorties() {
    return this.userService.get(this.profilsortieUrl).subscribe(
      profilsorties => {
        this.profilsorties = profilsorties;
        this.dataSourceOne = new MatTableDataSource(profilsorties);
        this.dataSourceOne.sort = this.sort;
        this.dataSourceOne.paginator = this.tableOnePaginator;
      },
      error => console.log(error),
    );
  }

  onArchivePs(id: number) {
    const url = this.profilsortieUrl + '/' + id;
    this.alertService.confirmDeleting('Êtes-vous sur de supprimer ce profil de sortie?').then((result) => {
      if (result.isConfirmed) {
        this.userService.archive(url).subscribe(() => this.getProfilsorties());
        Swal.fire(
          'Profil de sortie archivé!',
        )
      }
    })
    this.getProfilsorties();
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.dataSourceOne.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  // on reiniliatise à undefined la valeur du libelleUpdated lorsqu'on clik sur le edit button
  onInitInput() {
    this.libelleUpdated = undefined;
  }

  onEdit(id: number) {
    // si la valeur du libellé a changé
    const url = this.profilsortieUrl + '/' + id;
    if (this.libelleUpdated) {
      this.userService.update(url, {
        "libelle": this.libelleUpdated
      })
        .subscribe(
          () => {
            this.getProfilsorties();
            this.alertService.showMsg('Profil de sortie modifié avec succès');
          },
          (error) => {
            const ereur = this.userService.handleError(error);
            this.alertService.showErrorMsg(ereur);
          }
        );
    }
  }

  // detection de modification du libellé
  changeLibelle(event: any) {
    this.libelleUpdated = event.target.value;
  }

  addPs() {
    this.addNewPs = true;
    this.psForm = new FormGroup({
      "libelle": new FormControl('', Validators.required)
    })
  }

  onSubmitForm() {
    const body = {
      "libelle": this.psForm.get('libelle').value
    };
    this.userService.add(this.profilsortieUrl, body).subscribe(
      () => {
        this.getProfilsorties();
        this.alertService.showMsg('Profil de sortie ajouté avec succès');
      },
      (error) => {
        const ereur = this.userService.handleError(error);
        this.alertService.showErrorMsg(ereur);
      }
    );
  }

  onCancelAdding() {
    this.addNewPs = false;
  }

  // la liste des apprenants associés à un profil de sortie
  showApprenantsOfPs(id: number) {
    this.isShowDetails = true;
    const url = this.profilsortieUrl + '/' + id + '/apprenants';
    this.userService.get(url).subscribe(
      apprenants => {
        this.apprenants = apprenants;
        this.dataSourceTwo = new MatTableDataSource(apprenants);
        this.dataSourceTwo.paginator = this.tableTwoPaginator;
      }
    )
  }

  closeDetails() {
    this.isShowDetails = false;
  }
}
