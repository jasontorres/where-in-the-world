# 🕵️ Where in the World is Zaldy Co?

A political satire investigation game inspired by "Where in the World is Carmen Sandiego", featuring a retro 80s/90s aesthetic with typewriter effects and nostalgic CRT-screen styling.

![Game Screenshot](https://via.placeholder.com/800x400/000000/FFFF00?text=WHERE+IN+THE+WORLD+IS+ZALDY+CO%3F)

## 🎮 About the Game

Track down corrupt Congressman Zaldy Co who fled the Philippines after embezzling over P100 billion in flood control funds. Travel across the globe, interview witnesses, collect evidence, and issue an arrest warrant before time runs out!

### Features

- 🎯 **Retro Gaming Experience**: Classic 80s/90s Carmen Sandiego-style gameplay
- ⌨️ **Typewriter Effects**: Authentic retro text animation for all dialogue
- 🎨 **Vintage Aesthetic**: CRT screen effects, scanlines, and retro fonts (VT323, Press Start 2P, Orbitron)
- 🌍 **6 Global Locations**: Philippines, Singapore, Hong Kong, Dubai, Switzerland, and Macau
- 🕐 **Time Pressure**: 7 days to track down the suspect
- 🔍 **Evidence Collection**: Gather appearance, hobby, vehicle, and trait clues
- 🎭 **Political Satire**: Commentary on real-world corruption issues

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd zaldy-co-game

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will be available at `http://localhost:5173`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

## 📁 Project Structure

```
zaldy-co-game/
├── src/
│   ├── components/
│   │   ├── ZaldyCoGame.jsx    # Main game component
│   │   └── Typewriter.jsx      # Typewriter effect component
│   ├── App.jsx                 # App entry point
│   ├── index.css               # Global styles with Tailwind
│   └── main.jsx                # React entry point
├── public/                     # Static assets
├── index.html                  # HTML template
├── tailwind.config.js          # Tailwind configuration
├── vite.config.js              # Vite configuration (optimized)
├── vercel.json                 # Vercel deployment config
└── netlify.toml                # Netlify deployment config
```

## 🎨 Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Fonts**: Google Fonts (VT323, Press Start 2P, Orbitron)
- **Build Tool**: Vite with optimized production settings
- **Deployment**: Ready for Vercel, Netlify, or any static host

## 🌐 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or use the Vercel GitHub integration for automatic deployments.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod
```

Or drag and drop the `dist` folder to Netlify's web interface.

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## 🎯 How to Play

1. **Start Investigation**: Begin your mission at the Philippines
2. **Interview Witnesses**: Gather clues about Zaldy Co's appearance, habits, and whereabouts
3. **Travel**: Follow the trail across 6 global locations (costs 1 day per travel)
4. **Collect Evidence**: Build your case with 4 types of evidence
5. **Issue Arrest Warrant**: When you've found the suspect's location
6. **Win**: Successfully locate and arrest Zaldy Co within 7 days!

## 🛠️ Development

### Key Components

- **ZaldyCoGame**: Main game logic and state management
- **Typewriter**: Reusable typewriter effect with customizable speed
- **CSS Effects**: CRT screen effects, scanlines, and retro animations

### Customization

- Modify locations in `src/components/ZaldyCoGame.jsx`
- Adjust typewriter speed in component props
- Customize colors and styling in `tailwind.config.js` and `src/index.css`
- Add more suspects, witnesses, or clues

## 📝 License

This is a political satire game for educational and entertainment purposes.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- Inspired by "Where in the World is Carmen Sandiego"
- Retro fonts from Google Fonts
- Images from Unsplash

---

**Built with ❤️ and nostalgia for classic edutainment games**
