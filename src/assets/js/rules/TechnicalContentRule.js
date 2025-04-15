import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for technical content
 */
export default class TechnicalContentRule extends Rule {
    constructor() {
        super(
            "Technical Content",
            (prompt) => {
                // Détection plus sophistiquée de contenu technique
                const technicalTerms = [
                    // Termes techniques généraux
                    /\b(algorithme|fonction|variable|paramètre|API|backend|frontend|framework|library|bibliothèque|requête|système)\b/i,
                    
                    // Langages de programmation et technologies
                    /\b(javascript|python|java|c\+\+|ruby|php|sql|html|css|react|angular|vue|node|django|flask|tensorflow|pytorch)\b/i,
                    
                    // Concepts d'ingénierie
                    /\b(architecture|deployment|déploiement|scalability|performance|optimisation|sécurité|authentication|autorisation|encryption|chiffrement)\b/i,
                    
                    // Formats techniques
                    /\b(json|xml|yaml|csv|api|rest|graphql|websocket|http)\b/i
                ];
                
                // On compte combien de catégories techniques différentes sont présentes
                const techScore = technicalTerms.filter(regex => regex.test(prompt)).length;
                
                // Si au moins 2 catégories techniques sont présentes, c'est du contenu technique
                return techScore >= 2;
            },
            (prompt) => {
                // Calcul de base - 100mL + 5mL par ligne ou 10 mots
                const linesCount = prompt.split('\n').length;
                const wordsCount = prompt.split(/\s+/).length;
                
                // Calculer l'eau basée sur le plus grand des deux
                const lineBasedWater = 100 + (linesCount * 5);
                const wordBasedWater = 100 + Math.floor(wordsCount / 10) * 5;
                
                const baseWater = Math.max(lineBasedWater, wordBasedWater);
                
                // Détecter les cas particuliers qui augmentent la consommation
                const isCodeHeavy = (/\bfunction\b|\bclass\b|\bdef\b|\b=>\b|[{};]/.test(prompt) && 
                                    prompt.split('\n').filter(line => /^\s*[{}]/.test(line)).length >= 3);
                
                // Ajustement final basé sur la complexité
                if (isCodeHeavy) {
                    return Math.round(baseWater * 1.5); // 50% de plus pour du code complexe
                }
                
                return baseWater;
            },
            "100-300 mL pour contenu technique (100mL + 5mL par ligne ou par groupe de 10 mots)"
        );
    }
}