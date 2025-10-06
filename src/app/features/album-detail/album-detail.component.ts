// src/app/features/album-detail/album-detail.component.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SpotifyService } from '../../core/services/spotify.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-album-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe], 
  templateUrl: './album-detail.component.html',
  styleUrl: './album-detail.component.scss'
})
export class AlbumDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private spotifyService = inject(SpotifyService);

  public album = signal<any>(null);
  public isLoading = signal(true);

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const albumId = params.get('id');
      if (albumId) {
        this.loadAlbumData(albumId);
      }
    });
  }

  loadAlbumData(id: string) {
    this.isLoading.set(true);
    this.spotifyService.getAlbumById(id).subscribe({
      next: (response) => {
        this.album.set(response);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar dados do álbum:', err);
        this.isLoading.set(false);
      }
    });
  }
}