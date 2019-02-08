'use strict';

const getAllNodeIds = async function (selector = '*') {

    const { root } = await ChromeDebug.DOM.getDocument();
    const { nodeIds } = await ChromeDebug.DOM.querySelectorAll(root.nodeId, selector);
    return nodeIds;
};

const cleanup = function (node) {

    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
};

const createElement = function (tag, attributes = {}) {

    const element = document.createElement(tag);
    Object.keys(attributes)
        .forEach((key) => {

            element.setAttribute(key, attributes[key]);
        });
    return element;
};
