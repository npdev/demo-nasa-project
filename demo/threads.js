const {
    isMainThread,
    workerData,
    Worker,
} = require('worker_threads');

if (isMainThread) {
    console.log(`Main Thread! Process ID: ${process.pid}`);
    new Worker(__filename, {
        workerData: [0,8,2,4]
    });
    new Worker(__filename, {
        workerData: [2,1,3,0]
    });
} else {
    console.log(`Worker! Process ID: ${process.pid}`);
    console.log(`${workerData} sorted is ${workerData.sort()}`);
}
