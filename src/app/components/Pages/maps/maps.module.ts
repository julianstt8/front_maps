import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MapsComponent } from './maps.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

const routes: Routes = [
  { path: '', component: MapsComponent },
];

const COMPONENTS = [
  MapsComponent
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), DragDropModule],
  declarations: [COMPONENTS],
})
export class MapsModule { }
