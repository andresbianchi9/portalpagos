import Swal from "sweetalert2";

// const facturas = [
//     {
//         nroFactura: 101,
//         monto: 1000,
//         vencimiento: "2026-07-01",
//         estado: "pendiente",
//     },
//     {
//         nroFactura: 102,
//         monto: 2000,
//         vencimiento: "2026-07-02",
//         estado: "pendiente",
//     },
//     {
//         nroFactura: 103,
//         monto: 7800,
//         vencimiento: "2026-08-01",
//         estado: "pendiente",
//     },
//     {
//         nroFactura: 104,
//         monto: 3200,
//         vencimiento: "2026-06-20",
//         estado: "pendiente",
//     },
//     {
//         nroFactura: 105,
//         monto: 800,
//         vencimiento: "2026-05-20",
//         estado: "pendiente",
//     },
//     {
//         nroFactura: 106,
//         monto: 1500,
//         vencimiento: "2026-05-25",
//         estado: "pendiente",
//     },
//     {
//         nroFactura: 107,
//         monto: 5000,
//         vencimiento: "2026-05-25",
//         estado: "pendiente",
//     },
//     {
//         nroFactura: 108,
//         monto: 15000,
//         vencimiento: "2026-06-02",
//         estado: "pendiente",
//     },
// ];

let facturas = [];
let pagosRealizados = [];
const container = document.getElementById("container");
const btnPagar = document.getElementById("realizar-pago");
const btnReiniciar = document.getElementById("reiniciar-ordendepago");

btnReiniciar.onclick = reiniciarOP;
btnPagar.onclick = pagarFacturas;

function facturasPendientes() {
    return facturas.filter(factura => factura.estado === "pendiente");
};

function calcularSaldos() {

    const fechaActual = new Date();

    const saldoDeuda = facturasPendientes().reduce((total, factura) => total + factura.monto, 0);

    const saldoVencido = facturasPendientes().reduce((total, factura) => {
        const fechaVencimiento = new Date(factura.vencimiento);
        if (fechaVencimiento < fechaActual) total += factura.monto;
        return total;
    }, 0);

    const saldoProximaSemana = facturasPendientes().reduce((total, factura) => {
        const fechaVencimiento = new Date(factura.vencimiento);
        const diasParaVencimiento = (fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24); // Conversión de milisegundos a segundos > minutos > horas > días
        if (diasParaVencimiento > 0 && diasParaVencimiento <= 7) total += factura.monto;
        return total;
    }, 0);

    return {
        saldoDeuda,
        saldoVencido,
        saldoProximaSemana
    };
};

function cargarSaldos() {

    const {saldoDeuda, saldoVencido, saldoProximaSemana} = calcularSaldos();

    document.getElementById("saldo-deuda").innerText = saldoDeuda;
    document.getElementById("saldo-vencido").innerText = saldoVencido;
    document.getElementById("proxima-semana").innerText = saldoProximaSemana;
};

function crearCard(elemento) {
    const card = document.createElement("div");
    card.className = "card";

    const nroFactura = document.createElement("p");
    nroFactura.innerText = `Factura: ${elemento.nroFactura}`;

    const vencimiento = document.createElement("p");
    vencimiento.innerText = `${elemento.vencimiento}`;

    const monto = document.createElement("p");
    monto.innerText = `$ ${elemento.monto}`;

    const estado = document.createElement("p");
    estado.innerText = `${elemento.estado}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = elemento.nroFactura;
    checkbox.className = "checkFactura";
    checkbox.addEventListener("change", mostrarTotal);

    card.appendChild(nroFactura);
    card.appendChild(vencimiento);
    card.appendChild(monto);
    card.appendChild(estado);
    card.appendChild(checkbox);

    container.appendChild(card);
};

function cargarFacturas() {

    document.getElementById("container").innerHTML = ""
    facturasPendientes().forEach(el => crearCard(el));
};

function obtenerTotal() {

    let total = 0;
    
    const checksSeleccionados = document.querySelectorAll(
        ".checkFactura:checked"
    );

    checksSeleccionados.forEach(check => {

        const nroFactura = Number(check.value);

        const facturaSeleccionada = facturas.find(
            factura => factura.nroFactura === nroFactura
        );

        total += facturaSeleccionada.monto;

    });

    return total;
};

function mostrarTotal() {

    const total = obtenerTotal();
    document.getElementById("total-ordendepago").innerText = total;
};

function reiniciarOP() {

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

            mostrarTotal();

            alert("La Orden de Pago se reinició correctamente");

        } else {

            alert("Ok, continuamos con la selección actual");

        }

    } else {

        alert("No hay facturas seleccionadas aún");

    };
};

function pagarFacturas() {

    const checksSeleccionados = document.querySelectorAll(
        ".checkFactura:checked"
    );

    if (checksSeleccionados.length === 0) {

        alert("Seleccioná al menos una factura");

        return;
    };

    const metodoPago = prompt(
        "Seleccioná método de pago:\n\n1 - Transferencia\n2 - Tarjeta de crédito\n3 - Mercado Pago"
    );

    let metodoSeleccionado = "";

    if (metodoPago === "1") {
        metodoSeleccionado = "Transferencia";
    } else if (metodoPago === "2") {
        metodoSeleccionado = "Tarjeta de crédito";
    } else if (metodoPago === "3") {
        metodoSeleccionado = "Mercado Pago";
    } else {
        alert("Método de pago inválido");
        return;
    }

    alert("Pago realizado con exitos!");

    pagosRealizados.push({
            fecha: new Date().toLocaleDateString(),
            monto: obtenerTotal(),
            metodoPago: metodoSeleccionado,
        });

    checksSeleccionados.forEach(checkbox => {

        const nroFacturaPagada = Number(checkbox.value);

        const factura = facturas.find(factura => factura.nroFactura === nroFacturaPagada);

        if (factura) {
            factura.estado = "pagada";
        };

        checkbox.checked = false;

    });  

    cargarSaldos();
    mostrarTotal();
    cargarFacturas();
    cargarHistorial();
};

function cargarHistorial() {
    
    document.getElementById("historial").innerHTML = "";
    
    const historial = document.getElementById("historial");

    const titulo = document.createElement("h2");
    titulo.innerText = "Historial de Pagos";

    if (pagosRealizados.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.innerText = "No se han realizado pagos aún.";
        historial.appendChild(titulo);
        historial.appendChild(mensaje);
        return;
    };

    const listaPagos = document.createElement("ul");

        pagosRealizados.forEach(pago => {
            const itemPago = document.createElement("li");
            itemPago.innerText = `Pago realizado el ${pago.fecha} por un monto de $${pago.monto}`;
            listaPagos.appendChild(itemPago);
        });

    historial.appendChild(titulo);
    historial.appendChild(listaPagos);
};

document.addEventListener("DOMContentLoaded", () => {

    fetch("./facturas.json")
        .then(respuesta => respuesta.json())
        .then(data => {
            facturas = data.facturas;

            cargarSaldos();
            cargarFacturas();
            cargarHistorial();
    });
});



