'use strict';
async function renderNodeDetails (nodeId, objectId, listeners) {

    const main = document.createElement('div');
    main.setAttribute('class', 'row');

    const btn = document.createElement('button');
    main.appendChild(btn);
    btn.textContent = 'highlight';
    btn.addEventListener('click', async () => {

        await ChromeDebug.DOM.hideHighlight();
        await ChromeDebug.DOM.highlightNode(nodeId);
    });

    const btn2 = document.createElement('button');
    main.appendChild(btn2);
    btn2.textContent = 'un-highlight';
    btn2.addEventListener('click', async () => {

        await ChromeDebug.DOM.hideHighlight();
    });

    const raw = document.createElement('div');
    raw.setAttribute('class', 'col-12');

    main.appendChild(raw);
    raw.innerText = JSON.stringify({ nodeId, objectId, listeners }, nodeId, 2);

    return main;
}

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
    const content = await renderNodeDetails(nodeId, objectId, listeners);
    div.appendChild(content);
}

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

document.getElementById('filterBtn')
    .addEventListener('click', filterNodes);


