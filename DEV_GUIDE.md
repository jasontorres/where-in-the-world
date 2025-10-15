# 🛠️ Developer Guide

## Project Structure

```
zaldy-co-game/
├── src/
│   ├── components/
│   │   ├── ZaldyCoGame.tsx      # Main game component (all game logic)
│   │   └── Typewriter.tsx        # Reusable typewriter effect
│   ├── App.tsx                   # Root app component
│   ├── main.tsx                  # React entry point
│   └── index.css                 # Global styles + Tailwind
├── public/                       # Static assets
├── index.html                    # HTML template with Google Fonts
├── vite.config.ts                # Vite + Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind custom fonts
└── package.json                  # Dependencies and scripts
```

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.10
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS v4 with `@tailwindcss/vite`
- **Fonts**: Google Fonts (VT323, Press Start 2P, Orbitron)
- **Deployment**: Vercel/Netlify ready

## Development Commands

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build (http://localhost:4173)
npm run preview

# Lint code
npm run lint

# Clean build directory
npm run clean
```

## Key Components

### ZaldyCoGame.tsx
Main game component containing:
- **Game state**: Uses React `useState` hook
- **Locations**: 6 global cities with witnesses
- **Suspects**: Currently 1 suspect (easily expandable)
- **Game logic**: Interview witnesses, travel, collect clues, arrest

**State Interface**:
```typescript
interface GameState {
  currentLocation: string;
  visitedLocations: string[];
  cluesCollected: Clue[];
  daysRemaining: number;
  gameStarted: boolean;
  gameOver: boolean;
  gameWon: boolean;
  selectedWitness: Witness | null;
  showTravel: boolean;
  conversation: Conversation | null;
  evidence: Evidence;
  typewriterComplete: boolean;
}
```

### Typewriter.tsx
Reusable typewriter effect component:
```typescript
<Typewriter 
  text="Your text here"
  speed={30}              // ms per character
  onComplete={() => {}}   // Callback when complete
  className="custom-class"
/>
```

## Customization Guide

### Add New Location
In `ZaldyCoGame.tsx`, add to the `locations` object:
```typescript
newlocation: {
  name: "Location Name",
  description: "Description here",
  connections: ["city1", "city2", "city3"],
  image: "https://unsplash.com/...",
  witnesses: [
    { name: "Witness Name", type: "Type", location: "Place" }
  ]
}
```

### Change Suspect Location
Modify `suspect.currentLocation` in the `suspects` array.

### Adjust Game Difficulty
- **Time limit**: Change `daysRemaining: 7` in initial state
- **Clue clarity**: Modify `clueBank` in `generateClue` function
- **Travel cost**: Currently 1 day per travel

### Modify Colors
In `src/index.css`, update color classes:
```css
/* Main colors used */
- Yellow: text-yellow-300/400
- Red: text-red-400, bg-red-700/900
- Green: text-green-400
- Blue: bg-blue-700/900
- Purple: bg-purple-950
```

### Change Fonts
1. Update Google Fonts link in `index.html`
2. Add font to `tailwind.config.js`:
```javascript
fontFamily: {
  'your-font': ['"Your Font Name"', 'fallback'],
}
```
3. Use in components: `className="font-your-font"`

### Add Sound Effects
```typescript
// Add to game functions
const playSound = (soundFile: string) => {
  const audio = new Audio(`/sounds/${soundFile}`);
  audio.play();
};

// Use in functions
const interviewWitness = () => {
  playSound('click.mp3');
  // ... rest of logic
};
```

### Implement Save/Load
```typescript
// Save game
const saveGame = () => {
  localStorage.setItem('zaldy-co-save', JSON.stringify(gameState));
};

// Load game
const loadGame = () => {
  const saved = localStorage.getItem('zaldy-co-save');
  if (saved) {
    setGameState(JSON.parse(saved));
  }
};
```

## Styling System

### Tailwind Classes Used
- **Layout**: `flex`, `grid`, `min-h-screen`, `max-w-7xl`
- **Spacing**: `p-4`, `mb-4`, `space-y-2`
- **Colors**: `bg-black`, `text-yellow-300`, `border-gray-700`
- **Typography**: `font-vt323`, `text-2xl`, `font-bold`
- **Effects**: `hover:scale-105`, `animate-pulse`, `transition-all`

### Custom CSS Classes
Defined in `src/index.css`:
- `.text-shadow-glow` - Glowing text effect
- `.scanline` - CRT scanline effect
- `.crt-effect` - Screen flicker animation
- `.pixel-border` - Pixelated image rendering

## TypeScript Tips

### Adding New Interfaces
```typescript
interface NewFeature {
  id: number;
  name: string;
  // ... other properties
}
```

### Type Safety
- All props are typed with interfaces
- State is strictly typed with `GameState`
- Functions have explicit return types
- No `any` types allowed (strict mode)

## Performance Optimization

### Current Optimizations
- Code splitting (vendor chunk separate)
- Tree shaking (unused code removed)
- CSS purging (Tailwind unused styles removed)
- Image loading from CDN (Unsplash)

### Further Optimizations
1. **Local Images**: Download and optimize images
2. **Lazy Loading**: Load images on demand
3. **Memoization**: Use `useMemo` for expensive calculations
4. **Code Splitting**: Split game screens into separate chunks

## Debugging

### Common Issues

**1. Typewriter not working**
- Check `typewriterComplete` state
- Verify `onComplete` callback is firing
- Ensure text prop is a string

**2. Styles not applying**
- Verify Tailwind import in `index.css`
- Check `@tailwindcss/vite` plugin in config
- Clear build cache: `rm -rf dist node_modules/.vite`

**3. Build fails**
- Check TypeScript errors: `npx tsc --noEmit`
- Verify all imports are correct
- Ensure all files are `.tsx` (not `.jsx`)

**4. Fonts not loading**
- Check Google Fonts link in `index.html`
- Verify font names in `tailwind.config.js`
- Check network tab for 404s

### Debug Mode
Add to component for debugging:
```typescript
useEffect(() => {
  console.log('Game State:', gameState);
}, [gameState]);
```

## Testing

### Manual Testing Checklist
- [ ] Game starts correctly
- [ ] Typewriter effect works
- [ ] Witness interviews add clues
- [ ] Travel costs 1 day
- [ ] Arrest in correct location wins
- [ ] Time runs out loses
- [ ] All locations accessible
- [ ] Evidence displays correctly
- [ ] Restart works

### Unit Testing (Future)
```bash
npm install -D vitest @testing-library/react
```

Example test:
```typescript
import { render, screen } from '@testing-library/react';
import ZaldyCoGame from './ZaldyCoGame';

test('game starts with 7 days', () => {
  render(<ZaldyCoGame />);
  expect(screen.getByText(/7/)).toBeInTheDocument();
});
```

## Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature
git add .
git commit -m "Add: new feature description"
git push origin feature/new-feature

# Main branch
git checkout main
git merge feature/new-feature
git push origin main
```

## Deployment

See `DEPLOYMENT.md` for full deployment instructions.

Quick deploy:
```bash
# Vercel
vercel

# Netlify
netlify deploy --prod
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## Resources

- [Vite Docs](https://vitejs.dev)
- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs)
- [Tailwind CSS v4](https://tailwindcss.com/docs)
- [Google Fonts](https://fonts.google.com)

---

**Happy Coding! 🎮**
