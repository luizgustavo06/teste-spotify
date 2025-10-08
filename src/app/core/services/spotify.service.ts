import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { tap, map, switchMap } from 'rxjs/operators';

// Interface para a resposta do token
interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Interface para o que vamos guardar no LocalStorage
interface StoredTokenInfo {
  token: string;
  expiryTime: number; // Vamos guardar o timestamp de quando o token expira
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

  // ALTERADO: A chave do LocalStorage agora guarda um objeto
  private readonly TOKEN_INFO_KEY = 'spotify_token_info';

  /**
   * Obtém um token de autenticação VÁLIDO.
   * Ele verifica se o token armazenado expirou antes de retornar.
   */
  private getAuthToken(): Observable<string> {
    const storedTokenJSON = localStorage.getItem(this.TOKEN_INFO_KEY);

    if (storedTokenJSON) {
      const storedTokenInfo: StoredTokenInfo = JSON.parse(storedTokenJSON);
      // VERIFICAÇÃO PRINCIPAL: Se o tempo atual for MENOR que o tempo de expiração, o token é válido.
      if (Date.now() < storedTokenInfo.expiryTime) {
        console.log('Usando token do cache (ainda válido).');
        return of(storedTokenInfo.token);
      }
      console.log('Token do cache expirou.');
    }

    // Se não há token ou ele expirou, busca um novo.
    console.log('Buscando novo token da API do Spotify...');
    const body = new HttpParams().set('grant_type', 'client_credentials');
    const authHeader = 'Basic ' + btoa(this.clientId + ':' + this.clientSecret);
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: authHeader,
    });

    return this.http
      .post<SpotifyTokenResponse>(this.authApiUrl, body.toString(), { headers })
      .pipe(
        tap((response) => {
          // LÓGICA DE SALVAMENTO: Calcula o tempo de expiração
          // Date.now() está em milissegundos, expires_in em segundos.
          // Adicionamos uma margem de segurança de 60 segundos.
          const expiryTime = Date.now() + (response.expires_in - 60) * 1000;
          const tokenInfo: StoredTokenInfo = {
            token: response.access_token,
            expiryTime: expiryTime,
          };
          localStorage.setItem(this.TOKEN_INFO_KEY, JSON.stringify(tokenInfo));
          console.log('Novo token obtido e salvo.');
        }),
        map((response) => response.access_token)
      );
  }


  searchArtists(query: string): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams()
          .set('q', query)
          .set('type', 'artist')
          .set('limit', '10');
        return this.http.get(`${this.dataApiUrl}/search`, { headers, params });
      })
    );
  }

  getArtistById(id: string): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        return this.http.get(`${this.dataApiUrl}/artists/${id}`, { headers });
      })
    );
  }

  getArtistAlbums(id: string): Observable<any> {
    return this.getAuthToken().pipe(
      switchMap((token) => {
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
        const params = new HttpParams().set('limit', '20');
        return this.http.get(`${this.dataApiUrl}/artists/${id}/albums`, {
          headers,
          params,
        });
      })
    );
  }

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
