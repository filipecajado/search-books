import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EMPTY, Subscription, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { Item, Livro, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent  {


  campoBusca = new FormControl()
  mensagemErro = '';
  livrosResultado : LivrosResultado;
  listaLivros: Livro[];
  
  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
                                      .pipe(
                                        debounceTime(300),
                                        filter((valorDigitado) => valorDigitado.length >= 3),
                                        tap(() => console.log('Fluxo Inicial')),
                                        distinctUntilChanged(),
                                        switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
                                        map(resultado => this.livrosResultado = resultado),
                                        map(resultado => resultado.items ?? []),
                                        map(items =>
                                           this.listaLivros = this.livrosResultadoParaLivros(items)),
                                        catchError((erro) => {
                                          // this.mensagemErro = 'ops, erro aqui, Recarregue a aplicação'
                                          // return EMPTY
                                          console.log(erro)
                                          return throwError(() => new Error(this.mensagemErro = 'ops, erro aqui, Recarregue a aplicação'))
                                          })
                                          )


  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[]{
    return items.map(item => {
      return new LivroVolumeInfo(item)
    })
  }
}



