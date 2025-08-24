import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <div class="header">
        <button class="menu-button" (click)="toggleMenu()">☰</button>
        <h1>SIMULADOR DE EMPRÉSTIMOS</h1>
      </div>
      
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
      
      <div class="content-grid">
        <div class="logo-container">
          <img src="assets/images/logo.jpg" alt="CAIXA" class="logo-image" />
        </div>
        
        <div class="menu-card" (click)="navigateTo('/cadastro-produto')">
          <h3>Cadastrar Produtos</h3>
          <p>Adicione novos produtos de empréstimo</p>
        </div>
                
        <div class="menu-card" (click)="navigateTo('/listagem-produto')">
          <h3>Produtos Cadastrados</h3>
          <p>Visualize todos os produtos disponíveis</p>
        </div>
                
        <div class="menu-card" (click)="navigateTo('/simulacao-emprestimo')">
          <h3>Simular Empréstimo</h3>
          <p>Faça uma simulação completa</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
      position: relative;
    }

    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      margin-bottom: 2rem;
    }

    .menu-button {

      left: 0;
      background: white;
      border: none;
      border-radius: 8px;
      padding: 12px 16px;
      font-size: 1.5rem;
      cursor: pointer;
      color: #005CA9;
    }

      .dropdown-menu {
      position: absolute;
      top: 85px;
      left: 0;
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

    h1 {
      color: #005CA9;
      font-size: 2.5rem;
      margin: 0;
      flex-grow: 1;
    }

    .content-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-top: 2rem;
    }

    .logo-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    }

    .logo-image {
      width: 100%;
      max-width: 500px;
      height: auto;
      border-radius: 12px;

      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
    }

    .menu-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 30px 20px;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
      border: 2px solid transparent;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .menu-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
      border-color: #f39200;
    }

    .menu-card h3 {
      color: #f39200;
      margin-bottom: 15px;
      font-size: 1.5rem;
    }

    .menu-card p {
      color: #005CA9;
      font-size: 1rem;
      line-height: 1.4;
    }

    @media (max-width: 768px) {
      .home-container {
        padding: 15px;
      }

      h1 {
        font-size: 2rem;
      }

      .content-grid {
        grid-template-columns: 1fr;
      }

      .logo-image {
        max-width: 500px;
      }

      .logo-container {
        min-height: 150px;
      }

      .menu-card {
        min-height: 150px;
      }

      .dropdown-menu {
        left: 0;
        right: 0;
        min-width: auto;
      }
    }

    @media (max-width: 480px) {
      .logo-image {
        max-width: 500px;
      }
      
      .logo-container {
        min-height: 120px;
      }

      .menu-card {
        min-height: 120px;
        padding: 20px 15px;
      }

      .menu-button {
        padding: 10px 12px;
        font-size: 1.3rem;
      }
    }
  `]
})
export class HomeComponent {
  isMenuOpen = false;

  constructor(private router: Router) {}

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