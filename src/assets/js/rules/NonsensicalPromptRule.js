import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for nonsensical or gibberish prompts
 * Detects when users input random characters, keyboard mashing, or nonsensical text
 */
export default class NonsensicalPromptRule extends Rule {
    constructor() {
        super(
            "Nonsensical Prompt",
            (prompt) => {
                // Détection des prompts sans sens
                
                // 1. Texte très court sans structure
                const isTooShort = prompt.length < 5;
                
                // 2. Répétition excessive de caractères (comme "aaaaaaaa" ou "hhhhhhhh")
                const hasRepeatedChars = /(.)\1{4,}/i.test(prompt);
                
                // 3. Absence de mots reconnaissables ou espaces
                const hasNoWords = !/\b[a-zA-Zéèêëàâäôöùûüïîç]{3,}\b/i.test(prompt.trim());
                
                // 4. Séquences aléatoires de consonnes impossibles à prononcer
                const hasRandomConsonants = /[bcdfghjklmnpqrstvwxz]{5,}/i.test(prompt);
                
                // 5. Ratio très faible de voyelles/consonnes ou inverse (texte improbable)
                const letters = prompt.toLowerCase().replace(/[^a-z]/g, '');
                let vowels = 0;
                if (letters.length > 0) {
                    for (const char of letters) {
                        if ('aeiouyéèêëàâäôöùûüïî'.includes(char)) {
                            vowels++;
                        }
                    }
                    const vowelRatio = vowels / letters.length;
                    const hasUnbalancedRatio = vowelRatio < 0.1 || vowelRatio > 0.8;
                    
                    // Score combiné - plusieurs facteurs ensemble indiquent un prompt débile
                    let nonsenseScore = 0;
                    if (isTooShort) nonsenseScore += 2;
                    if (hasRepeatedChars) nonsenseScore += 2;
                    if (hasNoWords) nonsenseScore += 3;
                    if (hasRandomConsonants) nonsenseScore += 2;
                    if (hasUnbalancedRatio) nonsenseScore += 2;
                    
                    // 6. Prompt qui combine mots aléatoires sans aucun sens grammatical
                    // On vérifie s'il y a des mots mais aucune structure grammaticale de base
                    const wordsButNoStructure = prompt.length > 10 && 
                                               prompt.split(/\s+/).length > 3 && 
                                               !/\b(je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|ce|cette|ces|est|sont|a|ont|et|ou|mais|donc|car|si)\b/i.test(prompt);
                    
                    if (wordsButNoStructure) nonsenseScore += 2;
                    
                    // Si plusieurs indicateurs sont présents, on considère comme du non-sens
                    return nonsenseScore >= 4;
                } else {
                    // Cas des prompts sans aucune lettre
                    return prompt.length > 0;
                }
            },
            (prompt) => {
                // Pour les prompts sans sens, la consommation d'eau est relativement faible
                // car les modèles détectent rapidement l'absurdité mais doivent quand même
                // analyser et générer une réponse
                
                let baseWaterUsage = 30; // Consommation minimale pour toute requête
                
                // Facteurs d'ajustement
                
                // Prompts plus longs consomment un peu plus
                if (prompt.length > 20) baseWaterUsage += 10;
                if (prompt.length > 50) baseWaterUsage += 10;
                if (prompt.length > 100) baseWaterUsage += 20;
                
                // Prompts avec des caractères spéciaux ou non-ASCII complexes
                if (/[^\x00-\x7F]/.test(prompt)) {
                    baseWaterUsage += 15;
                }
                
                // Répétitions excessives (nécessite plus de mémoire pour traiter)
                if (/(..+)\1{5,}/i.test(prompt)) {
                    baseWaterUsage += 15;
                }
                
                return baseWaterUsage;
            },
            "30-90 mL pour des prompts sans sens ou aléatoires, une consommation minimale car facilement identifiables comme incohérents"
        );
    }
}