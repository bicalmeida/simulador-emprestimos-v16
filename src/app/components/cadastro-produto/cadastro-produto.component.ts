import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-cadastro-produto',
  template: `
    <div class="header">
      <button class="back-button" (click)="goBack()">
        ← Cadastrar novo produto
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




    <div class="form-container">
      <form [formGroup]="produtoForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="nome">Nome do Produto</label>
          <input 
            type="text" 
            id="nome"
            formControlName="nome"
            placeholder="Digite o nome do produto"
          />
          <div class="error" *ngIf="produtoForm.get('nome')?.touched && produtoForm.get('nome')?.errors?.['required']">
            Nome é obrigatório
          </div>
        </div>

        <div class="form-group">
          <label for="taxaAnual">Taxa Anual de Juros</label>
          <input 
            type="number" 
            id="taxaAnual"
            formControlName="taxaAnual"
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          <div class="error" *ngIf="produtoForm.get('taxaAnual')?.touched && produtoForm.get('taxaAnual')?.errors?.['required']">
            Taxa anual é obrigatória
          </div>
        </div>

        <div class="form-group">
          <label for="prazoMaximo">Prazo Máximo em Meses</label>
          <input 
            type="number" 
            id="prazoMaximo"
            formControlName="prazoMaximo"
            placeholder="0"
            min="1"
          />
          <div class="error" *ngIf="produtoForm.get('prazoMaximo')?.touched && produtoForm.get('prazoMaximo')?.errors?.['required']">
            Prazo máximo é obrigatório
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="cancel-button" (click)="cancelar()">Cancelar</button>
          <button type="submit" class="save-button" [disabled]="!produtoForm.valid || isLoading">
            {{ isLoading ? 'Salvando...' : 'Salvar' }}
          </button>
        </div>
      </form>

      <div class="success-message" *ngIf="showSuccess">
        Produto cadastrado com sucesso!
      </div>

      <div class="error-message" *ngIf="errorMessage">
        {{ errorMessage }}
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

    .form-container {
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
      color: #005CA9;
    }

    input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
    }

    input:focus {
      outline: none;
      border-color: #005CA9;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }

    .cancel-button {
      background: #026173;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .save-button {
      background: #f39200;
      color: white;
      border: none;
      padding: 12px 30px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
    }

    .save-button:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error {
      color: red;
      font-size: 14px;
      margin-top: 5px;
    }

    .success-message {
      background: #179231;
      color: white;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
      text-align: center;
    }

    .error-message {
      background: #d93636;
      color: white;
      padding: 15px;
      border-radius: 4px;
      margin-top: 20px;
      text-align: center;
    }

    @media (max-width: 768px) {
      .form-container {
        padding: 15px;
      }

      .form-actions {
        flex-direction: column;
      }

      .cancel-button,
      .save-button {
        width: 100%;
      }
    }
  `]
})
export class CadastroProdutoComponent {
  produtoForm: FormGroup;
  isLoading = false;
  showSuccess = false;
  errorMessage = '';
  isMenuOpen: boolean | undefined;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      taxaAnual: ['', [Validators.required, Validators.min(0)]],
      prazoMaximo: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.produtoForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const produto = this.produtoForm.value;
      console.log('Enviando produto:', produto); // ← Debug: não deve ter ID
      
      this.apiService.createProduto(produto).subscribe({
        next: (response) => {
          console.log('Produto criado:', response); // ← Debug: veja o tipo do ID
          console.log('Tipo do ID:', typeof response.id);
          
          this.isLoading = false;
          this.showSuccess = true;
          this.produtoForm.reset();
          
          setTimeout(() => {
            this.showSuccess = false;
          }, 3000);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'Erro ao cadastrar produto. Tente novamente.';
          console.error('Erro:', error);
        }
      });
    }
  }

  cancelar(): void {
    this.produtoForm.reset();
    this.router.navigate(['/']);
  }

  goBack(): void {
    this.router.navigate(['/']);
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