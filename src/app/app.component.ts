// src/app/app.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpotifyService } from './core/services/spotify.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'spotify-clone';

  private spotifyService = inject(SpotifyService);

  ngOnInit(): void {
   this.spotifyService.getAuthToken().subscribe({
      next: (response) => {
        console.log('Autenticação bem-sucedida!', response);
      },
      error: (err) => {
        console.error('Erro na autenticação:', err);
      }
    });
  }
}