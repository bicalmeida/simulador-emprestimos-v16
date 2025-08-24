import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Produto, SimulacaoRequest, SimulacaoResponse } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  private idMapping = new Map<number, string>(); // Mapeia ID numérico -> ID string do backend

  constructor(private http: HttpClient) {}

  // Produtos
  getProdutos(): Observable<Produto[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produtos`).pipe(
      map(produtos => produtos.map(produto => {
        const numericId = this.convertToNumericId(produto.id);
        this.idMapping.set(numericId, produto.id.toString());
        return {
          ...produto,
          id: numericId
        };
      }))
    );
  }

  createProduto(produto: Produto): Observable<Produto> {
    return this.http.post<any>(`${this.baseUrl}/produtos`, produto).pipe(
      map(response => {
        const numericId = this.convertToNumericId(response.id);
        this.idMapping.set(numericId, response.id.toString());
        return {
          ...response,
          id: numericId
        };
      })
    );
  }

  getProdutoById(id: number): Observable<Produto> {
    // Usa o ID original do backend para a requisição
    const backendId = this.idMapping.get(id) || id.toString();
    
    return this.http.get<any>(`${this.baseUrl}/produtos/${backendId}`).pipe(
      map(produto => ({
        ...produto,
        id: this.convertToNumericId(produto.id)
      }))
    );
  }

  // Método para converter IDs alfanuméricos em números consistentes
  private convertToNumericId(id: any): number {
    if (typeof id === 'number') {
      return id;
    }
    
    if (typeof id === 'string') {
      // Gera hash consistente da string
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        const char = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Converte para 32-bit integer
      }
      return Math.abs(hash);
    }
    
    return 0;
  }

  // Simulação
  simularEmprestimo(simulacao: SimulacaoRequest): Observable<SimulacaoResponse> {
    return this.getProdutoById(simulacao.produtoId).pipe(
      map(produto => this.calcularSimulacao(produto, simulacao.valor, simulacao.meses))
    );
  }

  private calcularSimulacao(produto: Produto, valor: number, meses: number): SimulacaoResponse {
    const taxaMensal = Math.pow(1 + produto.taxaAnual / 100, 1/12) - 1;
    const parcelaMensal = (valor * taxaMensal * Math.pow(1 + taxaMensal, meses)) / 
                         (Math.pow(1 + taxaMensal, meses) - 1);
    
    const memoriaCalculo = [];
    let saldoDevedor = valor;
    
    for (let mes = 1; mes <= meses; mes++) {
      const juros = saldoDevedor * taxaMensal;
      const amortizacao = parcelaMensal - juros;
      saldoDevedor = saldoDevedor - amortizacao;
      
      memoriaCalculo.push({
        mes,
        juros: Number(juros.toFixed(2)),
        amortizacao: Number(amortizacao.toFixed(2)),
        saldoDevedor: Number(Math.max(0, saldoDevedor).toFixed(2))
      });
    }
    
    return {
      produto,
      valorSolicitado: valor,
      prazo: meses,
      taxaMensal: Number((taxaMensal * 100).toFixed(2)),
      parcelaMensal: Number(parcelaMensal.toFixed(2)),
      valorTotalComJuros: Number((parcelaMensal * meses).toFixed(2)),
      memoriaCalculo
    };
  }
}