import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';
import { Produto, SimulacaoRequest } from '../models/models';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService]
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get produtos', () => {
    const mockProdutos: Produto[] = [
      { id: 1, nome: 'Teste', taxaAnual: 15.0, prazoMaximo: 24 }
    ];

    service.getProdutos().subscribe(produtos => {
      expect(produtos).toEqual(mockProdutos);
    });

    const req = httpMock.expectOne('http://localhost:3000/produtos');
    expect(req.request.method).toBe('GET');
    req.flush(mockProdutos);
  });

  it('should create produto', () => {
    const mockProduto: Produto = {
      nome: 'Novo Produto',
      taxaAnual: 18.0,
      prazoMaximo: 36
    };

    const mockResponse: Produto = { ...mockProduto, id: 1 };

    service.createProduto(mockProduto).subscribe(produto => {
      expect(produto).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/produtos');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduto);
    req.flush(mockResponse);
  });

  it('should simulate emprestimo', () => {
    const mockProduto: Produto = {
      id: 1,
      nome: 'Empréstimo Teste',
      taxaAnual: 12.0,
      prazoMaximo: 24
    };

    const simulacaoRequest: SimulacaoRequest = {
      produtoId: 1,
      valor: 10000,
      meses: 12
    };

    service.simularEmprestimo(simulacaoRequest).subscribe(resultado => {
      expect(resultado).toBeDefined();
      expect(resultado.produto).toEqual(mockProduto);
      expect(resultado.valorSolicitado).toBe(10000);
      expect(resultado.prazo).toBe(12);
      expect(resultado.memoriaCalculo).toHaveSize(12);
    });

    const req = httpMock.expectOne('http://localhost:3000/produtos/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockProduto);
  });

  it('should calculate simulation correctly', () => {
    const mockProduto: Produto = {
      id: 1,
      nome: 'Empréstimo Teste',
      taxaAnual: 12.0,
      prazoMaximo: 24
    };

    const simulacaoRequest: SimulacaoRequest = {
      produtoId: 1,
      valor: 1000,
      meses: 2
    };

    service.simularEmprestimo(simulacaoRequest).subscribe(resultado => {
      expect(resultado.memoriaCalculo[0].mes).toBe(1);
      expect(resultado.memoriaCalculo[1].mes).toBe(2);
      expect(resultado.memoriaCalculo[1].saldoDevedor).toBeCloseTo(0, 1);
    });

    const req = httpMock.expectOne('http://localhost:3000/produtos/1');
    req.flush(mockProduto);
  });
});