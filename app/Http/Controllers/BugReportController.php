<?php
namespace App\Http\Controllers;

use App\Models\BugReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use App\Mail\BugReportMail;

class BugReportController extends Controller
{
    public function send(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500'
        ]);

        $user=Auth::user();
        BugReport::create([
            'buginfo' =>$request->message,
            'user_id'=>$user->id,
        ]);

        Mail::to(config('mail.bug_report_address'))
            ->send(new BugReportMail($request->message,$user->name,$user->email));
        return back()->with('success', 'Bug report sent!');
    }
}