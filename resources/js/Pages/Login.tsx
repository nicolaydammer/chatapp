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
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-8 w-96">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <p className="text-gray-500 dark:text-gray-300 text-sm underline">
                        <Link href="/">Don't have an account yet?</Link>
                    </p>
                    <div className="border dark:border-gray-600 rounded-lg px-3 py-2 font-bold text-xl text-gray-700 dark:text-gray-200">
                        D
                    </div>
                </div>

                {/* Login form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
                    <div>
                        <h1 className="text-red-700 font-bold text-sm tracking-wide">
                            {errors && errors[Object.keys(errors)[0]]}
                        </h1>
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300">
                            Username:
                        </label>
                        <input
                            id="username"
                            type="text"
                            className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring focus:ring-indigo-400"
                            value={values.username}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={values.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Recaptcha & Login buttons */}
                    <button
                        type="button"
                        className="border dark:border-gray-600 rounded-lg px-4 py-2 mt-2 w-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        reCAPTCHA
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white rounded-lg px-4 py-2 mt-2 w-full hover:bg-indigo-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
