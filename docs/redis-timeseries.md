https://www.infoq.com/articles/redis-time-series-grafana-real-time-analytics/

https://github.com/OptimalBits/bull/blob/develop/REFERENCE.md#queueadd
https://stackoverflow.com/questions/61659677/bull-queue-when-a-job-fails-how-to-stop-queue-from-processing-remaining-jobs
```ts
var Queue = require('bull');

let redisOptions = {
  redis: { port: 6379, host: '127.0.0.1' }
}
var myQueue = new Queue('Linear-Queue', redisOptions);

myQueue.process('Type-1', function (job, done) {
  console.log(`Processing Job-${job.id} Attempt: ${job.attemptsMade}`);
  downloadFile(job, async function (error) {
    if (error) {
      await repeatSameJob(job, done);
    } else {
      done();
    }
  });
});

async function repeatSameJob(job, done) {
  let newJob = await myQueue.add('Type-1', job.data, { ...{ priority: 1 }, ...job.opts });
  console.log(`Job-${job.id} failed. Creating new Job-${newJob.id} with highest priority for same data.`);
  done(true);
}

function downloadFile(job, done) {
  setTimeout(async () => {
    done(job.data.error)
  }, job.data.time);
}

myQueue.on('completed', function (job, result) {
  console.log("Completed: Job-" + job.id);
});
```
https://gist.github.com/antirez/9e716670f76133ec81cb24036f86ee95

