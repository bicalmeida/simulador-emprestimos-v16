import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Produto, SimulacaoResponse } from '../../models/models';

@Component({
  selector: 'app-simulacao-emprestimo',
  template: `
    <div class="header">
      <button class="back-button" (click)="goBack()">
        ← Simular Empréstimo
      </button>

        <button class="menu-button" (click)="toggleMenu()">☰</button>


     <div class="dropdown-menu" [class.show]="isMenuOpen">
        <div class="menu-item" (click)="navigateToAndCloseMenu('/')">
          Página Inicial
        </div>
        <div class="menu-item" (click)="navigateToAndCloseMenu('/cadastro-produto')">
          Cadastrar Produtos
        </div>
        <div class="menu-item" (click)="navigateToAndCloseMenu('/listagem-produto')">
          Produtos Cadastrados
        </div>
        <div class="menu-item" (click)="navigateToAndCloseMenu('/simulacao-emprestimo')">
          Simular Empréstimos
        </div>
            </div>

    </div>

    <div class="simulation-container">
      <form [formGroup]="simulacaoForm" (ngSubmit)="onSubmit()" *ngIf="!simulacaoResult">
        <div class="form-group">
          <label for="produto">Selecione o Produto</label>
          <select id="produto" formControlName="produtoId">
            <option value="">Produto</option>
            <option *ngFor="let produto of produtos" [value]="produto.id">
              {{ produto.nome }}
            </option>
          </select>
          <div class="error" *ngIf="simulacaoForm.get('produtoId')?.touched && simulacaoForm.get('produtoId')?.errors?.['required']">
            Produto é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label for="valor">Valor do Empréstimo</label>
          <input 
            type="number" 
            id="valor"
            formControlName="valor"
            placeholder="R$ 0,00"
            step="0.01"
            min="0"
          />
          <div class="error" *ngIf="simulacaoForm.get('valor')?.touched && simulacaoForm.get('valor')?.errors?.['required']">
            Valor é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label for="meses">Total de Meses</label>
          <input 
            type="number" 
            id="meses"
            formControlName="meses"
            placeholder="Total de meses"
            min="1"
            [max]="maxMeses"
          />
          <div class="error" *ngIf="simulacaoForm.get('meses')?.touched && simulacaoForm.get('meses')?.errors?.['required']">
            Número de meses é obrigatório
          </div>
          <div class="error" *ngIf="simulacaoForm.get('meses')?.touched && simulacaoForm.get('meses')?.errors?.['max']">
            Máximo de {{ maxMeses }} meses para este produto
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="simulate-button" [disabled]="!simulacaoForm.valid || isLoading">
            {{ isLoading ? 'Simulando...' : 'Simular' }}
          </button>
        </div>
      </form>

      <div class="result-container" *ngIf="simulacaoResult">
        <div class="result-header">
          <h2>Resultado da Simulação</h2>
          <button class="new-simulation-button" (click)="novaSimulacao()">Nova Simulação</button>
        </div>

        <div class="result-summary">
          <div class="summary-item">
            <span class="label">Produto:</span>
            <span class="value">{{ simulacaoResult.produto.nome }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Valor solicitado:</span>
            <span class="value">{{ simulacaoResult.valorSolicitado | currency:'BRL':'symbol':'1.2-2' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Prazo:</span>
            <span class="value">{{ simulacaoResult.prazo }} meses</span>
          </div>
          <div class="summary-item">
            <span class="label">Taxa efetiva mensal:</span>
            <span class="value">{{ simulacaoResult.taxaMensal }}%</span>
          </div>
          <div class="summary-item">
            <span class="label">Parcela mensal:</span>
            <span class="value highlight">{{ simulacaoResult.parcelaMensal | currency:'BRL':'symbol':'1.2-2' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Valor total com juros:</span>
            <span class="value">{{ simulacaoResult.valorTotalComJuros | currency:'BRL':'symbol':'1.2-2' }}</span>
          </div>
        </div>

        <div class="memory-calculation">
          <h3>Memória de Cálculo</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Mês</th>
                  <th>Juros</th>
                  <th>Amortização</th>
                  <th>Saldo Devedor</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let parcela of simulacaoResult.memoriaCalculo">
                  <td>{{ parcela.mes }}</td>
                  <td>{{ parcela.juros | currency:'BRL':'symbol':'1.2-2' }}</td>
                  <td>{{ parcela.amortizacao | currency:'BRL':'symbol':'1.2-2' }}</td>
                  <td>{{ parcela.saldoDevedor | currency:'BRL':'symbol':'1.2-2' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
      </div>
<div class="page-container">
      <div class="loading-container" *ngIf="isLoadingProdutos">
        <p>Carregando produtos...</p>
      </div>
</div>
      <div class="no-products" *ngIf="!isLoadingProdutos && produtos.length === 0">
        <p>Nenhum produto cadastrado ainda.</p>
        <button class="add-product-button" (click)="goToCadastro()">
          Cadastrar Primeiro Produto
        </button>
      </div>
    </div>
  `,
  styles: [`
    
    .menu-button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }


    .dropdown-menu {
      position: absolute;
      top: 67px;
      right: 10px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(63, 81, 181, 0.4);
      min-width: 200px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
      z-index: 1000;
    }

    .dropdown-menu.show {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }


    .menu-item {
      padding: 15px 20px;
      color: #005CA9;
      transition: background-color 0.2s ease;
      font-weight: 500;
      text-align: left;
      border-bottom: 1px solid #f0f0f0;
    }

    .menu-item:last-child {
      border-bottom: none;
      border-radius: 0 0 8px 8px;
    }

    .menu-item:first-child {
      border-radius: 8px 8px 0 0;
    }

    .menu-item:hover {
      background-color: #f3f4fe;
      color: #005CA9;
    }

    
    .header {
      background-color: #005CA9;
      color: white;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .back-button {
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    }

    .menu-button {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }

    .simulation-container {
      padding: 20px;
      background: #f5f5f5;
      min-height: calc(100vh - 70px);
      margin: 0 auto;
    }

    .form-group {
      margin-bottom: 20px;
          }

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    input, select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
      background: white;
    }

    input:focus, select:focus {
      outline: none;
      border-color: #005CA9;
    }

    .form-actions {
      text-align: center;
      margin-top: 30px;
    }

    .simulate-button {
      background: #f39200;
      color: white;
      border: none;
      padding: 15px 40px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 18px;
      font-weight: bold;
      transition: background-color 0.3s ease;
    }

    .simulate-button:hover:not(:disabled) {
      background: #f39200;
    }

    .simulate-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .result-container {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #eee;
    }

    .result-header h2 {
      margin: 0;
      color: #005CA9;
    }

    .new-simulation-button {
      background: #005CA9;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }

    .new-simulation-button:hover {
      background: #005CA9;
    }

    .result-summary {
      margin-bottom: 30px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
    }

    .summary-item:last-child {
      border-bottom: none;
    }

    .label {
      font-weight: 500;
      color: #005CA9;
    }

    .value {
      font-weight: 600;
      color: #333;
    }

    .value.highlight {
      color: #f39200;
      font-size: 18px;
    }

    .memory-calculation h3 {
      color: #005CA9;
      margin-bottom: 20px;
    }

    .table-container {
      overflow-x: auto;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
    }

    th {
      background: #005CA9;
      color: white;
      padding: 12px;
      text-align: left;
      font-weight: 600;
    }

    td {
      padding: 12px;
      border-bottom: 1px solid #eee;
    }

    tbody tr:hover {
      background: #f9f9f9;
    }

    tbody tr:last-child td {
      border-bottom: none;
    }

    .error {
      color: #d93636;
      font-size: 14px;
      margin-top: 5px;
    }

    .error-message {
      background: #d93636;
      color: white;
      padding: 15px;
      border-radius: 4px;
      text-align: center;
      margin-top: 20px;
    }

.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
}

    .loading-container {
      text-align: center;
      padding: 50px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .loading-container p {
      font-size: 18px;
      color: #666;
    }

    .no-products {
      text-align: center;
      padding: 50px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .no-products p {
      font-size: 18px;
      color: #666;
      margin-bottom: 20px;
    }

    .add-product-button {
      background: #005CA9;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background-color 0.3s ease;
    }

    .add-product-button:hover {
      background: #005CA9;
    }

    @media (max-width: 768px) {
      .simulation-container {
        padding: 15px;
      }

      .result-header {
        flex-direction: column;
        gap: 15px;
        align-items: flex-start;
      }

      .new-simulation-button {
        width: 100%;
      }

      .summary-item {
        flex-direction: column;
        gap: 5px;
      }

      .table-container {
        font-size: 14px;
      }

      th, td {
        padding: 8px 4px;
      }

      .simulate-button {
        width: 100%;
        padding: 15px;
      }
    }

    @media (max-width: 480px) {
      .header {
        padding: 10px 15px;
      }

      .back-button {
        font-size: 16px;
      }

      th, td {
        padding: 6px 2px;
        font-size: 12px;
      }

      .value.highlight {
        font-size: 16px;
      }
    }
  `]
})
export class SimulacaoEmprestimoComponent implements OnInit {
  simulacaoForm: FormGroup;
  produtos: Produto[] = [];
  simulacaoResult: SimulacaoResponse | null = null;
  isLoading = false;
  isLoadingProdutos = true;
  errorMessage = '';
  maxMeses = 0;
  isMenuOpen: boolean | undefined;  

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.simulacaoForm = this.fb.group({
      produtoId: ['', Validators.required],
      valor: ['', [Validators.required, Validators.min(0.01)]],
      meses: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadProdutos();
    this.setupFormValidation();
  }

  loadProdutos(): void {
    this.isLoadingProdutos = true;
    this.errorMessage = '';

    this.apiService.getProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.isLoadingProdutos = false;
      },
      error: (error) => {
        this.isLoadingProdutos = false;
        this.errorMessage = 'Erro ao carregar produtos. Verifique se a API está rodando.';
        console.error('Erro ao carregar produtos:', error);
      }
    });
  }

  setupFormValidation(): void {
    this.simulacaoForm.get('produtoId')?.valueChanges.subscribe(produtoId => {
      if (produtoId) {
        const produto = this.produtos.find(p => p.id == produtoId);
        if (produto) {
          this.maxMeses = produto.prazoMaximo;
          const mesesControl = this.simulacaoForm.get('meses');
          mesesControl?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(produto.prazoMaximo)
          ]);
          mesesControl?.updateValueAndValidity();
        }
      } else {
        this.maxMeses = 0;
        const mesesControl = this.simulacaoForm.get('meses');
        mesesControl?.setValidators([
          Validators.required,
          Validators.min(1)
        ]);
        mesesControl?.updateValueAndValidity();
      }
    });
  }

  onSubmit(): void {
    if (this.simulacaoForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const simulacaoData = {
        produtoId: Number(this.simulacaoForm.value.produtoId),
        valor: Number(this.simulacaoForm.value.valor),
        meses: Number(this.simulacaoForm.value.meses)
      };

      // Validação adicional
      if (simulacaoData.valor <= 0) {
        this.errorMessage = 'Valor deve ser maior que zero';
        this.isLoading = false;
        return;
      }

      if (simulacaoData.meses <= 0) {
        this.errorMessage = 'Número de meses deve ser maior que zero';
        this.isLoading = false;
        return;
      }

      this.apiService.simularEmprestimo(simulacaoData).subscribe({
        next: (resultado) => {
          this.isLoading = false;
          this.simulacaoResult = resultado;
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao realizar simulação. Tente novamente.';
          console.error('Erro na simulação:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.simulacaoForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  novaSimulacao(): void {
    this.simulacaoResult = null;
    this.simulacaoForm.reset();
    this.errorMessage = '';
    this.maxMeses = 0;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  goToCadastro(): void {
    this.router.navigate(['/cadastro-produto']);
  }

      navigateTo(route: string): void {
          this.router.navigate([route]);
        }
      
        toggleMenu(): void {
          this.isMenuOpen = !this.isMenuOpen;
        }
      
        navigateToAndCloseMenu(route: string): void {
          this.isMenuOpen = false;
          this.router.navigate([route]);
        }
      
        @HostListener('document:click', ['$event'])
        onDocumentClick(event: Event): void {
          const target = event.target as HTMLElement;
          const menuButton = document.querySelector('.menu-button');
          const dropdownMenu = document.querySelector('.dropdown-menu');
          
          if (!menuButton?.contains(target) && !dropdownMenu?.contains(target)) {
            this.isMenuOpen = false;
          }
        }
}