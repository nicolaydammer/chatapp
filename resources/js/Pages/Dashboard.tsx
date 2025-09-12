import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { configureEcho, useEcho } from "@laravel/echo-react";

export default function Dashboard() {
    const { props } = usePage();

    configureEcho({
        broadcaster: "reverb",
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT,
        wssPort: import.meta.env.VITE_REVERB_PORT,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
        enabledTransports: ["ws", "wss"],
    });

    let messages = [];

    useEcho("user." + props.auth.user?.id, "MessagesBroadcast", (e) => {
        messages = e.messages;
        console.log(e);
    });

    const { errors } = usePage().props;

    const [values, setValues] = useState({
        username: "",
        display_name: "",
        password: "",
        password_confirmation: "",
        email: "",
        email_confirmation: "",
    });

    function handleChange(e) {
        setValues({
            ...values,
            [e.target.id]: e.target.value,
        });
    }

    function handleSubmit(e) {
        e.preventDefault();
        router.post("/register", values);
    }

    return (
        <div>
            <div className="bg-white dark:bg-dark dark:text-white py-30">
                <div className="border rounded-[150px] mx-60 h-[70dvh]">
                    <p>Dashboard</p>
                </div>
            </div>
        </div>
    );
}
