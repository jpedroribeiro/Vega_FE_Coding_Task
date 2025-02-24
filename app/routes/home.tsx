import React from "react";
import type { Route } from "./+types/home";
import { Form, redirect } from "react-router"
import logo from "/public/logo.jpg";
import { homeCopy } from "../constants";

export type Credentials = {
  email: string[]
  password: string
  visits: number
  active: boolean
}

export default function Home() {
  const [loading, setLoading] = React.useState(false)

  return <main className="flex items-center justify-center pt-16 pb-4">
    <div className="flex-1 flex flex-col items-center gap-4 min-h-0">
      <header className="flex flex-col items-center gap-9">
        <img
          src={logo}
          alt="VEGA"
          className="block"
          width={100}
          height={100}
        />
      </header>
      <div className="max-w-xs w-full space-y-6 px-4">

        <nav className="rounded-3xl border border-gray-700 p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center">
              {/* Fake loading spinner just for visual fx */}
              <p className="mb-4">{homeCopy.loading}</p>
              <span className="loader"></span>
            </div>
          ) : (<>
            <p className="leading-6 text-gray-200 text-center pb-2">
              {homeCopy.enter}
            </p>
            <Form id="login-form" className="flex flex-col gap-6" autoComplete="off" method="post" onSubmit={() => {
              setLoading(true)
            }}>
              <label className="flex flex-col flex-col-reverse">
                <input required name="email" type="email" className="flex-1 bg-black outline-0 border-b-1 border-gray-600" />
                <span className="text-sm text-gray-400">{homeCopy.email}</span>
              </label>
              <label className="flex flex-col flex-col-reverse">
                <input required name="password" type="password" className="flex-1 bg-black outline-0 border-b-1 border-gray-600" />
                <span className="text-sm  text-gray-400">{homeCopy.password}</span>
              </label>
              <button type="submit" className="w-full py-2 text-white text-sm bg-gray-600 rounded-md uppercase mt-1 hover:bg-gray-700 hover:cursor-pointer transition">{homeCopy.login}</button>
            </Form>
          </>)}
        </nav>
      </div>
    </div>
  </main>;
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
