// src/app/core/services/spotify.service.ts
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of, tap, map, switchMap } from 'rxjs';

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private http = inject(HttpClient);
    private authApiUrl = 'https://accounts.spotify.com/api/token';
  private dataApiUrl = 'https://api.spotify.com/v1';

  private clientId = environment.spotify.clientId;
  private clientSecret = environment.spotify.clientSecret;
    private readonly TOKEN_KEY = 'spotify_access_token';

  /**
   * Obtém o token de autenticação, verificando primeiro o LocalStorage.
   */
  getAuthToken(): Observable<string> {
    const storedToken = localStorage.getItem(this.TOKEN_KEY);

    if (storedToken) {
      return of(storedToken);
    }

    const body = new HttpParams().set('grant_type', 'client_credentials');
    const authHeader = 'Basic ' + btoa(this.clientId + ':' + this.clientSecret);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    });

    // Usando a URL de autenticação correta
    return this.http
      .post<SpotifyTokenResponse>(this.authApiUrl, body.toString(), { headers })
      .pipe(
        tap((response) => {
          console.log('Token obtido:', response.access_token);
          localStorage.setItem(this.TOKEN_KEY, response.access_token);
        }),
        map((response) => response.access_token)
      );
  }

  /**
   * Busca artistas na API do Spotify.
   */
  searchArtists(query: string): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams()
          .set('q', query)
          .set('type', 'artist')
          .set('limit', '10');
        // Usando a URL de dados correta
        return this.http.get(`${this.dataApiUrl}/search`, { headers, params }).pipe(
          tap(data => console.log('Search Artists Response:', data))
        );
      })
    );
  }


   // Busca um artista específico pelo seu ID.

  getArtistById(id: string): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        // Usando a URL de dados correta
        return this.http.get(`${this.dataApiUrl}/artists/${id}`, { headers });
      })
    );
  }

   // Busca os álbuns de um artista específico.
  getArtistAlbums(id: string): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams().set('limit', '20');
        // Usando a URL de dados correta
        return this.http.get(`${this.dataApiUrl}/artists/${id}/albums`, {
          headers,
          params,
        });
      })
    );
  }
  // Busca um álbum específico pelo seu ID.
  getAlbumById(id: string): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });
        return this.http.get(`${this.dataApiUrl}/albums/${id}`, { headers });
      })
    );
  }
}
