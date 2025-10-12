import { useEffect, useRef, useState } from "react";
import { router } from '@inertiajs/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faEllipsisVertical, faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { useEcho } from "@laravel/echo-react";

interface ChatBoxProps {
    chat: Friendship | null;
    currentUser: User;
    updateMessage: (msg: Message) => void;
}

export default function ChatBox({
    chat,
    currentUser,
    updateMessage
}: {
    chat: Friendship | null;
    currentUser: User;
    updateMessage: (msg: Message) => void;
}) {

    const [showDropdown, setShowDropdown] = useState(false);

    const [message, setMessage] = useState('');

    const containerRef = useRef<HTMLDivElement | null>(null);

    //websocket to receive new messages and put it in the chatdata structure
    useEcho("user." + currentUser.id, "MessagesBroadcast", (e: Message) => {
        updateMessage(e);
    });

    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [chat?.messages]);

    const Smile = () => (
        (<FontAwesomeIcon icon={faSmile} size="xl" />)
    );

    const MoreVertical = () => (
        <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
    );

    const Plus = () => (
        <FontAwesomeIcon icon={faPlus} size="xl" />
    );

    const Send = () => (
        <FontAwesomeIcon icon={faPaperPlane} />
    );

    if (!chat) {
        return (
            <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="relative flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                </div>
            </div>
        );
    }

    const friend = chat.friend
    let messages = chat.messages;


    const handleMessage = () => {

        if (!message.trim()) return;

        const data = {
            id: 10000000,
            friend_id: chat.friendShipId,
            message: message,
            send_by_user_id: currentUser.id
        };

        router.post('/chat/sendMessage', data, {
            preserveScroll: true,
            preserveState: true,
            preserveUrl: true,
            replace: false,
        });

        updateMessage(data);

        setMessage('');
    };



    return (
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="relative flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-4">
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold">{friend.display_name}</span>
                        {/* todo: online status */}
                        {/* <span className="text-xs text-gray-500 dark:text-gray-400">Online</span> */}
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
            <div className="flex flex-col flex-grow p-4 space-y-2 overflow-y-auto" ref={containerRef}>

                {messages.map((msg) => {
                    const isMe = msg.send_by_user_id === currentUser.id;

                    if (!isMe) {
                        return <div className="flex items-start" key={msg.id}>
                            <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow">
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    }

                    if (isMe) {
                        return <div className="flex items-start justify-end" key={msg.id}>
                            <div className="p-3 max-w-xs bg-indigo-500 text-white rounded-2xl rounded-br-none shadow">
                                <p>{msg.message}</p>
                            </div>
                        </div>
                    }
                })}
            </div>

            {/* Input Area */}
            <div className="p-4 flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
                <button className="text-gray-600 dark:text-gray-300">
                    <Plus />
                </button>
                <div className="flex-1 relative">
                    <input
                        type="text"
                        onChange={(e) => setMessage(e.target.value)} value={message}
                        onKeyDown={(e) => {
                            if (e.key == 'Enter' && message.trim()) {
                                e.preventDefault();
                                handleMessage();
                            }
                        }}
                        placeholder="Start typing..."
                        className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={!message.trim()}
                        className={`absolute right-4 top-1/2 -translate-y-1/2  ${message.trim()
                            ? "text-indigo-500 hover:text-indigo-600"
                            : "text-gray-400 cursor-not-allowed"
                            }`}>
                        {<Send />}
                    </button>
                </div>
                <button className="text-gray-600 dark:text-gray-300">
                    <Smile />
                </button>
            </div>
        </div>
    );
}