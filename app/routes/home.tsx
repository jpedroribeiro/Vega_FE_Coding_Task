import type { Route } from "./+types/home";
import { redirect } from "react-router"
import HomeComponent from "./components/home";

export type Credentials = {
  email: string[]
  password: string
  visits: number
  active: boolean
}

export default function Home() {
  return <HomeComponent />
}


/**
 *  Client-side action to handle login
 *  @param {Request} request
 *  @returns {Promise<Response>}
 * 
 *  This only mimicks a login process. 
 *  It get the user email and password and save it to localStorage.
 *  For returning visitors, udpates the visit counter.
 *  Settingt the user as active means which user is currently logged in.
 */
export async function clientAction({ request }: { request: Request }) {
  // Get data from form
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Get data from localStorage
  const credentials = localStorage.getItem("credentials");

  // Credentials object
  if (credentials) {
    const credentialsParsed: Credentials[] = JSON.parse(credentials);
    credentialsParsed.forEach((credential) => {
      // Just matching email for simplicity
      if (credential.email.includes(email)) {
        credential.visits += 1;
        credential.active = true;
      } else {
        credential.active = false;
      }
    })
    localStorage.setItem("credentials", JSON.stringify(credentialsParsed));
  } else {
    const newCredentials: Credentials[] = []
    newCredentials.push({ email: [email], password, visits: 1, active: true });
    localStorage.setItem("credentials", JSON.stringify(newCredentials));
  }

  // This is just to fake a loading time
  await new Promise((resolve) => setTimeout(resolve, 3500));

  // Lets go!
  return redirect("/dashboard");
}


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vega Frontend Coding Task" },
    { name: "description", content: "Welcome to Vega Frontend Coding Task!" },
  ];
}
