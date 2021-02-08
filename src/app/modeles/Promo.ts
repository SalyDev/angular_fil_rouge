import { Referentiel } from "./Referentiel";

export class Promo{
    id:number;
    titre:string;
    lieu:string;
    referenceagate:string;
    choixdefabrique:string;
    description:string;
    avatar:Blob;
    datedebut:Date;
    datefin:Date;
    referentiel: Referentiel
}