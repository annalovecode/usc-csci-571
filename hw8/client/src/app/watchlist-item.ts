export class WatchlistItem {
    ticker: string;
    name: string;
    price: number;

    static of(ticker: string, name: string, price: number): WatchlistItem {
        const item = new WatchlistItem();
        item.ticker = ticker;
        item.name = name;
        item.price = price;
        return item;
    }

    static clone(item: WatchlistItem): WatchlistItem {
        const clone = new WatchlistItem();
        Object.assign(clone, item);
        return clone;
    }

    round(value: number): number {
        return +(value.toFixed(2));
    }

    getChange(newPrice: number): number {
        return this.round(newPrice - this.price);
    }

    getChangePercent(newPrice: number): number {
        return this.round(((newPrice - this.price) / this.price) * 100);
    }
}
