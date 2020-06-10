import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { Photo } from './photo';
import { PhotoComment } from './photo-comment';
import { environment } from 'src/environments/environment';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor(private http: HttpClient) { }

  listFromUser(userName: string) {
    return this.http
      .get<Photo[]>(`${API_URL}/${userName}/photos`);
  }

  listFromUserPaginated(userName: string, page: number) {
    const params = new HttpParams().append('page', page.toString());

    return this.http
      .get<Photo[]>(`${API_URL}/${userName}/photos`, { params });
  }

  upload(description: string, allowComments: boolean, file: File) {
    const formData = new FormData();
    formData.append('description', description);
    formData.append('allowComments', String(allowComments));
    formData.append('imageFile', file);

    return this.http.post(`${API_URL}/photos/upload`, formData);
  }

  findById(photoId: number) {
    return this.http.get<Photo>(`${API_URL}/photos/${photoId}`);
  }

  getComments(photoId: number) {
    return this.http.get<PhotoComment[]>(`${API_URL}/photos/${photoId}/comments`);
  }

  addComment(photoId: number, commentText: string) {
    return this.http.post(`${API_URL}/photos/${photoId}/comments`, { commentText });
  }

  removePhoto(photoId: number) {
    return this.http.delete(`${API_URL}/photos/${photoId}`);
  }

  like(photoId: number) {
    return this.http
      .post(`${API_URL}/photos/${photoId}/like`, {}, { observe: 'response' })
      .pipe(
        map(res => true)
      )
      .pipe(
        catchError(err => {
          return err.status == '304' ? of(false) : throwError(err);
        })
      );
  }

}
