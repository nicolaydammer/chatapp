<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\Request;
use Str;

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
            'path' => 'required|string|exists:attachments,path'
        ]);

        return "";
    }
}
