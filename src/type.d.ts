export type Dot = {
    x: number;
    y: number;
}

export type Line = {
    start: Dot;
    end: Dot;
    invisible: boolean;
    color: string;
    stroke: number;
}