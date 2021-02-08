import { GroupeCompetences } from "./GroupeCompetences";
import { Promo } from "./Promo";

export class Referentiel{
    id:number;
    libelle:string;
    presentation:string;
    programme:string;
    groupeCompetences: GroupeCompetences;
    critereEvaluation:string;
    critereAdmission:string;
    promos: Promo;
}