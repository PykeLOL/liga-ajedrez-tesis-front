<?php

namespace App\Providers;

use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        View::composer('*', function ($view) {
            try {
                $res = Http::get(env('API_URL') . '/select/tipos-evento');
                if ($res->successful()) {
                    $view->with('tiposEventosSidebar', collect($res->json()));
                } else {
                    $view->with('tiposEventosSidebar', collect());
                }
            } catch (\Throwable $e) {
                $view->with('tiposEventosSidebar', collect());
            }
        });
    }
}
