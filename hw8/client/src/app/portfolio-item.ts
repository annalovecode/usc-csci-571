export class PortfolioItem {
    ticker: string;
    name: string;
    quantity: number;
    price: number;

    static of(ticker: string, name: string, quantity: number, price: number): PortfolioItem {
        const item = new PortfolioItem();
        item.ticker = ticker;
        item.name = name;
        item.quantity = quantity;
        item.price = price;
        return item;
    }

    static clone(item: PortfolioItem): PortfolioItem {
        const clone = new PortfolioItem();
        Object.assign(clone, item);
        return clone;
    }

    getChange(newPrice: number): number {
        return this.round(newPrice - this.price);
    }

    getTotalCost(): number {
        return this.round(this.quantity * this.price);
    }

    getMarketValue(newPrice: number): number {
        return this.round(this.quantity * newPrice);
    }

    buy(quantity: number, price: number): void {
        const newQuantity = this.quantity + quantity;
        const newPrice = this.round(((this.quantity * this.price) + (quantity * price)) / newQuantity);
        this.quantity = newQuantity;
        this.price = newPrice;
    }

    sell(quantity: number): boolean {
        this.quantity -= quantity;
        return this.quantity === 0;
    }

    round(value: number): number {
        return +(value.toFixed(2));
    }
}
