import React from "react";
import type { Route } from "./+types/home";
import logo from "/public/logo.jpg";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import type { Credentials } from "./home";

interface Asset {
  label: string;
  quantity: number;
  type: string;
  price: number;
  date: string;
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

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export async function clientLoader({
  params,
}: any) {
  /* 
    TODO
      - filtering date and type could be optimised
      - more types (charts etc)
      - API with more data?
  
  */


  // CREDENTIALS: load email and visits from localStorage
  const credentials: string | null = localStorage.getItem("credentials");
  let email: string | undefined;
  let visits: string | undefined;
  if (credentials) {
    const credentialsParsed: Credentials[] = JSON.parse(credentials);
    const thisUser = credentialsParsed.find((credential) => credential.active);
    email = thisUser?.email[0];
    visits = thisUser?.visits.toString();
  }


  // DONUT DATA: fetch data from /assets
  const assetResponse = await fetch("/assets");
  const assetData = await assetResponse.json();

  return { email, visits, assetData };
}

export default function DashboardRoute({ loaderData }: { loaderData: { email: string, visits: string, assetData: { donut: Asset[], donutAndHistoricalData: Asset[] } } }) {
  // Hardcoded constants
  const ALL_TYPES = "all-assets";
  const COLOURS = {
    backgroundColor: [
      'rgba(0, 51, 153, 0.92)',
      'rgba(0, 102, 204, 0.92)',
      'rgba(0, 153, 255, 0.92)',
      'rgba(30, 144, 255, 0.92)',
      'rgba(70, 130, 180, 0.92)',
      'rgba(173, 216, 230, 0.92)',
    ],
    borderColor: [
      'rgba(100, 149, 237, 1)',
      'rgba(135, 206, 250, 1)',
      'rgba(173, 216, 230, 1)',
      'rgba(176, 224, 230, 1)',
      'rgba(202, 225, 255, 1)',
      'rgba(224, 240, 255, 1)',
    ],
  }

  // API data
  const { email, visits, assetData } = loaderData;

  // App state
  const [selectedType, setSelectedType] = React.useState<string>(ALL_TYPES);
  const [selectedDate, setSelectedDate] = React.useState<string>(assetData.donutAndHistoricalData.sort((a: Asset, b: Asset) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date);

  // Dashboard data
  const [donutData, setDonutData] = React.useState<DonutChartData | null>(null);
  const availableAssetsTypes: string[] = [... new Set<string>(assetData.donut.map((asset: Asset) => asset.type))];
  const [tableData, setTableData] = React.useState<any[]>([]);
  const [lineData, setLineData] = React.useState<any>(null);

  // Select box change functions
  function handleDonutDataChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const assetLabel = event.target.value;
    setSelectedType(assetLabel);
  }

  function handleDateChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const date = event.target.value;
    setSelectedDate(date);
  }

  // Charts & table data transformations
  function updateDonutData() {
    // Donut#1 - All assets by type
    const donut_1: Record<string, number> = {};
    assetData.donutAndHistoricalData.filter((asset: Asset) => asset.date === selectedDate).forEach((asset: Asset) => {
      donut_1[asset.type] ? donut_1[asset.type] += asset.quantity * asset.price : donut_1[asset.type] = asset.quantity * asset.price;
    });

    const defaultDonut: DonutChartData = {
      labels: Object.keys(donut_1).map((type: string) => `${type[0].toUpperCase()}${type.slice(1)}`),
      datasets: [
        {
          label: 'Total value in USD$',
          data: Object.values(donut_1),
          backgroundColor: COLOURS.backgroundColor,
          borderColor: COLOURS.borderColor,
          borderWidth: 1,
        },
      ],
    };


    if (selectedType === ALL_TYPES) {
      setDonutData(defaultDonut);
    } else {
      // Donut#2 - Individual assets of a specific type
      const donut_2 = {} as Record<string, number>;
      assetData.donutAndHistoricalData.filter((asset: Asset) => asset.date === selectedDate).forEach((asset: Asset) => {
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
      assetData.donutAndHistoricalData
        .filter((asset: Asset) => selectedType === ALL_TYPES || asset.type === selectedType)
        .filter((asset: Asset) => asset.date === selectedDate)
    )
  }


  function updateLineData() {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top' as const,
        }
      },
    };

    const filteredAssetsData: Asset[] = assetData.donutAndHistoricalData
      .filter((asset: Asset) => new Date(asset.date) <= new Date(selectedDate) && (asset.type === selectedType || selectedType === ALL_TYPES))
      .sort((a: Asset, b: Asset) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels = [...new Set(filteredAssetsData.map((asset: Asset) => asset.date))];
    const assetTypes = [...new Set(filteredAssetsData.map((asset: Asset) => selectedType === ALL_TYPES ? asset.type : asset.label))];



    const data = {
      labels,
      datasets: [
        ...assetTypes.map((type: string, index: number) => {
          const label = `${type[0].toUpperCase()}${type.slice(1)}`;
          const entryData: { [key: string]: number } = {};
          filteredAssetsData.filter((asset: Asset) => asset[selectedType === ALL_TYPES ? 'type' : 'label'] === type).forEach((asset: Asset) => {
            entryData[asset.date] = (entryData[asset.date] || 0) + (asset.price * asset.quantity);
          })

          return {
            label,
            data: Object.values(entryData),
            borderColor: COLOURS.backgroundColor[index % COLOURS.backgroundColor.length],
            backgroundColor: COLOURS.backgroundColor[index % COLOURS.backgroundColor.length],
          }
        }),
      ],
    };

    setLineData({
      options,
      data
    });
  }

  React.useEffect(() => {
    updateDonutData();
    updateTableData();
    updateLineData();
  }, [selectedType, selectedDate]);

  return (
    <main className="max-w-[600px] mx-auto flex flex-col items-center justify-center gap-4 m-[24px] relative">
      <div className="w-full sticky top-0 left-0 right-0 bg-gray-950/90 pb-4">
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
            <p className="leading-6 text-gray-200 text-center pb-2 text-sm mb-4">
              Welcome back, <b>{email}</b>, you have visited the dashboard <b>{visits || 1}</b> time{parseInt(visits) === 1 ? '' : 's'}.
            </p>
          </nav>
        </div>
        <div className="w-full flex gap-4 justify-between">
          <select className="flex-1 basis-1/2 p-2 rounded-md border border-gray-700"
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

          <select className="flex-1 basis-1/2 p-2 rounded-md border border-gray-700"
            onChange={handleDateChange}
          >
            {[...new Set(assetData.donutAndHistoricalData
              .map((asset: Asset) => asset.date)
              .filter((date): date is string => date !== undefined)
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
            )].map((date: string, index: number) => <option key={index} value={date}>{date}</option>)}
          </select>

        </div>
      </div>
      <div className="flex flex-col items-center w-full rounded-3xl border p-6 border-gray-700 space-y-4 gap-4">
        {/*
          Task 1: Donut chart with total assets by type
        */}
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">❶ Available assets</h2>
        <div className="w-full max-w-[600px] mb-20">
          {donutData && <Doughnut data={donutData} />}
        </div>

        {/*
          Task 2: Table with your positions
        */}
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">❷ Your Positions</h2>
        <div className="w-full max-w-[600px]">
          <table className="w-full border-t border-gray-700 text-white mb-20">
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

        {/*
          Task 3: Historical chart portfolio over time
        */}
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">❸ Portfolio Through Time</h2>
        <div className="w-full max-w-[600px] mb-10">
          {lineData && <Line options={lineData.options} data={lineData.data} />}
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