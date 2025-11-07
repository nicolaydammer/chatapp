import { act, useEffect, useRef, useState } from "react";
import { router } from '@inertiajs/react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSmile, faEllipsisVertical, faPlus, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { useEcho, useEchoPresence } from "@laravel/echo-react";

import AttachmentModal from "@/Modals/AttachmentModal.js";
import axiosInstance from "@/lib/axios.js";

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

export default function ChatBox({
    chat,
    currentUser,
    addMessage,
    onlineUsers,
    setOnlineUsers,
    editMessage
}: {
    chat: Friendship;
    currentUser: User;
    addMessage: (msg: Message) => void;
    onlineUsers: PresenceUser[];
    setOnlineUsers: (users: PresenceUser[]) => void;
    editMessage: (tempId: number, msg: Message) => void;
}) {

    const [showDropdown, setShowDropdown] = useState(false);
    const [message, setMessage] = useState('');

    // presence for checking online status
    const { channel } = useEchoPresence(`friend.${chat.friendShipId}`, [], (event) => { });

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [showAttachmentDropdown, setAttachmentDropdown] = useState(false);
    const [activeTab, setActiveTab] = useState("document");
    const [isModalOpen, setIsModalOpen] = useState(false);

    //websocket to receive new messages and put it in the chatdata structure
    const { leaveChannel, stopListening, listen } = useEcho("user." + currentUser.id, "MessagesBroadcast", (e: Message) => {
        addMessage(e);
    });

    useEffect(() => {
        const el = containerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [chat?.messages]);

    useEffect(() => {
        const presence = channel();

        presence.here((users: PresenceUser[]) => setOnlineUsers(users ?? []));

        presence.joining((user: PresenceUser) => {
            const newUsers = onlineUsers.some(u => u.id === user.id)
                ? onlineUsers
                : [...onlineUsers, user];

            setOnlineUsers(newUsers);
        });

        presence.leaving((user: PresenceUser) => {
            const newUsers = onlineUsers.filter(u => u.id !== user.id);
            setOnlineUsers(newUsers);
        });
    }, [chat, channel]);

    const uploadRoutes = {
        document: '/chat/attachment/document',
        image: '/chat/attachment/image',
        video: '/chat/attachment/video',
    } as const

    const friend = chat.friend
    let messages = chat.messages;

    const allowedDocumentMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
        'text/plain',
    ];

    const getRouteKeyForFile = (file: File): UploadRouteKey | null => {
        if (file.type.startsWith('image/')) return 'image';
        if (file.type.startsWith('video/')) return 'video';
        if (allowedDocumentMimes.includes(file.type)) return 'document';

        return null; // unsupported type
    };

    const sendFiles = async (file, routeKey, formData) => {
        try {
            await axiosInstance.post(uploadRoutes[routeKey], formData);
        } catch (err) {
            console.error(`Failed to upload ${file.name}:`, err);
        }
    }

    const handleMessage = (files?: File[]) => {

        const tempId = Date.now();

        let data = {
            id: tempId,
            friend_id: chat.friendShipId,
            message: message,
            send_by_user_id: currentUser.id,
        };

        if (!files) {
            if (!message.trim()) return;

            addMessage(data);
            setMessage('');
        }

        data.message = data.message ? data.message : ' ';

        const res = axiosInstance.post('/chat/sendMessage', data);

        res.then((e) => {
            let messageId = e.data.message.id;

            editMessage(tempId, e.data.message);

            if (files) {
                for (const file of files) {
                    const routeKey = getRouteKeyForFile(file);

                    if (!routeKey) {
                        console.warn(`Unsupported file type: ${file.name}`);
                        continue;
                    }

                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('messageId', messageId);

                    sendFiles(file, routeKey, formData)
                }
            }
        });
    }

    return (
        <div className="flex w-full overflow-hidden">
            <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 shadow-xl overflow-hidden h-screen">
                {/* Header */}
                <div className="relative flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold">{friend.display_name}</span>
                            {onlineUsers.length > 1 && <span className="text-xs text-gray-500 dark:text-gray-400">Online</span>}
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
                                <div className="p-3 max-w-xs bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-none shadow break-words">
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        }

                        if (isMe) {
                            return <div className="flex items-start justify-end" key={msg.id}>
                                <div className="p-3 max-w-xs bg-indigo-500 text-white rounded-2xl rounded-br-none shadow break-words">
                                    <p>{msg.message}</p>
                                </div>
                            </div>
                        }

                        return null;
                    })}
                </div>

                {/* Input Area */}
                <div className="p-4 flex items-center space-x-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 relative">
                    {/* Attachment Button */}
                    <button className="text-gray-600 dark:text-gray-300" onClick={() => setAttachmentDropdown(!showAttachmentDropdown)}>
                        <Plus />
                    </button>

                    {/* Dropdown */}
                    {showAttachmentDropdown && (
                        <div className="absolute bottom-full left-0 mb-2 w-48 bg-white dark:bg-gray-700 rounded-xl shadow-lg z-50">
                            <div className="p-2">
                                <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-lg" onClick={() => { setActiveTab('camera'); setIsModalOpen(true); setAttachmentDropdown(false); }}>Take picture with camera</p>
                                <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-lg" onClick={() => { setActiveTab('document'); setIsModalOpen(true); setAttachmentDropdown(false); }}>Upload document</p>
                                <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-lg" onClick={() => { setActiveTab('image'); setIsModalOpen(true); setAttachmentDropdown(false); }}>Upload image</p>
                                <p className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer rounded-lg" onClick={() => { setActiveTab('video'); setIsModalOpen(true); setAttachmentDropdown(false); }}>Upload video</p>
                            </div>
                        </div>
                    )}

                    {/* Input + Send */}
                    <div className="flex-1 relative">
                        <input
                            name="message"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && message.trim()) {
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
                            className={`absolute right-4 top-1/2 -translate-y-1/2 ${message.trim() ? 'text-indigo-500 hover:text-indigo-600' : 'text-gray-400 cursor-not-allowed'}`}
                        >
                            <Send />
                        </button>

                        <AttachmentModal activeTab={activeTab} isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} sendMessage={handleMessage} />
                    </div>

                    <button className="text-gray-600 dark:text-gray-300">
                        <Smile />
                    </button>
                </div>
            </div>
        </div>
    );
}