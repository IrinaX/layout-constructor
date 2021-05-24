/**
 * Класс для работы с точками. На вход принимает X, Y или объект, в котором есть поля X, Y
 */
export default class Point {
    constructor(x = 0, y = 0) {
        if (x && typeof x === 'object') {
            this.x = x.x;
            this.y = x.y;
        } else {
            this.x = x;
            this.y = y;
        }
    }

    /**
     * Повернуть на угол (в радианах) вокруг произвольной точки. По умолчанию вокруг точки (0,0)
     */
    rotate(angle, origin = { x: 0, y: 0 }) {
        return new Point(
            (this.x - origin.x) * Math.cos(angle) - (this.y - origin.y) * Math.sin(angle) + origin.x,
            (this.x - origin.x) * Math.sin(angle) + (this.y - origin.y) * Math.cos(angle) + origin.y,
        );
    }

    /**
     * Рассточние до точки. По умолчанию до точки (0,0)
     */
    len(point = { x: 0, y: 0 }) {
        return Math.sqrt((this.x - point.x) * (this.x - point.x) + (this.y - point.y) * (this.y - point.y));
    }

    /**
     * Угол между текущей и заданной точкой. По умолчанию заданная точка (0,0)
     */
    angle(point = { x: 0, y: 0 }) {
        return Math.atan((this.y - point.y) / (this.x - point.x));
    }

    /**
     * Вычесть X,Y
     */
    sub(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }

    /**
     * Прибавить X,Y
     */
    add(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }

    /**
     * Перемножить X,Y
     */
    mul(point) {
        return new Point(this.x * point.x, this.y * point.y);
    }
}
