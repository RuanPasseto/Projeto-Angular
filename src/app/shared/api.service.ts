import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        map(categories => categories.map(category => category.category))
      );
  }

  getProductsByCategory(category: string) {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(
        map(products => products.filter(product => product.category === category))
      );
  }

  postProduct(data: any) {
    return this.http.post<any>(this.apiUrl, data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  getProduct() {
    return this.http.get<any>(this.apiUrl)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  updateProduct(data: any, id: number) {
    return this.http.put<any>(`${this.apiUrl}/${id}`, data)
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(`${this.apiUrl}/${id}`)
      .pipe(map((res: any) => {
        return res;
      }));
  }
}
