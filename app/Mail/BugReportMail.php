<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class BugReportMail extends Mailable
{
    public $messageText;
    public $username;
    public $useremail;

    public function __construct($messageText, $username, $useremail)
    {
        $this->messageText = $messageText;
        $this->username = $username;
        $this->useremail = $useremail;
    }

    public function build()
    {
        return $this->subject('Bug Report')
            ->view('emails.bug_report');
    }
}