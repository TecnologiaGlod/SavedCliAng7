import { Component, Inject, ViewEncapsulation, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA, MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Router } from '@angular/router';
import { E_Cliente } from 'app/Models/E_Cliente';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { E_SessionUser } from 'app/Models/E_SessionUser';
import { UserService } from '../../../ApiServices/UserService';
import { ClienteService } from 'app/ApiServices/ClienteService';
import { SelectionModel } from '@angular/cdk/collections';
import { DetallePedidoService } from 'app/ApiServices/DetallePedidoService';
import { E_PLU } from 'app/Models/E_PLU';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ModalPopUpComponent } from '../ModalPopUp/modalpopup.component';
import { ExceptionErrorService } from 'app/ApiServices/ExceptionErrorService';
import { ErrorLogExcepcion } from 'app/Models/ErrorLogExcepcion';
import { E_PedidosCliente } from 'app/Models/E_PedidosCliente';
import { PedidoService } from 'app/ApiServices/PedidoService';
import { E_SessionEmpresaria } from 'app/Models/E_SessionEmpresaria';
import { PLUBuilder } from 'app/Builders/PLU.model.builder';
import { E_PedidosDetalleCliente } from 'app/Models/E_PedidosDetalleCliente';
import { PedidosDetalleClienteBuilder } from 'app/Builders/PedidosDetalleCliente.model.builder';
import { PedidosClienteBuilder } from 'app/Builders/PedidosCliente.model.builder';
import { ResumenPedidoComponent } from '../ResumenPedido/resumenpedido.component';
import { E_Error } from 'app/Models/E_Error';
import { RenderDeleteComponent } from './render-delete/render-delete.component';
import { E_Parametros } from 'app/Models/E_Parametros';
import { ParametrosEnum } from 'app/Enums/Enumerations';
import { ParameterService } from 'app/ApiServices/ParametersServices';
import { ModalPopUpPedidoComponent } from '../ModalPopUpPedido/modalpopuppedido.component';
import { RenderDisponibleComponent } from './render-disponible/render-disponible.component';

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
];

//const ELEMENT_DATA_PLU: ListElementArticulo[] =  [];
/*[
  { Cantidad: '1', PrecioCatalogoTotalConIVA: '4', CodigoRapido: '7', NombreProducto: '10', PrecioConIVA:'13', PorcentajeDescuento:'16',  PrecioEmpre:'19', PrecioPuntos:'22'},
  { Cantidad: '2', PrecioCatalogoTotalConIVA: '5', CodigoRapido: '8', NombreProducto: '11', PrecioConIVA:'14', PorcentajeDescuento:'17',  PrecioEmpre:'20', PrecioPuntos:'23'},
  { Cantidad: '3', PrecioCatalogoTotalConIVA: '6', CodigoRapido: '9', NombreProducto: '12', PrecioConIVA:'15', PorcentajeDescuento:'18',  PrecioEmpre:'21', PrecioPuntos:'24'},
  
];*/



/*
[
  { Cantidad: '', PrecioCatalogoTotalConIVA: '', CodigoRapido: '', NombreProducto: '', PrecioConIVA:'', PorcentajeDescuento:'',  PrecioEmpre:'', PrecioPuntos:''},
  
];*/

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface ListElementArticulo {
  Cantidad: string;
  PrecioCatalogoTotalConIVA: string;
  CodigoRapido: string;
  NombreProducto: string;
  PrecioConIVA: string;
  PorcentajeDescuento: string;
  PrecioEmpre: string;
  PrecioPuntos: string;
}


export interface DialogData {
  Titulo: string;
  Mensaje: string;
  TipoMensaje: string;
  TipoEnvio: string;
  CodCiudadDespacho: string;
  ValorFleteCobrar: number;
}

@Component({
  selector: 'detallepedido',
  templateUrl: 'detallepedido.component.html',
  styleUrls: ['detallepedido.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class DetallePedidoComponent implements OnInit {

  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  // const ELEMENT_DATA_PLU = this.DetallePedidoService.GetCurrentDetallePedido();
  displayedColumns =
    ['select', 'CodigoRapido', 'NombreProducto', 'Cantidad', 'PrecioCatalogoTotalConIVA',
      'PrecioConIVA', 'PorcentajeDescuento', 'PrecioPuntos', 'star'];
  //['select', 'name', 'position', 'weight', 'symbol', 'position', 'weight', 'symbol', 'star'];
  //dataSource = ELEMENT_DATA;
  dataSource = this.DetallePedidoService.GetCurrentDetallePedido();;



  //*displayedColumns = ['Documento', 'NombreCompleto', 'NombreCompleto1', 'NombreCompleto2', 'NombreCompleto3','Ciudad'];
  //*dataSource: MatTableDataSource<E_Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  public SessionUser: E_SessionUser = new E_SessionUser()
  public SessionEmpresaria: E_SessionEmpresaria = new E_SessionEmpresaria()
  public ListClientes: Array<E_Cliente> = new Array<E_Cliente>()

  TextColor: any
  form: FormGroup;

  //public data: DialogData[];

  public Cantidad: number = 1;
  public PrecioCatalogoTotalConIVA: number = 0;
  public CantidadArticulos: number = 0;
  public TotalPagar: number = 0;

  public PrecioEmpresariaTotalConIVA: number = 0;
  public PrecioPuntosTotal: number = 0;
  public PuntosUsar: number = 0; //Lo que retorna del resumen
  public DescuentoPuntosUsar: number = 0;//Lo que retorna del resumen
  public TotalPagarUsar: number = 0;//Lo que retorna del resumen
  public PuntosGanadosUsar: number = 0;//Lo que retorna del resumen
  public ValorPagarPagoPuntosUsar: number = 0;//Lo que retorna del resumen
  public AplicarPuntosGanados: boolean = true;//Lo que retorna del resumen
  public PagarFletePuntos: boolean = false;//Lo que retorna del resumen
  public ValorMinimoParaPuntos: number = 0;
  public ValorFletePuntos: number = 0;

  public gridApi;
  public gridColumnApi;

  public columnDefs;
  public rowData: Array<E_PLU> = new Array<E_PLU>();

  constructor(private formBuilder: FormBuilder,
    private UserService: UserService,
    private ClienteService: ClienteService,
    private DetallePedidoService: DetallePedidoService,
    private bottomSheetRef: MatBottomSheetRef<DetallePedidoComponent>,
    private Matdialog: MatDialog,
    public dialog: MatDialog,
    public dialog2: MatDialog,
    private ExceptionErrorService: ExceptionErrorService,
    private PedidoService: PedidoService,
    private ParameterService: ParameterService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: DialogData,
  ) {
    this.columnDefs = [
      {
        headerName: 'Eliminar', width: 80, field: 'Modificar', cellRendererFramework: RenderDeleteComponent,
        cellRendererParams: { action: this.clickAuction }
      },
      {
        headerName: 'Disponible', width: 85, field: 'Disponible', cellRendererFramework: RenderDisponibleComponent,
        cellRendererParams: { action: this.clickAuction }
      },
      { headerName: 'Cod Rapido', width: 80, field: 'CodigoRapido' },
      { headerName: 'Nombre', field: 'NombreProducto', sortable: true, filter: true },
      { headerName: 'Cantidad', width: 60, field: 'Cantidad' },
      { headerName: 'Prec Emp', width: 80, field: 'PrecioEmpresaria' },
      { headerName: 'Prec Cat', width: 80, field: 'PrecioConIVA' },
      { headerName: '% Descuento', width: 80, field: 'PorcentajeDescuento' },
      { headerName: 'Prec Puntos', width: 90, field: 'PrecioPuntos' }

    ];


  }


  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.rowData = this.DetallePedidoService.GetCurrentDetallePedido();;
    /*params.api.sizeColumnsToFit();

    params.api.sizeColumnsToFit();
    window.addEventListener("resize", function() {
      setTimeout(function() {
        params.api.sizeColumnsToFit();
      });
    });*/
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }






  clickAuction(para) {
  }

  public cargarDatos() {
    this.rowData = this.DetallePedidoService.GetCurrentDetallePedido();;
  }

  ngOnInit() {

    /* if (this.data.TipoMensaje == 'Error') {
       this.TextColor = 'blue';
     }
     else {
       this.TextColor = 'green';
     }*/
    this.rowData = this.DetallePedidoService.GetCurrentDetallePedido();;
    this.form = this.formBuilder.group({
      Cantidad: [undefined, [Validators.required]],


    });

    this.ConsultarParametroMinimoPuntos();
    this.ConsultarParametroValorPuntosFlete();

  }

  //selection = new SelectionModel<PeriodicElement>(true, []);
  selection = new SelectionModel<E_PLU>(true, []);

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.forEach(row => this.selection.select(row));
  }

  onClose(): void {
    this.bottomSheetRef.dismiss();
  }



  openVerResumenPedido(): void {

    this.SessionEmpresaria = this.UserService.GetCurrentCurrentEmpresariaNow();
    this.CalcularTotales();
    const dialogRef = this.dialog.open(ResumenPedidoComponent, {
      panelClass: 'knowledgebase-article-dialog', //MRG: poner este para el style del popup.
      data: {
        TipoMensaje: "Error", Titulo: "Resumen Pedido", Mensaje: "Resumen del Pedido.",
        Nit: this.SessionEmpresaria.DocumentoEmpresaria.trim(), NombreEmpresaria: this.SessionEmpresaria.NombreEmpresariaCompleto.trim(),
        TotalPrecioCatalogo: this.PrecioCatalogoTotalConIVA.toFixed(2), CantidadArticulos: this.CantidadArticulos,
        TotalPagar: this.PrecioEmpresariaTotalConIVA.toFixed(2), TusPuntos: this.SessionEmpresaria.PuntosEmpresaria, ValorPuntos: this.SessionEmpresaria.ValorPuntos,
        PrecioEmpresariaTotal: this.PrecioEmpresariaTotalConIVA.toFixed(2), PrecioPuntosTotal: this.PrecioPuntosTotal, DescuentoPts: 0,
        PuntosGanados: this.PuntosGanadosUsar, ValorPagarPagoPuntos: 0, ValorMinimoParaPuntos: this.ValorMinimoParaPuntos,
        ValorFleteCobrar: this.data.ValorFleteCobrar, ValorFletePuntosCobrar: this.ValorFletePuntos
      }
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result[0].PuntosUsar >= 0 && result[0].PuntosUsar != undefined) {
        this.PuntosUsar = result[0].PuntosUsar;
        this.DescuentoPuntosUsar = result[0].DescuentoPuntos;
        this.TotalPagarUsar = result[0].TotalPagar;
        this.PuntosGanadosUsar = result[0].PuntosGanados;
        this.ValorPagarPagoPuntosUsar = result[0].ValorPagarPagoPuntos;
        this.AplicarPuntosGanados = result[0].AplicarPuntosGanados;
        this.PagarFletePuntos = result[0].PagarFletePuntos;
        this.CrearPedido();
      }
    });

  }

  ConfirmDataEliminar() {
    this.confirmDialogRef = this.Matdialog.open(FuseConfirmDialogComponent, {})
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de eliminar los articulos seleccionados?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) { this.EliminarArticulos() }
      this.confirmDialogRef = null;
    });
  }

  EliminarArticulos() {
    this.DetallePedidoService.ClearCurrentDetallePedido();
    this.UserService.ClearCurrentCurrentEmpresariaNow();
  }


  ConfirmData() {
    this.confirmDialogRef = this.Matdialog.open(FuseConfirmDialogComponent, {})
    this.confirmDialogRef.componentInstance.confirmMessage = '¿Estas seguro de enviar el pedido?';
    this.confirmDialogRef.afterClosed().subscribe(result => {
      if (result) { this.CrearPedido() }
      this.confirmDialogRef = null;
    });
  }

  CalcularTotales() {

    //******************************************************** */
    //Calcula los totales del pedido.
    var CantidadArticulosSum = 0;
    var Valor = 0;
    var ValorPrecioCat = 0;
    var objDetallePedidoService: Array<E_PLU> = new Array<E_PLU>()
    objDetallePedidoService = this.DetallePedidoService.GetCurrentDetallePedido()
    var ValorPrecioEmp = 0;
    var ValorPuntos = 0;
    var PuntosGanadosTotal = 0;

    if (objDetallePedidoService != null) {
      objDetallePedidoService.forEach((element) => {

        if (element.Cantidad > 0) {

          ValorPrecioCat = ValorPrecioCat + element.PrecioCatalogoTotalConIVA;
          ValorPrecioEmp = ValorPrecioEmp + element.PrecioEmpresaria;
          ValorPuntos = ValorPuntos + element.PrecioPuntos;
          CantidadArticulosSum = CantidadArticulosSum + element.Cantidad;

          PuntosGanadosTotal = PuntosGanadosTotal + element.PuntosGanados;

          this.PrecioEmpresariaTotalConIVA = ValorPrecioEmp;
          this.PrecioPuntosTotal = ValorPuntos;

          this.PrecioCatalogoTotalConIVA = ValorPrecioCat;
          this.CantidadArticulos = CantidadArticulosSum;
          this.TotalPagar = Valor;
          this.PuntosGanadosUsar = PuntosGanadosTotal;
        }
      });

    }
  }


  CrearPedido() {
    var NumeroPedidoGuardado = "";
    const dialogRef = this.dialog2.open(ModalPopUpPedidoComponent, {
      width: '450px',
      data: { spinerr: true }
    });
    this.bottomSheetRef.dismiss();
    try {

      //******************************************************** */
      //Calcula los totales del pedido.

      var TotalPuntosPedidoSum = 0;
      var CantidadArticulosSum = 0;
      var IVA = 0;
      var Valor = 0;

      var ValorPrecioCatSinIVA = 0;
      var ValorPrecioEmpSinIVA = 0;
      var IVAPrecioCat = 0;
      var IVAPrecioEmp = 0;
      var ValorPuntos = 0;
      var objDetallePedidoService: Array<E_PLU> = new Array<E_PLU>()
      objDetallePedidoService = this.DetallePedidoService.GetCurrentDetallePedido()

      if (objDetallePedidoService != null) {
        objDetallePedidoService.forEach((element) => {

          ValorPrecioCatSinIVA = ValorPrecioCatSinIVA + element.PrecioCatalogoSinIVA;
          IVAPrecioCat = IVAPrecioCat + element.IVAPrecioCatalogo;

          ValorPrecioEmpSinIVA = ValorPrecioEmpSinIVA + element.PrecioEmpresariaSinIVA;
          IVAPrecioEmp = IVAPrecioEmp + element.IVAPrecioEmpresaria;


          ValorPuntos = ValorPuntos + element.PrecioPuntos;
          CantidadArticulosSum = CantidadArticulosSum + element.Cantidad;

        });

      }

      //******************************************************** */
      //INSERTA ENCABEZADO DEL PEDIDO
      this.SessionUser = this.UserService.GetCurrentCurrentUserNow()
      this.SessionEmpresaria = this.UserService.GetCurrentCurrentEmpresariaNow()
      var objPedidoRequest: E_PedidosCliente = new E_PedidosCliente()


      objPedidoRequest.Nit = this.SessionEmpresaria.DocumentoEmpresaria.trim();
      objPedidoRequest.IdVendedor = this.SessionUser.IdVendedor.trim();
      objPedidoRequest.IVA = IVAPrecioEmp; //valor del pedido * iva (16%). Solo para encabezado de pedido.
      objPedidoRequest.Valor = ValorPrecioEmpSinIVA; //valor total con iva incuido. Solo para encabezado de pedido.
      objPedidoRequest.ClaveUsuario = this.SessionUser.ClaveUsuario.trim();
      objPedidoRequest.Campana = this.SessionUser.Campana.trim();
      objPedidoRequest.IVAPrecioCat = IVAPrecioCat; //valor precio catalogo del pedido * iva (16%). Solo para encabezado de pedido.
      objPedidoRequest.ValorPrecioCat = ValorPrecioCatSinIVA; //valor precio catalogo total con iva incuido. Solo para encabezado de pedido.
      objPedidoRequest.Codigo = this.SessionUser.Catalogo.trim();//rcb_catalogo.SelectedValue;
      objPedidoRequest.Zona = this.SessionEmpresaria.IdZona.trim();
      objPedidoRequest.IdLider = this.SessionEmpresaria.Empresaria_Lider.trim();
      objPedidoRequest.TipoEnvio = Number(this.data.TipoEnvio);
      objPedidoRequest.CiudadDespacho = this.data.CodCiudadDespacho;
      objPedidoRequest.Asistente = this.SessionUser.Asistente;
      objPedidoRequest.ExcentoIVA = this.SessionEmpresaria.ExcentoIVA
      objPedidoRequest.CodCiudadCliente = this.SessionEmpresaria.CodCiudadCliente.trim();
      objPedidoRequest.PagarFletePuntos = this.PagarFletePuntos;
      objPedidoRequest.PuntosUsar = this.PuntosUsar;

      var objPedidoResponse: E_PedidosCliente = new E_PedidosCliente()
      this.PedidoService.GuardarEncabezadoPedido(objPedidoRequest)
        .subscribe((x: E_PedidosCliente) => {
          objPedidoResponse = x

          if (x.Error == undefined) {

            if (x.Numero != null && x.Numero != "") {
              NumeroPedidoGuardado = x.Numero;
              ///######################################################################################
              //INSERTA DETALLE DEL PEDIDO

              var objPedidoDetalleRequestArray: Array<E_PedidosDetalleCliente> = new Array<E_PedidosDetalleCliente>()
              var objPedidoDetalle: E_PedidosDetalleCliente = new E_PedidosDetalleCliente()

              if (objDetallePedidoService != null) {



                objDetallePedidoService.forEach((element) => {

                  //Si se paga con puntos se debe enviar el valor calculado menos los puntos usados.
                  if (this.ValorPagarPagoPuntosUsar > 0) {
                    objPedidoDetalle.Valor = element.PrecioEmpresariaSinIVA - (element.PrecioEmpresariaSinIVA * (this.DescuentoPuntosUsar / 100));
                  }
                  else {
                    objPedidoDetalle.Valor = element.PrecioEmpresariaSinIVA;
                  }

                  objPedidoDetalle.TarifaIVA = element.PorcentajeIVA;
                  objPedidoDetalle.ValorPrecioCatalogo = element.PrecioCatalogoSinIVA;
                  objPedidoDetalle.IVAPrecioCatalogo = element.IVAPrecioCatalogo;

                  objPedidoDetalle.PLU = element.PLU;
                  objPedidoDetalle.Cantidad = element.CantidadPedida;//element.Cantidad;
                  objPedidoDetalle.IdCodigoCorto = element.CodigoRapido;
                  objPedidoDetalle.CatalogoReal = element.CatalogoReal;

                  objPedidoDetalle.PorcentajeDescuento = element.PorcentajeDescuento;
                  objPedidoDetalle.PorcentajeDescuentoPuntos = this.DescuentoPuntosUsar;

                  //MRG: SOLO SI EL % DE DESCUENTO PUNTOS ES 100% EL VALOR DEL ARTICULO ES 0.
                  if (objPedidoDetalle.PorcentajeDescuentoPuntos == 100) {
                    objPedidoDetalle.Valor = 0;
                  }

                  if (this.AplicarPuntosGanados) {
                    objPedidoDetalle.PuntosGanados = Math.floor(element.PuntosGanados);
                  }
                  else {
                    objPedidoDetalle.PuntosGanados = 0;
                  }

                  objPedidoDetalle.PedidosClienteInfo = new E_PedidosCliente()
                  x.okTransEncabezadoPedido = true;
                  x.okTransDetallePedido = true;
                  x.PuntosUsar = this.PuntosUsar;
                  x.TotalPuntosPedido = TotalPuntosPedidoSum;
                  x.PagarFletePuntos = this.PagarFletePuntos;
                  objPedidoDetalle.PedidosClienteInfo = new PedidosClienteBuilder().buildFromObject(x).Build();

                  objPedidoDetalleRequestArray.push(new PedidosDetalleClienteBuilder().buildFromObject(objPedidoDetalle).Build());

                });

              }

              this.PedidoService.GuardarDetallePedido(objPedidoDetalleRequestArray)
                .subscribe((x: E_PedidosCliente) => {
                  objPedidoResponse = x

                  if (x.Error == undefined) {

                    ///[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]][][]
                    //REALIZAR RESERVA EN LINEA

                    this.PedidoService.GuardarReservaEnLinea(objPedidoDetalleRequestArray)
                      .subscribe((x: E_PedidosCliente) => {
                        objPedidoResponse = x

                        if (x.Error == undefined) {

                          //..............................................................
                          //Consulta el saldo a pagar x nit.
                          var SaldoPagarNit = "";
                          this.PedidoService.ConsultarSaldoAPagarxNit(objPedidoRequest)
                            .subscribe((y: E_PedidosCliente) => {
                              objPedidoResponse = y

                              if (y.Error == undefined) {
                                if (y.Saldo != -100) {
                                  SaldoPagarNit = y.Saldo.toString();
                                }
                                else {
                                  SaldoPagarNit = "Por favor Comuniquese con la empresa.";
                                }


                                this.dialog2.closeAll();
                                //Mensaje de OK
                                const dialogRef = this.dialog.open(ModalPopUpPedidoComponent, {
                                  width: '450px',
                                  data: { TipoMensaje: "Ok", Titulo: "Creación Pedido", Mensaje: "Se almacenó el pedido exitosamente! Numero Pedido: " + x.Numero, spinerr: false, Nit: "Documento: " + objPedidoRequest.Nit, NombreEmpresaria: "Nombre: " + this.SessionEmpresaria.NombreEmpresariaCompleto.toUpperCase(), NumeroPedidoReservado: NumeroPedidoGuardado, SaldoPagar: "Saldo a Pagar: $" + SaldoPagarNit }
                                });
                                this.bottomSheetRef.dismiss();
                                this.EliminarArticulos();
                              }
                            })
                          //..............................................................

                        }
                      })

                    ///[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]][][]
                  }
                })
              ///######################################################################################
            }
          }
          else {
            //---------------------------------------------------------------------------------------------------------------
            //Mensaje de Error. 
            const dialogRef = this.dialog.open(ModalPopUpComponent, {
              width: '450px',
              data: { TipoMensaje: "Error", Titulo: "Crear Pedido", Mensaje: "No se pudo crear Pedido. Error: 202." }
            });

            throw new ErrorLogExcepcion("DetallePedidoComponent", "CrearPedido()", x.Error.Descripcion, this.SessionUser.Cedula, this.ExceptionErrorService)
            //---------------------------------------------------------------------------------------------------------------
          }
        })

    }
    catch (error) {
      //---------------------------------------------------------------------------------------------------------------
      //Mensaje de Error.   
      throw new ErrorLogExcepcion("DetallePedidoComponent", "CrearPedido()", error.message, this.SessionUser.Cedula, this.ExceptionErrorService)
      //---------------------------------------------------------------------------------------------------------------
    }


  }

  //Consulta el valor mimino de la tabla parametros para otorgar puntos ganados.
  ConsultarParametroMinimoPuntos() {

    var objParametros: E_Parametros = new E_Parametros()
    objParametros.Id = ParametrosEnum.PedidoMinimoParaPuntos;
    this.ValorMinimoParaPuntos = 0;

    this.ParameterService.listarParametrosxId(objParametros)
      .subscribe((x: E_Parametros) => {
        if (x.Valor != undefined) {
          var MinimoPuntos = Number(x.Valor);
          if (MinimoPuntos > 0) {
            this.ValorMinimoParaPuntos = MinimoPuntos;
          }
        }
        else {
          this.ValorMinimoParaPuntos = 0;
        }
      })
  }


  //Consulta el valor del flete en puntos de la tabla parametros para pagar con puntos.
  ConsultarParametroValorPuntosFlete() {

    var objParametros: E_Parametros = new E_Parametros()
    objParametros.Id = ParametrosEnum.ValorFletePuntos;
    this.ValorFletePuntos = 0;

    this.ParameterService.listarParametrosxId(objParametros)
      .subscribe((x: E_Parametros) => {
        if (x.Valor != undefined) {
          var ValorPuntos = Number(x.Valor);
          if (ValorPuntos > 0) {
            this.ValorFletePuntos = ValorPuntos;
          }
        }
        else {
          this.ValorFletePuntos = 0;
        }
      })
  }



}
