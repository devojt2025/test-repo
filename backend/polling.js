const fs = require('fs')
const { exec } = require('child_process')
const cron = require('node-cron');
const path = require('path');
const logFile = 'git-pull-log.txt'
const repoDirectory = "C:\\Users\\DEV.OJT\\Documents\\test-repo"
function ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
        console.error(`Directory not found: ${dirPath}`);
        return false;
    }
    return true;
}
function pullLatestCode() {
    console.log('Checking for updates...');
    exec(`
        cd ${repoDirectory} && git pull &&
        cd frontend && npm install && npm run build &&
        cd ../backend && npm install && pm2 restart app
        `, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error pulling code: ${stderr}`);
            fs.appendFileSync(logFile, `ERROR: ${new Date().toISOString()} - ${stderr}\n`)
            return;
        }
        console.log(`Git pull successful: \n${stdout}`);
        fs.appendFileSync(logFile, `SUCCESS: ${new Date().toISOString()} - ${stdout}\n`)
    })
}

cron.schedule('*/10 * * * *', () => {
    if (ensureDirectoryExists(path.join(repoDirectory, 'frontend')) &&
        ensureDirectoryExists(path.join(repoDirectory, 'backend'))) {
        pullLatestCode();
        console.log('Git pull job ran at ' + new Date().toLocaleDateString());
    }

})