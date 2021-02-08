import { GroupeCompetences } from "./GroupeCompetences";
import { Niveau } from "./Niveau";

export class Competence
{
    "id":string;
    "libelle":string;
    "descriptif":string;
    "niveaux":Niveau[];
    "archive":boolean;
    "groupeCompetences": GroupeCompetences[];
}