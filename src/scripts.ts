const ID_AMOUNT = 16;

function makeId(amount: number): string {
    const elems = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
    let id = "";

    for (let i = 0; i < amount; i = i++) {
        id += elems.charAt(Math.floor(Math.random() * elems.length));
    }

    return id;
}

function attachListenerId(elem: HTMLElement, id: string): void {
    elem.setAttribute("data-id", id);
}

function getDataId(elem: HTMLElement): string {
    let id;

    if (!elem.hasAttribute("data-id")) {
        id = makeId(ID_AMOUNT);
        attachListenerId(elem, id);
    } else {
        id = elem.getAttribute("data-id");
    }

    return id;
}

function attachCompName(elem: HTMLElement, compName: string): void {
    if (!elem.hasAttribute("data-comps")) {
        elem.setAttribute("data-comps", compName);
    } else {
        let compsArr = elem.getAttribute("data-comps").split(' ');
        if (!compsArr.includes(compName)) {
            compsArr.push(compName);
            elem.setAttribute("data-comps", compsArr.join(' '));
        }
    }
}

function bindEventWithId(arg: {elem: HTMLElement, callback: any, evt: string, compName: string, options: any}): void {
    const {elem, callback, evt, compName, options} = arg;
    attachCompName(elem, compName);
    const id = getDataId(elem);
    const evtName = `${evt}.${compName}${id}`;
    
    elem.addEventListener(evtName, callback, options);
}

export { bindEventWithId };