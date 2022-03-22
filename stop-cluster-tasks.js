/**
 * @author David Menger
 */

const { ECSClient, StopTaskCommand, ListTasksCommand } = require("@aws-sdk/client-ecs");

let region = process.env.AWS_DEFAULT_REGION || 'eu-central-1';
let cluster = null;
let accessKeyId = process.env.AWS_ACCESS_KEY_ID || '';
let secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';

const args = process.argv.slice();

function abort (msg) {
    console.error('  %s', msg);
    process.exit(1);
}

let arg;

function required () {
    if (args.length) {
        return args.shift();
    }
    return abort(`${arg} requires an argument.`);
}

while (args.length) {
    arg = args.shift();
    switch (arg) {
        case '-r':
            region = required();
            break;
        case '-c':
            cluster = required();
            break;
        case '-k': // number of threads (optional)
            accessKeyId = required();
            break;
        case '-s': // loss method (optional)
            secretAccessKey = required();
            break;
        default:
            break;
    }
}

if (!cluster) {
    abort('-c cluster required');
}

const client = new ECSClient({
    region,
    credentials: {  accessKeyId, secretAccessKey }
});

let i = 0;

(async () => {
    const listTasks = new ListTasksCommand({
        cluster,
        desiredStatus: 'RUNNING'
    });
    const { taskArns = [] } = await client.send(listTasks);

    console.log(`\nfound ${taskArns.length} tasks`);
    for (const task of taskArns) {
        const stopTask = new StopTaskCommand({
            cluster,
            task
        });
        await new Promise((r) => setTimeout(r, 500));
        await client.send(stopTask);
        process.stdout.write('.');
        i++;
    }

    console.log('\nSUCCESS!')
})()
    .finally(() => {
        console.log(`\nstopped ${i} task(s)`);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });