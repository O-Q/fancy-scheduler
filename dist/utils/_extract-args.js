"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractJobArgs = void 0;
const extractJobArgs = (args) => {
    let options, name, callback;
    const [arg1, arg2, arg3] = args;
    if (typeof arg3 == 'undefined') {
        options = arg1;
        callback = arg2;
    }
    else {
        name = arg1;
        options = arg2;
        callback = arg3;
    }
    return { options, name, callback };
};
exports.extractJobArgs = extractJobArgs;
//# sourceMappingURL=_extract-args.js.map