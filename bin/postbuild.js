const fs = require('fs').promises;

Promise.resolve().then(async () => {

    const packageJson = require('../package.json');
    let main = await fs.readFile(packageJson.main, 'utf-8');
    Object.entries(packageJson).forEach(([key, value]) => {
        main = main.replace(`'<package.${key}>'`, JSON.stringify(value));
    });
    await fs.writeFile(packageJson.main, main, 'utf-8');

}).then(() => {
    process.exit(0);
}, error => {
    console.error(error);
    process.exit(1);
});
