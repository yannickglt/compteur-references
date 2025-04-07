import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get repository URL
const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8'));
const repoUrl = packageJson.repository?.url;

if (!repoUrl) {
  console.error('Repository URL not found in package.json');
  process.exit(1);
}

try {
  // Build the app
  console.log('Building the app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Initialize git if not already initialized
  try {
    execSync('git status', { stdio: 'ignore' });
  } catch {
    console.log('Initializing git repository...');
    execSync('git init', { stdio: 'inherit' });
    execSync('git add .', { stdio: 'inherit' });
    execSync('git commit -m "Initial commit"', { stdio: 'inherit' });
  }

  // Add remote if not already added
  try {
    execSync('git remote get-url origin', { stdio: 'ignore' });
  } catch {
    console.log('Adding remote repository...');
    execSync(`git remote add origin ${repoUrl}`, { stdio: 'inherit' });
  }

  // Deploy to GitHub Pages
  console.log('Deploying to GitHub Pages...');
  execSync('npx gh-pages -d dist', { stdio: 'inherit' });

  console.log('Deployment successful!');
} catch (error) {
  console.error('Deployment failed:', error);
  process.exit(1);
} 