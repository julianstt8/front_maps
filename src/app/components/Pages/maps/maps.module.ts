import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MapsComponent } from './maps.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: MapsComponent },
];

const COMPONENTS = [
  MapsComponent
];

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes), DragDropModule, MatExpansionModule],
  declarations: [COMPONENTS],
})
export class MapsModule { }
