import Swal from "sweetalert2";

let facturas = [];
let pagosRealizados = [];
const hoy = new Date("2026-05-28"); // Variable global para la fecha actual, utilizada en cálculos de saldos. Por motivos de demo se deja fija en 28/5/26.

function facturasPendientes() {
    return facturas.filter(factura => factura.estado === "pendiente");
};

function facturasPagadas() {
    return facturas.filter(factura => factura.estado === "pagada");
};

const btnPagar = document.getElementById("realizar-pago");
const btnReiniciar = document.getElementById("reiniciar-ordendepago");

btnReiniciar.onclick = reiniciarOP;
btnPagar.onclick = pagarFacturas;

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

    registrarPago();

    cargarSaldos();
    mostrarTotal();
    cargarFacturas();
    cargarHistorial();
};

function registrarPago() {

    const { value: metodoPago } = await Swal.fire({
        title: "Seleccioná método de pago",
        input: "select",
        inputOptions: {
            transferencia: "Transferencia",
            tarjeta: "Tarjeta de crédito",
            mercadoPago: "Mercado Pago"
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
        monto: obtenerTotal(),
        metodo: metodoPago,
    });


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



