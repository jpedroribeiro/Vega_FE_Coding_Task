
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


    return { donut, historical };

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

/* Data for historical chart */
const historical = [
    { date: "2022-01-01", value: 1000 },
    { date: "2022-02-01", value: 2000 },
    { date: "2022-03-01", value: 1700 },
    { date: "2022-04-01", value: 1800 },
    { date: "2022-05-01", value: 3400 },
    { date: "2022-06-01", value: 2300 },
    { date: "2022-07-01", value: 1900 },
    { date: "2022-08-01", value: 3000 },
    { date: "2022-09-01", value: 4000 },
    { date: "2022-10-01", value: 5000 },
    { date: "2022-11-01", value: 6000 },
    { date: "2022-12-01", value: 7000 },
    { date: "2023-01-01", value: 100 },
    { date: "2023-02-01", value: 2900 },
    { date: "2023-03-01", value: 9000 },
    { date: "2023-04-01", value: 2000 },
    { date: "2023-05-01", value: 5000 },
    { date: "2023-06-01", value: 3000 },
    { date: "2023-07-01", value: 1000 },
    { date: "2023-08-01", value: 4000 },
    { date: "2023-09-01", value: 7000 },
    { date: "2023-10-01", value: 9000 },
    { date: "2023-11-01", value: 2000 },
    { date: "2023-12-01", value: 5000 },
    { date: "2024-01-01", value: 5500 },
    { date: "2024-02-01", value: 6000 },
    { date: "2024-03-01", value: 6700 },
    { date: "2024-04-01", value: 7300 },
    { date: "2024-05-01", value: 7900 },
    { date: "2024-06-01", value: 8500 },
    { date: "2024-07-01", value: 9100 },
    { date: "2024-08-01", value: 9700 },
    { date: "2024-09-01", value: 10300 },
    { date: "2024-10-01", value: 10900 },
    { date: "2024-11-01", value: 11500 },
    { date: "2024-12-01", value: 12000 },
    { date: "2025-01-01", value: 12500 },
    { date: "2025-02-01", value: 13000 },
]
