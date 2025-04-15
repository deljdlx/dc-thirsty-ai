import Rule from '../Rule.js';

/**
 * Rule for estimating water usage based on prompt size (in tokens)
 */
export default class PromptSizeRule extends Rule {
    constructor() {
        super(
            "Prompt Size",
            (prompt) => prompt.length > 0,
            (prompt) => {
                // Méthode plus sophistiquée pour estimer les tokens
                // Prise en compte des espaces, symboles, nombres différemment
                let tokenEstimate = 0;
                
                // Diviser par type de contenu
                const text = prompt.replace(/[^\w\s]/g, ' '); // Texte simple
                const nonText = prompt.length - text.length; // Symboles et caractères spéciaux
                
                // Estimation basée sur des règles OpenAI/GPT (approximative)
                // ~4 caractères = 1 token pour du texte simple
                // ~2.5 caractères = 1 token pour des symboles/non-texte
                tokenEstimate = Math.ceil(text.length / 4) + Math.ceil(nonText / 2.5);
                
                // Calcul d'eau - ajout d'un minimum pour éviter les valeurs trop faibles
                return Math.max(5, Math.round(tokenEstimate * 0.5));
            },
            "0.5 mL par token estimé (analyse sophistiquée du texte et symboles)"
        );
    }
}