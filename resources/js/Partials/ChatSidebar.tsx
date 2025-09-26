import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMagnifyingGlass, faCopy } from "@fortawesome/free-solid-svg-icons"

export default function ChatSidebar(inviteToken) {

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
        navigator.clipboard.writeText(`${window.location.origin}/register/${inviteToken.inviteToken}`)
    ).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000)
    });

    const [copied, setCopied] = useState(false);

    const [showInviteDropdown, setShowInviteDropdown] = useState(false);

    return <div>
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
        {
            showInviteDropdown && (
                <div className="absolute left-80 top-10 mt-2 w-60 bg-white dark:bg-gray-900 rounded-xl shadow-lg z-10">
                    {!copied && <button
                        onClick={GetInviteLink}
                        className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    >
                        <span className="truncate"><Copy /> Click to copy invite link</span>
                    </button>}
                    {copied && (
                        <div className="gap-2 w-full p-2 rounded-lg text-green-500 font-medium">
                            Copied!
                        </div>
                    )}
                </div>
            )
        }
    </div>
}