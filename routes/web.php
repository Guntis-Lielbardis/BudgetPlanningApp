<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\IncomeSourceController;
use App\Http\Controllers\ExpenseSourceController;
use App\Http\Controllers\BugReportController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware(['auth', 'verified'])->get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::middleware(['auth', 'verified'])->get('/about', function () {
    return Inertia::render('About');
})->name('about');

Route::middleware(['auth', 'verified'])->get('/bugreport', function () {
    return Inertia::render('BugReport');
})->name('bugreport');

Route::middleware('auth:sanctum')->put('/user/settings', [ProfileController::class, 'updateSettings']);
Route::middleware(['auth'])->put('/user/theme', function (Request $request) {
    $request->validate([
        'dark_mode' => 'required|boolean',
    ]);

    $user = $request->user();
    $user->dark_mode = $request->dark_mode;
    $user->save();

    return response()->json(['dark_mode' => $user->dark_mode]);
});

Route::middleware('auth')->get('/user/theme', function () {
    return response()->json(['dark_mode' => Auth::user()->dark_mode]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::post('/bug_report', [BugReportController::class, 'send'])->middleware(['auth','throttle:bug_report']);
Route::post('/income-sources', [IncomeSourceController::class, 'store']);
Route::post('/expense-sources', [ExpenseSourceController::class, 'store']);
Route::get('/income-sources', [IncomeSourceController::class, 'index']);
Route::get('/expense-sources', [ExpenseSourceController::class, 'index']);
Route::put('/income-sources/{id}', [IncomeSourceController::class, 'update']);
Route::put('/expense-sources/{id}', [ExpenseSourceController::class, 'update']);
Route::delete('/income-sources/{incomeSource}', [IncomeSourceController::class, 'destroy']);
Route::delete('/expense-sources/{expenseSource}', [ExpenseSourceController::class, 'destroy']);

require __DIR__.'/auth.php';