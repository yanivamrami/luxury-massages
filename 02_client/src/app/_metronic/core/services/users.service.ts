import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {customerDetails} from '../models/customerDetails.model'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

const ROOT_URL = window.location.protocol + '//' + window.location.hostname + ':3000/';
// const ROOT_URL = 'http://161.97.157.17:3000/';
// const ROOT_URL = 'http://localhost:3000/';
// const ROOT_URL = 'http://127.0.0.1:3000/';
// const ROOT_URL = 'http://' + window.location.hostname + ':3000/';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  workersListChanged = new BehaviorSubject<customerDetails[]>([]);
  readonly workers = this.workersListChanged.asObservable();
  workerStore:customerDetails[] = [];

  userFromDistListChanged = new BehaviorSubject<customerDetails[]>([]);
  readonly userFromDist = this.userFromDistListChanged.asObservable();
  userFromDistStore:customerDetails[] = [];

  nameCurrentDistributorChanged = new BehaviorSubject<string>(null);
  readonly nameCurrentDistributor = this.nameCurrentDistributorChanged.asObservable();
  nameCurrentDistributorStore:string = '';

  public url: SafeResourceUrl;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }
  
  getAvailableWorkers(datetime, minutes){
    return this.http.get(ROOT_URL + `workers/${datetime}/${minutes}`);
  }

  createWorker(user){
    return this.http.post(ROOT_URL + `admin/worker`, user);
  }

  getAllWorkers(){
    return this.http.get<any[]>(ROOT_URL + `admin/workers`).subscribe(
      workers => {
        this.workerStore = workers;
        this.workersListChanged.next(this.workerStore);
      },
    );
  }

  public getProfilePicture(url: string, id:string): Observable<SafeResourceUrl> {
    return this.http
      .get(ROOT_URL + `profile/${id}`, { responseType: 'blob' })
      .pipe(
        map(x => {
          const urlToBlob = window.URL.createObjectURL(x) // get a URL for the blob
          return this.sanitizer.bypassSecurityTrustResourceUrl(urlToBlob); // tell Anuglar to trust this value
        }),
      );
  }

  public updateProfilePhoto(image:any, id:string){
    return this.http.post(ROOT_URL + `worker/profile/${id}`, image);
  }

  public sendAvailability(id:string, event:string[]){
    return this.http.post(ROOT_URL + `availability/${id}`, {events: event});
  }

  public getAvailability(id:string){
    return this.http.get(ROOT_URL + `availability/${id}`);
  }

  public addDistributor(user, name){
    return this.http.post(ROOT_URL + `distributor/${name}`, user);
  }

  public getAllDistributor(){
    return this.http.get(ROOT_URL + `admin/distributor`);
  }

  public usersFromDistributor(users, name){
    this.userFromDistStore = users;
    this.userFromDistListChanged.next(this.userFromDistStore);
    this.nameCurrentDistributorStore=name;
    this.nameCurrentDistributorChanged.next(this.nameCurrentDistributorStore)
  }
  
}
