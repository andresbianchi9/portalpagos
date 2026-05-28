const container = document.getElementById("container");

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
            itemPago.innerText = `Pago realizado el ${pago.fecha} por un monto de $${pago.monto} mediante ${pago.metodoPago}`;
            listaPagos.appendChild(itemPago);
        });

    historial.appendChild(titulo);
    historial.appendChild(listaPagos);
};

function mostrarTotal() {

    const total = obtenerTotal();
    document.getElementById("total-ordendepago").innerText = total;
};

function cargarSaldos() {

    const {saldoDeuda, saldoVencido, saldoProximaSemana} = calcularSaldos();

    document.getElementById("saldo-deuda").innerText = saldoDeuda;
    document.getElementById("saldo-vencido").innerText = saldoVencido;
    document.getElementById("proxima-semana").innerText = saldoProximaSemana;
};