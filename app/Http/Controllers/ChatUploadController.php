<?php

namespace App\Http\Controllers;

use App\Events\MessagesBroadcast;
use Str;
use App\Models\Attachment;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ChatUploadController extends Controller
{
    public function uploadImage(Request $request)
    {
        $request->validate([
            'file' => 'required|image|max:4096',
            'messageId' => 'required|int|exists:messages,id'
        ]);

        $file = $request->file('file');
        $path = $file->store('chat/images', 'local');

        $attachment = Attachment::query()->create([
            'uuid' => Str::uuid(),
            'message_id' => $request->get('messageId'),
            'filename' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'path' => $path,
        ]);

        // todo: send this to the websocket so we can see stuff there, because only the message arrived.

        $message = $attachment->message()
            ->with(['attachments', 'friendship'])
            ->first();

        // Now you have everything:
        $friendship = $message->friendship;

        // Figure out the other user
        $friendId = $friendship->user_id_1 == $request->user()->id
            ? $friendship->user_id_2
            : $friendship->user_id_1;

        MessagesBroadcast::dispatch($friendId, $message->toArray());

        return $attachment->toArray();
    }


    public function uploadVideo(Request $request)
    {
        $request->validate([
            'file' => 'required|mimes:mp4,mov,avi,webm|max:51200',
            'messageId' => 'required|int|exists:messages,id'
        ]);

        $file = $request->file('file');
        $path = $file->store('chat/videos', 'local');

        $attachment = Attachment::query()->create([
            'uuid' => Str::uuid(),
            'message_id' => $request->get('messageId'),
            'filename' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'path' => $path,
        ]);

        return $attachment->toArray();
    }

    public function uploadDocument(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,doc,docx,xls,xlsx,ppt,pptx,txt|max:10240',
            'messageId' => 'required|int|exists:messages,id'
        ]);

        $file = $request->file('file');
        $path = $file->store('chat/documents', 'local');

        $attachment = Attachment::query()->create([
            'uuid' => Str::uuid(),
            'message_id' => $request->get('messageId'),
            'filename' => $file->getClientOriginalName(),
            'file_type' => $file->getClientMimeType(),
            'file_size' => $file->getSize(),
            'path' => $path,
        ]);

        return $attachment->toArray();
    }

    public function getFile(Request $request)
    {
        $request->validate([
            'uuid' => 'required|string|exists:attachments,uuid'
        ]);

        $fileUUID = $request->get('uuid');

        $attachment = Attachment::query()->where('uuid', $fileUUID)->firstOrFail();

        // todo: authentication is this valid for this user?

        $path = $attachment->path;

        if (!Storage::disk('local')->exists($path)) {
            abort(404);
        }

        $mime = Storage::disk('local')->mimeType($path);

        return new StreamedResponse(function () use ($path) {
            $stream = Storage::disk('local')->readStream($path);
            fpassthru($stream);
            if (is_resource($stream)) {
                fclose($stream);
            }
        }, 200, [
            'Content-Type' => $mime,
            'Content-Disposition' => 'inline; filename="' . basename($path) . '"',
        ]);
    }
}
