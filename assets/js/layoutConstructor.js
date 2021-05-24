export default class LayoutConstructor {
    constructor() {
        this.components = [];
        this.placeSubscribers = [];
        this.scaleFactor = 1;
    }

    place(component) {
        component.props.id = Math.random().toString(36).substring(7);
        this.components.push(component);
        this.placeSubscribers.forEach(callback => callback(component));
    }

    subscribeToPlace(callback) {
        this.placeSubscribers.push(callback);
    }

    remove(id) {
        const index = this.components.findIndex(item => item.props.id === id);
        if (index > -1) {
            this.components.splice(index, 1);
        }
    }

    bringFront(id) {
        const index = this.components.findIndex(item => item.props.id === id);
        this.components.splice(index + 1, 0, this.components.splice(index, 1)[0]);
    }

    bringBack(id) {
        const index = this.components.findIndex(item => item.props.id === id);
        if (index !== 0) {
            this.components.splice(index - 1, 0, this.components.splice(index, 1)[0]);
        }
    }
}
