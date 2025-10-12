<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function(Blueprint $table) {
            $table->string('invite_token')->unique()->after('remember_token');
        });

        Schema::create('friends', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id_1');
            $table->unsignedBigInteger('user_id_2');
            $table->timestamps();
        });

        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('friend_id');
            $table->unsignedBigInteger('send_by_user_id');
            $table->longText('message');
            $table->timestamps();
        });

        Schema::table('messages', function(Blueprint $table) {
            $table->foreign('friend_id')->references('id')->on('friends')->cascadeOnDelete();
            $table->foreign('send_by_user_id')->references('id')->on('users');
            $table->index('friend_id');
        });

        Schema::table('friends', function(Blueprint $table) {
            $table->foreign('user_id_1')->references('id')->on('users')->cascadeOnDelete();
            $table->foreign('user_id_2')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function(Blueprint $table) {
            $table->dropColumn('invite_token');
        });

        Schema::dropIfExists('friends');
        Schema::dropIfExists('messages');
    }
};
