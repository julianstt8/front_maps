import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapasWebService } from './services/WebServices/mapas-web.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatExpansionModule,
    AppRoutingModule,
    HttpClientModule,
    DragDropModule,
    BrowserModule
  ],
  providers: [MapasWebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
