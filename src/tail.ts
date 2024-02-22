import Line from "./shape/line";

export class Tail {

    private parts: Line[] = [];

    constructor() {
    }

    public addPart(part: Line) {
        this.parts.push(part);
    }

    public getParts(): Line[] {
        return this.parts;
    }

}