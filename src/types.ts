import { Job, Timezone, RecurrenceSpecDateRange, JobCallback } from 'node-schedule';
export { Job, Timezone, RecurrenceSpecDateRange, JobCallback };

export interface IRange {
    start: number;
    end: number;
    step: number;
}


export interface ISchedule {
    year?: RecurrenceSegment,
    month?: RecurrenceSegment,
    date?: RecurrenceSegment,
    dayOfWeek?: RecurrenceSegment,
    hour?: RecurrenceSegment,
    minute?: RecurrenceSegment,
    second?: RecurrenceSegment,
    tz?: Timezone,
}


export type ScheduleId = string;
export type ScheduleOptions = string | ISchedule | RecurrenceSpecDateRange;
export type Recurrence = number | string | Partial<IRange>;

export type RecurrenceSegment = Recurrence | Recurrence[];
