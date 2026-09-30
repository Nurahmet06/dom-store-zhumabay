export class Store {
    #items = [];

    constructor(items = []) {
        if (!Array.isArray(items)) {
            throw new TypeError("Items must be an array");
        }

        this.#items = [...items];
    }

    add(item) {
        this.#items.push(item);
        return item;
    }

    remove(id) {
        const index = this.#items.findIndex(
            item => item.id === id
        );

        if (index === -1) {
            return false;
        }

        this.#items.splice(index, 1);
        return true;
    }

    find(id) {
        return this.#items.find(
            item => item.id === id
        );
    }

    total() {
        return this.#items.length;
    }

    get items() {
        return [...this.#items];
    }

    static create(items = []) {
        return new Store(items);
    }
}