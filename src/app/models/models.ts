export interface Produto {
  id?: number;
  nome: string;
  taxaAnual: number;
  prazoMaximo: number;
}

export interface SimulacaoRequest {
  produtoId: number;
  valor: number;
  meses: number;
}

export interface ParcelaMes {
  mes: number;
  juros: number;
  amortizacao: number;
  saldoDevedor: number;
}

export interface SimulacaoResponse {
  produto: Produto;
  valorSolicitado: number;
  prazo: number;
  taxaMensal: number;
  parcelaMensal: number;
  valorTotalComJuros: number;
  memoriaCalculo: ParcelaMes[];
}