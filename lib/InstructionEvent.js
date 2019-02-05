const TYPE = 'InstructionEvent';
const InstructionEvent = class extends Event {

    constructor(command, params) {

        super(TYPE);
        this.data = { command, params };
        this.promise = new Promise((resolve, reject) => {

            this.resolve = resolve;
            this.reject = reject;
        });
    }
};
InstructionEvent.TYPE = TYPE;
