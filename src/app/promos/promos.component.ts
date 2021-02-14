import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Promo } from '../modeles/Promo';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { CustomValidatorsService } from '../_services/custom-validators.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-promos',
  templateUrl: './promos.component.html',
  styleUrls: ['./promos.component.css']
})
export class PromosComponent implements OnInit {
  promos: Promo[] = [];
  private promoUrl = environment.apiUrl + '/admin/promos';
  isShownApprenantEnAttente = false;
  isShownApprenantInPromo = false;
  listApprenants: any[] = [];
  apprenantsEnAttente: any[] = [];
  promoTitle: string;
  apprenantsInPromo: any[] = [];
  isChargeCsvFile: boolean = false;
  apprenants: string;
  promoId: number;
  ds: any;
  body: FormData;
  isFormSubmitted: boolean = false;

  @ViewChild('PromoPaginator') promoPaginator: MatPaginator;
  obs: Observable<any>;
  listData: MatTableDataSource<any>;
  searchKey: string;

  // pagination des apprenants ayant deja rejoint la promo
  @ViewChild('StudentInPromoPaginator') studentInPromoPaginator: MatPaginator;
  displayedColumnsOne: string[] = ['avatar', 'prenom', 'nom', 'action'];
  dataSourceOne: MatTableDataSource<any>;

  // pagination des apprenants en attente
  @ViewChild('WaitingStudentsPaginator') waitingStudentsPaginator: MatPaginator;
  displayedColumnsTwo: string[] = ['email', 'relance'];
  dataSourceTwo: MatTableDataSource<any>;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  btnLibelle: string;

  constructor(private userService: UserService, private changeDetectorRef: ChangeDetectorRef, private alertService: AlertService, private customValidatorsService: CustomValidatorsService) { }

  csvControl = new FormControl();

  ngOnInit(): void {
    this.getPromos();
    this.csvControl.setValidators([Validators.required, this.customValidatorsService.requiredFileType(['ods', 'csv', 'xlsx', 'xls'])]);
  }

  add(event: MatChipInputEvent): void {
    this.userService.addChip(event, this.emails);
  }

  remove(email: string): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
    }
  }

  getPromos() {
    this.userService.get(this.promoUrl).subscribe(
      promos => {
        this.promos = promos;
        this.changeDetectorRef.detectChanges();
        this.listData = new MatTableDataSource(this.promos);
        this.listData.paginator = this.promoPaginator;
        this.obs = this.listData.connect();
      },
      () => {
        this.alertService.showProgressSpinner();
        this.alertService.showErrorMsg('Désolé, une ereur est survenue du serveur')
      }
    )
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  // fonction pour l'archivage d'une promo
  onDeletePromo(id: number) {
    const url = environment.apiUrl + '/admin/promos/' + id;
    this.alertService.confirmDeleting('Etes-vous de vouloir supprimer cette promotion').then((result) => {
      if (result.isConfirmed) {
        this.userService.archive(url).subscribe(() => this.getPromos());
        Swal.fire(
          'Promo supprimée avec succès!',
        )
      }
    })
  }

  // la liste des apprenants de la promo
  getApprenantsInPromo(id: number, promoTitle: string) {
    this.isShownApprenantEnAttente = true;
    this.isShownApprenantInPromo = true;
    this.promoId = id;
    this.promoTitle = promoTitle;
    this.apprenantsInPromo = [];
    const url = environment.apiUrl + '/admin/promos/' + id;
    this.userService.view(url).subscribe(
      (promo) => {
        promo.groupes.forEach(groupe => {
          groupe.apprenants.forEach(apprenant => {
            let isContain = false;
            this.apprenantsInPromo.forEach(apprenantInPromo => {
              if (apprenantInPromo.email == apprenant.email) {
                isContain = true;
              }
            });
            if (!isContain && apprenant.hasJoinPromo) {
              this.apprenantsInPromo.push(apprenant);
            }
          });
          this.dataSourceOne = new MatTableDataSource(this.apprenantsInPromo);
          this.dataSourceOne.paginator = this.studentInPromoPaginator;
        }
        )
          ;
      },
    )
    //  les apprenants en attente
    const attenteUrl = environment.apiUrl + '/admin/promos/' + id + '/apprenants/attente';
    this.userService.get(attenteUrl).subscribe(
      (apprenantsEnAttente) => {
        this.apprenantsEnAttente = apprenantsEnAttente;
        this.dataSourceTwo = new MatTableDataSource(apprenantsEnAttente);
        this.dataSourceTwo.paginator = this.waitingStudentsPaginator;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // relance collectif
  onRelanceAll() {
    const url = environment.apiUrl + '/reset-password/relance/apprenants';
    this.alertService.showProgressSpinner();
    this.userService.get(url).subscribe(
      () => {
        this.alertService.showMsg('Relance envoyé avec succès');
      },
      (error) => {
        console.log(error);
        this.alertService.showErrorMsg('Une erreur est survenue du serveur');
      }
    )
  }

  // relance individul
  onRelanceOne(id: number) {
    const url = environment.apiUrl + '/reset-password/relance/apprenants/' + id;
    this.alertService.showProgressSpinner();
    this.userService.get(url).subscribe(
      () => {
        // sweet alert pour dire que le mail de relance a été envoyé
        this.alertService.showMsg('Relance envoyé avec succès');
      },
      () => {
        // alert : une erreur est servenue du serveur, veuillez reéssayer plus tard
        this.alertService.showErrorMsg('Une erreur est survenue du serveur');
      }
    )
  }

  // fonction pour l'ajout des apprenants
  onAddApprenant() {
    this.isShownApprenantInPromo = false;
    this.isFormSubmitted = false;
  }

  // fonction pour retirer un apprenant de la promo
  onDeleteApprenantOfPromo(email: string) {
    const body =
    {
      "apprenant": email
    };
    const url = environment.apiUrl + '/admin/promos/' + this.promoId + '/apprenants';
    this.alertService.confirmDeleting('Etes-vous de vouloir supprimer cet(te) apprenant(e) de la promo?').then((result) => {
      if (result.isConfirmed) {
        this.userService.update(url, body).subscribe(() => this.getApprenantsInPromo(this.promoId, this.promoTitle));
        Swal.fire(
          'Apprenant(e) retiré(e) de la promo avec succès!',
        );
        // on reset les listes des apprenants
        this.getApprenantsInPromo(this.promoId, this.promoTitle);
      }
    })
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    this.csvControl.setValue(file);
  }

  // fonction pour charger un fichier csv
  onChargeCvsFile() {
    this.csvControl.setValue('');
    this.isChargeCsvFile = !this.isChargeCsvFile;
    this.btnLibelle = "Charger un fichier csv";
    this.body = new FormData();
    this.apprenants = "";
  }

  onCancelAdding() {
    this.isShownApprenantInPromo = true;
  }

  // fonction pour la soumission des apprenants à ajouter
  onSubmit() {
    this.isFormSubmitted = true;
    this.apprenants = "";
    // ajout par emails/manuel
    if (this.emails.length != 0) {
      let formdata1 = new FormData();
      this.emails.forEach(email => {
        this.apprenants = this.apprenants + ' ' + email;
      });
      formdata1.append('groupes', this.apprenants);
      this.body = formdata1;
    }

    if (this.csvControl.value) {
      const formdata2 = new FormData();
      formdata2.append('file', this.csvControl.value);
      this.body = formdata2;
    }
    const url = environment.apiUrl + '/admin/promos/' + this.promoId + '/apprenants';
    this.userService.add(url, this.body).subscribe(
      (addedStudents) => {
        addedStudents.forEach(addedStudent => {
          // on genere le pdf avec les infos et le code qr de l'apprenant
          this.generateStudentCard(addedStudent.email, addedStudent.prenom, addedStudent.nom, addedStudent.avatar);
          // on reset les listes des apprenants
          this.getApprenantsInPromo(this.promoId, this.promoTitle);
        });

        this.isShownApprenantInPromo = true;
        // on vide les emails (chips)
        this.emails = [];
      },
      (error) => {
        let ereur = this.userService.handleError(error);
        this.alertService.showErrorMsg(ereur);
        this.emails = [];
        this.isFormSubmitted = false;

      }
    )
  }

  // fonction pour generer la carte de l'etudiant
  generateStudentCard(email: string, prenom: string, nom: string, image: any) {
    let docDefinition =
    {
      header: [
        {
          text: 'Sonatel Academy',
          style: 'myStyle'
        }
      ],
      content: [
        {
          columns: [
            [
              {
                image: 'data:image/jpg;base64,' + image,
                fit: [100, 100],
              },
            ],
            [
              {
                text: 'Email',
                style: 'titre'
              },
              { text: email },
              { text: 'Prénom', style: 'titre' },
              { text: prenom },
              { text: 'Nom', style: 'titre' },
              { text: nom },
              [{ text: 'Code Qr', style: 'titre' }],
              [{ qr: email, fit: '100' }],
            ]
          ]
        },
      ],
      footer: [
        {
          text: 'Coding For Better Life',
          style: 'myStyle'
        }
      ],
      styles: {
        titre: {
          bold: true,
          fontSize: 14,
          color: '#3c908d',
          fontStyle: 'italic',
          margin: [0, 0, 5, 0]
        },
        myStyle: {
          fontStyle: 'italic',
          color: '#f6812a'
        }
      }
    };
    pdfMake.createPdf(docDefinition).open();
  }
}