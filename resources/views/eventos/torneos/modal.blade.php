<div class="modal fade" id="modalTorneo" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
        <div class="modal-content bg-dark-card text-white border border-secondary rounded-4 overflow-hidden">
            <div class="modal-body p-0">
                <div class="row g-0">
                    <div class="col-lg-5 position-relative">
                        <img id="modalImagen"
                             class="w-100 h-100 object-fit-cover"
                             style="min-height:340px"
                             src="">

                        <div class="position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-dark">
                            <h4 class="fw-bold mb-1" id="modalTitulo"></h4>
                            <div class="small text-muted" id="modalLugar"></div>
                        </div>
                    </div>

                    <div class="col-lg-7 p-4 d-flex flex-column">
                        <div class="d-flex flex-wrap gap-2 mb-3" id="modalBadges"></div>
                        <div class="row small text-muted mb-3">
                            <div class="col-6">
                                <i class="bi bi-calendar-event me-2 text-chess-green"></i>
                                <span id="modalFecha"></span>
                            </div>
                            <div class="col-6">
                                <i class="bi bi-clock me-2 text-chess-green"></i>
                                <span id="modalHora"></span>
                            </div>
                        </div>
                        <div class="border-top border-secondary pt-3 mb-3 small" id="modalDescripcion"></div>
                        <div class="d-flex justify-content-between align-items-center mt-auto pt-3 border-top border-secondary">
                            <div class="small text-muted">
                                <i class="bi bi-people-fill me-1"></i>
                                <span id="modalCupos"></span>
                            </div>
                            <div class="d-flex gap-2">
                                <a id="btnDetalle" class="btn btn-outline-secondary btn-sm">
                                    Ver detalles
                                </a>
                                <form id="formInscripcion" method="POST">
                                    @csrf
                                    <input type="hidden" name="torneo_id" id="inputTorneoId">
                                    <button class="btn btn-chess fw-bold btn-sm">
                                        Inscribirme
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
