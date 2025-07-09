import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { useEcho } from "@laravel/echo-react";

export default function Dashboard() {
    // const { leaveChannel, leave, stopListening, listen } = useEcho(
    //     `orders.${orderId}`,
    //     "OrderShipmentStatusUpdated",
    //     (e) => {
    //         console.log(e.order);
    //     },
    // );

    // Stop listening without leaving channel
    // stopListening();

    // Start listening again
    // listen();

    // Leave channel
    // leaveChannel();

    // Leave a channel and also its associated private and presence channels
    // leave();

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
