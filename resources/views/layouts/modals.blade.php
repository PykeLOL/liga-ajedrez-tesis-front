<link rel="stylesheet" href="{{ asset('css/modals.css') }}">

<div class="modal fade" id="modalLoginRequired" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark border-secondary text-white">
            <div class="modal-header border-secondary">
                <h5 class="modal-title d-flex align-items-center mb-0">
                    <i class="bi bi-person-lock me-2 text-chess-green"></i>
                    Inicia sesión para continuar
                </h5>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
                <div class="contenido">
                    <div class="mb-3">
                        <i class="bi bi-people-fill text-chess-green" style="font-size:3.2rem;"></i>
                    </div>
                    <h3 class="fw-bold mb-3">
                        Inicia sesión o crea una cuenta
                    </h3>
                    <p class="text-light opacity-75 mb-4" style="line-height:1.7;">
                        Para acceder a esta función necesitas iniciar sesión o crear una cuenta gratuita. Una vez hayas ingresado podrás disfrutar de todas las funcionalidades de la plataforma.
                    </p>
                    <div class="mensaje-login">
                        <i class="bi bi-info-circle-fill me-2 text-chess-green"></i>
                        <span class="text-chess-green fw-semibold">
                            Es rápido y completamente gratuito.
                        </span>
                    </div>
                    <div class="acciones">
                        <a href="{{ route('login') }}" class="btn btn-chess">
                            <i class="bi bi-box-arrow-in-right me-2"></i>
                            Ingresar
                        </a>
                        <a href="{{ route('registrarse') }}" class="btn btn-chess-secondary">
                            <i class="bi bi-person-plus-fill me-2"></i>
                            Registrarme
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
