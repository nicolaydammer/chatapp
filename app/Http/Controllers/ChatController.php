<?php

namespace App\Http\Controllers;

use App\Models\Friend;
use Illuminate\Contracts\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $userId = $user->id;

        $friendship = Friend::query()->with(['messages.sender', 'requester', 'requested'])
        ->where(function (Builder $builder) use ($userId) {
            $builder->where('user_id_1', $userId)
            ->orWhere('user_id_2', $userId);
        })->get();

        $result = $friendship->map(function ($friendship) use ($userId) {
            $friend = $friendship->user_id_1 == $userId ? $friendship->requested : $friendship->requester;

            return [
                'friend' => $friend->toArray(),
                'messages' => $friendship->messages->toArray(),
            ];
        });

        return inertia('Chat', [
            'chatData' => $result,
        ]);
    }
}
