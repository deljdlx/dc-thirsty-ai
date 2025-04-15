import Rule from './Rule.js';
import defaultRules from './defaultRules.js';
import RuleManager from './RuleManager.js';

/**
 * ThirstyAI Class
 * Estimates water consumption of AI prompts
 */
class ThirstyAI {
    constructor(initialRules = []) {
        // Instance de RuleManager pour gérer les règles
        this.ruleManager = new RuleManager();
        
        // Initialiser avec les règles fournies ou les règles par défaut
        if (initialRules.length > 0) {
            this.ruleManager.addRules(initialRules);
        } else {
            this.addDefaultRules();
        }
    }
    
    /**
     * Add an estimation rule
     * @param {string} name - Rule name
     * @param {Function} condition - Function that checks if the rule applies
     * @param {Function} estimation - Function that calculates water estimation
     * @param {string} description - Rule description
     */
    addRule(name, condition, estimation, description) {
        const rule = new Rule(name, condition, estimation, description);
        this.ruleManager.addRule(rule);
    }
    
    /**
     * Add a Rule instance directly
     * @param {Rule} rule - The rule to add
     */
    addRuleInstance(rule) {
        if (rule instanceof Rule) {
            this.ruleManager.addRule(rule);
        } else {
            console.error("Invalid rule object. Must be an instance of Rule class.");
        }
    }
    
    /**
     * Initialize default rules
     */
    addDefaultRules() {
        // Si defaultRules est un RuleManager (notre nouveau format)
        if (defaultRules.getAllRules && typeof defaultRules.getAllRules === 'function') {
            // Obtenir toutes les règles du gestionnaire
            const rules = defaultRules.getAllRules();
            // Ajouter chaque règle individuellement
            this.ruleManager.addRules(rules);
        } 
        // Si defaultRules est encore un tableau (ancienne implémentation)
        else if (Array.isArray(defaultRules)) {
            // Ancienne implémentation: defaultRules est un tableau de règles
            this.ruleManager.addRules(defaultRules);
        }
        else {
            console.error("defaultRules est ni un RuleManager ni un tableau de règles");
        }
    }
    
    /**
     * Estimate water consumption for a given prompt
     * @param {string} prompt - The prompt to evaluate
     * @returns {Object} result with total and details
     */
    estimate(prompt) {
        if (!prompt || prompt.trim() === "") {
            return {
                totalWater: 0,
                details: [],
                message: "No text to evaluate."
            };
        }
        
        // Utilise directement les méthodes du RuleManager
        const ruleResults = this.ruleManager.evaluatePrompt(prompt);
        const totalWater = this.ruleManager.calculateTotalWaterUsage(prompt);
        
        // Formater les détails comme attendu par l'interface
        const details = ruleResults.map(result => ({
            rule: result.name,
            water: result.waterUsage,
            description: result.description
        }));
        
        // Summary message
        let message = "";
        if (totalWater < 100) {
            message = "Low ecological impact";
        } else if (totalWater < 500) {
            message = "Moderate ecological impact";
        } else {
            message = "High ecological impact";
        }
        
        return {
            totalWater: Math.round(totalWater * 10) / 10, // Round to 1 decimal place
            details,
            message
        };
    }
    
    /**
     * Accéder au RuleManager sous-jacent
     * @returns {RuleManager} - Le gestionnaire de règles utilisé par ThirstyAI
     */
    getRuleManager() {
        return this.ruleManager;
    }
    
    /**
     * Récupère toutes les règles actuellement utilisées
     * @returns {Array<Rule>} - Tableau de toutes les règles
     */
    getAllRules() {
        return this.ruleManager.getAllRules();
    }
    
    /**
     * Trouve les règles qui contribuent le plus à la consommation pour un prompt
     * @param {string} prompt - Le prompt à évaluer
     * @param {number} count - Nombre de règles principales à retourner
     * @returns {Array<Object>} - Les règles principales contribuant à la consommation
     */
    findTopContributors(prompt, count = 3) {
        return this.ruleManager.findTopContributingRules(prompt, count);
    }
}

// Export class for use in other files
export default ThirstyAI;