// src/app/features/search/search.component.ts
import { Component, signal, inject } from '@angular/core';
import { SpotifyService } from '../../core/services/spotify.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  private spotifyService = inject(SpotifyService);

  // Signals para controlar o estado do componente
  public searchTerm = signal('');
  public searchResults = signal<any[]>([]);
  public isLoading = signal(false);
  public noResults = signal(false);

  onSearch() {
    const query = this.searchTerm();
    if (!query) {
      return; // Não faz busca se o campo estiver vazio
    }

    this.isLoading.set(true);
    this.noResults.set(false);
    this.searchResults.set([]);

    this.spotifyService.searchArtists(query).subscribe({
      next: (response: any) => {
        const artists = response?.artists?.items || [];
        this.searchResults.set(artists);
        if (artists.length === 0) {
          this.noResults.set(true); // Ativa a mensagem de "nenhum resultado"
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar artistas:', err);
        this.isLoading.set(false);
        // Aqui poderíamos ter um signal de erro para exibir na tela
      }
    });
  }
}