import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Advertising } from '../models/advertising.model';
import { Article } from '../models/article.model';


// const ROOT_URL = 'http://161.97.157.17:3000/';
const ROOT_URL = window.location.protocol + '//' + window.location.hostname + ':3000/';
// const ROOT_URL = 'http://' + window.location.hostname + ':3000/';
// const ROOT_URL = 'http://localhost:3000/';
// const ROOT_URL = 'http://127.0.0.1:3000/';



@Injectable({
  providedIn: 'root'
})
export class AdvertisingService {

  adsListStore:Advertising[] = [];
  adsListChanged = new BehaviorSubject<Advertising[]>([]);
  readonly adsList = this.adsListChanged.asObservable();

  articlesStore:Article[] = [];
  articlesChanged = new BehaviorSubject<Article[]>([]);
  readonly articles = this.articlesChanged.asObservable();

  articlesActifStore:Article[] = [];
  articlesActifChanged = new BehaviorSubject<Article[]>([]);
  readonly articlesActif = this.articlesActifChanged.asObservable();

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }


  public getAdsIds(){
    return this.http.get(ROOT_URL + `ids/ads`)
  }

  public getAdsImage(id): Observable<SafeResourceUrl> {
    return this.http
      .get(ROOT_URL + `ads/${id}`, { responseType: 'blob' })
      .pipe(
        map(x => {
          const urlToBlob = window.URL.createObjectURL(x) // get a URL for the blob
          return this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob); // tell Anuglar to trust this value
        }),
      );
  }

  public updateAdsImage(image:any, id:string){
    return this.http.post(ROOT_URL + `update/ads/${id}`, image)
  }

  public addAdsImage(image:any, nameSociety:string, nameFile:string){
    return this.http.post(ROOT_URL + `add/ads/${nameSociety}/${nameFile}`, image)
  }

  public getAdsList(){
    return this.http.get<Advertising[]>(ROOT_URL + 'ads').subscribe(
      ads => { this.adsListStore = ads;
        this.adsListChanged.next(this.adsListStore);
      });
  }

  public putActifAds(id, actif){
    return this.http.put(ROOT_URL + `actif/ads/${id}`, actif)
  }

  public removeAds(id){
    return this.http.delete(ROOT_URL + `ads/${id}`)
  }

  public addArticle(item){
    console.log(item)
    return this.http.post(ROOT_URL + `admin/article`, item)
  }

  public addArticleImage(image:any, id:string, nameFile:string){
    return this.http.post(ROOT_URL + `admin/article/${id}/${nameFile}`, image)
  }

  public getAllArticle(){
    return this.http.get(ROOT_URL + `admin/article`).subscribe((articles:Article[]) => 
    {   this.articlesStore = articles;
        this.articlesChanged.next(this.articlesStore);
    });
  }

  public getAllArticleActif(){ 
    console.log('HERE____________________________________________')
    return this.http.get(ROOT_URL + `articles/actif`).subscribe((articles:Article[]) => 
    {
      this.articlesActifStore = articles;
        this.articlesActifChanged.next(this.articlesActifStore);
    });
  }

  public updateActifArticle(id, actif){
    return this.http.put(ROOT_URL + `admin/article/actif/${id}`, {actif:actif})
  }

}
