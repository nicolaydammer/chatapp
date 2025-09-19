import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faEllipsisVertical, faPlus } from "@fortawesome/free-solid-svg-icons"

export default function ChatBox() {
    const [showDropdown, setShowDropdown] = useState(false);

    const Smile = () => (
        (<FontAwesomeIcon icon={faSmile} size="xl" />)
    );

    const MoreVertical = () => (
        <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
    );

    const Plus = () => (
        <FontAwesomeIcon icon={faPlus} size="xl" />
    );

    return (
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="relative flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">Nicolay Dammer</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>
                    </div>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                    <button onClick={() => setShowDropdown(!showDropdown)}>
                        <MoreVertical />
                    </button>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                    <div className="absolute right-4 top-14 mt-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg z-10">
                        <div className="p-2">
                            <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-lg">View Profile</p>
                            <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-lg">Mute Notifications</p>
                            <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-lg text-red-500">Delete Chat</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Messages Container */}
            <div className="flex flex-col flex-grow p-4 space-y-2 overflow-y-auto">
                {/* Added extra messages to test scrollbar functionality */}
                <div className="flex items-start">
                    <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow">
                        <p>Sure thing! I can send you a copy of the report.</p>
                    </div>
                </div>
                <div className="flex items-start justify-end">
                    <div className="p-3 max-w-xs bg-indigo-500 text-white rounded-2xl rounded-br-none shadow">
                        <p>That would be great, thanks!</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow">
                        <p>Just finished the presentation, it went really well.</p>
                    </div>
                </div>
                <div className="flex items-start justify-end">
                    <div className="p-3 max-w-xs bg-indigo-500 text-white rounded-2xl rounded-br-none shadow">
                        <p>Hey, did you get the project report finished?</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow">
                        <p>I'm so glad to hear that! You worked really hard on it.</p>
                    </div>
                </div>
                <div className="flex items-start justify-end">
                    <div className="p-3 max-w-xs bg-indigo-500 text-white rounded-2xl rounded-br-none shadow">
                        <p>Thanks! The feedback from the team was positive too.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow">
                        <p>That's awesome! Do you want to celebrate this weekend?</p>
                    </div>
                </div>
                <div className="flex items-start justify-end">
                    <div className="p-3 max-w-xs bg-indigo-500 text-white rounded-2xl rounded-br-none shadow">
                        <p>Sounds like a plan! I'll check my schedule and get back to you.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow">
                        <p>Perfect. Let me know what works for you.</p>
                    </div>
                </div>
                <div className="flex items-start justify-end">
                    <div className="p-3 max-w-xs bg-indigo-500 text-white rounded-2xl rounded-br-none shadow">
                        <p>Will do! Have a great afternoon.</p>
                    </div>
                </div>
                <div className="flex items-start">
                    <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow">
                        <p>You too!</p>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-4 flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button className="text-gray-600 dark:text-gray-300">
                    <Plus />
                </button>
                <div className="flex-1">
                    <input type="text" placeholder="Start typing..." className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <button className="text-gray-600 dark:text-gray-300">
                    <Smile />
                </button>
            </div>
        </div>
    );
}