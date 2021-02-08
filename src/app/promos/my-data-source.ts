import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { filter } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { UserService } from "../_services/user.service";

export class MyDataSource extends DataSource<any | undefined>
{
  private page = 1;
  apprenantsInPromo: any[] = [];
  private initialData: any[] = [
    {
      id: 0,
      nom: 'Dione',
      prenom: 'Saly'
    }
  ];
  private dataStream = new BehaviorSubject<(any | undefined)[]>(this.initialData);
  private subscription = new Subscription();

  constructor(private userService: UserService, public id: number) {
    super();
  }

  connect(collectionViewer: CollectionViewer): Observable<(any | undefined)[]> {
    this.subscription.add(collectionViewer.viewChange.subscribe(
      (range) => {
        console.log(range.start);
        console.log(range.end);
        const url = environment.apiUrl + '/admin/promos/' + this.id
        console.log(url);
        this.userService.view(url).subscribe(
          (promo) => {
            promo.groupes.forEach(groupe => {
              // filter(apprenant => apprenant.hasJoinPromo)
              groupe.apprenants.forEach(apprenant => {
                //   console.log(apprenant);
                let isContain = false;
                this.apprenantsInPromo.forEach(apprenantInPromo => {
                  if (apprenantInPromo.email == apprenant.email) {
                    isContain = true;
                  }
                });
                if (!isContain && apprenant.hasJoinPromo) {
                  // this.apprenantsInPromo.push(apprenant);
                  // this.formatDta(apprenant);
                  this.dataStream.next(apprenant);
                }
              });
            });
          },
        )
      }
    )
    );
    // const donne:any[] = ['1', '2', '3'];
    // console.log(this.dataStream.next);
    this.dataStream.subscribe(
      (x) => console.log(x)
    )
    return this.dataStream;
  }

  disconnect(): void {
    this.subscription.unsubscribe();
  }

  // formatDta(_body: any[]): void {
  //   this.dataStream.next(_body);
  // }
}