const currentPath = '/root/rumor'; // server path do not change
const { exec } = require('child_process');

const getBranch = () => new Promise((resolve, reject) => {
    return exec('git rev-parse --abbrev-ref HEAD', (err, stdout, stderr) => {
        if (err)
            reject(`getBranch Error: ${err}`);
        else if (typeof stdout === 'string')
            resolve(stdout.trim());
    });
});

module.exports = async shipit => {
    const branch = await getBranch();
    // require('dotenv').config({ path: `./config/${branch}/.env` })
    // Load shipit-deploy tasks
    require('shipit-deploy')(shipit);


    shipit.initConfig({
        prod: {

            servers: [
                {
                    user: "root",
                    host: "68.183.4.118",
                }
            ],
            deployTo: '/root/rumor',
            repositoryUrl: 'git@github.com:AleannLab/rumor.git',
            branch: branch,
            // key: `./config/${branch}/key.pem`
        },
    });

    shipit.task('upload:admin', async function () {
        const nvm = `cd ${currentPath}/backend`;
        // await shipit.local(`cd backend && yarn && ENV_PATH="./.env.${branch}" yarn build`);
        await shipit.copyToRemote(
          './backend/build',
          `${currentPath}/backend/`,
        );

        await shipit.copyToRemote(
          `./backend/.env.${branch}`,
          `${currentPath}/backend/.env`,
        );

        const yarn = "npx yarn install"
        const pm2 = 'pm2';
        try {
            await shipit.remote(`${nvm} && git pull`);
        } catch (e) {

        }
        await shipit.remote(`${nvm} && source ~/.nvm/nvm.sh && nvm use v16.20.0 && ${yarn} install`);
        // try {
        //     await shipit.remote(`cd ${currentPath} && ${pm2} delete all`);
        // } catch (e) {
        //     console.log(e);
        // }
        await shipit.remote(`cd ${currentPath} && ${pm2} start`);
    })

    shipit.task('upload', async function () {
        shipit.emit("upload:admin")
        // shipit.emit("upload:frontend")
    });
};
