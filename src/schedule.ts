import schedule, { cancelJob, Job, rescheduleJob, JobCallback, RecurrenceRule } from 'node-schedule';
import { IRange, ISchedule, ScheduleOptions, RecurrenceSegment, ScheduleId } from "./types";
import { extractJobArgs } from "./utils/_extract-args";
export { cancelJob };


export class Schedule {
    /**
     * default timezone
     */
    static DEFAULT_TZ: string = null;

    private static DEFAULT_OPTIONS: ISchedule = {
        tz: Schedule.DEFAULT_TZ, hour: null, year: null, date: null, dayOfWeek: null, minute: null, month: null, second: 0
    };

    /**
     * change the default value of properties in fancy `options`
     */
    static config(options: ISchedule) {
        if (options.tz) this.DEFAULT_TZ = options.tz;
        Schedule.DEFAULT_OPTIONS = { ...Schedule.DEFAULT_OPTIONS, ...options };
    }


    /**
     * Convert fancy rule to node-schedule rule
     */
    static Rule(options: ISchedule) {
        const { tz, ...rest } = { ...Schedule.DEFAULT_OPTIONS, ...options } as Partial<ISchedule>;
        const rule = new RecurrenceRule();
        for (const k of Object.keys(rest)) {
            const obj: RecurrenceSegment = rest[k];

            if (!obj || typeof obj !== 'object') {
                rule[k] = obj;
                continue;
            }

            if (obj instanceof Array) {
                rule[k] = [];
                for (const recurrence of obj.values()) {
                    rule[k].push(typeof recurrence === 'object' ? Schedule.Range(recurrence, k) : recurrence);
                }
            } else {
                rule[k] = Schedule.Range(rest[k], k);
            }
        }
        rule.tz = tz;
        return rule;
    }

    /**
     * Convert fancy range to node-schedule range
     * @param  keyName used for set the default end/start range. (optional) 
     */
    static Range(options: Partial<IRange>, keyName?: string) {
        let _end = null;
        let _start = null;
        if (keyName && !options.end) {
            if (keyName === 'hour') _end = 23;
            else if (keyName === 'dayOfWeek') _end = 6;
            else if (keyName === 'month') _end = 12;
            else if (keyName === 'year') _end = 2199;
            else if (keyName === 'date') {
                _end = 31;
                _start = 1;
            } else {
                _end = 59;
            }
        }
        const { start, end, step } = { start: _start, end: _end, step: null, ...options };
        return new schedule.Range(start, end, step);
    }


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

    static Job(...args: (ScheduleId | ScheduleOptions | JobCallback)[]) {
        const { name, options, callback } = extractJobArgs(args);
        const job = new Job(name, callback);

        let rule: string | RecurrenceRule;

        if (typeof options === 'string') rule = options;
        else rule = Schedule.Rule(options);

        const success = job.reschedule(rule);
        if (!success) console.warn('[Warn] "Options" was not valid.');

        return job;
    }

    /**
     * Changes the timing of a Job, canceling all pending invocations.
     * @param options The new timing options for this Job.
     * @return if the job could be rescheduled, `null` otherwise.
     */
    static Reschedule(job: Job | string, options: ScheduleOptions) {
        const spec = typeof options === 'string' ? options : Schedule.Rule(options);
        return rescheduleJob(job, spec);
    }

    /**
     * Cancel the job
     * @returns  Whether the job has been cancelled with success.
     */
    static CancelJob = (job: Job | string) => cancelJob(job);
}