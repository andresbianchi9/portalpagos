const facturas = [
    {
        nroFactura: 101,
        monto: 1000,
        vencimiento: "2026-07-01",
        estado: "pendiente",
    },
    {
        nroFactura: 102,
        monto: 2000,
        vencimiento: "2026-07-02",
        estado: "pendiente",
    },
    {
        nroFactura: 103,
        monto: 7800,
        vencimiento: "2026-08-01",
        estado: "pendiente",
    },
    {
        nroFactura: 104,
        monto: 3200,
        vencimiento: "2026-06-20",
        estado: "pendiente",
    },
    {
        nroFactura: 105,
        monto: 800,
        vencimiento: "2026-05-20",
        estado: "pendiente",
    },
    {
        nroFactura: 106,
        monto: 1500,
        vencimiento: "2026-05-25",
        estado: "pendiente",
    },
        {
        nroFactura: 107,
        monto: 5000,
        vencimiento: "2026-05-25",
        estado: "pagada",
    },
];

const container = document.getElementById("container");
const btnPagar = document.getElementById("realizar-pago");
const btnReiniciar = document.getElementById("reiniciar-ordendepago");

btnReiniciar.onclick = reiniciarOP;
btnPagar.onclick = pagarFacturas;

function resumenSaldos() {

    const fechaActual = new Date();

    const saldoDeuda = facturasPendientes().reduce((total, factura) => total + factura.monto, 0);

    const saldoVencido = facturasPendientes().reduce((total, factura) => {
        const fechaVencimiento = new Date(factura.vencimiento);
        if (fechaVencimiento < fechaActual) total += factura.monto;
        return total;
    }, 0);

    const saldoProximaSemana = facturasPendientes().reduce((total, factura) => {
        const fechaVencimiento = new Date(factura.vencimiento);
        const diasParaVencimiento = (fechaVencimiento - fechaActual) / (1000 * 60 * 60 * 24);
        if (diasParaVencimiento > 0 && diasParaVencimiento <= 7) total += factura.monto;
        return total;
    }, 0);

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
    checkbox.addEventListener("change", recalcularTotal);

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

function recalcularTotal() {

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

            recalcularTotal();

            alert("La Orden de Pago se reinició correctamente");

        } else {

            alert("Ok, continuamos con la selección actual");

        }

    } else {

        alert("No hay facturas seleccionadas aún");

    }
};

function facturasPendientes() {
    return facturas.filter(factura => factura.estado === "pendiente");
};

function pagarFacturas() {

    const checksSeleccionados = document.querySelectorAll(
        ".checkFactura:checked"
    );

    if (checksSeleccionados.length === 0) {

        alert("Seleccioná al menos una factura");

        return;
    };

    alert("Pago realizado con exitos!");

    checksSeleccionados.forEach(checkbox => {

        const nroFacturaPagada = Number(checkbox.value);

        const factura = facturas.find(factura => factura.nroFactura === nroFacturaPagada);

        if (factura) {
            factura.estado = "pagada";
        }
        
        checkbox.checked = false;

    });  

    resumenSaldos();
    recalcularTotal();
    cargarFacturas();
};

document.addEventListener("DOMContentLoaded", () => {
    resumenSaldos();
    cargarFacturas();
});



