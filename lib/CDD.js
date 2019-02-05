const ChromeDebuggerDriver  = class {

    constructor() {

        this.target = null;
    }

    start() {

        const self = this;
        return new Promise((resolve) => {

            chrome.debugger.getTargets((x) => {

                self.target = x.find((p) => p.tabId === chrome.devtools.inspectedWindow.tabId);
                if (self.target === null) {
                    return reject(new Error(`could not find target ${chrome.devtools.inspectedWindow.tabId}`));
                }
                return resolve();
            });
        });
    }

    sendCommand(command, params) {

        const target = this.target;

        if (target === null) {
            return Promise.reject(new Error('call `start` on debugger to acquire target'))
        }

        return new Promise((resolve, reject) => {

            chrome.debugger.sendCommand(target, command, params, (res) => {

                if (res) {
                    return resolve(res);
                }
                return reject(/*TODO*/);
            });
        });
    }
};
