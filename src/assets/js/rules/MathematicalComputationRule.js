import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for mathematical computations
 * Detects when users ask for complex calculations, equations solving, etc.
 */
export default class MathematicalComputationRule extends Rule {
    constructor() {
        super(
            "Mathematical Computation",
            (prompt) => {
                // Expressions pour détecter les calculs mathématiques
                const mathOperators = /[+\-*\/^√()]|\b(plus|moins|fois|divisé|racine|puissance|carré|cube|logarithme|sinus|cosinus|tangente|dérivée|intégrale)\b/i;
                
                // Terminologie mathématique
                const mathTerms = /\b(équation|fonction|polynôme|matrice|vecteur|système|théorème|calcul|formule|probabilité|statistique|algèbre|géométrie|trigonométrie)\b/i;
                
                // Expressions de demande de calcul
                const calculationPhrases = /\b(calcule|résous|trouve|détermine|évalue)\b.{0,30}\b(résultat|solution|valeur|racine)\b/i;
                
                // Présence de formules ou équations
                const formulas = /[a-zA-Z]=.+[+\-*\/^]|(\d+[+\-*\/^]\d+)|(\(.+\)[+\-*\/^])/;
                
                // Exclusion des contextes où on parle de maths sans demander de calcul
                const negativeContexts = /\b(explique le concept|qu'est-ce que|définition)\b/i;
                
                // Si contexte négatif dominant, on ne considère pas comme calcul
                if (prompt.length < 50 && negativeContexts.test(prompt) && !formulas.test(prompt)) {
                    return false;
                }
                
                // On compte le nombre d'indicateurs positifs
                let score = 0;
                if (mathOperators.test(prompt)) score += 1;
                if (mathTerms.test(prompt)) score += 1;
                if (calculationPhrases.test(prompt)) score += 2;
                if (formulas.test(prompt)) score += 3;
                
                // Seuil minimal pour considérer comme demande de calcul
                return score >= 3;
            },
            (prompt) => {
                // Calcul de la consommation d'eau basé sur la complexité
                const promptLowerCase = prompt.toLowerCase();
                let baseWaterUsage = 150; // Valeur de base pour un calcul simple
                
                // Facteurs d'augmentation selon la complexité
                if (/\b(complexe|difficile|avancé|système d'équations)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 100;
                }
                
                if (/\b(matrice|tenseur|multivariable|différentielle|partielle)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 150; // Calculs matriciels/tensoriels plus intensifs
                }
                
                // Calculs de probabilité/statistique consomment plus
                if (/\b(probabilité|statistique|écart-type|variance|régression|corrélation)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 120;
                }
                
                return baseWaterUsage;
            },
            "150-400 mL pour des calculs mathématiques, avec consommation plus élevée pour les équations complexes et l'algèbre matricielle"
        );
    }
}