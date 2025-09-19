import { useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { configureEcho, useEcho } from "@laravel/echo-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons"
import ChatBox from "@/Partials/chatBox.js";
import ChatContact from "@/Partials/ChatContact.js";

export default function Dashboard() {
    // const { props } = usePage();

    // configureEcho({
    //     broadcaster: "reverb",
    //     key: import.meta.env.VITE_REVERB_APP_KEY,
    //     wsHost: import.meta.env.VITE_REVERB_HOST,
    //     wsPort: import.meta.env.VITE_REVERB_PORT,
    //     wssPort: import.meta.env.VITE_REVERB_PORT,
    //     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? "https") === "https",
    //     enabledTransports: ["ws", "wss"],
    // });

    // let messages = [];

    // useEcho("user." + props.auth.user?.id, "MessagesBroadcast", (e) => {
    //     messages = e.messages;
    //     console.log(e);
    // });

    // const [values, setValues] = useState({
    //     username: "",
    //     display_name: "",
    //     password: "",
    //     password_confirmation: "",
    //     email: "",
    //     email_confirmation: "",
    // });

    // function handleChange(e) {
    //     setValues({
    //         ...values,
    //         [e.target.id]: e.target.value,
    //     });
    // }

    // function handleSubmit(e) {
    //     e.preventDefault();
    //     router.post("/register", values);
    // }

    const Plus = () => (
        <FontAwesomeIcon icon={faPlus} size="xl" />
    );

    const Search = () => (
        <FontAwesomeIcon icon={faMagnifyingGlass} />
    );

    // Main App Component
    const contacts = [
        { name: "Nicolay Dammer", lastMessage: "Hey, did you get the...", active: true },
        { name: "Jessica Smith", lastMessage: "I'll send that over...", active: false },
        { name: "Kevin", lastMessage: "Sounds good! Talk to you later.", active: false },
        { name: "Project Team", lastMessage: "We have a meeting tomorrow...", active: false },
        { name: "Alex Johnson", lastMessage: "Did you see the new...", active: false }
    ];

    return (
        <div className="flex h-screen antialiased text-gray-800 dark:text-gray-200">
            <div className="flex flex-grow w-full overflow-hidden shadow-xl">

                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-full md:max-w-xs bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex flex-col p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">Chat</span>
                            <button className="p-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition-colors">
                                <Plus size={24} />
                            </button>
                        </div>
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="w-full pl-10 p-2 rounded-xl bg-gray-200 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <Search size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {contacts.map((contact, index) => (
                            <ChatContact key={index} {...contact} />
                        ))}
                    </div>
                </div>

                {/* Chat View */}
                <ChatBox />

            </div>
        </div>
    );
}
