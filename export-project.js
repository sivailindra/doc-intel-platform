const fs = require('fs');
const path = require('path');

const outputFilename = 'project-export.json';
const baseDir = __dirname;
const excludeDirs = ['node_modules', '.next', '.git', 'out', 'build', 'public'];
const excludeFiles = ['.env', 'dev.db', 'project-export.json', 'export-project.js', 'package-lock.json'];
const includeExtensions = ['.ts', '.tsx', '.js', '.jsx', '.json', '.prisma', '.css', '.md'];

const result = {};

function scanDirectory(currentPath) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const relativePath = path.relative(baseDir, fullPath);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!excludeDirs.includes(item)) {
                scanDirectory(fullPath);
            }
        } else {
            const ext = path.extname(item);
            if (
                !excludeFiles.includes(item) &&
                includeExtensions.includes(ext)
            ) {
                try {
                    const content = fs.readFileSync(fullPath, 'utf8');
                    result[relativePath] = content;
                } catch (err) {
                    console.error(`Could not read file: ${relativePath}`);
                }
            }
        }
    }
}

console.log('Starting project export...');
scanDirectory(baseDir);

fs.writeFileSync(path.join(baseDir, outputFilename), JSON.stringify(result, null, 2));
console.log(`Successfully exported project to ${outputFilename}`);
