import $ from "./jquery.js";

class BEMComponent {
    name: string;
    id: string;

    constructor(name: string) {
        const ID_LENGTH = 16;

        this.name = name;
        this.id = this.createId(ID_LENGTH);
    }

    createId(length: number): string {
        const SET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";
        let id = '';
    
        for (let i = 0; i < length; i++) {
            id += SET.charAt(Math.floor(Math.random() * SET.length));
        };
    
        return id;
    }

    bindEventListener(arg: {elem: HTMLElement, event: string, callback: any, data: any, options: any}): void {
        const {data, elem, callback, event, options} = arg;

        const uniqeEventName = event + "." + this.name + this.id;

        $(elem).on(uniqeEventName, options, (event) => {
            Object.assign(event, data);
            callback(event);
        });
    }
}

export { BEMComponent };