const Bree = require('bree');
const Graceful = require('@ladjs/graceful');
const jobs = [
    { name: 'example', interval: '5s', timeout: 0 },
];
//interval: 'every 1 minute'
//interval: '10s',


const bree = new Bree({
    jobs: jobs,
    defaultExtension: 'ts',
});

const graceful = new Graceful({ brees: [bree] });
graceful.listen();

(async () => {
    await bree.start();
})();