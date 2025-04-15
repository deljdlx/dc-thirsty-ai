// filepath: /home/jdlxt/__dev/experiments/waterai/assets/js/rules/LongPromptRule.js
import Rule from '../Rule.js';

/**
 * Rule for estimating water usage based on prompt length
 */
export default class LongPromptRule extends Rule {
    constructor() {
        super(
            "Long Prompt",
            (prompt) => {
                // Nettoyage des espaces excessifs et de la répétition
                const cleanText = prompt
                    .replace(/\s+/g, ' ')
                    .replace(/(.+?)\1{2,}/g, '$1$1'); // Détecte les motifs répétés 3+ fois
                
                // Au lieu d'un simple seuil fixe, on utilise une échelle progressive
                return cleanText.length > 800;
            },
            (prompt) => {
                // Nettoyage du texte
                const cleanText = prompt
                    .replace(/\s+/g, ' ')
                    .replace(/(.+?)\1{2,}/g, '$1$1');
                
                // Échelle progressive
                if (cleanText.length > 2000) return 300; // Très long
                if (cleanText.length > 1500) return 250; // Long
                if (cleanText.length > 1000) return 200; // Modéré à long
                return 150; // Juste assez long pour activer la règle
            },
            "150-300 mL pour prompt long, selon sa longueur effective (après élimination des répétitions)"
        );
    }
}