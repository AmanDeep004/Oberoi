const getTimeStamp = () => {
    return new Date().toISOString();
};

const info = (namespace, method, message, object) => {
    if (object) {
        console.log(`[${getTimeStamp()}] INFO [${namespace}] METHOD [${method}] ${message}`, object);
    } else {
        console.log(`[${getTimeStamp()}] INFO [${namespace}] METHOD [${method}] ${message}`);
    }
};

const warn = (namespace, method, message, object) => {
    if (object) {
        console.log(`[${getTimeStamp()}] [WARN] [${namespace}] METHOD [${method}] ${message}`, object);
    } else {
        console.log(`[${getTimeStamp()}] [WARN] [${namespace}] METHOD [${method}] ${message}`);
    }
};

const error = (namespace, method, message, object) => {
    if (object) {
        console.log(`[${getTimeStamp()}] [ERROR] [${namespace}] METHOD [${method}] ${message}`, object);
    } else {
        console.log(`[${getTimeStamp()}] [ERROR] [${namespace}] METHOD [${method}] ${message}`);
    }
};

const debug = (namespace, method, message, object) => {
    if (object) {
        console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] METHOD [${method}] ${message}`, object);
    } else {
        console.log(`[${getTimeStamp()}] [DEBUG] [${namespace}] METHOD [${method}] ${message}`);
    }
};

module.exports = {
    info,
    warn,
    error,
    debug
};
