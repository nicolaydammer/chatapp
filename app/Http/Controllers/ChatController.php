<?php

namespace App\Http\Controllers;

use App\Events\MessagesBroadcast;
use App\Http\Requests\SendMessageRequest;
use App\Models\Friend;
use App\Models\Message;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        return inertia('Chat', [
            'chatData' => $this->getFriendListWithMessages($userId),
        ]);
    }

    public function sendMessage(SendMessageRequest $request)
    {
        $request->validated();

        $userId = $request->user()->id;

        $data = [
            'friend_id' => $request->get('friend_id'),
            'send_by_user_id' => $userId,
            'message' => $request->get('message')
        ];

        $message = Message::query()->create($data);

        $friendShip = $message->friendship()->get()->first();

        $sendBroadcastTo = null;

        if ($friendShip->user_id_1 == $userId) {
            $sendBroadcastTo = $friendShip->user_id_2;
        } else {
            $sendBroadcastTo = $friendShip->user_id_1;
        }

        MessagesBroadcast::dispatch($sendBroadcastTo, $message->toArray());

        return Inertia('Chat', [
            'chatData' => $this->getFriendListWithMessages($userId)
        ]);
    }

    public function getFriendListWithMessages(int $userId): array
    {
        $friendship = Friend::query()->with(['messages.sender', 'requester', 'requested'])
            ->where(function (Builder $builder) use ($userId) {
            $builder->where('user_id_1', $userId)
            ->orWhere('user_id_2', $userId);
        })->get();

        $result = $friendship->map(function ($friendship) use ($userId) {
            $friend = $friendship->user_id_1 == $userId ? $friendship->requested : $friendship->requester;

            return [
                'friendShipId' => $friendship->id,
                'friend' => $friend->toArray(),
                'messages' => $friendship->messages->toArray(),
            ];
        });

        return $result->toArray();
    }
}
