'use strict';
// Create a new panel
chrome.devtools.panels.create('SPAudit',
    null,
    'panel.html',
    function (panel) {

        const cdt = new ChromeDebuggerDriver();

        panel.onShown.addListener(async (panelWindow) => {

            await cdt.start();

            panelWindow.document.addEventListener(InstructionEvent.TYPE, async (instruction) => {

                const { data: { command, params } } = instruction;

                cdt.sendCommand(command, params)
                    .then(instruction.resolve)
                    .catch(instruction.reject);
            });
        });

        panel.onHidden.addListener(async () => {

            await cdt.stop()
        });
    });
