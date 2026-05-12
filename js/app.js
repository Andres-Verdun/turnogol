const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

/* ============================= */
/* BUSCADOR HOME */
/* ============================= */

const formBusqueda = document.querySelector(".search-card");

formBusqueda?.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = "complejo.html";
});

/* ============================= */
/* RESERVA RÁPIDA EN COMPLEJO */
/* ============================= */

const bookingForm = document.querySelector(".booking-form");

bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  window.location.href = "reserva.html";
});

/* ============================= */
/* RESERVA */
/* ============================= */

const reserveForm = document.getElementById("reserveForm");
const canchaSelect = document.getElementById("cancha");
const horarioSelect = document.getElementById("horario");
const duracionSelect = document.getElementById("duracion");
const fechaInput = document.getElementById("fecha");

const summaryCancha = document.getElementById("summaryCancha");
const summaryHorario = document.getElementById("summaryHorario");
const summaryPrecio = document.getElementById("summaryPrecio");
const summaryResta = document.getElementById("summaryResta");

function formatearPesos(valor) {
  return `$${valor.toLocaleString("es-AR")}`;
}

function obtenerPrecioTotal() {
  if (!canchaSelect || !duracionSelect) return 0;

  const precioHora = Number(canchaSelect.value);
  const duracion = Number(duracionSelect.value);

  return precioHora * duracion;
}

function actualizarResumen() {
  if (!canchaSelect || !duracionSelect) return;

  const precioTotal = obtenerPrecioTotal();
  const senia = 5000;
  const resta = precioTotal - senia;

  if (summaryCancha) {
    summaryCancha.textContent =
      canchaSelect.options[canchaSelect.selectedIndex].text;
  }

  if (summaryHorario && horarioSelect) {
    summaryHorario.textContent = horarioSelect.value;
  }

  if (summaryPrecio) {
    summaryPrecio.textContent = formatearPesos(precioTotal);
  }

  if (summaryResta) {
    summaryResta.textContent = formatearPesos(resta);
  }
}

canchaSelect?.addEventListener("change", actualizarResumen);
horarioSelect?.addEventListener("change", actualizarResumen);
duracionSelect?.addEventListener("change", actualizarResumen);

actualizarResumen();

reserveForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(reserveForm);

  const nombre = reserveForm.querySelector('input[placeholder="Ej: Juan Pérez"]')?.value || "";
  const telefono = reserveForm.querySelector('input[placeholder="Ej: 299 000 0000"]')?.value || "";
  const email = reserveForm.querySelector('input[type="email"]')?.value || "";

  const precioTotal = obtenerPrecioTotal();
  const senia = 5000;
  const resta = precioTotal - senia;

  const nuevaReserva = {
    id: Date.now(),
    complejo: "Canchas del Gringo",
    cancha: canchaSelect.options[canchaSelect.selectedIndex].text,
    fecha: fechaInput.value,
    horario: horarioSelect.value,
    duracion: duracionSelect.options[duracionSelect.selectedIndex].text,
    nombre,
    telefono,
    email,
    precioTotal,
    senia,
    resta,
    estado: "Confirmada"
  };

  const reservasGuardadas =
    JSON.parse(localStorage.getItem("turnogol_reservas")) || [];

  reservasGuardadas.push(nuevaReserva);

  localStorage.setItem(
    "turnogol_reservas",
    JSON.stringify(reservasGuardadas)
  );

  localStorage.setItem(
    "turnogol_ultima_reserva",
    JSON.stringify(nuevaReserva)
  );

  window.location.href = "confirmacion.html";
});

/* ============================= */
/* MIS RESERVAS */
/* ============================= */

const reservasLista = document.getElementById("reservasLista");
const limpiarReservasBtn = document.getElementById("limpiarReservas");

function formatearFecha(fecha) {
  if (!fecha) return "Sin fecha";

  const partes = fecha.split("-");
  if (partes.length !== 3) return fecha;

  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function renderizarReservas() {
  if (!reservasLista) return;

  const reservas =
    JSON.parse(localStorage.getItem("turnogol_reservas")) || [];

  if (reservas.length === 0) {
    reservasLista.innerHTML = `
      <div class="empty-reservations">
        <h2>No tenés reservas cargadas</h2>
        <p>
          Cuando confirmes un turno, aparecerá en esta sección.
        </p>
      </div>
    `;
    return;
  }

  reservasLista.innerHTML = reservas
    .map((reserva) => {
      return `
        <article class="reservation-card">
          <div class="reservation-card-header">
            <div>
              <h2>${reserva.complejo}</h2>
              <p>${formatearFecha(reserva.fecha)} · ${reserva.horario}</p>
            </div>

            <span class="reservation-status">${reserva.estado}</span>
          </div>

          <div class="reservation-grid">
            <div class="reservation-item">
              <span>Cancha</span>
              <strong>${reserva.cancha}</strong>
            </div>

            <div class="reservation-item">
              <span>Duración</span>
              <strong>${reserva.duracion}</strong>
            </div>

            <div class="reservation-item">
              <span>Precio total</span>
              <strong>${formatearPesos(reserva.precioTotal)}</strong>
            </div>

            <div class="reservation-item">
              <span>Seña</span>
              <strong>${formatearPesos(reserva.senia)}</strong>
            </div>

            <div class="reservation-item">
              <span>Resta abonar</span>
              <strong>${formatearPesos(reserva.resta)}</strong>
            </div>

            <div class="reservation-item">
              <span>Contacto</span>
              <strong>${reserva.nombre}</strong>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

renderizarReservas();

limpiarReservasBtn?.addEventListener("click", () => {
  localStorage.removeItem("turnogol_reservas");
  localStorage.removeItem("turnogol_ultima_reserva");
  renderizarReservas();
});

/* ============================= */
/* PANEL DEL DUEÑO */
/* ============================= */

const ownerReservasLista = document.getElementById("ownerReservasLista");
const totalReservas = document.getElementById("totalReservas");
const totalSenias = document.getElementById("totalSenias");
const totalPendiente = document.getElementById("totalPendiente");

function renderizarPanelDuenio() {
  if (!ownerReservasLista) return;

  const reservas =
    JSON.parse(localStorage.getItem("turnogol_reservas")) || [];

  if (totalReservas) {
    totalReservas.textContent = reservas.length;
  }

  const senias = reservas.reduce((acc, reserva) => acc + reserva.senia, 0);
  const pendientes = reservas.reduce((acc, reserva) => acc + reserva.resta, 0);

  if (totalSenias) {
    totalSenias.textContent = formatearPesos(senias);
  }

  if (totalPendiente) {
    totalPendiente.textContent = formatearPesos(pendientes);
  }

  if (reservas.length === 0) {
    ownerReservasLista.innerHTML = `
      <div class="owner-empty">
        <h2>No hay reservas registradas</h2>
        <p>
          Cuando un usuario confirme un turno, aparecerá en este panel.
        </p>
      </div>
    `;
    return;
  }

  ownerReservasLista.innerHTML = reservas
    .map((reserva) => {
      return `
        <article class="owner-reservation-card">
          <div>
            <h3>${reserva.nombre || "Cliente sin nombre"}</h3>
            <p>
              ${reserva.complejo} · ${reserva.cancha}
            </p>

            <div class="owner-reservation-data">
              <span>📅 ${formatearFecha(reserva.fecha)}</span>
              <span>🕘 ${reserva.horario}</span>
              <span>⏱️ ${reserva.duracion}</span>
              <span>📞 ${reserva.telefono || "Sin teléfono"}</span>
              <span>✉️ ${reserva.email || "Sin email"}</span>
              <span>✅ ${reserva.estado}</span>
            </div>
          </div>

          <div class="owner-money">
            <strong>${formatearPesos(reserva.senia)}</strong>
            <span>Seña abonada</span>
            <br><br>
            <strong>${formatearPesos(reserva.resta)}</strong>
            <span>Resta abonar</span>
          </div>
        </article>
      `;
    })
    .join("");
}

renderizarPanelDuenio();