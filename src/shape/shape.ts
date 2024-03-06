export default abstract class Shape {

    private static idCounter = 0;

    public id = Shape.idCounter++;

    public abstract collide(other: Shape): boolean;
}