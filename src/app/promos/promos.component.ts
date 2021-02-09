import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2'
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Promo } from '../modeles/Promo';
import { AlertService } from '../_services/alert.service';
import { UserService } from '../_services/user.service';
import { MyDataSource } from './my-data-source';
import  pdfMake from  "pdfmake/build/pdfmake" ;  
import pdfFonts from  "pdfmake/build/vfs_fonts" ;  
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


  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  listData: MatTableDataSource<any>;
  searchKey: string;

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  emails: string[] = [];
  btnLibelle: string;
  

  constructor(private userService: UserService, private changeDetectorRef: ChangeDetectorRef, private alertService: AlertService) { }
  csvControl = new FormControl();
  ngOnInit(): void {
    this.getPromos();
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
        this.listData.paginator = this.paginator;
        this.obs = this.listData.connect();
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
  onDeletePromo(id: number){
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
    // this.ds = new MyDataSource(this.userService, id);
    // console.log(this.ds);
    // const url = environment.apiUrl + '/admin/promos/' + id;
    // this.userService.view(url).subscribe(
    //   (promo) => {
    //     promo.groupes.forEach(groupe => {
    //       groupe.apprenants.forEach(apprenant => {
    //         console.log(apprenant);
    //         let isContain = false;
    //         this.apprenantsInPromo.forEach(apprenantInPromo => {
    //           if (apprenantInPromo.email == apprenant.email) {
    //             isContain = true;
    //           }
    //         });
    //         if (!isContain && apprenant.hasJoinPromo) {
    //           this.apprenantsInPromo.push(apprenant);
    //         }
    //       });
    //     });
    //   },
    // )

    //  les apprenants en attente
    const attenteUrl = environment.apiUrl + '/admin/promos/' + id + '/apprenants/attente';
    this.userService.get(attenteUrl).subscribe(
      (apprenantsEnAttente) => {
        this.apprenantsEnAttente = apprenantsEnAttente;
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // relance collectif
  onRelanceAll() {
    const url = environment.apiUrl + '/reset-password/relance/apprenants';
    this.userService.get(url).subscribe(
      (successMsg) => {
        console.log(successMsg);
        // sweet alert pour dire que les mails de relance a été envoyé
      },
      (error) => {
        console.log(error);
      }
    )
  }

  // relance individul
  onRelanceOne(id: number) {
    const url = environment.apiUrl + '/reset-password/relance/apprenants/' + id;
    this.userService.get(url).subscribe(
      (successMsg) => {
        console.log(successMsg);
        // sweet alert pour dire que le mail de relance a été envoyé
      },
      (error) => {
        console.log(error);
        // alert : une erreur est servenue du serveur, veuillez reéssayer plus tard
      }
    )
  }

  // fonction pour l'ajout des apprenants
  onAddApprenant() {
    this.isShownApprenantInPromo = false;
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
        )
      }
    })
  }

  onFileSelect(event) {
    const file = event.target.files[0];

    if (event.target.files.length > 0) {


      //   if (file.type && file.type.indexOf('image') === -1) {
      //    // console.log('Type de fichier invalide.', file.type, file);
      //    this.isSelectedPromoAvatar = false;
      //    this.imgSource = '';
      //    this.promoAvatarMsg = '*Type de fichier invalide.';
      //    return;
      //  }

      this.csvControl.setValue(file);
    }
  }

  // fonction pour charger un fichier csv
  onChargeCvsFile() {
    this.isChargeCsvFile = !this.isChargeCsvFile;
    this.btnLibelle = "Charger un fichier csv";
  }

  onCancelAdding() {
    this.isShownApprenantInPromo = true;
  }

  // fonction pour la soumission des apprenants à ajouter
  onSubmit() {
    // console.log(this.promoId);
    this.apprenants = "";
    let body: FormData;
    // ajout par emails/manuel
    if (this.emails.length != 0) {
      let formdata1 = new FormData();
      this.emails.forEach(email => {
        this.apprenants = this.apprenants + ' ' + email;
        // on genere la carte de l'etudiant
      });

      // console.log(this.apprenants);

      formdata1.append('groupes', this.apprenants);
      body = formdata1;
    }

    if (this.csvControl.value) {
      const formdata2 = new FormData();
      formdata2.append('file', this.csvControl.value);
      body = formdata2;
    }
    const url = environment.apiUrl + '/admin/promos/' + this.promoId + '/apprenants';
    this.userService.add(url, body).subscribe(
      (addedStudents) => {
        console.log(addedStudents);
        addedStudents.forEach(addedStudent => {
          this.generateStudentCard(addedStudent.email, addedStudent.prenom, addedStudent.nom, addedStudent.avatar);
        });

        this.isShownApprenantInPromo = true;
        // on genere le pdf avec les infos et le code qr de l'apprenant
      },
      (error) => {
        console.log(error);
      }
    )
    // this.generateStudentCard(email);
  }

  // fonction pour generer la carte de l'etudiant
  generateStudentCard(email:string, prenom: string, nom:string, image:any)
  {
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
                style:'titre'
              },
              {text: email},
              {text: 'Prénom', style:'titre'},
              {text: prenom},
              {text: 'Nom', style:'titre'},
              {text: nom},
              [{text:  'Code Qr' , style:'titre' }],  
              [{qr: email, fit:  '100'  }], 
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
