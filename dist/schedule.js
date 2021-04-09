"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Schedule = exports.cancelJob = void 0;
const node_schedule_1 = __importStar(require("node-schedule"));
Object.defineProperty(exports, "cancelJob", { enumerable: true, get: function () { return node_schedule_1.cancelJob; } });
const _extract_args_1 = require("./utils/_extract-args");
class Schedule {
    /**
     * change the default value of properties in fancy `options`
     */
    static config(options) {
        if (options.tz)
            this.DEFAULT_TZ = options.tz;
        Schedule.DEFAULT_OPTIONS = Object.assign(Object.assign({}, Schedule.DEFAULT_OPTIONS), options);
    }
    /**
     * Convert fancy rule to node-schedule rule
     */
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
    /**
     * Convert fancy range to node-schedule range
     * @param  keyName used for set the default end/start range. (optional)
     */
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
        return new node_schedule_1.default.Range(start, end, step);
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
    /**
     * Changes the timing of a Job, canceling all pending invocations.
     * @param options The new timing options for this Job.
     * @return if the job could be rescheduled, `null` otherwise.
     */
    static Reschedule(job, options) {
        const spec = typeof options === 'string' ? options : Schedule.Rule(options);
        return node_schedule_1.rescheduleJob(job, spec);
    }
}
exports.Schedule = Schedule;
/**
 * default timezone
 */
Schedule.DEFAULT_TZ = null;
Schedule.DEFAULT_OPTIONS = {
    tz: Schedule.DEFAULT_TZ, hour: null, year: null, date: null, dayOfWeek: null, minute: null, month: null, second: 0
};
/**
 * Cancel the job
 * @returns  Whether the job has been cancelled with success.
 */
Schedule.CancelJob = (job) => node_schedule_1.cancelJob(job);
