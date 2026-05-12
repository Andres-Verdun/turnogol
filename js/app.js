const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

const formBusqueda = document.querySelector(".search-card");

formBusqueda?.addEventListener("submit", (e) => {
  e.preventDefault();

  alert(
    "Búsqueda simulada. En la próxima etapa conectamos esta acción con las canchas disponibles."
  );
});

const bookingForm = document.querySelector(".booking-form");

bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  window.location.href = "reserva.html";
});

const reserveForm = document.getElementById("reserveForm");
const canchaSelect = document.getElementById("cancha");
const horarioSelect = document.getElementById("horario");
const duracionSelect = document.getElementById("duracion");

const summaryCancha = document.getElementById("summaryCancha");
const summaryHorario = document.getElementById("summaryHorario");
const summaryPrecio = document.getElementById("summaryPrecio");
const summaryResta = document.getElementById("summaryResta");

function formatearPesos(valor) {
  return `$${valor.toLocaleString("es-AR")}`;
}

function actualizarResumen() {
  if (!canchaSelect || !duracionSelect) return;

  const precioHora = Number(canchaSelect.value);
  const duracion = Number(duracionSelect.value);
  const precioTotal = precioHora * duracion;
  const senia = 5000;
  const resta = precioTotal - senia;

  if (summaryCancha) {
    summaryCancha.textContent =
      canchaSelect.options[canchaSelect.selectedIndex].text;
  }

  if (summaryHorario) {
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

  alert(
    "Reserva confirmada de manera simulada. En la próxima etapa creamos la pantalla de confirmación."
  );
});