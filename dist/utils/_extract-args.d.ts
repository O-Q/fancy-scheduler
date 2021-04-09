import { JobCallback, ScheduleOptions, ScheduleId } from "../types";
export declare const extractJobArgs: (args: (ScheduleId | ScheduleOptions | JobCallback)[]) => {
    options: ScheduleOptions;
    name: string;
    callback: JobCallback;
};
