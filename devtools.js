'use strict';
// Create a new panel

const scripts = new Map();

chrome.devtools.panels.create('SPAudit',
    null,
    'panel.html',
    async function (panel) {

        const cdt = new ChromeDebuggerDriver();

        panel.onShown.addListener(async (panelWindow) => {

            cdt.on('Debugger.scriptParsed', (item) => scripts.set(item.scriptId, item));
            await cdt.start();
            cdt.sendCommand('Debugger.enable', {});

            panelWindow.document.addEventListener(InstructionEvent.TYPE, async (instruction) => {

                const { data: { command, params } } = instruction;

                if (command === 'SPAudit.getScripts') {
                    instruction.resolve(scripts);
                }

                cdt.sendCommand(command, params)
                    .then(instruction.resolve)
                    .catch(instruction.reject);
            });
        });

        panel.onHidden.addListener(async () => {

            await cdt.stop();
            scripts.clear();
        });
    });
