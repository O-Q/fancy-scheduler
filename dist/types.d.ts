import { Job, Timezone, RecurrenceSpecDateRange, JobCallback } from 'node-schedule';
export { Job, Timezone, RecurrenceSpecDateRange, JobCallback };
export interface IRange {
    start: number;
    end: number;
    step: number;
}
export interface ISchedule {
    year?: RecurrenceSegment;
    month?: RecurrenceSegment;
    date?: RecurrenceSegment;
    dayOfWeek?: RecurrenceSegment;
    hour?: RecurrenceSegment;
    minute?: RecurrenceSegment;
    second?: RecurrenceSegment;
    tz?: Timezone;
}
export declare type ScheduleId = string;
export declare type ScheduleOptions = string | ISchedule | RecurrenceSpecDateRange;
export declare type Recurrence = number | string | Partial<IRange>;
export declare type RecurrenceSegment = Recurrence | Recurrence[];
