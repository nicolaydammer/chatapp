import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function Home() {
    const { props } = usePage();

    const [values, setValues] = useState({
        username: "",
        display_name: "",
        password: "",
        password_confirmation: "",
        email: "",
        email_confirmation: "",
    });

    const invite_token = props.invite_token;

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setValues({
            ...values,
            [e.target.id]: e.target.value,
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (invite_token) {
            router.post(`/register/${invite_token}`, values);
        } else {
            router.post("/register", values);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-3xl p-8 w-96">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <p className="text-gray-500 dark:text-gray-300 text-sm underline">
                        <Link href="/login">Already have an account?</Link>
                    </p>
                    <div className="border dark:border-gray-600 rounded-lg px-3 py-2 font-bold text-xl text-gray-700 dark:text-gray-200">
                        D
                    </div>
                </div>

                {/* Social login */}
                <div className="mt-6">
                    <p className="font-semibold mb-3 text-gray-700 dark:text-gray-200">
                        Register with:
                    </p>
                    <div className="flex gap-4 mb-6">
                        <button className="border dark:border-gray-600 rounded-full p-2 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-700">
                            {/* Facebook SVG */}
                            <FontAwesomeIcon
                                className="mx-1 hover:cursor-pointer"
                                size="2x"
                                icon={faFacebook}
                            />
                        </button>
                        <button className="border dark:border-gray-600 rounded-full p-2 flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-700">
                            {/* Google SVG */}
                            <FontAwesomeIcon
                                className="mx-4 hover:cursor-pointer"
                                size="2x"
                                icon={faGoogle}
                            />
                        </button>
                    </div>
                </div>

                {/* Registration form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div>
                        <h1 className="text-red-700 font-bold text-sm tracking-wide">
                            {props.errors && props.errors[Object.keys(props.errors)[0]]}
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
                            Displayname:
                        </label>
                        <input
                            id="display_name"
                            type="text"
                            className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={values.display_name}
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
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300">
                            Confirm password:
                        </label>
                        <input
                            id="password_confirmation"
                            type="password"
                            className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={values.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={values.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-700 dark:text-gray-300">
                            Confirm email:
                        </label>
                        <input
                            id="email_confirmation"
                            type="email"
                            className="w-full border dark:border-gray-600 rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            value={values.email_confirmation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Recaptcha & Register buttons */}
                    <button
                        type="button"
                        className="border dark:border-gray-600 rounded-lg px-4 py-2 mt-3 w-full bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
                    >
                        reCAPTCHA
                    </button>
                    <button
                        type="submit"
                        className="bg-indigo-500 text-white rounded-lg px-4 py-2 mt-2 w-full hover:bg-indigo-600"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
