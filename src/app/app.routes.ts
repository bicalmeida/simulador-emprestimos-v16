import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CadastroProdutoComponent } from './components/cadastro-produto/cadastro-produto.component';
// Update the import path if the file is located elsewhere, for example:
import { ListagemProdutoComponent } from './components/listagem-produto/listagem-produto.component';
// If the file does not exist, create 'listagem-produto.component.ts' in 'src/app/components/listagem-produto/' and export the component.
import { SimulacaoEmprestimoComponent } from './components/simulacao-emprestimo/simulacao-emprestimo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cadastro-produto', component: CadastroProdutoComponent },
  { path: 'listagem-produto', component: ListagemProdutoComponent },
  { path: 'simulacao-emprestimo', component: SimulacaoEmprestimoComponent },
  { path: '**', redirectTo: '' }
];