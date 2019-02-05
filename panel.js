const wait = function (t) {
    return new Promise((r) => {
        setTimeout(r, t);
    });
};

async function act() {

    console.log('CLICK');
    const re = await ChromeDebug.DOM.enable();
    console.log(re);
    const re2 = await ChromeDebug.DOM.getDocument();
    console.log(re2.root.nodeId);
    const allNodes = await ChromeDebug.DOM.querySelectorAll(re2.nodeId);
    console.log(allNodes);
    for (const nodeId of allNodes.nodeIds) {
        const { object: { objectId } } = await ChromeDebug.DOM.resolveNode(nodeId); // should always be an html element
        console.log({ nodeId, objectId });
        const eventListeners = await ChromeDebug.DOMDebugger.getEventListeners(objectId);
        console.log(eventListeners);
        // await ChromeDebug.DOM.highlightNode(id);
        // await wait(1000);
    }
}

document.getElementById('btn')
    .addEventListener('click', act);

