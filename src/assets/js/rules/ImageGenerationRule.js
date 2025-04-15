import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for image generation requests
 */
export default class ImageGenerationRule extends Rule {
    constructor() {
        super(
            "Image Generation",
            (prompt) => {
                // 1. Expression plus précise pour la génération d'images
                const imageGenTerms = /\b(génère|crée|dessine|produis|fais|réalise)\b.{0,30}\b(image|photo|visuel|illustration|graphique|dessin)\b|\b(image|photo|visuel|illustration)\b.{0,30}\b(de|d'un|d'une)\b/i;
                
                // 2. Mots-clés spécifiques aux outils de génération d'images
                const aiArtTools = /\b(dall-?e|midjourney|stable diffusion|dream studio|imagen|ai art|art génératif)\b/i;
                
                // 3. Caractéristiques visuelles spécifiques (indiquant une description d'image)
                const visualDescriptors = /\b(style|fond|arrière-plan|premier plan|couleur)\b.{0,30}\b(image|photo|visuel|dessin)\b|\b(photoréaliste|rendu 3D|concept art)\b/i;
                
                // 4. Exclusion des contextes où on parle "d'image" sans vouloir en générer
                const negativeContexts = /\b(cet exemple|cette image montre|l'image ci-dessus|l'image dans|insérer une image|télécharger une image)\b/i;
                
                // Si contexte négatif, on ne considère pas comme génération d'image
                if (negativeContexts.test(prompt)) {
                    return false;
                }
                
                // On compte le nombre d'indicateurs positifs
                let score = 0;
                if (imageGenTerms.test(prompt)) score += 2;
                if (aiArtTools.test(prompt)) score += 3;
                if (visualDescriptors.test(prompt)) score += 1;
                
                // Seuil minimal pour considérer comme demande de génération d'image
                return score >= 2;
            },
            (prompt) => {
                // Calcul plus nuancé de la consommation d'eau basé sur la complexité
                const promptLowerCase = prompt.toLowerCase();
                let baseWaterUsage = 600; // Valeur de base pour la génération d'image
                
                // Facteurs d'augmentation
                if (/\b(haute résolution|détaillé|photoréaliste|hd)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 200; // Les images haute qualité consomment plus
                }
                
                if (/\b(3d|rendu|texture|ombres|lumière|éclairage)\b/i.test(promptLowerCase)) {
                    baseWaterUsage += 150; // Les rendus 3D sont plus complexes
                }
                
                return baseWaterUsage;
            },
            "600-950 mL pour toute demande de génération d'image, selon la complexité demandée"
        );
    }
}