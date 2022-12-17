import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapasWebService } from '../../../services/WebServices/mapas-web.service';
import { SwalPopupService } from '../../../services/LocalServices/swal-popup.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import * as L from 'leaflet';


const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, AfterViewInit {

  /** Formulario reactivo */
  public formCreateMarker!: FormGroup;
  public formEditMarker!: FormGroup;

  public listActive = true;
  private map!: L.Map;

  /** Marcadores */
  public polygonsMarker: any = [];
  public markers: any;

  /** Listado de cards a mostrar */
  public listCards = [
    {
      id: 0,
      name: 'MAPA',
      color: '#3ABCB1',
    },
    {
      id: 1,
      name: 'LISTA',
      color: '#9F84F9',
    }
  ];

  /** Id del card seleccionado */
  public idCardSelected: any = this.listCards[0];

  /** Marker editable */
  public editMarkerSelected: any = null;

  constructor(
    private mapassWeb: MapasWebService,
    private formBuilder: FormBuilder,
    private toast: SwalPopupService
  ) { }

  ngOnInit(): void {
    this.init();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  /** Inicializamos el mapa */
  private initMap(): void {
    this.map = L.map('map', {
      center: [6.3411316, -75.5733084],
      zoom: 3
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);
    /** Click marcador */
    this.map.on('click', (e) => {
      this.setFormEditMarker(e.latlng, "insert");
    })
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.markers, event.previousIndex, event.currentIndex);
    this.addMarkersOnMap(this.map);
  }

  /** Llama las funciones iniciales necesarias */
  init = () => {
    this.initForms();
    this.getMarker();
  }

  /** Inicializa los formularios */
  initForms = () => {
    this.formCreateMarker = this.formBuilder.group({
      lat: ['', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
      lon: ['', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
    });
    this.formEditMarker = this.formBuilder.group({
      id_marker: ['', Validators.required],
      lat: ['', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
      lon: ['', [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]],
    });
  };

  /** Añade marcadores al mapa */
  addMarkersOnMap(map: L.Map): void {
    this.polygonsMarker = [];
    this.markers.forEach((elm: { latitud: number; longitud: number; }, key: string | number) => {
      const point = L.marker([+elm.latitud, +elm.longitud]).bindTooltip(`<h5 style="margin:0; padding:0">Coordenadas</h5><b>Lat:</b> ${elm.latitud}<br><b>Lon:</b> ${elm.longitud}`).openTooltip();
      this.polygonsMarker[key] = [elm.latitud, elm.longitud];
      point.addTo(map);
    });
    this.createPolygons();
  }

  /** Genera el poligono con los puntos */
  createPolygons = () => {
    if (this.markers.length > 2) {
      let polygon = L.polygon(this.polygonsMarker, { color: '#3ABCB1' }).addTo(this.map);
      this.map.fitBounds(polygon.getBounds());
    }
  }

  /** Trae la información */
  getMarker = () => {
    this.markers = [];
    this.mapassWeb.getMarker().subscribe((response: any) => {
      if (response['status'] == 1) {
        this.markers = response['message'];
        this.addMarkersOnMap(this.map);
      }
    });
  }

  /** Añadir punto */
  addMarker = () => {
    if (this.formCreateMarker.valid) {
      this.mapassWeb.addMarker(this.formCreateMarker.value).subscribe((response: any) => {
        if (response['status'] == 1) {
          this.toast.setToastPopup('Punto añadido correctamente', 'success');
          this.formCreateMarker.reset();
          this.getMarker();
        } else {
          this.toast.setToastPopup('No se pudo añadir', 'danger');
        }
      })
    } else {
      this.toast.setToastPopup('Valida los valores ingresado, deben ser númericos y requeridos *', 'danger');
    }
  }

  /** Editar punto */
  editMarker = () => {
    if (this.formEditMarker.valid) {
      if (this.formEditMarker.get("lat")?.value != this.editMarkerSelected.latitud || this.formEditMarker.get("lon")?.value != this.editMarkerSelected.longitud) {
        this.mapassWeb.editMarker(this.formEditMarker.value).subscribe((res: any) => {
          if (res.status == 1) {
            this.toast.setToastPopup('Punto añadido correctamente', 'success');
            this.getMarker();
          } else {
            this.toast.setToastPopup('No se pudo añadir', 'danger');
          }
          this.editMarkerSelected = null;
        })
      } else {
        this.toast.setToastPopup('Los valores no han cambiado...', 'danger');
      }
    } else {
      this.toast.setToastPopup('Valida todos los campos requeridos.*', 'danger');
    }
  }

  /** Eliminar punto */
  deleteMarker = (id: any) => {
    this.toast.showModalConfirm('Esta seguro de eliminar este marcador?', '', (response: any) => {
      if (response.isConfirmed) {
        const params = new FormData();
        params.append("id_marker", id);
        this.mapassWeb.deleteMarker(params).subscribe((res: any) => {
          if (res["status"] == 1) {
            this.toast.setToastPopup('Punto eliminado satifactoriamente!', 'success');
            this.getMarker();
          } else {
            this.toast.setToastPopup('No se pudo eliminar', 'danger');
          }
        })
      }
    })
  }

  /** Inicializar formulario con valores de punto a editar */
  setFormEditMarker = (marker: any, type = "edit") => {
    if (type == "edit") {
      this.editMarkerSelected = marker;
      this.formEditMarker.get("id_marker")?.setValue(marker.id_marker);
      this.formEditMarker.get("lat")?.setValue(+marker.latitud);
      this.formEditMarker.get("lon")?.setValue(+marker.longitud);
    } else {
      this.formCreateMarker.get("lat")?.setValue(+marker.lat);
      this.formCreateMarker.get("lon")?.setValue(+marker.lng);
      this.toast.setToastPopup('Punto capturado puedes insertarlo', 'success');
    }
  }

  /** Cambia el tab seleccionado */
  changeTab = (card: any) => {
    if (this.idCardSelected.id != card.id) {
      this.idCardSelected = card;
      if (card.id == 0) setTimeout(() => { this.initMap(); this.addMarkersOnMap(this.map) }, 0)
      // if (card.id == 1) this.getMarker();
    }
  }
}
