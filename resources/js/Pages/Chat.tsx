import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import ChatBox from "@/Partials/ChatBox.js";
import ChatContact from "@/Partials/ChatContact.js";
import ChatSidebar from "@/Partials/ChatSidebar.js";

export default function Chat() {
    const { props } = usePage();

    const [user, setUser] = useState<User>(props.auth.user);

    const [chatData, setChatData] = useState<FriendshipData>(props.chatData);

    const [selectedChat, setSelectedChat] = useState<Friendship | null>(null);

    useEffect(() => {
        setUser(props.auth.user);
    }, [props.user]);

    useEffect(() => {
        setChatData(props.chatData);
    }, [props.chatData]);

    const addMessage = (newMsg: Message) => {
        setChatData((prev: FriendshipData) => {
            return prev.map((item) => {
                if (item.friendShipId === newMsg.friend_id) {
                    return {
                        ...item,
                        messages: [
                            ...item.messages,
                            {
                                id: newMsg.id ?? null,
                                friend_id: newMsg.friend_id,
                                send_by_user_id: newMsg.send_by_user_id,
                                message: newMsg.message,
                            },
                        ],
                    };
                }
                return item;
            });
        });
    };

    useEffect(() => {
        if (selectedChat) {
            let searchForCurrentChatIndex = chatData.findIndex(item => item.friendShipId === selectedChat.friendShipId);

            setSelectedChat({
                friend: chatData[searchForCurrentChatIndex].friend,
                friendShipId: selectedChat.friendShipId,
                messages: chatData[searchForCurrentChatIndex].messages
            });
        }
    }, [props.chatData, chatData]);

    // Main App Component
    return (
        <div className="flex h-screen antialiased text-gray-800 dark:text-gray-200">
            <div className="flex flex-grow w-full overflow-hidden shadow-xl">

                {/* Sidebar */}
                <div className="hidden md:flex flex-col w-full md:max-w-xs bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
                    <ChatSidebar inviteToken={user.invite_token} />

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {chatData.map(({ friend, messages, friendShipId }) => (
                            <ChatContact
                                user={user}
                                key={friend.id}
                                friend={friend}
                                messages={messages}
                                isActive={selectedChat?.friend.id === friend.id}
                                onClick={() => setSelectedChat({ friend, messages, friendShipId })} />
                        ))}
                    </div>
                </div>

                {/* Chat View */}
                <ChatBox chat={selectedChat} currentUser={user} updateMessage={addMessage} />
            </div>
        </div>
    );
}
