<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Support\Collection;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'username',
        'display_name',
        'email',
        'password',
        'invite_token'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'username',
        'password',
        'remember_token',
        'email_verified_at',
        'created_at',
        'updated_at',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function friendshipsInitiated(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id_1', 'user_id_2');
    }

    public function friendshipsReceived(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'friends', 'user_id_2', 'user_id_1');
    }

    public function friends(): Collection
    {
        $friendshipInitiated = $this->friendshipsInitiated()->get();
        $friendshipReceived = $this->friendshipsReceived()->get();

        return $friendshipInitiated->merge($friendshipReceived)->unique('id');
    }
}
