/**
 * Rule Class
 * Represents a single water estimation rule
 */
class Rule {
    /**
     * Create a new rule
     * @param {string} name - Rule name
     * @param {Function} condition - Function that checks if the rule applies
     * @param {Function} estimation - Function that calculates water estimation
     * @param {string} description - Rule description
     */
    constructor(name, condition, estimation, description) {
        this.name = name;
        this.condition = condition;
        this.estimation = estimation;
        this.description = description;
    }

    /**
     * Check if this rule applies to the given prompt
     * @param {string} prompt - The prompt to check
     * @returns {boolean} True if the rule applies
     */
    applies(prompt) {
        return this.condition(prompt);
    }

    /**
     * Calculate water usage for this rule
     * @param {string} prompt - The prompt to evaluate
     * @returns {number} Water usage in ml
     */
    calculateWaterUsage(prompt) {
        return this.estimation(prompt);
    }

    /**
     * Get the rule description
     * @returns {string} Description of the rule
     */
    getDescription() {
        return this.description;
    }
}

// Export class for use in other files
export default Rule;