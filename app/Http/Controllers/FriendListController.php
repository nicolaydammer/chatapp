<?php

namespace App\Http\Controllers;

use App\Models\User;
use Inertia\Inertia;
use App\Models\Friend;
use Illuminate\Http\Request;
use App\Http\Requests\InviteNewFriendRequest;

class FriendListController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        $nonFriends = $this->getNonFriendList($user);

        return Inertia::render('FriendList', [
            'userList' => $nonFriends
        ]);
    }

    public function inviteNewFriend(InviteNewFriendRequest $request)
    {
        $user = $request->user();
        $newFriendId = $request->get('user_id');

        Friend::query()->create([
            'user_id_1' => $user->id,
            'user_id_2' => $newFriendId
        ]);

        $nonFriends = $this->getNonFriendList($user);

        return Inertia::render('FriendList', [
            'userList' => $nonFriends
        ]);
    }

    private function getNonFriendList(User $user): array
    {
        $friends = $user->friends()->pluck('id');

        return User::query()->select(['id', 'display_name'])->whereNotIn('id', $friends)->whereNot('id', $user->id)->get()->toArray();
    }
}
