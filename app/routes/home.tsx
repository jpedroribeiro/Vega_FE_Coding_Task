import React from "react";
import type { Route } from "./+types/home";
import { Form, redirect } from "react-router"
import logo from "/public/logo.jpg";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vega Frontend Coding Task" },
    { name: "description", content: "Welcome to Vega Frontend Coding Task!" },
  ];
}

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
      <div className="max-w-[300px] w-full space-y-6 px-4">

        <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center">
              <p className="mb-4">Loading dashboard...</p>
              <span className="loader"></span>
            </div>
          ) : (<>
            <p className="leading-6 text-gray-200 text-center pb-2">
              Enter your details to login:
            </p>
            <Form id="login-form" className="flex flex-col gap-6" autoComplete="off" method="post" onSubmit={() => {
              // Fake loading spinner just for visual fx
              setLoading(true)
            }}>
              <label className="flex flex-col flex-col-reverse">
                <input name="email" type="email" className="flex-1 bg-black outline-0 border-b-1 border-gray-600" />
                <span className="text-sm text-gray-400">Email</span>
              </label>
              <label className="flex flex-col flex-col-reverse">
                <input name="password" type="password" className="flex-1 bg-black outline-0 border-b-1 border-gray-600" />
                <span className="text-sm  text-gray-400">Password</span>
              </label>
              <button type="submit" className="w-full py-2 text-white text-sm bg-gray-600 rounded-md uppercase mt-1 hover:bg-gray-700 hover:cursor-pointer transition">Login</button>
            </Form>
          </>)}
        </nav>
      </div>
    </div>
  </main>;
}

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // get credentials from localStorage
  const credentials = localStorage.getItem("credentials");
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

  await new Promise((resolve) => setTimeout(resolve, 3500));

  return redirect("/dashboard");

}


/*

TODO MAKE FORM  inputrequired

*/