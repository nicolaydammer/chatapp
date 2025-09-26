import { useEffect, useState } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import { useEcho } from "@laravel/echo-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass, faCopy } from "@fortawesome/free-solid-svg-icons"
import ChatBox from "@/Partials/ChatBox.js";
import ChatContact from "@/Partials/ChatContact.js";

export default function Chat() {
    const { props } = usePage();

    const user = props.auth.user;

    // let [data, setData] = useState({})

    // useEcho("user." + props.auth.user[0]?.id, "MessagesBroadcast", (e) => {
    //     setData(e);
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

    const Copy = () => (
        <FontAwesomeIcon icon={faCopy} />
    );

    const GetInviteLink = () => (
        navigator.clipboard.writeText(`${window.location.origin}/register/${props.auth.user?.invite_token}`)
    );

    const [showInviteDropdown, setShowInviteDropdown] = useState(false);

    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        if (selectedChat) {
            let searchForCurrentChatIndex = props.chatData.findIndex(item => item.friendShipId === selectedChat.friendShipId);

            setSelectedChat({
                friend: props.chatData[searchForCurrentChatIndex].friend,
                friendShipId: selectedChat.friendShipId,
                messages: props.chatData[searchForCurrentChatIndex].messages
            });
        }

    }, [props.chatData]);

    // Main App Component
    return (
        <div className="flex h-screen antialiased text-gray-800 dark:text-gray-200">
            <div className="flex flex-grow w-full overflow-hidden shadow-xl">

                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-full md:max-w-xs bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <div className="flex flex-col p-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xl font-bold">Chat</span>
                            <button onClick={() => setShowInviteDropdown(!showInviteDropdown)}
                                className="p-2 bg-indigo-500 text-white rounded-full shadow hover:bg-indigo-600 transition-colors">
                                <Plus />
                            </button>
                        </div>
                        <div className="relative">
                            <input type="text" placeholder="Search..." className="w-full pl-10 p-2 rounded-xl bg-gray-200 dark:bg-gray-700 border border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                <Search />
                            </div>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    {showInviteDropdown && (
                        <div className="absolute left-80 top-10 mt-2 w-60 bg-white dark:bg-gray-900 rounded-xl shadow-lg z-10">
                            <button
                                onClick={GetInviteLink}
                                className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <span className="truncate"><Copy /> Click to copy invite link</span>
                            </button>
                        </div>
                    )}

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {props.chatData.map(({ friend, messages, friendShipId }) => (
                            <ChatContact
                                key={friend.id}
                                friend={friend}
                                messages={messages}
                                isActive={selectedChat?.friend.id === friend.id}
                                onClick={() => setSelectedChat({ friend, messages, friendShipId })} />
                        ))}
                    </div>
                </div>

                {/* Chat View */}
                <ChatBox chat={selectedChat} currentUser={user} />
            </div>
        </div>
    );
}
