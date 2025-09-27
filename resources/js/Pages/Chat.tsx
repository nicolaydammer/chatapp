import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import ChatBox from "@/Partials/ChatBox.js";
import ChatContact from "@/Partials/ChatContact.js";
import ChatSidebar from "@/Partials/ChatSidebar.js";

export default function Chat() {
    const { props } = usePage();

    const [user, setUser] = useState(props.auth.user);

    const [chatData, setChatData] = useState(props.chatData);

    const [selectedChat, setSelectedChat] = useState(null);

    useEffect(() => {
        setUser(props.auth.user);
    }, [props.user]);

    useEffect(() => {
        setChatData(props.chatData);
    }, [props.chatData]);

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


    const addMessage = (newMsg) => {
        setChatData((prev) => {
            const oldData = [...prev];
            const index = oldData.findIndex(item => item.friendShipId === newMsg.friend_id);
            if (index !== -1) {
                oldData[index].messages.push({ id: null, friend_id: newMsg.friend_id, send_by_user_id: user.id, message: newMsg.message })
            }

            return oldData;
        });
        // todo: get data in here, then process it into the chatData
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
    }, [props.chatData]);

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
