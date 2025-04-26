import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for creative writing requests
 * Detects when users ask for stories, poems, scripts, etc.
 */
export default class CreativeWritingRule extends Rule {
    constructor() {
        super(
            "Creative Writing",
            (prompt) => {
                // Types de contenu créatif
                const creativeFormats = /\b(histoire|récit|conte|fable|nouvelle|roman|poème|poésie|vers|sonnet|chanson|paroles|scénario|script|dialogue|pièce de théâtre|narration)\b/i;
                
                // Verbes de demande d'écriture créative
                const creativeVerbs = /\b(écris|écrire|compose|composer|invente|inventer|crée|créer|imagine|imaginer|rédige|rédiger|raconte|raconter)\b/i;
                
                // Genres littéraires ou styles
                const genres = /\b(science-fiction|fantastique|fantasy|horreur|policier|thriller|romantique|dramatique|comique|historique|aventure|mystère|dystopie|utopie)\b/i;
                
                // Éléments narratifs
                const narrativeElements = /\b(personnage|intrigue|scène|décor|univers|monde|ambiance|péripétie|conflit|dénouement|retournement|twist|protagoniste|antagoniste|héros|villain)\b/i;
                
                // On compte le nombre d'indicateurs positifs
                let score = 0;
                if (creativeFormats.test(prompt)) score += 2;
                if (creativeVerbs.test(prompt)) score += 1;
                if (genres.test(prompt)) score += 1;
                if (narrativeElements.test(prompt)) score += 1;
                
                // Phrases typiques de demande créative
                const creativePhrases = /\b(écris(-moi)? une histoire|raconte(-moi)?|invente une histoire|crée un scénario|compose un poème)\b/i;
                if (creativePhrases.test(prompt)) score += 2;
                
                // Seuil minimal pour considérer comme demande d'écriture créative
                return score >= 3;
            },
            (prompt) => {
                // Calcul de la consommation d'eau basé sur la complexité
                const promptLowerCase = prompt.toLowerCase();
                let baseWaterUsage = 200; // Valeur de base pour l'écriture créative
                
                // Longueur du contenu demandé
                const lengthIndicators = {
                    short: /\b(court|brève|bref|concis|quelques (lignes|paragraphes)|mini)\b/i,
                    medium: /\b(moyen|modéré|intermédiaire|plusieurs paragraphes|quelques pages)\b/i,
                    long: /\b(long|longue|développé|élaboré|détaillé|complexe|plusieurs pages|chapitre)\b/i
                };
                
                if (lengthIndicators.short.test(promptLowerCase)) {
                    baseWaterUsage += 0; // Pas de bonus pour contenu court
                } else if (lengthIndicators.medium.test(promptLowerCase)) {
                    baseWaterUsage += 100;
                } else if (lengthIndicators.long.test(promptLowerCase)) {
                    baseWaterUsage += 200;
                }
                
                // Contraintes créatives spécifiques
                if (/\b(respecte|suivant|selon|avec|utilisant)\b.{0,20}\b(contrainte|règle|forme|structure|style)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 80;
                }
                
                // Demande d'originalité ou d'innovation
                if (/\b(original|innovant|créatif|unique|jamais vu|surprenant|inattendu)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 70;
                }
                
                // Complexité narrative ou structurelle
                if (/\b(intrigue complexe|personnages profonds|développement de personnage|arcs narratifs|multiples perspectives|retournements|twist)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 120;
                }
                
                return baseWaterUsage;
            },
            "200-600 mL pour l'écriture créative, variant selon la longueur et la complexité narrative demandée"
        );
    }
}