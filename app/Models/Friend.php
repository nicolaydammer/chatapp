<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Friend extends Model
{
    protected $fillable = [
        'user_id_1',
        'user_id_2'
    ];

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_1');
    }

    public function requested(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id_2');
    }

    public function messages(): HasMany
    {
        return $this->hasMany(Message::class);
    }
}
