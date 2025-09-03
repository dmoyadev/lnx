import fs from 'fs/promises';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

// Paths
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_DIR = path.join(__dirname, '../../packages/components/src');
const TEMPLATE_DIR = path.join(__dirname, 'templates');

// CLI helpers
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
const ask = (q) => new Promise((res) => rl.question(q, res));

// Create files from templates
async function getTemplateFiles(componentName) {
	const templates = await fs.readdir(TEMPLATE_DIR);
	return Promise.all(
		templates.map(async (templateFile) => {
			const templatePath = path.join(TEMPLATE_DIR, templateFile);
			const content = await fs.readFile(templatePath, 'utf8');
			const finalName = templateFile.replace('Component', componentName);
			const finalContent = content.replace(/<<ComponentName>>/g, componentName);
			return {
				name: finalName,
				content: finalContent, 
			};
		}),
	);
}

function toKebabCase(str) {
	return str
		.replace(/([a-z])([A-Z])/g, '$1-$2') // Add hyphen between lowercase and uppercase letters
		.replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // Add hyphen between uppercase letters followed by lowercase
		.toLowerCase(); // Convert to lowercase
}

async function createComponentFolder(componentName) {
	const dir = path.join(BASE_DIR, toKebabCase(componentName));
	try {
		await fs.mkdir(dir, { recursive: false });
	} catch (err) {
		console.error(err);
		throw new Error(`❌ Component "${componentName}" already exists.`);
	}

	const files = await getTemplateFiles(componentName);
	for (const { name, content } of files) {
		const filePath = path.join(dir, name);
		await fs.writeFile(filePath, content, 'utf8');
	}
	return dir;
}

async function main() {
	console.log('🛠️  Components generator\n');
	const componentName = await ask('📦 Component name (e.g. Input, Button, Icon...): ');

	if (typeof componentName === 'string' && !/^[A-Za-z0-9]+$/.test(componentName)) {
		console.log('❗ Use only letters and numbers, no spaces or symbols.');
		rl.close();
		return;
	}

	try {
		const dirCreated = await createComponentFolder(componentName);
		console.log(`✅  Component created in: ${dirCreated}`);
		console.log('ℹ️ You can now start working on it.');
	} catch (err) {
		console.error(err.message);
	}

	rl.close();
}

void main();