const wait = function (t) {
    return new Promise((r) => {
        setTimeout(r, t);
    });
};

const getAllNodeIds = async function (selector = '*') {

    const { root } = await ChromeDebug.DOM.getDocument();
    const rootId = root.nodeId;
    const { nodeIds } = await ChromeDebug.DOM.querySelectorAll(root.nodeId, selector);
    return [rootId].concat(nodeIds);
};

async function renderNode(nodeId, objectId, listeners) {

    const a = document.createElement('a');
    document.getElementById('list-tab').appendChild(a);
    a.setAttribute('class', 'list-group-item list-group-item-action');
    a.setAttribute('id', 'link-' + nodeId);
    a.setAttribute('data-toggle', 'list');
    a.setAttribute('href', '#' + 'tab-' + nodeId);
    a.setAttribute('role', 'tab');
    a.setAttribute('aria-controls', nodeId);
    a.innerText = objectId;

    const div = document.createElement('div');
    document.getElementById('nav-tabContent').appendChild(div);
    div.setAttribute('class', 'tab-pane fade');
    div.setAttribute('id', 'tab-' + nodeId);
    div.setAttribute('role', 'tabpanel');
    div.setAttribute('aria-labelledby', 'list-profile-list');
    div.innerText = JSON.stringify(listeners, null, 2);
}

const cleanup = function (node) {

    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

async function filterNodes() {

    // TODO: loading bar

    cleanup(document.getElementById('list-tab'));
    cleanup(document.getElementById('nav-tabContent'));

    const selector = document.getElementById('querySelector').value || '*';
    const targetEventListenerList = document.getElementById('eventsFilter').value
        .split(',')
        .filter(Boolean)
        .map((x) => x.trim());

    const nodeIdList = await getAllNodeIds(selector);
    for (const nodeId of nodeIdList) {
        const { object: { objectId } } = await ChromeDebug.DOM.resolveNode(nodeId); // should always be an html element
        const { listeners } = await ChromeDebug.DOMDebugger.getEventListeners(objectId);
        const hasListener = targetEventListenerList.length === 0 || !!listeners.find((x) => targetEventListenerList.includes(x.type));
        if (hasListener) {
            renderNode(nodeId, objectId, listeners);
        }
    }
}
async function act() {

    await ChromeDebug.DOM.enable();
    await ChromeDebug.Debugger.enable();

    const allNodes = await getAllNodeIds();

    console.log(allNodes);
/*    for (const nodeId of allNodes.nodeIds) {
        const { object: { objectId } } = await ChromeDebug.DOM.resolveNode(nodeId); // should always be an html element
        console.log({ nodeId, objectId });
        const { listeners } = await ChromeDebug.DOMDebugger.getEventListeners(objectId);
        console.log(listeners);
        for (const listener of listeners) {
            const { scriptId, lineNumber, columnNumber, type } = listener;
            const { scriptSource } = await ChromeDebug.Debugger.getScriptSource(scriptId);
            console.log(scriptSource);
            console.log(acorn.parse(scriptSource));
        }
    }*/
}

/*let isCov = false;
async function cov() {
    if (isCov) {
        await ChromeDebug.Debugger.enable();
        isCov = false;
        const { result } = await ChromeDebug.Profiler.takePreciseCoverage();
        await ChromeDebug.Profiler.stopPreciseCoverage();
        for (const line of result) {
            const { scriptId } = line;
            const script = await ChromeDebug.Debugger.getScriptSource(scriptId);
            console.log(line, script);
        }
        return;
    }
    await ChromeDebug.Profiler.enable();
    await ChromeDebug.Profiler.startPreciseCoverage();
    isCov = true;
}*/


document.getElementById('filterBtn')
    .addEventListener('click', filterNodes);


