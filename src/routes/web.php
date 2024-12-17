<?php

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $users = User::orderBy('id', 'desc')->get();
    $user = null;
    if(request()->has('id')){
        $user = User::find(request('id'));
    }
    return view('welcome', compact('users', 'user'));
});

Auth::routes();
Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::post('/user', function () {
    $user = User::find(request('id'));
    if(!$user){
        $user = new User();
    }
    $user->name = request('name');
    $user->save();

    return redirect('/')->with('status', 'action success');
});

Route::get('/run-migrations', function () {
    try {
        // Run the migrations
        Artisan::call('migrate', ['--force' => true]); // Use --force in production

        return response()->json([
            'status' => 'success',
            'message' => 'Migrations ran successfully.',
            'output' => Artisan::output()
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Migration failed: ' . $e->getMessage()
        ], 500);
    }
});
