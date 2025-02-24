import type { Route } from "./+types/home";
import LoadingSpinner from "../loading_spinner";
import type { Credentials } from "./home";
import type { Asset } from "./assets";
import { pageCopy } from "../constants";
import DashboardComponent from "./components/dashboard";


export async function clientLoader() {
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
  let assetResponse: Response;
  try {
    assetResponse = await fetch("/assets");
    const assetData = await assetResponse.json();
    return { email, visits, assetData };
  } catch {
    return { error: pageCopy.error_api };
  }
}

export default function DashboardRoute({ loaderData }: { loaderData: { email: string, visits: string, assetData: { donutAndHistoricalData: Asset[] }, error: string } }) {
  return (
    <DashboardComponent loaderData={loaderData} />
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
