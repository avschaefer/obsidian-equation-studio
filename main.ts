import { App, Modal, Plugin, PluginSettingTab, Setting, Editor, MarkdownView, Notice } from 'obsidian';
import 'mathlive';
import { MathfieldElement } from 'mathlive';

// Declare mathlive types
declare global {
    interface Window {
        mathVirtualKeyboard: {
            show: () => void;
            hide: () => void;
            visible: boolean;
        };
    }
}

interface MathLiveEnhancedSettings {
    defaultMode: 'inline' | 'block';
    showQuickTemplates: boolean;
    virtualKeyboardMode: 'auto' | 'manual' | 'onfocus';
    soundEnabled: boolean;
    recentFormulas: string[];
    maxRecentFormulas: number;
    fontSize: 'small' | 'medium' | 'large';
}

const DEFAULT_SETTINGS: MathLiveEnhancedSettings = {
    defaultMode: 'inline',
    showQuickTemplates: true,
    virtualKeyboardMode: 'onfocus',
    soundEnabled: false,
    recentFormulas: [],
    maxRecentFormulas: 10,
    fontSize: 'medium'
};

// Quick template categories with common formulas
const QUICK_TEMPLATES = {
    'Basic': [
        { label: 'Fraction', latex: '\\frac{a}{b}', icon: '½' },
        { label: 'Square Root', latex: '\\sqrt{x}', icon: '√' },
        { label: 'Power', latex: 'x^{n}', icon: 'xⁿ' },
        { label: 'Subscript', latex: 'x_{i}', icon: 'xᵢ' },
        { label: 'nth Root', latex: '\\sqrt[n]{x}', icon: 'ⁿ√' },
    ],
    'Greek': [
        { label: 'Alpha', latex: '\\alpha', icon: 'α' },
        { label: 'Beta', latex: '\\beta', icon: 'β' },
        { label: 'Gamma', latex: '\\gamma', icon: 'γ' },
        { label: 'Delta', latex: '\\delta', icon: 'δ' },
        { label: 'Theta', latex: '\\theta', icon: 'θ' },
        { label: 'Lambda', latex: '\\lambda', icon: 'λ' },
        { label: 'Pi', latex: '\\pi', icon: 'π' },
        { label: 'Sigma', latex: '\\sigma', icon: 'σ' },
        { label: 'Omega', latex: '\\omega', icon: 'ω' },
    ],
    'Calculus': [
        { label: 'Integral', latex: '\\int_{a}^{b} f(x) \\, dx', icon: '∫' },
        { label: 'Derivative', latex: '\\frac{d}{dx}', icon: 'd/dx' },
        { label: 'Partial', latex: '\\frac{\\partial}{\\partial x}', icon: '∂' },
        { label: 'Limit', latex: '\\lim_{x \\to \\infty}', icon: 'lim' },
        { label: 'Sum', latex: '\\sum_{i=1}^{n}', icon: 'Σ' },
        { label: 'Product', latex: '\\prod_{i=1}^{n}', icon: 'Π' },
    ],
    'Linear Algebra': [
        { label: 'Matrix 2x2', latex: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}', icon: '⊞' },
        { label: 'Matrix 3x3', latex: '\\begin{pmatrix} a & b & c \\\\ d & e & f \\\\ g & h & i \\end{pmatrix}', icon: '⊞₃' },
        { label: 'Determinant', latex: '\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix}', icon: '|·|' },
        { label: 'Vector', latex: '\\vec{v}', icon: 'v⃗' },
        { label: 'Dot Product', latex: '\\vec{a} \\cdot \\vec{b}', icon: '·' },
        { label: 'Cross Product', latex: '\\vec{a} \\times \\vec{b}', icon: '×' },
    ],
    'Logic & Sets': [
        { label: 'For All', latex: '\\forall', icon: '∀' },
        { label: 'Exists', latex: '\\exists', icon: '∃' },
        { label: 'Element Of', latex: '\\in', icon: '∈' },
        { label: 'Subset', latex: '\\subseteq', icon: '⊆' },
        { label: 'Union', latex: '\\cup', icon: '∪' },
        { label: 'Intersection', latex: '\\cap', icon: '∩' },
        { label: 'Implies', latex: '\\Rightarrow', icon: '⇒' },
        { label: 'Iff', latex: '\\Leftrightarrow', icon: '⇔' },
    ],
    'Relations': [
        { label: 'Not Equal', latex: '\\neq', icon: '≠' },
        { label: 'Approx', latex: '\\approx', icon: '≈' },
        { label: 'Less/Equal', latex: '\\leq', icon: '≤' },
        { label: 'Greater/Equal', latex: '\\geq', icon: '≥' },
        { label: 'Much Less', latex: '\\ll', icon: '≪' },
        { label: 'Much Greater', latex: '\\gg', icon: '≫' },
        { label: 'Proportional', latex: '\\propto', icon: '∝' },
    ],
};

export default class MathLiveEnhancedPlugin extends Plugin {
    settings: MathLiveEnhancedSettings;

    async onload() {
        await this.loadSettings();

        // Add command for inline math
        this.addCommand({
            id: 'insert-inline-math',
            name: 'Insert inline math formula',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                new MathLiveModal(this.app, this, editor, 'inline').open();
            },
            hotkeys: [{ modifiers: ['Mod'], key: 'm' }]
        });

        // Add command for block math
        this.addCommand({
            id: 'insert-block-math',
            name: 'Insert block math formula',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                new MathLiveModal(this.app, this, editor, 'block').open();
            },
            hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'm' }]
        });

        // Add command for quick inline (uses default mode)
        this.addCommand({
            id: 'insert-math-quick',
            name: 'Insert math formula (quick)',
            editorCallback: (editor: Editor, view: MarkdownView) => {
                new MathLiveModal(this.app, this, editor, this.settings.defaultMode).open();
            }
        });

        // Add settings tab
        this.addSettingTab(new MathLiveEnhancedSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    addToRecentFormulas(latex: string) {
        if (!latex.trim()) return;
        
        // Remove if already exists
        this.settings.recentFormulas = this.settings.recentFormulas.filter(f => f !== latex);
        
        // Add to beginning
        this.settings.recentFormulas.unshift(latex);
        
        // Trim to max
        if (this.settings.recentFormulas.length > this.settings.maxRecentFormulas) {
            this.settings.recentFormulas = this.settings.recentFormulas.slice(0, this.settings.maxRecentFormulas);
        }
        
        this.saveSettings();
    }
}

class MathLiveModal extends Modal {
    plugin: MathLiveEnhancedPlugin;
    editor: Editor;
    mode: 'inline' | 'block';
    mathfield: MathfieldElement | null = null;
    initialLatex: string = '';
    activeCategory: string = 'Calculus';

    constructor(app: App, plugin: MathLiveEnhancedPlugin, editor: Editor, mode: 'inline' | 'block') {
        super(app);
        this.plugin = plugin;
        this.editor = editor;
        this.mode = mode;
        
        // Check if cursor is inside existing math block and extract it
        this.initialLatex = this.getExistingMath();
    }

    getExistingMath(): string {
        const cursor = this.editor.getCursor();
        const line = this.editor.getLine(cursor.line);
        
        // Check for inline math $...$
        const inlineRegex = /\$([^$]+)\$/g;
        let match;
        while ((match = inlineRegex.exec(line)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            if (cursor.ch >= start && cursor.ch <= end) {
                this.mode = 'inline';
                return match[1];
            }
        }
        
        // Check for block math $$...$$
        const blockRegex = /\$\$([^$]+)\$\$/g;
        while ((match = blockRegex.exec(line)) !== null) {
            const start = match.index;
            const end = start + match[0].length;
            if (cursor.ch >= start && cursor.ch <= end) {
                this.mode = 'block';
                return match[1];
            }
        }
        
        return '';
    }

    onOpen() {
        const { contentEl, modalEl } = this;
        
        // Add custom class for styling
        modalEl.addClass('mathlive-enhanced-modal');
        
        // Main container with Claude-inspired design
        contentEl.empty();
        contentEl.addClass('mathlive-enhanced-container');
        
        // Header
        const header = contentEl.createDiv({ cls: 'mathlive-header' });
        const titleRow = header.createDiv({ cls: 'mathlive-title-row' });
        
        titleRow.createEl('h2', { 
            text: 'Math Formula Editor',
            cls: 'mathlive-title'
        });
        
        // Mode toggle
        const modeToggle = titleRow.createDiv({ cls: 'mathlive-mode-toggle' });
        
        const inlineBtn = modeToggle.createEl('button', {
            text: 'Inline $...$',
            cls: `mathlive-mode-btn ${this.mode === 'inline' ? 'active' : ''}`
        });
        
        const blockBtn = modeToggle.createEl('button', {
            text: 'Block $$...$$',
            cls: `mathlive-mode-btn ${this.mode === 'block' ? 'active' : ''}`
        });
        
        inlineBtn.addEventListener('click', () => {
            this.mode = 'inline';
            inlineBtn.addClass('active');
            blockBtn.removeClass('active');
        });
        
        blockBtn.addEventListener('click', () => {
            this.mode = 'block';
            blockBtn.addClass('active');
            inlineBtn.removeClass('active');
        });

        // Main content area
        const mainContent = contentEl.createDiv({ cls: 'mathlive-main-content' });
        
        // Left sidebar with templates (if enabled)
        if (this.plugin.settings.showQuickTemplates) {
            const sidebar = mainContent.createDiv({ cls: 'mathlive-sidebar' });
            this.createTemplateSidebar(sidebar);
        }
        
        // Editor area
        const editorArea = mainContent.createDiv({ cls: 'mathlive-editor-area' });

        // Quick templates (Basic & Greek) - always visible above mathfield
        const quickTemplatesSection = editorArea.createDiv({ cls: 'mathlive-quick-templates' });

        const quickHeader = quickTemplatesSection.createDiv({ cls: 'mathlive-quick-header' });
        quickHeader.createSpan({ text: 'Quick Templates', cls: 'mathlive-quick-title' });
        const hideBtn = quickHeader.createEl('button', {
            text: 'Hide',
            cls: 'mathlive-quick-hide-btn'
        });

        const quickBody = quickTemplatesSection.createDiv({ cls: 'mathlive-quick-body' });

        // Basic row
        const basicRow = quickBody.createDiv({ cls: 'mathlive-quick-row' });
        basicRow.createSpan({ text: 'Basic', cls: 'mathlive-quick-row-label' });
        const basicBtns = basicRow.createDiv({ cls: 'mathlive-quick-btns' });
        QUICK_TEMPLATES['Basic'].forEach(t => {
            const btn = basicBtns.createEl('button', {
                cls: 'mathlive-quick-btn',
                attr: { title: t.label }
            });
            btn.createSpan({ text: t.icon });
            btn.addEventListener('click', () => {
                if (this.mathfield) {
                    this.mathfield.insert(t.latex, {
                        insertionMode: 'insertAfter',
                        selectionMode: 'placeholder'
                    });
                    this.mathfield.focus();
                }
            });
        });

        // Greek row
        const greekRow = quickBody.createDiv({ cls: 'mathlive-quick-row' });
        greekRow.createSpan({ text: 'Greek', cls: 'mathlive-quick-row-label' });
        const greekBtns = greekRow.createDiv({ cls: 'mathlive-quick-btns' });
        QUICK_TEMPLATES['Greek'].forEach(t => {
            const btn = greekBtns.createEl('button', {
                cls: 'mathlive-quick-btn',
                attr: { title: t.label }
            });
            btn.createSpan({ text: t.icon });
            btn.addEventListener('click', () => {
                if (this.mathfield) {
                    this.mathfield.insert(t.latex, {
                        insertionMode: 'insertAfter',
                        selectionMode: 'placeholder'
                    });
                    this.mathfield.focus();
                }
            });
        });

        // Toggle hide/show for quick templates
        hideBtn.addEventListener('click', () => {
            const isHidden = quickBody.hasClass('is-hidden');
            quickBody.toggleClass('is-hidden', !isHidden);
            hideBtn.textContent = isHidden ? 'Hide' : 'Show';
        });

        // Create mathfield container
        const mathfieldContainer = editorArea.createDiv({ cls: 'mathlive-mathfield-container' });
        
        // Ensure web component is defined before creating element
        if (!customElements.get('math-field')) {
            customElements.define('math-field', MathfieldElement);
        }

        // Create the mathfield element via DOM API
        this.mathfield = document.createElement('math-field') as MathfieldElement;
        this.mathfield.classList.add('mathlive-mathfield');
        
        // Set font size based on settings
        const fontSizes = { small: '18px', medium: '24px', large: '32px' };
        this.mathfield.style.fontSize = fontSizes[this.plugin.settings.fontSize];
        
        // Disable sounds if configured
        if (!this.plugin.settings.soundEnabled) {
            MathfieldElement.keypressSound = null;
            MathfieldElement.plonkSound = null;
        }
        
        // Append to DOM first, then configure
        mathfieldContainer.appendChild(this.mathfield);

        // Configure mathfield properties after mounting
        this.mathfield.mathVirtualKeyboardPolicy = this.plugin.settings.virtualKeyboardMode === 'auto' ? 'auto' : 'manual';
        this.mathfield.smartMode = true;
        this.mathfield.smartFence = true;
        this.mathfield.smartSuperscript = true;

        // Set initial value after mount
        if (this.initialLatex) {
            this.mathfield.value = this.initialLatex;
        }

        // Listen for mount event for reliable initialization
        this.mathfield.addEventListener('mount', () => {
            if (this.mathfield) {
                this.mathfield.smartMode = true;
                this.mathfield.smartFence = true;
                this.mathfield.smartSuperscript = true;
                
                if (this.initialLatex) {
                    this.mathfield.value = this.initialLatex;
                }
                
                this.mathfield.focus();
            }
        });
        
        // Settings button (virtual keyboard toggle) inside mathfield container
        const settingsBtn = mathfieldContainer.createEl('button', {
            text: '⚙',
            cls: 'mathlive-settings-btn',
            attr: { title: 'Toggle Virtual Keyboard' }
        });

        settingsBtn.addEventListener('click', () => {
            if (this.mathfield) {
                this.mathfield.focus();
                try {
                    const kb = window.mathVirtualKeyboard;
                    if (kb) {
                        if (kb.visible) {
                            kb.hide();
                        } else {
                            kb.show();
                        }
                    }
                } catch (e) {
                    // Virtual keyboard may not be available in this environment
                    new Notice('Virtual keyboard is not available');
                }
            }
        });
        
        // LaTeX preview
        const previewSection = editorArea.createDiv({ cls: 'mathlive-preview-section' });
        previewSection.createEl('label', { text: 'LaTeX Output:', cls: 'mathlive-label' });
        const latexPreview = previewSection.createEl('code', { 
            cls: 'mathlive-latex-preview',
            text: this.initialLatex || 'Your LaTeX will appear here...'
        });
        
        // Update preview on input
        this.mathfield.addEventListener('input', () => {
            if (this.mathfield) {
                latexPreview.textContent = this.mathfield.value || 'Your LaTeX will appear here...';
            }
        });
        
        // Recent formulas section
        if (this.plugin.settings.recentFormulas.length > 0) {
            const recentSection = editorArea.createDiv({ cls: 'mathlive-recent-section' });
            recentSection.createEl('label', { text: 'Recent Formulas:', cls: 'mathlive-label' });
            const recentList = recentSection.createDiv({ cls: 'mathlive-recent-list' });
            
            this.plugin.settings.recentFormulas.slice(0, 5).forEach(formula => {
                const chip = recentList.createEl('button', {
                    cls: 'mathlive-recent-chip'
                });
                
                // Render a small preview
                const preview = document.createElement('math-span') as any;
                preview.textContent = formula.length > 20 ? formula.substring(0, 20) + '...' : formula;
                chip.appendChild(preview);
                
                chip.addEventListener('click', () => {
                    if (this.mathfield) {
                        this.mathfield.value = formula;
                        latexPreview.textContent = formula;
                    }
                });
            });
        }
        
        // Action buttons
        const actions = contentEl.createDiv({ cls: 'mathlive-actions' });
        
        const cancelBtn = actions.createEl('button', {
            text: 'Cancel',
            cls: 'mathlive-btn mathlive-btn-secondary'
        });
        
        const insertBtn = actions.createEl('button', {
            text: 'Insert Formula',
            cls: 'mathlive-btn mathlive-btn-primary'
        });
        
        cancelBtn.addEventListener('click', () => this.close());
        insertBtn.addEventListener('click', () => this.insertFormula());
        
        // Keyboard shortcuts
        this.mathfield.addEventListener('keydown', (e: KeyboardEvent) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                this.insertFormula();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.close();
            }
        });
        
        // Focus the mathfield after modal animation completes
        setTimeout(() => {
            if (this.mathfield) {
                this.mathfield.focus();
                this.mathfield.executeCommand('moveToMathfieldEnd');
            }
        }, 300);
    }

    createTemplateSidebar(container: HTMLElement) {
        const categories = Object.keys(QUICK_TEMPLATES).filter(c => c !== 'Basic' && c !== 'Greek');
        
        // Category tabs
        const tabs = container.createDiv({ cls: 'mathlive-template-tabs' });
        
        categories.forEach(category => {
            const tab = tabs.createEl('button', {
                text: category,
                cls: `mathlive-tab ${category === this.activeCategory ? 'active' : ''}`
            });
            
            tab.addEventListener('click', () => {
                this.activeCategory = category;
                tabs.querySelectorAll('.mathlive-tab').forEach(t => t.removeClass('active'));
                tab.addClass('active');
                this.renderTemplates(container);
            });
        });
        
        // Template grid
        this.renderTemplates(container);
    }

    renderTemplates(container: HTMLElement) {
        // Remove existing grid
        const existingGrid = container.querySelector('.mathlive-template-grid');
        if (existingGrid) existingGrid.remove();
        
        const grid = container.createDiv({ cls: 'mathlive-template-grid' });
        const templates = QUICK_TEMPLATES[this.activeCategory as keyof typeof QUICK_TEMPLATES];
        
        templates.forEach(template => {
            const btn = grid.createEl('button', {
                cls: 'mathlive-template-btn',
                attr: { title: template.label }
            });
            
            btn.createSpan({ text: template.icon, cls: 'mathlive-template-icon' });
            btn.createSpan({ text: template.label, cls: 'mathlive-template-label' });
            
            btn.addEventListener('click', () => {
                if (this.mathfield) {
                    this.mathfield.insert(template.latex, {
                        insertionMode: 'insertAfter',
                        selectionMode: 'placeholder'
                    });
                    this.mathfield.focus();
                }
            });
        });
    }

    insertFormula() {
        if (!this.mathfield) return;
        
        const latex = this.mathfield.value;
        if (!latex.trim()) {
            new Notice('Please enter a formula');
            return;
        }
        
        // Format based on mode
        const formatted = this.mode === 'inline' 
            ? `$${latex}$` 
            : `$$${latex}$$`;
        
        // If we were editing existing math, replace it
        if (this.initialLatex) {
            const cursor = this.editor.getCursor();
            const line = this.editor.getLine(cursor.line);
            
            // Find and replace the existing math
            const searchPattern = this.mode === 'inline' 
                ? `$${this.initialLatex}$`
                : `$$${this.initialLatex}$$`;
            
            const newLine = line.replace(searchPattern, formatted);
            this.editor.setLine(cursor.line, newLine);
        } else {
            // Insert at cursor
            this.editor.replaceSelection(formatted);
        }
        
        // Add to recent formulas
        this.plugin.addToRecentFormulas(latex);
        
        this.close();
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
        
        // Clean up mathfield
        if (this.mathfield) {
            this.mathfield.remove();
            this.mathfield = null;
        }
    }
}

class MathLiveEnhancedSettingTab extends PluginSettingTab {
    plugin: MathLiveEnhancedPlugin;

    constructor(app: App, plugin: MathLiveEnhancedPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        containerEl.createEl('h2', { text: 'Equation Studio Settings' });

        new Setting(containerEl)
            .setName('Default mode')
            .setDesc('Default math mode when using quick insert')
            .addDropdown(dropdown => dropdown
                .addOption('inline', 'Inline ($...$)')
                .addOption('block', 'Block ($$...$$)')
                .setValue(this.plugin.settings.defaultMode)
                .onChange(async (value) => {
                    this.plugin.settings.defaultMode = value as 'inline' | 'block';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Show quick templates')
            .setDesc('Display template sidebar with common formulas')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.showQuickTemplates)
                .onChange(async (value) => {
                    this.plugin.settings.showQuickTemplates = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Virtual keyboard')
            .setDesc('When to show the virtual math keyboard')
            .addDropdown(dropdown => dropdown
                .addOption('auto', 'Auto (touch devices)')
                .addOption('onfocus', 'On focus')
                .addOption('manual', 'Manual only')
                .setValue(this.plugin.settings.virtualKeyboardMode)
                .onChange(async (value) => {
                    this.plugin.settings.virtualKeyboardMode = value as 'auto' | 'manual' | 'onfocus';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Font size')
            .setDesc('Size of the formula in the editor')
            .addDropdown(dropdown => dropdown
                .addOption('small', 'Small')
                .addOption('medium', 'Medium')
                .addOption('large', 'Large')
                .setValue(this.plugin.settings.fontSize)
                .onChange(async (value) => {
                    this.plugin.settings.fontSize = value as 'small' | 'medium' | 'large';
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Sound effects')
            .setDesc('Enable keyboard sound effects')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.soundEnabled)
                .onChange(async (value) => {
                    this.plugin.settings.soundEnabled = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('Clear recent formulas')
            .setDesc('Clear your formula history')
            .addButton(button => button
                .setButtonText('Clear History')
                .onClick(async () => {
                    this.plugin.settings.recentFormulas = [];
                    await this.plugin.saveSettings();
                    new Notice('Formula history cleared');
                }));
    }
}
