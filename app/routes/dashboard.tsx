import React from "react";
import type { Route } from "./+types/home";
import logo from "/public/logo.jpg";
import LoadingSpinner from "../loading_spinner";
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import type { ChartData } from 'chart.js';
import { Doughnut, Line } from 'react-chartjs-2';
import type { Credentials } from "./home";
import type { Asset } from "./assets";
import { ALL_TYPES, COLOURS, pageCopy } from "../constants";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export async function clientLoader({ params }: any) {
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

export default function DashboardRoute({ loaderData }: { loaderData: { email: string, visits: string, assetData: { donutAndHistoricalData: Asset[] } } }) {
  // API data
  const { email, visits, assetData } = loaderData;

  // App state
  const [selectedType, setSelectedType] = React.useState<string>(ALL_TYPES);
  const [selectedDate, setSelectedDate] = React.useState<string>(assetData.donutAndHistoricalData.sort((a: Asset, b: Asset) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date);

  // Dashboard data
  const availableAssetsTypes: string[] = [... new Set<string>(assetData.donutAndHistoricalData.map((asset: Asset) => asset.type))];
  const [donutData, setDonutData] = React.useState<ChartData<"doughnut"> | null>(null);
  const [tableData, setTableData] = React.useState<Asset[]>([]);
  const [lineData, setLineData] = React.useState<ChartData<"line"> | null>(null);

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

    const defaultDonut: ChartData<"doughnut"> = {
      labels: Object.keys(donut_1).map((type: string) => `${type[0].toUpperCase()}${type.slice(1)}`),
      datasets: [
        {
          label: pageCopy.donut_label,
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
    const filteredAssetsData: Asset[] = assetData.donutAndHistoricalData
      .filter((asset: Asset) => new Date(asset.date) <= new Date(selectedDate) && (asset.type === selectedType || selectedType === ALL_TYPES))
      .sort((a: Asset, b: Asset) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const labels: string[] = [...new Set(filteredAssetsData.map((asset: Asset) => asset.date))];
    const assetTypes: string[] = [...new Set(filteredAssetsData.map((asset: Asset) => selectedType === ALL_TYPES ? asset.type : asset.label))];

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

    setLineData(data);
  }

  React.useEffect(() => {
    updateDonutData();
    updateTableData();
    updateLineData();
  }, [selectedType, selectedDate]);

  return (
    <main className="max-w-2xl mx-auto flex flex-col items-center justify-center gap-4 m-8 mt-4 relative p-4">
      <div className="w-full sticky top-0 left-0 right-0 bg-gray-950/90 pb-4">
        <header className="flex flex-col items-center gap-9">
          <img
            src={logo}
            alt="VEGA"
            className="block mb-4"
            width={100}
            height={100}
          />
        </header>
        <div className="space-y-6 px-4">
          <nav className="space-y-4">
            <p className="leading-6 text-gray-200 text-center pb-2 text-sm mb-4" dangerouslySetInnerHTML={{ __html: pageCopy.welcome_return_visit.replace('_EMAIL', email).replace('_VISITS', visits) }} />
          </nav>
        </div>
        <div className="w-full flex gap-4 justify-between">
          <select className="flex-1 basis-1/2 p-2 pl-0 sm:pl-4 rounded-md border border-gray-700"
            onChange={handleDonutDataChange}
          >
            <optgroup label={pageCopy.all_assets}>
              <option defaultChecked value={ALL_TYPES}>{pageCopy.total_by_type}</option>
            </optgroup>
            <optgroup label={pageCopy.individual_assets}>
              {
                availableAssetsTypes.map((label: string, index: number) => {
                  return <option key={index} value={label}>{label.charAt(0).toUpperCase() + label.slice(1)}</option>
                })
              }
            </optgroup>
          </select>

          <select className="flex-1 basis-1/2 p-2 pl-0 sm:pl-4 rounded-md border border-gray-700"
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
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">{pageCopy.header_1}</h2>
        <div className="w-full max-w-2xl mb-20">
          {donutData ? <Doughnut data={donutData} /> : <LoadingSpinner />}
        </div>

        {/*
          Task 2: Table with your positions
        */}
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">{pageCopy.header_2}</h2>
        <div className="w-full max-w-2xl overflow-hidden overflow-x-auto">
          {tableData ? (
            <table className="w-full border-t border-gray-700 text-white mb-20">
              <thead>
                <tr className="bg-gray-800 text-left">
                  <th className="p-3 border-b border-gray-700">{pageCopy.table_h_asset}</th>
                  <th className="p-3 border-b border-gray-700">{pageCopy.table_h_type}</th>
                  <th className="p-3 border-b border-gray-700">{pageCopy.table_h_quantity}</th>
                  <th className="p-3 border-b border-gray-700">{pageCopy.table_h_price}</th>
                  <th className="p-3 border-b border-gray-700">{pageCopy.table_h_total}</th>
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
                        <td colSpan={4} className="p-3 border-t border-gray-700">{pageCopy.total} {asset.type}</td>
                        <td className="p-3 border-t border-gray-700">{(tableData.reduce((acc: number, a: Asset) => a.type === asset.type ? acc + a.quantity * a.price : acc, 0)).toLocaleString("en-US", { style: "currency", currency: "USD" })}</td>
                      </tr>
                      {selectedType === ALL_TYPES && index === tableData.length - 1 && <>
                        <tr className="bg-gray-900 text-gray-300 font-bold">
                          <td colSpan={4} className="p-3 border-t border-gray-700">{pageCopy.total_all_assets}</td>
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
            </table>)
            : <LoadingSpinner />}
        </div>

        {/*
          Task 3: Historical chart portfolio over time
        */}
        <h2 className="w-full text-lg text-gray-200 font-semibold leading-6 text-center border-b border-gray-600 pb-2">❸ Portfolio Through Time</h2>
        <div className="w-full max-w-2xl mb-10">
          {lineData ? <Line data={lineData} options={{
            responsive: true,
            maintainAspectRatio: false,
          }} /> : <LoadingSpinner />}
        </div>

      </div>
    </main>
  );
}

export function HydrateFallback() {
  return <LoadingSpinner />
}

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vega Frontend Coding Task" },
    { name: "description", content: "This is the dashboard" },
  ];
}
