import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';
import { execSync } from 'child_process';

// Get the directories from command-line arguments
const [rootPackageJsonDir, childPackageJsonDir] = process.argv.slice(2);

// Check if both paths are provided
if (!rootPackageJsonDir || !childPackageJsonDir) {
	console.error('🔴 Error: Both rootPackageJsonDir and childPackageJsonDir must be provided.');
	process.exit(1);
}

// Paths to the package.json files
const rootPackageJsonPath = resolve(rootPackageJsonDir, 'package.json');
const childPackageJsonPath = resolve(childPackageJsonDir, 'package.json');

// Read and parse the root package.json
const rootPackageJson = JSON.parse(readFileSync(rootPackageJsonPath, 'utf8'));

// Read and parse the component package.json
const componentPackageJson = JSON.parse(readFileSync(childPackageJsonPath, 'utf8'));

// Update the version in the component package.json
componentPackageJson.version = rootPackageJson.version;

// Write the updated component package.json back to the file
writeFileSync(childPackageJsonPath, JSON.stringify(componentPackageJson, null, '\t'), 'utf8');

// Add the updated package.json to the Git stage
execSync(`git add ${childPackageJsonPath}`);

console.log(`Updated package.json version to ${rootPackageJson.version}`);