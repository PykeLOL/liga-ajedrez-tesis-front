<?php

use Illuminate\Support\Facades\Route;

// Importación de Controladores
use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\EntrenamientoController;
use App\Http\Controllers\DeportistasController;
use App\Http\Controllers\ClubesController;

// --- Autenticación ---
Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::get('/registrarse', [LoginController::class, 'registarse'])->name('registrarse');

// --- Página Principal y Perfil ---
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/perfil', [HomeController::class, 'perfil'])->name('perfil');

// --- MÓDULO: EVENTOS ---
Route::prefix('eventos')->name('eventos.')->group(function () {
    Route::get('/mis-entrenamientos', [EntrenamientoController::class, 'misEntrenamientos'])->name('entrenamientos.misEntrenamientos');
    Route::get('/{id}', [EventosController::class, 'index'])->name('eventos.index');
    Route::get('/torneos', [EventosController::class, 'torneos'])->name('torneos');
    Route::get('/reuniones', [EventosController::class, 'reuniones'])->name('reuniones');
    Route::get('/convocatorias', [EventosController::class, 'convocatorias'])->name('convocatorias');
});

// --- MÓDULO: ENTRENAMIENTOS ---
Route::prefix('entrenamientos')->name('entrenamientos.')->group(function () {
    Route::get('/', [EntrenamientoController::class, 'index'])->name('index');
    Route::get('/horarios', [EntrenamientoController::class, 'horarios'])->name('horarios');
    Route::get('/foro', [EntrenamientoController::class, 'foro'])->name('foro');
});

// --- MÓDULO: DEPORTISTAS ---
Route::prefix('deportistas')->name('deportistas.')->group(function () {
    Route::get('/topelo', [DeportistasController::class, 'topelo'])->name('topelo');
    Route::get('/palmares', [DeportistasController::class, 'palmares'])->name('palmares');
    Route::get('/mielo', [DeportistasController::class, 'mielo'])->name('mielo');

});

// --- MÓDULO: CLUBES ---
Route::get('/clubes', [ClubesController::class, 'index'])->name('clubes.index');


// --- ADMINISTRACIÓN (Protegida) ---
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('index');
    Route::get('/perfil', [AdminController::class, 'perfil'])->name('perfil');
    Route::get('/usuarios', [AdminController::class, 'getUsuarios'])->name('usuarios');
    Route::get('/roles', [AdminController::class, 'getRoles'])->name('roles');
    Route::get('/permisos', [AdminController::class, 'getPermisos'])->name('permisos');
    Route::get('/modulos', [AdminController::class, 'getModulos'])->name('modulos');
});

Route::prefix('entrenamientos')->group(function () {

});
