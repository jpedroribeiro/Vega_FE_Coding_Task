import type { Route } from "./+types/home";
import { Form, redirect } from "react-router"
import logo from "/public/logo.jpg";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Vega Frontend Coding Task" },
    { name: "description", content: "Welcome to Vega Frontend Coding Task!" },
  ];
}

export default function Home() {
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
          <p className="leading-6 text-gray-200 text-center pb-2">
            Enter your details to login:
          </p>
          <Form id="login-form" className="flex flex-col gap-6" autoComplete="off" method="post">
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
        </nav>
      </div>
    </div>
  </main>;
}

export async function clientAction({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // save to localStorage
  localStorage.setItem("email", email);
  localStorage.setItem("password", password);

  return redirect("/dashboard");
}


/*

TODO MAKE FORM  inputrequired

*/