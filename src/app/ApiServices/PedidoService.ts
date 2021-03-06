import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppSettings } from '../app.settings';
import { HeaderBuilder } from '../Tools/HeaderBuilder';
import { E_PedidosCliente } from 'app/Models/E_PedidosCliente';
import { PedidosClienteBuilder } from 'app/Builders/PedidosCliente.model.builder';
import { E_PedidosDetalleCliente } from 'app/Models/E_PedidosDetalleCliente';
import { PedidosDetalleClienteBuilder } from 'app/Builders/PedidosDetalleCliente.model.builder';


@Injectable()
export class PedidoService {
    PedidosListFacturados: any;
    constructor(private Http: HttpClient, private HeaderBuilder: HeaderBuilder) { }
    private UrlNow: string = AppSettings.Global().API
    private textarea: HTMLTextAreaElement;

    GuardarEncabezadoPedido(obj: E_PedidosCliente): Observable<E_PedidosCliente> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        var request = JSON.stringify(obj)
        return this.Http.post(this.UrlNow + "Pedido/GuardarEncabezadoPedido"
            , request, httpOptions).map(this.ExtractPedidosCliente)
    }

    GuardarDetallePedido(obj: Array<E_PedidosDetalleCliente>): Observable<E_PedidosCliente> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };

        var request = JSON.stringify(obj)
        return this.Http.post(this.UrlNow + "Pedido/GuardarDetallePedido"
            , request, httpOptions).map(this.ExtractPedidosCliente)
    }

    GuardarReservaEnLinea(obj: Array<E_PedidosDetalleCliente>): Observable<E_PedidosCliente> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        var request = JSON.stringify(obj)
        return this.Http.post(this.UrlNow + "Pedido/ValidarPedidoReserva"
            , request, httpOptions).map(this.ExtractPedidosCliente)
    }

    PedidosList(obj: E_PedidosCliente): Observable<Array<E_PedidosCliente>> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        var request = JSON.stringify(obj)
        return this.Http.post(this.UrlNow + "Pedido/PedidosList"
            , request, httpOptions).map(this.ExtractPedidosList)
    }

    PedidosListEmpresarias(obj: E_PedidosCliente): Observable<Array<E_PedidosCliente>> {
      const httpOptions = {
          headers: new HttpHeaders({
              'Content-Type': 'application/json',
          })
      };
      var request = JSON.stringify(obj)
      return this.Http.post(this.UrlNow + "Pedido/PedidosListEmpresaria"
          , request, httpOptions).map(this.ExtractPedidosListEmpresarias)
  }
  PedidosListLider(obj: E_PedidosCliente): Observable<Array<E_PedidosCliente>> {
    const httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json',
        })
    };
    var request = JSON.stringify(obj)
    return this.Http.post(this.UrlNow + "Pedido/PedidosListLider"
        , request, httpOptions).map(this.ExtractPedidosListLider)
}

    ListxGerenteZonaFacturados(obj: E_PedidosCliente): Observable<Array<E_PedidosCliente>> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        var request = JSON.stringify(obj)
        return this.Http.post(this.UrlNow + "Pedido/ListxGerenteZonaFacturados"
            , request, httpOptions).map(this.ExtractListxGerenteZonaFacturados)
    }

    ListDetallePedidoReservaGYG(obj: E_PedidosCliente): Observable<Array<E_PedidosDetalleCliente>> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        var request = JSON.stringify(obj)
        return this.Http.post(this.UrlNow + "Pedido/ListDetallePedidoReservaGYG"
            , request, httpOptions).map(this.ExtractPedidosDetalleList)

    }


    ConsultarSaldoAPagarxNit(obj: E_PedidosCliente): Observable<E_PedidosCliente> {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            })
        };
        var request = JSON.stringify(obj)
        return this.Http.post(this.UrlNow + "Pedido/ConsultarSaldoAPagarxNit"
            , request, httpOptions).map(this.ExtractPedidosCliente)
    }

    ExtractPedidosCliente(res: Response): E_PedidosCliente {
        var x: E_PedidosCliente = new E_PedidosCliente()
        if (res != null) { x = new PedidosClienteBuilder().buildFromObject(res).Build() }
        return x
    }

    ExtractPedidosDetalleCliente(res: Response): E_PedidosDetalleCliente {
        var x: E_PedidosDetalleCliente = new E_PedidosDetalleCliente()
        if (res != null) { x = new PedidosDetalleClienteBuilder().buildFromObject(res).Build() }
        return x
    }

    ExtractPedidosList(res: any): Array<E_PedidosCliente> {
        var x: Array<E_PedidosCliente> = new Array<E_PedidosCliente>()
        if (res != null) {
            res.forEach((element) => {
                x.push(new PedidosClienteBuilder().buildFromObject(element).Build())
            });

        }
        return x
    }

    ExtractPedidosListEmpresarias(res: any): Array<E_PedidosCliente> {
      var x: Array<E_PedidosCliente> = new Array<E_PedidosCliente>()
      if (res != null) {
          res.forEach((element) => {
              x.push(new PedidosClienteBuilder().buildFromObject(element).Build())
          });

      }
      return x
  }
  ExtractPedidosListLider(res: any): Array<E_PedidosCliente> {
    var x: Array<E_PedidosCliente> = new Array<E_PedidosCliente>()
    if (res != null) {
        res.forEach((element) => {
            x.push(new PedidosClienteBuilder().buildFromObject(element).Build())
        });

    }
    return x
}
    ExtractListxGerenteZonaFacturados(res: any): Array<E_PedidosCliente> {
        var x: Array<E_PedidosCliente> = new Array<E_PedidosCliente>()
        if (res != null) {
            res.forEach((element) => {
                x.push(new PedidosClienteBuilder().buildFromObject(element).Build())
            });

        }
        return x

    }


    ExtractPedidosDetalleList(res: any): Array<E_PedidosDetalleCliente> {
        var x: Array<E_PedidosDetalleCliente> = new Array<E_PedidosDetalleCliente>()
        if (res != null) {
            res.forEach((element) => {
                x.push(new PedidosDetalleClienteBuilder().buildFromObject(element).Build())
            });

        }
        return x
    }

}
