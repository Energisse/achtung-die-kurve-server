import Line from "./shape/line";

export class Tail {

    private parts: Line[] = [];

    constructor() {
    }

    public addPart(part: Line) {
        this.parts.push(part);
    }

    public removeParts(index: number[]) {
        this.parts = this.parts.filter((_, i) => !index.includes(i));
    }

    public getParts(): Line[] {
        return this.parts;
    }

}