<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attachment extends Model
{
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'uuid',
        'message_id',
        'filename',
        'file_type',
        'file_size',
        'path',
    ];

    protected $hidden = [
        'path',
    ];

    protected $casts = [
        'uuid' => 'string',
        'file_size' => 'integer',
    ];

    public function message(): BelongsTo
    {
        return $this->belongsTo(Message::class);
    }
}
