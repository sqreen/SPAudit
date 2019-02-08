'use strict';

function isEvalCall(node) {
    return (node.type === 'CallExpression') &&
        (node.callee.type === 'Identifier') &&
        (node.callee.name === 'eval') ;
}

function isInnerHTMLCall(node) {
    return (node.type === 'AssignmentExpression') &&
        node.left.property &&
        (node.left.property.type === 'Identifier') &&
        (node.left.property.name === 'innerHTML');
}

Prism.hooks.add('before-highlight', function (env) {
    env.code = env.element.innerText;
});

const displayScript = function (scriptSource, scriptData, highlightLines) {

    const toggleId = 'script-' + scriptData.scriptId;
    const main = document.getElementById('accordionJS');
    const card = createElement('div', { class: 'card' });
    const cardHeader = createElement('div', { class: 'card-header', id: 'head-' + scriptData.scriptId });
    card.appendChild(cardHeader);
    const cardTitle = createElement('h2', { class: 'mb-0' });
    cardHeader.appendChild(cardTitle);

    const btn = createElement('button', { class: 'btn btn-link', type: 'button', 'data-toggle': 'collapse', 'data-target': '#' + toggleId, 'aria-controls': toggleId });
    btn.innerText = 'script' + scriptData.scriptId + ' ' + scriptData.url;
    cardTitle.appendChild(btn);
    if (highlightLines.length > 0) {
        const span = createElement('span', {class: 'badge badge-secondary'});
        span.innerText = highlightLines.length + ' issues';
        cardTitle.appendChild(span);
    }


    const content = createElement('div', { class: 'collapse', id: toggleId, 'aria-labelledby': toggleId, 'data-parent': '#accordionJS' });
    card.appendChild(content);
    const body = createElement('div', { class: 'card-body' });
    content.appendChild(body);

    const pre = createElement('pre', { 'data-line': highlightLines.join(',') });
    body.appendChild(pre);
    const code = createElement('code', { 'class': 'language-js' });
    pre.appendChild(code);
    code.innerText = scriptSource;
    main.appendChild(card);
};


// TODO: add support for failed to parse scripts too.
async function scanJS() {

    cleanup(document.getElementById('accordionJS'));
    const scripts = await ChromeDebug.SPAudit.getScripts();
    for (const scriptData of scripts.values()) {
        const { scriptSource } = await ChromeDebug.Debugger.getScriptSource(scriptData.scriptId);
        const parse = scriptData.isModule ? esprima.parseModule : esprima.parseScript;
        const highlights = [];
        parse(scriptSource, {}, function (node, meta) {
            if (isEvalCall(node)) {
                highlights.push(meta.start.line);
            }
            if (isInnerHTMLCall(node)) {
                highlights.push(meta.start.line);
            }
        });
        displayScript(scriptSource, scriptData, highlights);
    }
    Prism.highlightAll();
}
document.getElementById('scanJS')
    .addEventListener('click', scanJS);


