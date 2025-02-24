import React from "react";
import { Form } from "react-router"
import logo from "/public/logo.jpg";
import { homeCopy } from "../../constants";

export type Credentials = {
    email: string[]
    password: string
    visits: number
    active: boolean
}

export default function HomeComponent() {
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