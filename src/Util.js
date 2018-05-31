export function assign(target, ...args) {
    if (target == null) {
        throw new Error('Cannot convert undefined or null to object')
    }

    let i = -1, len = args.length;
    while (++i < len) {
        let source = args[i];
        if (source != null) {
            for (let key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        }
    }

    return target
}

export function trim(str) {
    return str.replace(/^\s+|\s+$/g, '')
}
