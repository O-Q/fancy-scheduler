import schedule, { cancelJob, Job, JobCallback } from 'node-schedule';
import { IRange, ISchedule, ScheduleOptions, ScheduleId } from "./types";
export { cancelJob };
export declare class Schedule {
    /**
     * default timezone
     */
    static DEFAULT_TZ: string;
    private static DEFAULT_OPTIONS;
    /**
     * change the default value of properties in fancy `options`
     */
    static config(options: ISchedule): void;
    /**
     * Convert fancy rule to node-schedule rule
     */
    static Rule(options: ISchedule): schedule.RecurrenceRule;
    /**
     * Convert fancy range to node-schedule range
     * @param  keyName used for set the default end/start range. (optional)
     */
    static Range(options: Partial<IRange>, keyName?: string): schedule.Range;
    /**
     * Create a fancy job
     * @param options timing schedule for this job
     * @param callback Job's callback
     */
    static Job(options: ScheduleOptions, callback: JobCallback): Job;
    /**
     * Create a fancy job
     * @param name optional name for this Job
     * @param options timing options for this job
     * @param callback Job's callback
     */
    static Job(name: ScheduleId, options: ScheduleOptions, callback: JobCallback): Job;
    /**
     * Changes the timing of a Job, canceling all pending invocations.
     * @param options The new timing options for this Job.
     * @return if the job could be rescheduled, `null` otherwise.
     */
    static Reschedule(job: Job | string, options: ScheduleOptions): schedule.Job;
    /**
     * Cancel the job
     * @returns  Whether the job has been cancelled with success.
     */
    static CancelJob: (job: Job | string) => boolean;
}
