const btn = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");
let chart; // para destruir el gráfico anterior

btn.addEventListener("click", async () => {
  const monto = document.getElementById("monto").value;
  const moneda = document.getElementById("moneda").value;

  if (!monto || !moneda) {
    resultado.textContent = "Debe ingresar un monto y seleccionar una moneda.";
    return;
  }

  try {
    const res = await fetch("https://mindicador.cl/api");
    const data = await res.json();

    const valorMoneda = data[moneda].valor;
    const conversion = (monto / valorMoneda).toFixed(2);

    resultado.textContent = `Resultado: ${conversion} ${moneda.toUpperCase()}`;

    await renderGrafico(moneda);

  } catch (error) {
    resultado.textContent = "Error al consultar la API.";
  }
});

async function renderGrafico(moneda) {
  const res = await fetch(`https://mindicador.cl/api/${moneda}`);
  const data = await res.json();

  const ultimos10 = data.serie.slice(0, 10).reverse();

  const labels = ultimos10.map(item => item.fecha.slice(0, 10));
  const valores = ultimos10.map(item => item.valor);

  const ctx = document.getElementById("grafico");

  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: `Historial últimos 10 días (${moneda})`,
        data: valores,
        borderColor: "blue",
        borderWidth: 2
      }]
    }
  });
}

