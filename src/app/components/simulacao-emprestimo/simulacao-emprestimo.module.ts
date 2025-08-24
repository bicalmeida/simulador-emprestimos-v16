// import { NgModule } from '@angular/core';
// import { BrowserModule } from '@angular/platform-browser';
// import { ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { AppRoutingModule } from '../../app-routing.module';
// import { CurrencyPipe } from '@angular/common';
// import { SimulacaoEmprestimoComponent } from './simulacao-emprestimo.component';
// import { CommonModule } from '@angular/common';
// import { AppComponent } from '../../app.component';

// @NgModule({
//   declarations: [AppComponent, SimulacaoEmprestimoComponent],
//   imports: [BrowserModule, ReactiveFormsModule, HttpClientModule, AppRoutingModule, CommonModule],
//   providers: [CurrencyPipe],
//   bootstrap: [AppComponent]
// })
// export class SimulacaoEmprestimoModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    // Remove AppComponent from declarations
  ],
  imports: [
    CommonModule
  ]
})
export class SimulacaoEmprestimoModule { }