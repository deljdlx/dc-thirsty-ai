import Rule from '../Rule.js';

/**
 * Rule for estimating water usage based on complex words in the prompt
 */
export default class ComplexWordsRule extends Rule {
    constructor() {
        super(
            "Complex Words",
            (prompt) => {
                // Détection des mots véritablement complexes (pas des identifiants)
                const realWords = prompt.match(/\b[a-zA-ZÀ-ÿ]{9,}\b/g) || [];
                
                // Éviter les faux positifs (nombres longs, identifiants techniques)
                const notCodeWords = realWords.filter(word => {
                    // Exclure les mots mélangés avec CamelCase ou snake_case
                    if (/[A-Z].*[A-Z]/.test(word) || word.includes('_')) {
                        return false;
                    }
                    // Exclure les mots qui ressemblent à des identifiants ou variables
                    if (/^[a-z][A-Z]/.test(word)) {
                        return false;
                    }
                    return true;
                });
                
                return notCodeWords.length > 0;
            },
            (prompt) => {
                const realWords = prompt.match(/\b[a-zA-ZÀ-ÿ]{9,}\b/g) || [];
                
                // Filtrage avancé
                const notCodeWords = realWords.filter(word => {
                    if (/[A-Z].*[A-Z]/.test(word) || word.includes('_')) return false;
                    if (/^[a-z][A-Z]/.test(word)) return false;
                    return true;
                });
                
                // Ajouter un facteur de complexité basé sur la longueur
                let waterUsage = 0;
                notCodeWords.forEach(word => {
                    // Plus le mot est long, plus il consomme
                    if (word.length >= 12) {
                        waterUsage += 15; // Mots très longs
                    } else if (word.length >= 9) {
                        waterUsage += 10; // Mots longs
                    }
                });
                
                return waterUsage;
            },
            "10-15 mL par mot complexe selon sa longueur (vrais mots, pas d'identifiants techniques)"
        );
    }
}