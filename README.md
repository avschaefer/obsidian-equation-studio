# MathLive Enhanced - Obsidian Plugin

An enhanced visual LaTeX formula editor for Obsidian with a modern Claude-inspired UI, quick templates, and improved user experience.

![MathLive Enhanced](https://img.shields.io/badge/Obsidian-Plugin-7C3AED?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-D97706?style=for-the-badge)

## ✨ Features

### 🎨 Modern Claude-Inspired Design
- Clean, minimal interface with thoughtful typography
- Beautiful light and dark theme support
- Smooth animations and transitions
- Accessible focus states

### 📝 Visual LaTeX Editing
- Real-time formula rendering as you type
- Smart mode for automatic text/math switching
- Smart fences and superscripts
- Full virtual keyboard support

### ⚡ Quick Templates
Categorized template sidebar with 40+ common formulas:
- **Basic**: Fractions, roots, powers, subscripts
- **Greek**: All common Greek letters
- **Calculus**: Integrals, derivatives, limits, sums
- **Linear Algebra**: Matrices, vectors, determinants
- **Logic & Sets**: Quantifiers, set operations
- **Relations**: Inequalities, approximations

### 🔄 Smart Features
- Edit existing formulas by clicking inside them
- Recent formulas history for quick reuse
- Inline ($...$) and block ($$...$$) mode toggle
- LaTeX output preview
- Keyboard shortcuts for power users

## 🚀 Installation

### From Community Plugins (Recommended)
1. Open Obsidian Settings
2. Navigate to Community Plugins
3. Search for "equations-ui"
4. Click Install, then Enable

### Manual Installation (For Development/Testing)

1. **Clone or download this repository**:
   ```bash
   git clone https://github.com/your-repo/obsidian-mathlive-enhanced.git
   cd obsidian-mathlive-enhanced
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build the plugin**:
   ```bash
   npm run build
   ```

4. **Copy to your Obsidian vault**:
   ```bash
   # Create the plugin directory in your vault
   mkdir -p /path/to/your/vault/.obsidian/plugins/mathlive-enhanced
   
   # Copy the required files
   cp main.js manifest.json styles.css /path/to/your/vault/.obsidian/plugins/mathlive-enhanced/
   ```

5. **Enable the plugin**:
   - Open Obsidian
   - Go to Settings → Community Plugins
   - Find "MathLive Enhanced" and enable it

### Development Mode

For active development with hot-reload:

```bash
npm run dev
```

This will watch for changes and automatically rebuild `main.js`.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + M` | Insert inline math |
| `Ctrl/Cmd + Shift + M` | Insert block math |
| `Ctrl/Cmd + Enter` | Insert formula (in modal) |
| `Escape` | Close modal |

## 🎛️ Settings

Access settings via Obsidian Settings → MathLive Enhanced:

- **Default Mode**: Choose inline or block as default
- **Quick Templates**: Show/hide template sidebar
- **Virtual Keyboard**: Auto, on-focus, or manual
- **Font Size**: Small, medium, or large
- **Sound Effects**: Enable/disable keyboard sounds
- **Clear History**: Remove recent formula history

## 📖 Usage

### Basic Usage
1. Press `Ctrl/Cmd + M` to open the formula editor
2. Type your formula or click templates
3. Toggle between inline and block modes
4. Press `Ctrl/Cmd + Enter` or click "Insert Formula"

### Editing Existing Formulas
1. Place your cursor inside an existing formula
2. Press `Ctrl/Cmd + M`
3. The editor will open with the formula pre-loaded
4. Make your changes and insert

### Using Templates
1. Click a category tab (Basic, Greek, Calculus, etc.)
2. Click any template button to insert it
3. Continue typing to complete the formula

### Virtual Keyboard
- Click "⌨️ Toggle Keyboard" to show/hide
- The keyboard provides specialized math input buttons
- Particularly useful on touch devices

## 🔧 Technical Details

### Dependencies
- [MathLive](https://cortexjs.io/mathlive/) v0.101.0 - Math rendering engine
- [Obsidian API](https://github.com/obsidianmd/obsidian-api)

### Build System
- esbuild for fast bundling
- TypeScript for type safety

### File Structure
```
obsidian-mathlive-enhanced/
├── main.ts           # Plugin source code
├── styles.css        # Claude-inspired styles
├── manifest.json     # Plugin metadata
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
├── esbuild.config.mjs # Build configuration
└── README.md         # Documentation
```

## 🐛 Troubleshooting

### Formula not rendering
- Ensure you have the latest version of Obsidian
- Try disabling other math-related plugins
- Check the console for errors (`Ctrl/Cmd + Shift + I`)

### Virtual keyboard not showing
- Set Virtual Keyboard mode to "On focus" in settings
- Click the "Toggle Keyboard" button manually

### Styles not loading
- Make sure `styles.css` is in the plugin folder
- Try reloading Obsidian (`Ctrl/Cmd + R`)

## 📄 License

MIT License - feel free to use, modify, and distribute.

## 🙏 Credits

- Original [obsidian-mathlive](https://github.com/danzilberdan/obsidian-mathlive) by danzilberdan
- [MathLive](https://cortexjs.io/mathlive/) library by arnog
- Design inspired by [Claude](https://claude.ai) by Anthropic

---

Made with ❤️ for the Obsidian community
# obsidian-equation-studio
