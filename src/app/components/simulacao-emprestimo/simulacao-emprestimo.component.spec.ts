import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulacaoEmprestimoComponent } from './simulacao-emprestimo.component';

describe('SimulacaoEmprestimoComponent', () => {
  let component: SimulacaoEmprestimoComponent;
  let fixture: ComponentFixture<SimulacaoEmprestimoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SimulacaoEmprestimoComponent]
    });
    fixture = TestBed.createComponent(SimulacaoEmprestimoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
