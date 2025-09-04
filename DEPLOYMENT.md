# Deploying Seating Map App to GitHub Pages

This guide shows you how to deploy your React seating map application to GitHub Pages using pnpm.

## Prerequisites

- Node.js and pnpm installed
- Git repository on GitHub
- GitHub account

## Method 1: Manual Deployment

Your project is already configured for GitHub Pages deployment. Here's how to deploy manually:

### 1. Ensure your repository is set up

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Deploy to GitHub Pages

```bash
pnpm run deploy
```

This command will:
- Build your app using `pnpm run build`
- Deploy the `dist` folder to the `gh-pages` branch
- Make your app available at: https://Sahil811.github.io/seating-map

## Method 2: Automated Deployment with GitHub Actions

A GitHub Actions workflow has been set up in `.github/workflows/deploy.yml` that will automatically deploy your app when you push to the main branch.

### Setup Steps:

1. **Enable GitHub Pages in your repository settings:**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "gh-pages" branch and "/ (root)" folder
   - Click "Save"

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Add GitHub Actions deployment"
   git push origin main
   ```

3. **Monitor the deployment:**
   - Go to the "Actions" tab in your GitHub repository
   - Watch the deployment workflow run
   - Once complete, your app will be live at: https://Sahil811.github.io/seating-map

## Configuration Details

Your `package.json` is already configured with:

- **Homepage URL**: `https://Sahil811.github.io/seating-map`
- **Deploy scripts**: 
  - `predeploy`: Builds the app
  - `deploy`: Deploys to GitHub Pages
- **gh-pages package**: Already installed as a dev dependency

## Troubleshooting

### Common Issues:

1. **404 Error**: Make sure GitHub Pages is enabled and set to deploy from the `gh-pages` branch

2. **Build Fails**: Check that all dependencies are installed and there are no TypeScript errors:
   ```bash
   pnpm install
   pnpm run build
   ```

3. **Permission Issues**: Ensure your GitHub token has the necessary permissions for GitHub Actions

4. **Wrong URL**: Verify the homepage URL in `package.json` matches your GitHub username and repository name

## Manual Build and Test

To test your build locally before deploying:

```bash
# Build the app
pnpm run build

# Preview the built app
pnpm run preview
```

## Updating Your App

To update your deployed app:

1. Make your changes
2. Commit and push to main branch (for automatic deployment)
   ```bash
   git add .
   git commit -m "Update app"
   git push origin main
   ```

Or run manual deployment:
```bash
pnpm run deploy
```

Your app will be available at: **https://Sahil811.github.io/seating-map**