// filepath: /home/jdlxt/__dev/experiments/waterai/assets/js/rules/AnalyticalIntentRule.js
import Rule from '../Rule.js';

/**
 * Rule for estimating water usage for analytical tasks
 */
export default class AnalyticalIntentRule extends Rule {
    constructor() {
        super(
            "Analytical Intent",
            (prompt) => {
                // Analyse d'intention beaucoup plus sophistiquée
                const promptLowerCase = prompt.toLowerCase();
                
                // 1. Verbes d'analyse et de raisonnement
                const analyticalVerbs = /\b(analyse[rz]?|expliqu|explqu|compar|résum|dédui|interprèt|critiqu|argument|défini|modélis|justifi|détaill|évaluer|synthétis)\b/i;
                
                // 2. Indicateurs de demande approfondie
                const depthIndicators = /\b(profondeur|détail|complet|exhausti|nuancé|précis|rigoureux|méthodique)\b/i;
                
                // 3. Questions complexes et interrogations avancées
                const complexQuestions = /\bpourquoi\b.{10,}|comment\b.{10,}|\bquel.{0,3}\b.{0,10}\b(différence|rapport|lien|relation|impact|conséquence|implication)\b/i;
                
                // 4. Structures de demande d'analyse
                const analyticalStructures = /\b(avantages et inconvénients|pour et contre|forces et faiblesses|causes et conséquences|différences entre|en \d+ points)\b/i;
                
                // 5. Mots-clés de disciplines académiques ou techniques nécessitant analyse
                const academicFields = /\b(philosophie|sociologie|psychologie|politique|économie|histoire|littérature|science|théorie|intelligence artificielle|IA|machine learning|apprentissage automatique|informatique|technologie)\b/i;
                
                // Score pour évaluer l'intention analytique
                let analyticalScore = 0;
                if (analyticalVerbs.test(promptLowerCase)) analyticalScore += 2;
                if (depthIndicators.test(promptLowerCase)) analyticalScore += 1;
                if (complexQuestions.test(promptLowerCase)) analyticalScore += 2;
                if (analyticalStructures.test(promptLowerCase)) analyticalScore += 3;
                if (academicFields.test(promptLowerCase)) analyticalScore += 1;
                
                // Conditions spéciales qui méritent des points supplémentaires
                if (/\b(expliqu|explqu).{0,10}comment\b/i.test(promptLowerCase) && 
                    /\b(fonctionne|marche|opère|se déroule)\b/i.test(promptLowerCase)) {
                  analyticalScore += 1;
                }
                
                // Seuil d'intention analytique/cognitive
                return analyticalScore >= 3;
            },
            (prompt) => {
                const promptLowerCase = prompt.toLowerCase();
                
                // Base pour tâche cognitive
                let waterUsage = 100;
                
                // Facteurs augmentant la consommation
                // 1. Analyse multidimensionnelle complexe
                if (/\b(multifactoriel|plusieurs perspectives|plusieurs angles|plusieurs aspects|différents points de vue)\b/i.test(promptLowerCase)) {
                  waterUsage += 50;
                }
                
                // 2. Demande de créativité intellectuelle
                if (/\b(innov|créati|original|nouvelle approche|jamais vu|perspectiv)\b/i.test(promptLowerCase)) {
                  waterUsage += 30;
                }
                
                // 3. Demande de précision extrême
                if (/\b(très précis|extrêmement détaillé|méticuleusement|exhaustivement)\b/i.test(promptLowerCase)) {
                  waterUsage += 40;
                }
                
                // 4. Sujets complexes spécifiques
                if (/\b(intelligence artificielle|IA|machine learning|algorithme|quantum|quantique|neurosciences)\b/i.test(promptLowerCase)) {
                  waterUsage += 30;
                }
                
                return waterUsage;
            },
            "100-250 mL pour tâches nécessitant analyse, réflexion ou raisonnement complexe"
        );
    }
}