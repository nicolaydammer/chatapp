<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Message extends Model
{
    protected $fillable = [
        'friend_id',
        'send_by_user_id',
        'message'
    ];

    protected $hidden = [
        
    ];

    public function friendship(): BelongsTo
    {
        return $this->belongsTo(Friend::class);
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'send_by_user_id');
    }
}
