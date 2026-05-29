import { calcularSaldos, facturasPagadas, facturasPendientes, totalOrdenPago } from "./calculos.js";

const btnHome = document.getElementById("btnHome");
const btnOrdenPago = document.getElementById("btnOrdenPago");
const btnHistorial = document.getElementById("btnHistorial");

const vistaHome = document.getElementById("vista-home");
const vistaOrdenPago = document.getElementById("vista-ordendepago");
const vistaHistorial = document.getElementById("vista-historial");

let facturas = [];
let pagosRealizados = [];
const hoy = new Date("2026-05-28"); // Variable global para la fecha actual, utilizada en cálculos de saldos. Por motivos de demo se deja fija en 28/5/26.
// Al usuario se mostrará 27/5/26 por transformación de formato a es-AR".

const formatoMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS'
});

btnHome.onclick = renderHome;
btnOrdenPago.onclick = renderOrdenPago;
btnHistorial.onclick =  renderHistorial;

function renderHome() {

    vistaHome.style.display = "block";
    vistaOrdenPago.style.display = "none";
    vistaHistorial.style.display = "none";

    const saldos = calcularSaldos(hoy, facturas);

    vistaHome.innerHTML = `
        <h1>Portal de Pagos</h1>
        <h2>Detalle y saldos de su cuenta corriente</h2>
        <div class="container-saldos">
        <div class="saldos">
            <p>Su deuda total es de</p>
            <p>${formatoMoneda.format(saldos.saldoDeuda)}</p>
        </div>
        <div class="saldos">
            <p>Su deuda vencida es de</p>
            <p>${formatoMoneda.format(saldos.saldoVencido)}</p>
        </div>
        <div class="saldos">
            <p>Su deuda para la próxima semana es de</p>
            <p>${formatoMoneda.format(saldos.saldoProximaSemana)}</p>
        </div>
        </div>
    `;
}

function renderOrdenPago() {

    vistaHome.style.display = "none";
    vistaOrdenPago.style.display = "block";
    vistaHistorial.style.display = "none";

    vistaOrdenPago.innerHTML = `
        <h2>Facturas pendientes</h2>
        <div class="encabezados">
            <p>Nro de Factura</p>
            <p>Vencimiento</p>
            <p>Monto</p>
            <p>Estado</p>
            <p>Acciones</p>
        </div>
        <div id="container" class="container"></div>
        <h2>Orden de Pago</h2>
        <h3>Total seleccionado</h3>
        <p id="total-ordendepago"></p>
        <button id="reiniciar-ordendepago">Reiniciar orden de pago</button>
        <button id="realizar-pago">Realizar pago</button>
    `;

    const container = document.getElementById("container");
    const btnPagar = document.getElementById("realizar-pago");
    const btnReiniciar = document.getElementById("reiniciar-ordendepago");
    const totalOrdenPago = document.getElementById("total-ordendepago");

    btnReiniciar.onclick = () => reiniciarOP(facturas);
    btnPagar.onclick = () => pagarFacturas(facturas);

    renderizarListadoFacturas(container);
    renderizarTotalOP(facturas);
}

function renderHistorial() {

    vistaHome.style.display = "none";
    vistaOrdenPago.style.display = "none";
    vistaHistorial.style.display = "block";

    vistaHistorial.innerHTML = `
        <h2>Historial de Pagos</h2>
        <div id="historial"></div>
    `;

    const historial = document.getElementById("historial");
    renderizarHistorial(historial);
}

function crearCard(elemento, container) {
    const card = document.createElement("div");
    card.className = "card";

    const nroFactura = document.createElement("p");
    nroFactura.innerText = `Factura: ${elemento.nroFactura}`;

    const vencimiento = document.createElement("p");
    vencimiento.innerText = `${elemento.vencimiento}`;

    const monto = document.createElement("p");
    monto.innerText = `${formatoMoneda.format(elemento.monto)}`;

    const estado = document.createElement("p");
    estado.innerText = `${elemento.estado}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = elemento.nroFactura;
    checkbox.className = "checkFactura";
    checkbox.addEventListener("change", () => renderizarTotalOP(facturas));

    card.appendChild(nroFactura);
    card.appendChild(vencimiento);
    card.appendChild(monto);
    card.appendChild(estado);
    card.appendChild(checkbox);

    container.appendChild(card);
};

function renderizarListadoFacturas(container) {

    container.innerHTML = ""
    facturasPendientes(facturas).forEach(el => crearCard(el, container));
};

function renderizarTotalOP(facturas) {

    document.getElementById("total-ordendepago").innerText = formatoMoneda.format(totalOrdenPago(facturas));
};

function reiniciarOP(facturas) {

    const checksSeleccionados = document.querySelectorAll(
        ".checkFactura:checked"
    );

    if (checksSeleccionados.length > 0) {

        const confirmar = confirm(
            "Esta acción desmarcará todas las facturas seleccionadas. ¿Confirmar reinicio de la OP?"
        );

        if (confirmar) {

            checksSeleccionados.forEach(check => {

                check.checked = false;

            });

            mostrarTotal(facturas);

            alert("La Orden de Pago se reinició correctamente");

        } else {

            alert("Ok, continuamos con la selección actual");

        }

    } else {

        alert("No hay facturas seleccionadas aún");

    };
};

async function pagarFacturas(facturas) {

    const facturasSeleccionadas = document.querySelectorAll(
        ".checkFactura:checked"
    );

    if (facturasSeleccionadas.length === 0) {

    Swal.fire({
                icon: "warning",
                title: "Oops...",
                text: "Seleccioná al menos una factura"
            });

            return;
    };

    const { value: metodoPago } = await Swal.fire({
        title: "Seleccioná método de pago",
        input: "select",
        inputOptions: {
            "Transferencia": "Transferencia",
            "Tarjeta de crédito": "Tarjeta de crédito",
            "Mercado Pago": "Mercado Pago"
        },
        inputPlaceholder: "Elegí una opción",
        showCancelButton: true,
        confirmButtonText: "Pagar",
        cancelButtonText: "Cancelar",
        inputValidator: (value) => {
            if (!value) {
                return "Tenés que seleccionar un método";
            }
        }
    });

    if (!metodoPago) {
        return;
    }

    Swal.fire({
        icon: "success",
        title: "Pago realizado con éxito"
    });

    pagosRealizados.push({
        fecha: hoy.toLocaleDateString("es-AR"),
        monto: formatoMoneda.format(totalOrdenPago(facturas)),
        metodo: metodoPago,
    });

    console.log(pagosRealizados);
    cambiarEstadoFacturas(facturasSeleccionadas)
};

function cambiarEstadoFacturas(facturasSeleccionadas) {
        
        facturasSeleccionadas.forEach(checkbox => {

        const nroFacturaPagada = Number(checkbox.value);

        const factura = facturas.find(factura => factura.nroFactura === nroFacturaPagada);

        if (factura) {
            factura.estado = "pagada";
        };

        checkbox.checked = false;

    });

    renderOrdenPago();
};

function renderizarHistorial(historial) {
    
    historial.innerHTML = "";

    if (pagosRealizados.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.innerText = "No se han realizado pagos aún.";
        historial.appendChild(mensaje);
        return;
    };

    const listaPagos = document.createElement("ul");

        pagosRealizados.forEach(pago => {
            const itemPago = document.createElement("li");
            itemPago.innerText = `Pago realizado el ${pago.fecha} por un monto de ${pago.monto} mediante ${pago.metodo}`;
            listaPagos.appendChild(itemPago);
        });

    const mensaje = document.createElement("p");
    mensaje.innerText = "*NOTA: la fecha siempre será 27-5-2026 por tratarse de una demo, pero en un entorno real se mostraría la fecha actual del pago.";
    
    historial.appendChild(listaPagos);
    historial.appendChild(mensaje);
};

document.addEventListener("DOMContentLoaded", () => {

    fetch("./facturas.json")
        .then(respuesta => respuesta.json())
        .then(data => {
            facturas = data.facturas;

            renderHome();
    });
});