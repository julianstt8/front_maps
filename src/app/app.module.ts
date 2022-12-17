import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MapasWebService } from './services/WebServices/mapas-web.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    DragDropModule,
  ],
  providers: [MapasWebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
