<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\HomeController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\EventosController;
use App\Http\Controllers\EntrenamientoController;
use App\Http\Controllers\DeportistasController;
use App\Http\Controllers\ClubesController;
use App\Http\Controllers\NoticiasController;

Route::get('/login', [LoginController::class, 'index'])->name('login');
Route::get('/registrarse', [LoginController::class, 'registarse'])->name('registrarse');

Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/perfil', [HomeController::class, 'perfil'])->name('perfil');
Route::get('/sobre-nosotros', [HomeController::class, 'welcome'])->name('nosotros');

Route::prefix('eventos')->name('eventos.')->group(function () {
    Route::get('/{tipo}', [EventosController::class, 'index'])->name('tipo');
    Route::get('/{tipo}/{id}', [EventosController::class, 'show'])->name('show');
    // Route::get('/torneos', [EventosController::class, 'torneos'])->name('torneos');
    // Route::get('/reuniones', [EventosController::class, 'reuniones'])->name('reuniones');
    // Route::get('/convocatorias', [EventosController::class, 'convocatorias'])->name('convocatorias');
});

Route::prefix('entrenamientos')->name('entrenamientos.')->group(function () {
    Route::get('/', [EntrenamientoController::class, 'index'])->name('index');
    Route::get('/foro', [EntrenamientoController::class, 'foro'])->name('foro');
});

Route::prefix('deportistas')->name('deportistas.')->group(function () {
    Route::get('/mielo', [DeportistasController::class, 'mielo'])->name('mielo');
    Route::get('/topelo', [DeportistasController::class, 'topelo'])->name('topelo');
    Route::get('/palmares', [DeportistasController::class, 'palmares'])->name('palmares');
});

Route::prefix('clubes')->name('clubes.')->group(function () {
    Route::get('/', [ClubesController::class, 'index'])->name('index');
    Route::get('/{id}', [ClubesController::class, 'show'])->name('show');
});

Route::get('/noticias', [NoticiasController::class, 'index'])->name('noticias.index');

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('index');
    Route::get('/perfil', [AdminController::class, 'perfil'])->name('perfil');
    Route::get('/roles', [AdminController::class, 'getRoles'])->name('roles');
    Route::get('/clubes', [AdminController::class, 'getClubes'])->name('clubes');
    Route::get('/modulos', [AdminController::class, 'getModulos'])->name('modulos');
    Route::get('/eventos', [AdminController::class, 'getEventos'])->name('eventos');
    Route::get('/torneos', [AdminController::class, 'getTorneos'])->name('torneos');
    Route::get('/usuarios', [AdminController::class, 'getUsuarios'])->name('usuarios');
    Route::get('/permisos', [AdminController::class, 'getPermisos'])->name('permisos');
    Route::get('/deportistas', [AdminController::class, 'getDeportistas'])->name('deportistas');
    Route::get('/entrenamientos', [AdminController::class, 'getEntrenamientos'])->name('entrenamientos');
    Route::get('/planes-entrenamiento', [AdminController::class, 'getPlanesEntrenamiento'])->name('planes-entrenamiento');
});
