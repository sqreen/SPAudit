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
        highlightNode: (nodeId) => sendCommand('DOM.highlightNode', { nodeId, highlightConfig: {contentColor: { r: 100, g: 50, b: 50 }}}), // TODO: better
        querySelectorAll: (nodeId = 1, selector = '*') => sendCommand('DOM.querySelectorAll', { nodeId, selector }),
        resolveNode: (nodeId) => sendCommand('DOM.resolveNode', { nodeId }),
        hideHighlight: () => sendCommand('DOM.hideHighlight'),
        focus: (nodeId) => sendCommand('DOM.focus', { nodeId }),
    },
    DOMDebugger: {
        getEventListeners: (objectId) => sendCommand('DOMDebugger.getEventListeners', { objectId })
    },
    Profiler: {
        startPreciseCoverage: () => sendCommand('Profiler.startPreciseCoverage'),
        stopPreciseCoverage: () => sendCommand('Profiler.stopPreciseCoverage'),
        takePreciseCoverage: () => sendCommand('Profiler.takePreciseCoverage'),
        enable: () => sendCommand('Profiler.enable')
    },
    Debugger: {
        getScriptSource: (scriptId) => sendCommand('Debugger.getScriptSource', { scriptId }),
        enable: () => sendCommand('Debugger.enable')
    },
    SPAudit: {
        getScripts: () => sendCommand('SPAudit.getScripts')
    }
};

