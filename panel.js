function act() {

    console.log('CLICK');
    const evt = new InstructionEvent('msg', { ok: 1 });
    evt.promise.then((x) => console.log('RESOLVE', x));

    document.dispatchEvent(evt);
}

document.getElementById('btn')
    .addEventListener('click', act);

