import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons"

export default function ChatContact({
    user,
    friend,
    messages,
    isActive,
    onClick
}: {
    user: User;
    friend: User;
    messages: Message[];
    isActive: boolean,
    onClick: (chat: {
        friend: User;
        messages: Message[];
        friendShipId: number;
    }) => void
}) {

    let lastMessage = messages?.at(-1);

    const activeClasses = isActive ? 'bg-indigo-500 text-white' : 'bg-transparent text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700';

    const UserRound = () => (
        (<FontAwesomeIcon icon={faUser} size="xl" />)
    );

    return (
        <div className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-colors ${activeClasses}`} onClick={onClick}>
            <div className="rounded-full w-10 h-10 bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <UserRound />
            </div>
            <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-sm truncate">{friend.display_name}</p>
                <p className="text-xs opacity-75 truncate">{lastMessage && (lastMessage?.send_by_user_id == user.id ? 'You: ' : 'Them: ')}{lastMessage?.message}</p>
            </div>
        </div>
    );
}