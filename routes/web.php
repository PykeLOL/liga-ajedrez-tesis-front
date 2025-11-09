<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::get('/registrarse', [LoginController::class, 'registarse'])->name('registrarse');

Route::prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/perfil', [AdminController::class, 'perfil'])->name('admin.perfil');
    Route::get('/usuarios', [AdminController::class, 'getUsuarios'])->name('admin.usuarios');
    Route::get('/roles', [AdminController::class, 'getRoles'])->name('admin.roles');
    Route::get('/permisos', [AdminController::class, 'getPermisos'])->name('admin.permisos');
});

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/perfil', [HomeController::class, 'perfil'])->name('perfil');

