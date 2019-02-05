const ChromeDebuggerDriver  = class {

    constructor() {

        this.debuggee = { tabId: chrome.devtools.inspectedWindow.tabId };
        this.enabled = false;
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

            chrome.debugger.attach(this.debuggee, '1.3', (x) => {

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
