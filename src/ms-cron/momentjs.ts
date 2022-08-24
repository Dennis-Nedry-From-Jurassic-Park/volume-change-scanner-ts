import WaitJob from "./wait-job";

const waitJob = new WaitJob('08:14:30')

console.log(waitJob.getFirstJobAt())
console.log(waitJob.getSecondJobAt())
console.log(waitJob.getThirdJobAt())