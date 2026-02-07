# Equation Studio

A visual LaTeX formula editor plugin for [Obsidian](https://obsidian.md). Type equations using a graphical math editor powered by MathLive, with quick-access templates for common symbols and formulas.

## Features

- Visual math editing with real-time rendering
- Quick templates for Basic, Greek, Calculus, Linear Algebra, Logic & Sets, and Relations symbols
- Inline (`$...$`) and block (`$$...$$`) math mode toggle
- Virtual keyboard for math input
- Edit existing formulas by placing your cursor inside them
- Recent formulas history
- Configurable font size, keyboard behavior, and sound effects

## Installation

### From Community Plugins

1. Open Obsidian Settings
2. Navigate to Community Plugins
3. Search for "Equation Studio"
4. Click Install, then Enable

### Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/avschaefer/obsidian-equation-studio.git
   cd obsidian-equation-studio
   ```

2. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```

3. Copy `main.js`, `manifest.json`, and `styles.css` to your vault's plugin directory:
   ```
   <your-vault>/.obsidian/plugins/equation-studio/
   ```

4. Enable the plugin in Obsidian Settings under Community Plugins.

### Development

```bash
npm run dev
```

This watches for changes and rebuilds automatically.

## Usage

- Press `Ctrl/Cmd + M` to open the formula editor (inline mode).
- Press `Ctrl/Cmd + Shift + M` to open in block mode.
- Press `Enter` to insert the formula.
- Press `Escape` to close the editor.
- Click template buttons to insert common symbols.
- Click "Show Keyboard" for the virtual math keyboard.
- Use the three-bar menu inside the editor for additional options.

## Settings

Access via Obsidian Settings, then Equation Studio:

- Default Mode — inline or block
- Quick Templates — show or hide
- Virtual Keyboard — auto, on-focus, or manual
- Font Size — small, medium, or large
- Sound Effects — enable or disable
- Clear History — remove saved recent formulas

## Third-Party Licenses

This plugin uses the following third-party libraries:

### MathLive

- Author: Arno Gourdol
- License: MIT
- Source: https://github.com/arnog/mathlive
- Website: https://cortexjs.io/mathlive/

MathLive is the core math editing component used in this plugin. Copyright (c) 2017–present Arno Gourdol. Used under the MIT License.

### Obsidian API

- Author: Dynalist Inc.
- License: MIT
- Source: https://github.com/obsidianmd/obsidian-api

### Original Plugin

This plugin is based on [obsidian-mathlive](https://github.com/danzilberdan/obsidian-mathlive) by danzilberdan.

## License

This project is licensed under the MIT License. See the individual third-party licenses above for dependencies.

## Repository

- GitHub: https://github.com/avschaefer/obsidian-equation-studio
- Author: [avschaefer](https://github.com/avschaefer)
