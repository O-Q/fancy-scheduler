"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schedule = void 0;
const node_schedule_1 = require("node-schedule");
const _extract_args_1 = require("./utils/_extract-args");
class Schedule {
    static get DEFAULT_TZ() {
        return Schedule.DEFAULT_OPTIONS.tz;
    }
    ;
    static set DEFAULT_TZ(tz) {
        Schedule.DEFAULT_OPTIONS.tz = tz;
    }
    static config(options) {
        Schedule.DEFAULT_OPTIONS = Object.assign(Object.assign({}, Schedule.DEFAULT_OPTIONS), options);
    }
    static Rule(options) {
        const _a = Object.assign(Object.assign({}, Schedule.DEFAULT_OPTIONS), options), { tz } = _a, rest = __rest(_a, ["tz"]);
        const rule = new node_schedule_1.RecurrenceRule();
        for (const k of Object.keys(rest)) {
            const obj = rest[k];
            if (!obj || typeof obj !== 'object') {
                rule[k] = obj;
                continue;
            }
            if (obj instanceof Array) {
                rule[k] = [];
                for (const recurrence of obj.values()) {
                    rule[k].push(typeof recurrence === 'object' ? Schedule.Range(recurrence, k) : recurrence);
                }
            }
            else {
                rule[k] = Schedule.Range(rest[k], k);
            }
        }
        rule.tz = tz;
        return rule;
    }
    static Range(options, keyName) {
        let _end = null;
        let _start = null;
        if (keyName && !options.end) {
            if (keyName === 'hour')
                _end = 23;
            else if (keyName === 'dayOfWeek')
                _end = 6;
            else if (keyName === 'month')
                _end = 12;
            else if (keyName === 'year')
                _end = 2199;
            else if (keyName === 'date') {
                _end = 31;
                _start = 1;
            }
            else {
                _end = 59;
            }
        }
        const { start, end, step } = Object.assign({ start: _start, end: _end, step: null }, options);
        return new node_schedule_1.Range(start, end, step);
    }
    static Job(...args) {
        const { name, options, callback } = _extract_args_1.extractJobArgs(args);
        const job = new node_schedule_1.Job(name, callback);
        let rule;
        if (typeof options === 'string')
            rule = options;
        else
            rule = Schedule.Rule(options);
        const success = job.reschedule(rule);
        if (!success)
            console.warn('[Warn] "Options" was not valid.');
        return job;
    }
    static Reschedule(job, options) {
        const spec = typeof options === 'string' ? options : Schedule.Rule(options);
        return node_schedule_1.rescheduleJob(job, spec);
    }
}
exports.Schedule = Schedule;
Schedule.DEFAULT_OPTIONS = {
    tz: null, hour: null, year: null, date: null, dayOfWeek: null, minute: null, month: null, second: 0
};
Schedule.CancelJob = (job) => node_schedule_1.cancelJob(job);
//# sourceMappingURL=schedule.js.map