# 🚀 Deployment Guide

## Quick Start

### Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview  # Test production build locally
```

## Deployment Options

### 1. Vercel (Recommended - Easiest)
```bash
npm i -g vercel
vercel
```

Or connect your GitHub repo to Vercel for automatic deployments.

**Configuration**: `vercel.json` already included

### 2. Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

Or drag and drop the `dist` folder to Netlify's web interface.

**Configuration**: `netlify.toml` already included

### 3. GitHub Pages
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
{
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}

# Update vite.config.ts base path:
export default defineConfig({
  base: '/your-repo-name/',
  // ... rest of config
})

# Deploy
npm run deploy
```

### 4. Docker
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t zaldy-co-game .
docker run -p 8080:80 zaldy-co-game
```

### 5. Static Hosting (Any Provider)
After running `npm run build`, upload the contents of the `dist` folder to any static hosting provider:
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps
- Firebase Hosting
- Cloudflare Pages

## Environment Variables

If you need environment variables, create a `.env` file:
```env
VITE_API_URL=your_api_url_here
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

## Production Checklist

- [ ] Build succeeds without errors (`npm run build`)
- [ ] All environment variables configured
- [ ] Images and assets load correctly
- [ ] Game logic tested thoroughly
- [ ] Meta tags and SEO configured in `index.html`
- [ ] Analytics/monitoring set up (optional)
- [ ] Custom domain configured (optional)

## Performance Tips

1. **Image Optimization**: Images are loaded from Unsplash. Consider downloading and optimizing them locally for faster loading.

2. **CDN**: Use a CDN for static assets (Vercel and Netlify do this automatically).

3. **Caching**: The build is already configured with optimal caching headers.

4. **Bundle Analysis**: Run `npm run build` and check the output for bundle sizes.

## Troubleshooting

### Build Fails
- Ensure Node.js 18+ is installed
- Clear `node_modules` and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npx tsc --noEmit`

### Fonts Not Loading
- Ensure Google Fonts links are in `index.html`
- Check network tab for font loading errors

### Tailwind Styles Missing
- Verify `@import "tailwindcss";` is in `src/index.css`
- Check that `@tailwindcss/vite` plugin is in `vite.config.ts`

## Support

For issues or questions, check:
- Vite Documentation: https://vitejs.dev
- React Documentation: https://react.dev
- Tailwind CSS v4: https://tailwindcss.com/docs
