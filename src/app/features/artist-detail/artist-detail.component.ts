// src/app/features/artist-detail/artist-detail.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SpotifyService } from '../../core/services/spotify.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-artist-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './artist-detail.component.html',
  styleUrl: './artist-detail.component.scss'
})
export class ArtistDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private spotifyService = inject(SpotifyService);

  public artist = signal<any>(null);
  public albums = signal<any[]>([]);
  public isLoading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const artistId = params.get('id');
      if (artistId) {
        this.loadArtistData(artistId);
      }
    });
  }

  loadArtistData(id: string) {
    this.isLoading.set(true);

    // forkJoin permite executar duas chamadas de API em paralelo
    forkJoin({
      artist: this.spotifyService.getArtistById(id),
      albums: this.spotifyService.getArtistAlbums(id)
    }).subscribe({
      next: (response) => {
        this.artist.set(response.artist);
        this.albums.set(response.albums.items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do artista:', err);
        this.isLoading.set(false);
      }
    });
  }
}