import { JobCallback, ScheduleOptions, ScheduleId } from "../types";

export const extractJobArgs = (args: (ScheduleId | ScheduleOptions | JobCallback)[]) => {
    let options: ScheduleOptions, name: ScheduleId, callback: JobCallback;
    const [arg1, arg2, arg3] = args;
    if (typeof arg3 == 'undefined') {
        options = arg1 as ScheduleOptions;
        callback = arg2 as JobCallback;
    } else {
        name = arg1 as ScheduleId;
        options = arg2 as ScheduleOptions;
        callback = arg3 as JobCallback;
    }
    return { options, name, callback };
}