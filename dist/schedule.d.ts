import { Job, Range, JobCallback, RecurrenceRule } from 'node-schedule';
import { IRange, ISchedule, ScheduleOptions, ScheduleId } from "./types";
export declare class Schedule {
    static get DEFAULT_TZ(): string;
    static set DEFAULT_TZ(tz: string);
    private static DEFAULT_OPTIONS;
    static config(options: ISchedule): void;
    static Rule(options: ISchedule): RecurrenceRule;
    static Range(options: Partial<IRange>, keyName?: string): Range;
    static Job(options: ScheduleOptions, callback: JobCallback): Job;
    static Job(name: ScheduleId, options: ScheduleOptions, callback: JobCallback): Job;
    static Reschedule(job: Job | string, options: ScheduleOptions): Job;
    static CancelJob: (job: Job | string) => boolean;
}
