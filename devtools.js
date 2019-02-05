'use strict';
// Create a new panel
chrome.devtools.panels.create('SPAudit',
    null,
    'panel.html',
    async function (panel) {

        const cdt = new ChromeDebuggerDriver();
        await cdt.start();


        panel.onShown.addListener((panelWindow) => {

            panelWindow.document.addEventListener(InstructionEvent.TYPE, async (instruction) => {

                const { data: { command, params } } = instruction;

                cdt.sendCommand(command, params)
                    .then(instruction.resolve)
                    .catch(instruction.reject);
            });
        });
    });
