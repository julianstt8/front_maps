import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapasWebService } from '../../../services/WebServices/mapas-web.service';
import { SwalPopupService } from '../../../services/LocalServices/swal-popup.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  /** Formulario reactivo */
  public formCreateMarker!: FormGroup;
  public formInitSession!: FormGroup;


  public markers: any;
  /** Listado de cards a mostrar */
  public listCards = [
    {
      id: 0,
      name: 'DASHBOARD',
      color: '#9F84F9',
    },
    {
      id: 1,
      name: 'MAPA',
      color: '#3ABCB1',
    },
    {
      id: 2,
      name: 'LISTA',
      color: '#3ABCB1',
    }
  ];

  /** Id del card seleccionado */
  public idCardSelected: any = this.listCards[0];



  constructor(
    private mapassWeb: MapasWebService,
    private formBuilder: FormBuilder,
    private toast: SwalPopupService
  ) { }

  ngOnInit(): void {
    this.init();
    this.getMarker();
  }

  init = () => {
    this.initForms();
  }

  /** Inicializa los formularios */
  initForms = () => {
    this.formCreateMarker = this.formBuilder.group({
      lat: ['', [Validators.required]],
      lon: ['', [Validators.required]],
    });
    this.formInitSession = this.formBuilder.group({
      cedula: ['', [Validators.required]],
      contrasena: ['', Validators.required],
    });
  };

  /** Trae la información */
  getMarker = () => {
    this.mapassWeb.getMarker().subscribe((response: any) => {
      if (response['status'] == 1) {
        this.markers = response['message'];
      }
    });
  }

  addMarker = () => {
    this.mapassWeb.addMarker(this.formCreateMarker.value).subscribe((response: any) => {
      if (response['status'] == 1) {
        this.toast.setToastPopup('Punto añadido correctamente', 'success');
      } else {
        this.toast.setToastPopup('No se pudo añadir', 'danger');
      }
    })
  }
}
