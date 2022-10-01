

class JsonShedule {
    private jsonShedule: any;

    constructor() {
        this.jsonShedule = {}
    }

    get(): any{
        return this.jsonShedule;
    }

    set(value: any) {
        this.jsonShedule = value;
    }


}

export const jsonShedule = new JsonShedule();