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

    const [onlineUsersByChat, setOnlineUsersByChat] = useState<Record<number, PresenceUser[]>>({});

    useEffect(() => {
        setUser(props.auth.user);
    }, [props.user]);

    const addMessage = (newMsg: Message) => {
        setChatData((prev: FriendshipData) => {
            return prev.map((item) => {
                if (item.friendShipId === newMsg.friend_id) {
                    return {
                        ...item,
                        messages: [
                            ...item.messages,
                            {
                                attachments: newMsg.attachments ?? null,
                                id: newMsg.id ?? null,
                                friend_id: newMsg.friend_id,
                                send_by_user_id: newMsg.send_by_user_id,
                                message: newMsg.message,
                                created_at: newMsg.created_at ?? null,
                                updated_at: newMsg.updated_at ?? null,
                                sender: newMsg.sender ?? null,
                            },
                        ],
                    };
                }
                return item;
            });
        });
    };

    const editMessage = (tempId: number, message: Message) => {
        setChatData((prev: FriendshipData) =>
            prev.map((friendship) => {
                if (friendship.friendShipId === message.friend_id) {
                    const messageExists = friendship.messages.some(
                        (msg) => msg.id === Number(tempId)
                    );

                    return {
                        ...friendship,
                        messages: messageExists
                            ? friendship.messages.map((msg) =>
                                msg.id === Number(tempId) ? message : msg
                            )
                            : [...friendship.messages, message],
                    };
                }
                return friendship;
            })
        );
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

                {selectedChat ?
                    <ChatBox
                        chat={selectedChat}
                        currentUser={user}
                        addMessage={addMessage}
                        onlineUsers={onlineUsersByChat[selectedChat?.friendShipId ?? 0] ?? []}
                        setOnlineUsers={(users: PresenceUser[]) =>
                            setOnlineUsersByChat((prev) => ({
                                ...prev,
                                [selectedChat!.friendShipId]: users,
                            }))
                        }
                        editMessage={editMessage}
                    /> :
                    (
                        <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 shadow-xl overflow-hidden">
                            {/* Header */}
                            <div className="relative flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
}
