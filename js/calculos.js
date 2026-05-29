export function facturasPendientes(facturas) {
    return facturas.filter(factura => factura.estado === "pendiente");
};

export function calcularSaldos(hoy, facturas) {

    const saldoDeuda = facturasPendientes(facturas).reduce((total, factura) => total + factura.monto, 0);

    const saldoVencido = facturasPendientes(facturas).reduce((total, factura) => {
        const fechaVencimiento = new Date(factura.vencimiento);
        if (fechaVencimiento < hoy) total += factura.monto;
        return total;
    }, 0);

    const saldoProximaSemana = facturasPendientes(facturas).reduce((total, factura) => {
        const fechaVencimiento = new Date(factura.vencimiento);
        const diasParaVencimiento = (fechaVencimiento - hoy) / (1000 * 60 * 60 * 24); // Conversión de milisegundos a segundos > minutos > horas > días
        if (diasParaVencimiento > 0 && diasParaVencimiento <= 7) total += factura.monto;
        return total;
    }, 0);

    return {
        saldoDeuda,
        saldoVencido,
        saldoProximaSemana
    };
};

export function totalOrdenPago(facturas) {

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
