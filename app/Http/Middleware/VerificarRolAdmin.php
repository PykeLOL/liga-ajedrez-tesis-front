<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerificarRolAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle($request, Closure $next)
    {
        $user = Auth::user();

        // Si no está autenticado, redirigir al login
        if (!$user) {
            return redirect()->route('login')->with('error', 'Debes iniciar sesión.');
        }

        // Si no tiene roles o si su rol principal es deportista, denegar acceso
        if ($user->roles->isEmpty() || $user->roles->contains('nombre', 'deportista')) {
            Auth::logout();
            return redirect()->route('login')->with('error', 'No tienes acceso al panel administrativo.');
        }

        return $next($request);
    }
}
