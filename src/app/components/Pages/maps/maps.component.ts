import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MapasWebService } from '../../../services/WebServices/mapas-web.service';
import { SwalPopupService } from '../../../services/LocalServices/swal-popup.service';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  /** Formulario reactivo */
  public formCreateMarker!: FormGroup;
  public formEditMarker!: FormGroup;


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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.markers, event.previousIndex, event.currentIndex);
  }

  init = () => {
    this.initForms();
    this.getMarker();
  }

  /** Inicializa los formularios */
  initForms = () => {
    this.formCreateMarker = this.formBuilder.group({
      lat: ['', [Validators.required]],
      lon: ['', [Validators.required]],
    });
    this.formEditMarker = this.formBuilder.group({
      id_marker: ['', Validators.required],
      lat: ['', [Validators.required]],
      lon: ['', [Validators.required]],
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
      this.toast.setToastPopup('Valida todos los campos requeridos.*', 'danger');
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
  setFormEditMarker = (marker: any) => {
    this.editMarkerSelected = marker;
    this.formEditMarker.get("id_marker")?.setValue(marker.id_marker);
    this.formEditMarker.get("lat")?.setValue(+marker.latitud);
    this.formEditMarker.get("lon")?.setValue(+marker.longitud);
  }
}
