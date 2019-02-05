'use strict';
const sendCommand = function (cmd, params = {}) {

    console.log('SEND', cmd, JSON.stringify(params));
    const evt = new InstructionEvent(cmd, params);
    document.dispatchEvent(evt);
    return evt.promise;
};

const ChromeDebug = {
    DOM: {
        enable: () => sendCommand('DOM.enable' ,),
        getDocument: (depth = -1) => sendCommand('DOM.getDocument', { depth }),
        highlightNode: (nodeId) => sendCommand('DOM.highlightNode', { nodeId, highlightConfig: {contentColor: { r: 100, g: 50, b: 50 }}}),
        querySelectorAll: (nodeId = 1, selector = '*') => sendCommand('DOM.querySelectorAll', { nodeId, selector }),
        resolveNode: (nodeId) => sendCommand('DOM.resolveNode', { nodeId })
    },
    DOMDebugger: {
        getEventListeners: (objectId) => sendCommand('DOMDebugger.getEventListeners', { objectId })
    }
};

