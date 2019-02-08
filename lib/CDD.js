const ChromeDebuggerDriver  = class {

    constructor() {

        const self = this;
        this.debuggee = { tabId: chrome.devtools.inspectedWindow.tabId };
        this.enabled = false;
        chrome.debugger.onEvent.addListener(function (source, method, params) {

            if (source.tabId !== self.debuggee.tabId) {
                return;
            }
            self.dispatch(method, params);
        });

        this.listeners = new Map();
    }

    on(eventName, cb) {

        let line = this.listeners.get(eventName);
        if (!line) {
            line = new Set();
            this.listeners.set(eventName, line);
        }
        line.add(cb);
    }

    off(eventName, cb) {

        const line = this.listeners.get(eventName);
        if (!line) {
            return;
        }
        line.delete(cb);
    }

    dispatch(eventName, args) {

        const line = this.listeners.get(eventName);
        if (!line) {
            return;
        }
        for (const cb of line) {
            cb(args);
        }
    }

    _lastError() {

        return chrome.runtime.lastError;
    }

    _getError(e1) {

        const e2 = this._lastError();
        if (e1 !== e2) {
            return e2;
        }
        return null;
    }

    start() {

        const e0 = this._lastError();
        return new Promise((resolve, reject) => {

            chrome.debugger.attach(this.debuggee, '1.3', () => {

                // TODO if already attached, detach and take it
                const e = this._getError(e0);
                if (e) {
                    return reject(e);
                }

                return resolve();
            });
        });
    }

    stop() {

        const e0 = this._lastError();
        return new Promise((resolve, reject) => {

            chrome.debugger.detach(this.debuggee, () => {

                // TODO if already attached, detach and take it
                const e = this._getError(e0);
                if (e) {
                    return reject(e);
                }

                return resolve();
            });
        });
    }

    sendCommand(command, params) {

        const e0 = this._lastError();
        return new Promise((resolve, reject) => {

            chrome.debugger.sendCommand(this.debuggee, command, params, (res) => {

                const e = this._getError(e0);
                if (e) {
                    return reject(e);
                }
                return resolve(res);
            });
        });
    }
};
