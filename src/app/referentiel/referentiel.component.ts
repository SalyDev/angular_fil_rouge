import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Referentiel } from '../modeles/Referentiel';
import { UserService } from '../_services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2'
import { AlertService } from '../_services/alert.service';

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-referentiel',
  templateUrl: './referentiel.component.html',
  styleUrls: ['./referentiel.component.css']
})
export class ReferentielComponent implements OnInit {
  referentiels: Referentiel[] = [];
  private referentielUrl = environment.apiUrl + '/admin/referentiels/grpecompetences';

  @ViewChild(MatPaginator) paginator: MatPaginator;
  obs: Observable<any>;
  listData: MatTableDataSource<any>;
  searchKey: string;

  constructor(private userService: UserService, private changeDetectorRef: ChangeDetectorRef, private alertService: AlertService) { }

  ngOnInit(): void {
    this.getReferentiels();
  }

  getReferentiels() {
    this.userService.get(this.referentielUrl).subscribe(
      referentiels => {
        this.referentiels = referentiels;
        this.changeDetectorRef.detectChanges();
        this.listData = new MatTableDataSource(this.referentiels);
        this.listData.paginator = this.paginator;
        this.obs = this.listData.connect();
      },
      (error) => {
        this.alertService.showProgressSpinner();
        const ereur = this.userService.handleError(error);
        this.alertService.showErrorMsg(ereur);
      } 
    );
  }

  onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLocaleLowerCase();
  }

  archiveReferentiel(id: number) {
    console.log(id);
    const url = environment.apiUrl + '/admin/referentiels/' + id;
    this.alertService.confirmDeleting('Etes-vous sûr de supprimer cet référentiel?').then((result) => {
      if (result.isConfirmed) {
        this.userService.archive(url).subscribe(() => this.getReferentiels());
        Swal.fire(
          'Référentiel archivé!',
        )
      }
    })
    this.getReferentiels();
  }

  generatePDF(id: number) {
    const url = environment.apiUrl + '/admin/referentiels/' + id;
    this.userService.view(url).subscribe(
      (referentiel) => {
        let docDefinition = {
          header: {
            text: 'Sonatel Academy',
            style: 'myStyle'
          },
          footer: [
            {
              text: 'Coding For Better Life',
              style: 'myStyle'
            }
          ],
          content: [
            {
              columns: [
                [
                  {
                    text: 'Référentiel :'
                  },
                ],
                [
                  {
                    text: referentiel.libelle,
                    alignment: 'right'
                  },
                ]
              ],

            },
            {
              text: "Critère d'évaluation",
              style: 'sectionHeader'
            },
            {
              text: referentiel.critereEvaluation
            },
            {
              text: "Critère d'admission",
              style: 'sectionHeader'
            },
            {
              text: referentiel.critereAdmission
            },
            {
              text: "Groupes de compétences",
              style: 'sectionHeader'
            },

            {
              ul: [
                ...referentiel.groupeCompetences.map(gc => ([gc.libelle,
                {
                  table: {
                    headerRows: 1,
                    widths: ['*'],
                    body: [
                      ['Compétences'],
                      ...gc.competences.map(c => ([c.libelle])),
                    ]
                  },

                }
                ])),
              ],
            },
          ],
          styles: {
            sectionHeader: {
              bold: true,
              fontSize: 14,
              margin: [0, 15, 0, 15],
              color: '#3c908d'
            },
            myStyle: {
              color: '#f6812a',
              fontStyle: 'italic'
            }
          }
        };
        pdfMake.createPdf(docDefinition).open();
      }
    )
  }
}
