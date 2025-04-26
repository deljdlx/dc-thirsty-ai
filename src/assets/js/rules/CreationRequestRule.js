import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for creation requests and proposals
 * Detects when users ask to create, build, develop, make or propose something
 */
export default class CreationRequestRule extends Rule {
    constructor() {
        super(
            "Creation & Proposal Request",
            (prompt) => {
                // Expressions pour détecter les demandes de création
                const creationVerbs = /\b(crée|créer|construis|construire|développe|développer|fabrique|fabriquer|conçois|concevoir|élabore|élaborer|bâtis|bâtir|fais|faire|invente|inventer|génère|générer|produis|produire|mets en place|mettre en place)\b/i;
                
                // Expressions pour détecter les demandes de proposition
                const proposalVerbs = /\b(propose|proposer|suggère|suggérer|recommande|recommander|présente|présenter|offre|offrir|donne|donner|fournis|fournir)\b/i;
                
                // Termes liés à la création ou proposition (noms communs)
                const creationTerms = /\b(projet|site web|application|programme|script|code|système|plan|modèle|prototype|schéma|framework|architecture|solution|algorithme|stratégie|méthode)\b/i;
                
                // Termes spécifiques aux propositions
                const proposalTerms = /\b(idée|suggestion|recommandation|option|alternative|possibilité|approche|concept|proposition|scénario|plan d'action)\b/i;
                
                // Exemples d'expressions complètes de création
                const creationPhrases = /\b(comment (faire|créer|construire|développer|concevoir))\b|\b(aide[^ ]* (à|moi à) (faire|créer|construire|développer|concevoir))\b/i;
                
                // Exemples d'expressions complètes de proposition
                const proposalPhrases = /\b(peux-tu (proposer|suggérer|recommander))\b|\b(quelles (sont|seraient) les (options|possibilités|alternatives))\b|\b(donne[^ ]* des idées (de|pour))\b|\b(aide[^ ]* (à|moi à) trouver des (idées|solutions))\b/i;
                
                // Exclusion des contextes où on parle de création/proposition sans en demander
                const negativeContexts = /\b(explique|résume|décris|analyse|définis|compare|parle de la (création|proposition))\b/i;
                
                // Si contexte négatif dominant, on ne considère pas comme demande de création/proposition
                if (prompt.length < 50 && negativeContexts.test(prompt)) {
                    return false;
                }
                
                // On compte le nombre d'indicateurs positifs
                let score = 0;
                if (creationVerbs.test(prompt)) score += 1;
                if (proposalVerbs.test(prompt)) score += 1;
                if (creationTerms.test(prompt)) score += 1;
                if (proposalTerms.test(prompt)) score += 1;
                if (creationPhrases.test(prompt)) score += 2;
                if (proposalPhrases.test(prompt)) score += 2;
                
                // Traiter les phrases impératives qui commencent par un verbe de création/proposition
                const startsWithActionVerb = /^(crée|construis|développe|fabrique|conçois|élabore|bâtis|fais|invente|génère|produis|propose|suggère|recommande|présente)/i;
                if (startsWithActionVerb.test(prompt.trim())) {
                    score += 2;
                }
                
                // Contextes qui augmentent la probabilité d'une demande de proposition analytique
                const analyticalContexts = /\b(analyse|comparatif|comparaison|évaluation|critique|avantages et inconvénients|pour et contre|forces et faiblesses)\b/i;
                if (proposalVerbs.test(prompt) && analyticalContexts.test(prompt)) {
                    score += 2;
                }
                
                // Seuil minimal pour considérer comme demande de création/proposition
                return score >= 2;
            },
            (prompt) => {
                // Calcul de la consommation d'eau basé sur la complexité de la demande
                const promptLowerCase = prompt.toLowerCase();
                let baseWaterUsage = 200; // Valeur de base pour une demande standard
                
                // Détecter si c'est une proposition analytique (consomme plus)
                const isAnalyticalProposal = /\b(propose|proposer|suggère|suggérer|recommande|recommander)\b.*\b(analyse|comparatif|comparaison|évaluation|critique|avantages|inconvénients)\b/i.test(promptLowerCase);
                
                if (isAnalyticalProposal) {
                    baseWaterUsage = 250; // Les propositions analytiques demandent plus de ressources
                }
                
                // Facteurs d'augmentation selon la complexité
                if (/\b(complexe|avancé|sophistiqué|élaboré|détaillé|approfondi)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 100;
                }
                
                if (/\b(architecture|système complet|framework|plateforme complète|écosystème|solution globale)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 150;
                }
                
                // Les propositions avec multiples options consomment plus
                if (/\b(plusieurs|multiples|différentes|diverses|variées) (options|possibilités|alternatives|propositions|approches|solutions)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 120;
                }
                
                // Tenir compte de la longueur de la demande
                if (prompt.length > 200) {
                    baseWaterUsage += 50;
                }
                
                return baseWaterUsage;
            },
            "200-500 mL pour toute demande de création ou proposition, avec une consommation plus élevée pour les propositions analytiques et les demandes de solutions multiples"
        );
    }
}