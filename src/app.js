import ThirstyAI from './assets/js/ThirstyAI.js';
import Rule from './assets/js/Rule.js';

/**
 * Thirsty !AI Application
 * User interface for estimating water consumption of AI prompts
 */
class ThirstyAIApp {
    constructor() {
        // Initialize water estimator
        this.thirstyAI = new ThirstyAI();
        
        // DOM elements
        this.promptInput = document.getElementById('user-prompt');
        this.estimateButton = document.getElementById('estimate-btn');
        this.messagesContainer = document.getElementById('messages-container');
        this.aboutModalBtn = document.getElementById('about-modal-btn');
        this.explanationModal = document.getElementById('explanation-modal');
        this.disclaimerModal = document.getElementById('disclaimer-modal');
        this.closeExplanationModalBtn = document.querySelector('#explanation-modal .close-modal');
        this.closeDisclaimerModalBtn = document.querySelector('#disclaimer-modal .close-modal');
        this.disclaimerContinueBtn = document.getElementById('disclaimer-continue');
        
        // Mobile responsive elements
        this.menuToggle = document.getElementById('menu-toggle');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebar-overlay');
        
        // Chat history
        this.chatHistory = [];
        
        // Attach events
        this.attachEvents();
        
        // Auto resize textarea
        this.setupTextareaAutoResize();
        
        // Show the disclaimer modal on startup
        this.showDisclaimerOnStartup();
    }
    
    /**
     * Attach event handlers
     */
    attachEvents() {
        this.estimateButton.addEventListener('click', () => this.handlePromptSubmission());
        
        // Submit with Enter (but allow Shift+Enter for new lines)
        this.promptInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.handlePromptSubmission();
            }
        });
        
        // Open explanation modal
        this.aboutModalBtn.addEventListener('click', () => this.openModal());
        
        // Close explanation modal with X button
        if (this.closeExplanationModalBtn) {
            this.closeExplanationModalBtn.addEventListener('click', () => this.closeModalHandler());
        }
        
        // Close disclaimer modal with X button
        if (this.closeDisclaimerModalBtn) {
            this.closeDisclaimerModalBtn.addEventListener('click', () => this.closeDisclaimerModalHandler());
        }
        
        // Close disclaimer modal with continue button
        if (this.disclaimerContinueBtn) {
            this.disclaimerContinueBtn.addEventListener('click', () => this.closeDisclaimerModalHandler());
        }
        
        // Close modals when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === this.explanationModal) {
                this.closeModalHandler();
            }
            if (event.target === this.disclaimerModal) {
                this.closeDisclaimerModalHandler();
            }
        });
        
        // Close modals with Escape key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                if (this.explanationModal.classList.contains('show')) {
                    this.closeModalHandler();
                }
                if (this.disclaimerModal && this.disclaimerModal.classList.contains('show')) {
                    this.closeDisclaimerModalHandler();
                }
            }
        });
        
        // Mobile menu toggle
        if (this.menuToggle) {
            this.menuToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Close sidebar when clicking outside
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => this.closeSidebar());
        }
        
        // Handle window resize for responsive layout
        window.addEventListener('resize', () => this.handleResize());
    }
    
    /**
     * Show disclaimer modal on startup
     */
    showDisclaimerOnStartup() {
        // Pour les tests, forcer l'affichage du disclaimer à chaque chargement de page
        // en décommentant la ligne ci-dessous et en commentant le reste de la fonction
        this.openDisclaimerModal();
        localStorage.removeItem('thirstyAI_hasSeenDisclaimer'); // Réinitialiser pour le prochain chargement

        // Code original ci-dessous
        /*
        // Check if we've shown the disclaimer before
        const hasSeenDisclaimer = localStorage.getItem('thirstyAI_hasSeenDisclaimer');
        
        // Always show disclaimer on first visit, then only once per day
        if (!hasSeenDisclaimer || Date.now() - parseInt(hasSeenDisclaimer) > 24 * 60 * 60 * 1000) {
            setTimeout(() => {
                this.openDisclaimerModal();
                // Set flag that user has seen disclaimer
                localStorage.setItem('thirstyAI_hasSeenDisclaimer', Date.now().toString());
            }, 500);
        }
        */
    }
    
    /**
     * Open the disclaimer modal
     */
    openDisclaimerModal() {
        if (this.disclaimerModal) {
            this.disclaimerModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    }
    
    /**
     * Close the disclaimer modal
     */
    closeDisclaimerModalHandler() {
        if (this.disclaimerModal) {
            this.disclaimerModal.classList.remove('show');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }
    
    /**
     * Toggle sidebar on mobile
     */
    toggleSidebar() {
        this.sidebar.classList.toggle('active');
        this.sidebarOverlay.classList.toggle('active');
        document.body.classList.toggle('sidebar-open');
    }
    
    /**
     * Close sidebar
     */
    closeSidebar() {
        this.sidebar.classList.remove('active');
        this.sidebarOverlay.classList.remove('active');
        document.body.classList.remove('sidebar-open');
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        // If window width is greater than 768px and sidebar is open on mobile, close it
        if (window.innerWidth > 768 && this.sidebar.classList.contains('active')) {
            this.closeSidebar();
        }
    }
    
    /**
     * Open the explanation modal
     */
    openModal() {
        this.explanationModal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    /**
     * Close the explanation modal
     */
    closeModalHandler() {
        this.explanationModal.classList.remove('show');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    /**
     * Auto resize textarea as user types
     */
    setupTextareaAutoResize() {
        const textarea = this.promptInput;
        
        // Function to adjust height
        const adjustHeight = () => {
            textarea.style.height = 'auto';
            textarea.style.height = (textarea.scrollHeight) + 'px';
        };
        
        // Add event listeners
        textarea.addEventListener('input', adjustHeight);
        textarea.addEventListener('focus', adjustHeight);
        
        // Initial adjustment
        setTimeout(adjustHeight, 0);
    }
    
    /**
     * Handle prompt submission
     */
    handlePromptSubmission() {
        const promptText = this.promptInput.value.trim();
        
        if (promptText === '') return;
        
        // Add user message to chat
        this.addUserMessage(promptText);
        
        // Clear input
        this.promptInput.value = '';
        this.promptInput.style.height = 'auto';
        
        // Get water estimation
        const estimation = this.thirstyAI.estimate(promptText);

        // Show estimation in chat
        this.addAssistantMessage(estimation);
        
        // Save to history
        this.saveToHistory(promptText);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    /**
     * Add user message to chat
     * @param {string} text - User prompt text
     */
    addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user';
        
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-user"></i>
            </div>
            <div class="message-content">
                <p>${this.escapeHTML(text)}</p>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
    }
    
    /**
     * Add assistant (Thirsty !AI) message to chat
     * @param {Object} estimation - Water estimation result
     */
    addAssistantMessage(estimation) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message assistant';
        
        // Get impact icon based on water usage
        let impactIcon, impactClass;
        if (estimation.totalWater < 100) {
            impactIcon = '<i class="fas fa-smile-beam"></i>';
            impactClass = 'impact-low';
        } else if (estimation.totalWater < 500) {
            impactIcon = '<i class="fas fa-meh"></i>';
            impactClass = 'impact-medium';
        } else {
            impactIcon = '<i class="fas fa-frown"></i>';
            impactClass = 'impact-high';
        }
        
        let detailsHTML = '';
        if (estimation.details && estimation.details.length > 0) {
            detailsHTML = `
                <div id="water-details">
                    <h3>Détails de l'estimation</h3>
                    <ul id="estimation-details-list">
                        ${estimation.details.map(detail => `
                            <li>
                                <div>${this.getRuleIcon(detail.rule)} <strong>${detail.rule}:</strong> ${detail.description}</div>
                                <span class="detail-water">${detail.water} ml</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            <div class="message-icon">
                <i class="fas fa-tint"></i>
            </div>
            <div class="message-content">
                <div id="water-estimation-result">
                    <h3 class="${impactClass}">${impactIcon} ${estimation.message}</h3>
                    <div class="water-usage">
                        <span class="water-icon"><i class="fas fa-tint"></i></span>
                        <span class="water-amount">${estimation.totalWater} ml d'eau</span>
                    </div>
                    <div class="water-fill" style="width: ${Math.min(estimation.totalWater / 10, 100)}%;"></div>
                </div>
                ${detailsHTML}
            </div>
        `;
        
        this.messagesContainer.appendChild(messageDiv);
        
        // Animate water fill after adding to DOM
        setTimeout(() => {
            const waterFill = messageDiv.querySelector('.water-fill');
            if (waterFill) {
                waterFill.style.width = `${Math.min(estimation.totalWater / 10, 100)}%`;
            }
        }, 100);
    }
    
    /**
     * Save prompt to history
     * @param {string} promptText - The prompt to save
     */
    saveToHistory(promptText) {
        // Save to chat history
        this.chatHistory.push(promptText);
    }
    
    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    /**
     * Get appropriate icon for a rule
     * @param {string} ruleName - Name of the rule
     * @returns {string} HTML for the icon
     */
    getRuleIcon(ruleName) {
        const iconMap = {
            'Prompt Size': '<i class="fas fa-text-width"></i>',
            'Complex Words': '<i class="fas fa-book"></i>',
            'Image Generation': '<i class="fas fa-image"></i>',
            'Technical Content': '<i class="fas fa-laptop-code"></i>',
            'Structured Code': '<i class="fas fa-code"></i>',
            'Long Prompt': '<i class="fas fa-file-alt"></i>',
            'Analytical Intent': '<i class="fas fa-brain"></i>',
            'Foreign or Extended Charset': '<i class="fas fa-language"></i>',
        };
        
        return iconMap[ruleName] || '<i class="fas fa-water"></i>';
    }
    
    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    escapeHTML(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
            .replace(/\n/g, "<br>");
    }
    
    /**
     * Add a new estimation rule
     * @param {Rule} rule - The rule to add
     */
    addRule(rule) {
        this.thirstyAI.addRuleInstance(rule);
    }
    
    /**
     * Add a new estimation rule using parameters
     * @param {string} name - Rule name
     * @param {Function} condition - Function that checks if the rule applies
     * @param {Function} estimation - Function that calculates water estimation
     * @param {string} description - Rule description
     */
    addEstimationRule(name, condition, estimation, description) {
        const rule = new Rule(name, condition, estimation, description);
        this.addRule(rule);
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new ThirstyAIApp();
    
    // Make globally accessible for debugging
    window.thirstyAIApp = app;
});