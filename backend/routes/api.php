<?php

use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\RegisterController;
use App\Http\Controllers\API\BannerController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\OrderController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});

Route::resource('product', ProductController::class)->middleware(['auth:sanctum', 'abilities:role-admin']);
Route::resource('banner', BannerController::class)->middleware(['auth:sanctum', 'abilities:role-admin']);
Route::resource('category', CategoryController::class)->middleware(['auth:sanctum', 'abilities:role-admin']);

Route::controller(ProductController::class)->group(function() {
    Route::get('product', 'index');
    Route::get('product/{product}', 'show');
    Route::post('get-cart-items', 'getCartItems');
});

Route::controller(RegisterController::class)->group(function() {
    Route::post('auth/register', 'register');
    Route::post('auth/login', 'login');
    Route::post('auth/register-admin', 'register_admin')->middleware(['auth:sanctum', 'abilities:role-admin']);
    Route::get('user/get-users', 'getAllUsers')->middleware(['auth:sanctum', 'abilities:role-admin']);
    Route::get('user/get-admins', 'getAllAdmins')->middleware(['auth:sanctum', 'abilities:role-admin']);
    Route::post('user/edit', 'editUser')->middleware(['auth:sanctum', 'abilities:role-admin']);
    Route::delete('user/delete/{id}', 'deleteUser')->middleware(['auth:sanctum', 'abilities:role-admin']);
});

Route::controller(BannerController::class)->group(function() {
    Route::get('display-banners', 'getDisplayable');
    Route::post('update-banner-activity', 'updateBannerActivity')->middleware(['auth:sanctum', 'abilities:role-admin']);
});

Route::controller(CategoryController::class)->group(function() {
    Route::get('get-categories', 'getDisplayable');
});

Route::controller(OrderController::class)->group(function() {
    Route::post('order/place', 'placeOrder')->middleware(['auth:sanctum']);
    Route::get('order', 'getAllOrders')->middleware(['auth:sanctum', 'abilities:role-admin']);
});
