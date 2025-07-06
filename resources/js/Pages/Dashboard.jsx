import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook } from "@fortawesome/free-brands-svg-icons";

export default function Dashboard() {
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
