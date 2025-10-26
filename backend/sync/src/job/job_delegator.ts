import { AbstractJob } from "./abstract_job.js";
import { DeserializationJob } from "./deserialization_job.js";
import { JobType } from "./job_type.js";
import { MergeJob } from "./merge_job.js";
import { RequestJob } from "./request_job.js";

process.on('message', async (message: any) => {
    const incrementJob = AbstractJob.parse({
        jobType: JobType.IncrementJobs,
        isWorkerFree: false,
        workerId: message.workerId,
    })
    if (process.send) {
        process.send(incrementJob.serializeJob())
    }

    const jobType = message.jobType;
    if (jobType !== undefined) {
        let messageJob = undefined;
        switch (jobType) {
            case JobType.Request:
                messageJob = RequestJob.parse(message);
                break;
            case JobType.Deserialization:
                messageJob = DeserializationJob.parse(message);
                break;
            case JobType.Merge:
                messageJob = MergeJob.parse(message);
                break;
        }

        if (messageJob) {
            await messageJob.runJob(process);
        }

        const decrementJob = AbstractJob.parse({
            jobType: JobType.DecrementJobs,
            isWorkerFree: true,
            workerId: message.workerId,
        })
        if (process.send) {
            process.send(decrementJob.serializeJob())
        }
    }
});