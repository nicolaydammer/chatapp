interface User {
    id: number;
    display_name: string;
    email: string;
    invite_token: string;
}

interface Message {
    id: number;
    friend_id: number;
    send_by_user_id: number;
    message: string;
    created_at?: string;
    updated_at?: string;
    sender?: User | number;
}

interface Friendship {
    friendShipId: number;
    friend: User;
    messages: Message[];
}

type FriendshipData = Friendship[];