<?php

use App\Models\Friend;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('friend.{friendId}', function (User $user, $friendId) {

    $relationship = Friend::query()->where('id', $friendId)->get()->first();
    if ($relationship->user_id_1 == $user->id || $relationship->user_id_2 == $user->id) {
        return ['id' => $user->id, 'name' => $user->display_name];
    }

    return false;
});

Broadcast::channel('user.{id}', function (User $user, $id) {
    return (int) $user->id === (int) $id;
});
