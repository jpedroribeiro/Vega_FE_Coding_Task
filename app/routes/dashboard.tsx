import React from "react";
import type { Route } from "./+types/home";
import logo from "/public/logo.jpg";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

interface Asset {
  label: string;
  quantity: number;
  type: string;
  price: number;
}

interface DonutChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

ChartJS.register(ArcElement, Tooltip, Legend);

export async function clientLoader({
  params,
}: any) {
  // CREDENTIALS: load email and visits from localStorage
  const email = localStorage.getItem("email");
  const visits = localStorage.getItem("visits");


  // DONUT DATA: fetch data from /assets
  const assetResponse = await fetch("/assets");
  const assetData = await assetResponse.json();

  return { email, visits, assetData };
}

export default function DashboardRoute({ loaderData }: any) {
  const ALL_TYPES = "all-assets";
  const [selectedType, setSelectedType] = React.useState<string>(ALL_TYPES);
  const { email, visits, assetData } = loaderData;
  const [donutData, setDonutData] = React.useState<DonutChartData | null>(null);
  const availableAssetsTypes: string[] = [... new Set<string>(assetData.donut.map((asset: Asset) => asset.type))];
  const [tableData, setTableData] = React.useState<any[]>([]);

  function handleDonutDataChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const assetLabel = event.target.value;
    setSelectedType(assetLabel);
  }

  function updateDonutData() {
    // Create specific data containers based on user data (from API)
    const donut_1: Record<string, number> = {};
    assetData.donut.forEach((asset: Asset) => {
      donut_1[asset.type] ? donut_1[asset.type] += asset.quantity * asset.price : donut_1[asset.type] = asset.quantity * asset.price;
    });

    const defaultDonut: DonutChartData = {
      labels: Object.keys(donut_1),
      datasets: [
        {
          label: 'Total value in USD$',
          data: Object.values(donut_1),
          backgroundColor: [
            'rgba(255, 99, 132, 0.92)',
            'rgba(54, 162, 235, 0.92)',
            'rgba(255, 206, 86, 0.92)',
            'rgba(75, 192, 192, 0.92)',
            'rgba(153, 102, 255, 0.92)',
            'rgba(255, 159, 64, 0.92)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };


    if (selectedType === ALL_TYPES) {
      setDonutData(defaultDonut);
    } else {
      const donut_2 = {} as Record<string, number>;
      assetData.donut.forEach((asset: Asset) => {
        if (asset.type === selectedType) donut_2[asset.label] ? donut_2[asset.label] += asset.quantity * asset.price : donut_2[asset.label] = asset.quantity * asset.price;
      });

      setDonutData({
        ...defaultDonut,
        labels: Object.keys(donut_2),
        datasets: [
          {
            ...defaultDonut.datasets[0],
            data: Object.values(donut_2),
          },
        ],
      })

    }
  }

  function updateTableData() {
    setTableData(
      assetData.donut.filter((asset: Asset) => selectedType === ALL_TYPES || asset.type === selectedType)
    )
  }

  React.useEffect(() => {
    updateDonutData();
    updateTableData();
  }, [selectedType]);

  return (
    <main className="flex flex-col items-center justify-center gap-4 m-[24px]">
      <header className="flex flex-col items-center gap-9">
        <img
          src={logo}
          alt="VEGA"
          className="block"
          width={100}
          height={100}
        />
      </header>
      <div className="space-y-6 px-4">
        <nav className="space-y-4">
          <p className="leading-6 text-gray-200 text-center pb-2 text-sm">
            Welcome back, {email || "TODO"}, you have visited the dashboard {visits || "TODO"} times.
          </p>
        </nav>
      </div>
      <div className="flex flex-col items-center w-full rounded-3xl border p-6 border-gray-700 space-y-4 gap-4">
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">❶ Available assets</h2>
        <div className="w-full max-w-[600px]">
          {donutData && <Doughnut data={donutData} />}
        </div>
        <select className="w-full max-w-[600px] p-2 rounded-md border border-gray-700 mb-20"
          onChange={handleDonutDataChange}
        >
          <optgroup label="All available assets">
            <option defaultChecked value={ALL_TYPES}>Total by type</option>
          </optgroup>
          <optgroup label="Individual asset type">
            {
              availableAssetsTypes.sort().map((label: string, index: number) => {
                return <option key={index} value={label}>{label.charAt(0).toUpperCase() + label.slice(1)}</option>
              })
            }
          </optgroup>
        </select>
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">❷ Your Positions</h2>
        <div className="w-full max-w-[600px]">
          <table className="w-full border-t border-gray-700 text-white">
            <thead>
              <tr className="bg-gray-800 text-left">
                <th className="p-3 border-b border-gray-700">Asset</th>
                <th className="p-3 border-b border-gray-700">Type</th>
                <th className="p-3 border-b border-gray-700">Quantity</th>
                <th className="p-3 border-b border-gray-700">Price</th>
                <th className="p-3 border-b border-gray-700">Total (USD$)</th>
              </tr>
            </thead>
            <tbody>
              {tableData && tableData.map((asset: Asset, index: number) => {
                if ((index === tableData.length - 1) || (tableData[index + 1] !== null && tableData[index + 1].type !== asset.type)) {
                  return <React.Fragment key={asset.type}>
                    <tr className="border-b border-gray-700 hover:bg-gray-800">
                      <td className="p-3">{asset.label}</td>
                      <td className="p-3">{asset.type}</td>
                      <td className="p-3">{asset.quantity}</td>
                      <td className="p-3">{asset.price}</td>
                      <td className="p-3">{(asset.quantity * asset.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                    </tr>
                    <tr className="bg-gray-900 text-gray-300 font-semibold">
                      <td colSpan={4} className="p-3 border-t border-gray-700">Total {asset.type}</td>
                      <td className="p-3 border-t border-gray-700">{(tableData.reduce((acc: number, a: Asset) => a.type === asset.type ? acc + a.quantity * a.price : acc, 0)).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                    </tr>
                    {selectedType === ALL_TYPES && index === tableData.length - 1 && <>
                      <tr className="bg-gray-900 text-gray-300 font-bold">
                        <td colSpan={4} className="p-3 border-t border-gray-700">Total all assets</td>
                        <td className="p-3 border-t border-gray-700">{tableData.reduce((acc: number, a: Asset) => acc + a.quantity * a.price, 0).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                      </tr>
                    </>}
                  </React.Fragment>
                }

                return <tr key={asset.label} className="border-b border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{asset.label}</td>
                  <td className="p-3">{asset.type}</td>
                  <td className="p-3">{asset.quantity}</td>
                  <td className="p-3">{asset.price}</td>
                  <td className="p-3">{(asset.quantity * asset.price).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                </tr>
              })}
            </tbody>
          </table>

        </div>
      </div>
    </main>
  );
}


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vega Frontend Coding Task" },
    { name: "description", content: "This is the dashboard" },
  ];
}

export function HydrateFallback() {
  return <p>Loading...</p>;
}