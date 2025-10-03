// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { SearchComponent } from './features/search/search.component';
import { ArtistDetailComponent } from './features/artist-detail/artist-detail.component';
import { AlbumDetailComponent } from './features/album-detail/album-detail.component';

export const routes: Routes = [
  {
    path: '', 
    component: SearchComponent
  },
  {
    path: 'artist/:id', 
    component: ArtistDetailComponent
  },
   {
    path: 'album/:id',
    component: AlbumDetailComponent
  }
];