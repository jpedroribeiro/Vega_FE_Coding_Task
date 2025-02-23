
import type { Route } from "./+types/assets";

// Hardcoded data for this exercise
const commonAssets = [
    {
        id: 1,
        name: "APPL",
        type: "stock"
    },
    {
        id: 2,
        name: "GOOGL",
        type: "stock"
    },
    {
        id: 3,
        name: "MSFT",
        type: "stock"
    },
    {
        id: 4,
        name: "GBP",
        type: "fiat"
    },
    {
        id: 5,
        name: "EUR",
        type: "fiat"
    },
    {
        id: 6,
        name: "BRL",
        type: "fiat"
    },
    {
        id: 7,
        name: "BTC",
        type: "crypto"
    },
    {
        id: 8,
        name: "ETH",
        type: "crypto"
    },
    {
        id: 9,
        name: "SOL",
        type: "crypto"
    }
];





export async function loader({ params }: Route.LoaderArgs) {
    console.log(params);


    return { donut, donutAndHistoricalData };

}



/* (1) Data for donut chart and (2) table */
const donut = [
    { label: "GBP", quantity: 1905, price: 1.1, type: "fiat" },
    { label: "EUR", quantity: 2055, price: 0.9, type: "fiat" },
    { label: "BRL", quantity: 1155, price: 0.2, type: "fiat" },
    { label: "BTC", quantity: 22, price: 1000, type: "crypto" },
    { label: "ETH", quantity: 55, price: 500, type: "crypto" },
    { label: "SOL", quantity: 11, price: 250, type: "crypto" },
    { label: "APPL", quantity: 123, price: 333, type: "stock" },
    { label: "GOOGL", quantity: 44, price: 555, type: "stock" },
    { label: "MSFT", quantity: 12, price: 111, type: "stock" }
]

const donutAndHistoricalData = [
    { label: "GBP", quantity: 1905, price: 1.1, type: "fiat", date: "2024-03-01" },
    { label: "GBP", quantity: 3321, price: 1.1, type: "fiat", date: "2024-04-01" },
    { label: "GBP", quantity: 5123, price: 1.1, type: "fiat", date: "2024-05-01" },
    { label: "GBP", quantity: 5555, price: 1.1, type: "fiat", date: "2024-06-01" },
    { label: "GBP", quantity: 6100, price: 1.1, type: "fiat", date: "2024-07-01" },
    { label: "EUR", quantity: 2055, price: 0.9, type: "fiat", date: "2024-03-01" },
    { label: "EUR", quantity: 3211, price: 0.9, type: "fiat", date: "2024-04-01" },
    { label: "EUR", quantity: 2900, price: 0.9, type: "fiat", date: "2024-05-01" },
    { label: "EUR", quantity: 1111, price: 0.9, type: "fiat", date: "2024-06-01" },
    { label: "EUR", quantity: 6412, price: 0.9, type: "fiat", date: "2024-07-01" },
    { label: "BRL", quantity: 1155, price: 0.2, type: "fiat", date: "2024-03-01" },
    { label: "BRL", quantity: 2312, price: 0.2, type: "fiat", date: "2024-04-01" },
    { label: "BRL", quantity: 6525, price: 0.2, type: "fiat", date: "2024-05-01" },
    { label: "BRL", quantity: 8888, price: 0.2, type: "fiat", date: "2024-06-01" },
    { label: "BRL", quantity: 10000, price: 0.2, type: "fiat", date: "2024-07-01" },
    { label: "BTC", quantity: 76, price: 1000, type: "crypto", date: "2024-03-01" },
    { label: "ETH", quantity: 65, price: 500, type: "crypto", date: "2024-03-01" },
    { label: "SOL", quantity: 31, price: 250, type: "crypto", date: "2024-03-01" },
    { label: "APPL", quantity: 19, price: 333, type: "stock", date: "2024-03-01" },
    { label: "GOOGL", quantity: 13, price: 555, type: "stock", date: "2024-03-01" },
    { label: "MSFT", quantity: 61, price: 111, type: "stock", date: "2024-03-01" },
    { label: "BTC", quantity: 19, price: 1000, type: "crypto", date: "2024-04-01" },
    { label: "ETH", quantity: 40, price: 500, type: "crypto", date: "2024-04-01" },
    { label: "SOL", quantity: 52, price: 250, type: "crypto", date: "2024-04-01" },
    { label: "APPL", quantity: 49, price: 333, type: "stock", date: "2024-04-01" },
    { label: "GOOGL", quantity: 91, price: 555, type: "stock", date: "2024-04-01" },
    { label: "MSFT", quantity: 30, price: 111, type: "stock", date: "2024-04-01" },
    { label: "BTC", quantity: 67, price: 1000, type: "crypto", date: "2024-05-01" },
    { label: "ETH", quantity: 60, price: 500, type: "crypto", date: "2024-05-01" },
    { label: "SOL", quantity: 51, price: 250, type: "crypto", date: "2024-05-01" },
    { label: "APPL", quantity: 98, price: 333, type: "stock", date: "2024-05-01" },
    { label: "GOOGL", quantity: 80, price: 555, type: "stock", date: "2024-05-01" },
    { label: "MSFT", quantity: 21, price: 111, type: "stock", date: "2024-05-01" },
    { label: "BTC", quantity: 39, price: 1000, type: "crypto", date: "2024-06-01" },
    { label: "ETH", quantity: 15, price: 500, type: "crypto", date: "2024-06-01" },
    { label: "SOL", quantity: 85, price: 250, type: "crypto", date: "2024-06-01" },
    { label: "APPL", quantity: 16, price: 333, type: "stock", date: "2024-06-01" },
    { label: "GOOGL", quantity: 44, price: 555, type: "stock", date: "2024-06-01" },
    { label: "MSFT", quantity: 95, price: 111, type: "stock", date: "2024-06-01" },
    { label: "BTC", quantity: 75, price: 1000, type: "crypto", date: "2024-07-01" },
    { label: "ETH", quantity: 75, price: 500, type: "crypto", date: "2024-07-01" },
    { label: "SOL", quantity: 97, price: 250, type: "crypto", date: "2024-07-01" },
    { label: "APPL", quantity: 19, price: 333, type: "stock", date: "2024-07-01" },
    { label: "GOOGL", quantity: 64, price: 555, type: "stock", date: "2024-07-01" },
    { label: "MSFT", quantity: 49, price: 111, type: "stock", date: "2024-07-01" }
];