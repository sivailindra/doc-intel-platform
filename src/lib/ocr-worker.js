const Tesseract = require('tesseract.js');
const fs = require('fs');

async function run() {
    const imagePath = process.argv[2];
    if (!imagePath || !fs.existsSync(imagePath)) {
        console.error('No image path provided');
        process.exit(1);
    }

    try {
        const worker = await Tesseract.createWorker('eng');
        const { data: { text } } = await worker.recognize(imagePath);
        await worker.terminate();
        // Only output the recognized text to stdout
        console.log(text);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
