'use strict';
// Create a new panel


chrome.devtools.panels.create('SPAudit',
    null,
    'panel.html',
    async function (panel) {

        const cdt = new ChromeDebuggerDriver();
        await cdt.start();

        panel.onShown.addListener((panelWindow) => {

            panelWindow.document.addEventListener(InstructionEvent.TYPE, (instruction) => {

                const { data: { command, params } } = instruction;
                console.log(command, params);
                instruction.resolve('ok');
            });
        });
    }
);
