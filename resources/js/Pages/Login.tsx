import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";

export default function Home() {
    const { errors } = usePage().props;

    const [values, setValues] = useState({
        username: "",
        password: "",
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        setValues({
            ...values,
            [e.target.id]: e.target.value,
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
        e.preventDefault();
        router.post("/login", values);
    }

    return (
        <div>
            <div className="bg-white dark:bg-dark dark:text-white min-h-screen py-30">
                <div className="border rounded-[150px] mx-60 h-[70dvh]">
                    <div className="ml-40 mt-10 flex">
                        <p className="text-4xl hover:border-blue-500 hover:cursor-pointer border-b-3 border-dblue">
                            <Link href="/">Don't have an account yet?</Link>
                        </p>
                        {/* #todo: logo */}
                    </div>

                    <div className="flex flex-row justify-center mt-30">
                        <h1 className="text-red-700 font-bold text-xl tracking-wide">
                            {errors && errors[Object.keys(errors)[0]]}
                        </h1>
                    </div>

                    <div className="flex flex-row justify-center">
                        <div className="flex flex-col items-end w-1/5 mr-10 mt-1">
                            <label className="mb-4" htmlFor="username">
                                Username:
                            </label>
                            <label className="mb-3" htmlFor="password">
                                Password:
                            </label>
                        </div>

                        <div className="flex flex-col items-start w-3/7">
                            <form onSubmit={handleSubmit} className="w-full">
                                <div className="flex flex-col w-7/12">
                                    <input
                                        className="border-b-3 border-dblue mb-3"
                                        id="username"
                                        type="text"
                                        value={values.username}
                                        onChange={handleChange}
                                    />
                                    <input
                                        className="border-b-3 border-dblue mb-3"
                                        id="password"
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button className="text-white ml-12 text-2xl mt-8 bg-dblue hover:cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Login
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
