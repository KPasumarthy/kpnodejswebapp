import { Injectable } from '@angular/core';
//KP : Import Components
import { Hero } from '../modules/hero';
import { HEROS } from '../modules/mock-heros';
import { Observable, of } from 'rxjs';
import { MessageService } from '../messages/message.service';
import { catchError, map, tap} from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
//KP : Import MongoDB URL
//import { ResponseType } from '@angular/http';
//import { MongoClient } from '..';

// //KP : Declaring Const
// const httpOptions = {
//   headers : new HttpHeaders({'Content-Type':'application/json'})
// }
 const httpOptions = {
  headers: new HttpHeaders( {'Content-Type':'application/json',
                             'Access-Control-Allow-Origin': '*',
                             'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE'}
  )};

//KP : Use MongoDB Client
//var Cloudant = require('@cloudant/cloudant');
//var MongoClient  = require('mongodb').MongoClient;

//@Injectable()
@Injectable({ providedIn: 'root' })
export class HeroService {
 
  private heroesUrl = 'api/heroes';  // URL to web api
 
  constructor(
    private http: HttpClient,
    private messageService: MessageService
    //private mongodbService: MongodbService
    ) { }

    ////KP : Uses http.get() to load food data from a single API endpoint
  getHeroesNonObservable() {
      return this.http.get('/api/heroes');
  }

 
  /** GET heroes from the server */
  getHeroes (): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(heroes => { 
                        this.log('fetched heroes'), 
                        this.log('KP : Call MongoDBservice'), 
                        this.http.get(`localhost:27017/KPMongoDB`)
                      }
        ),
        catchError(this.handleError('getHeroes', []))
      );
  }
 
  /** GET hero by id. Return `undefined` when id not found */
  getHeroNo404<Data>(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/?id=${id}`;
    return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]), // returns a {0|1} element array
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }
 
  /** GET hero by id. Will 404 if id not found */
  getHeroWORKING(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }
 
  /** GET hero by id. Will 404 if id not found */
  /** GET hero by id. Will 404 if id not found */
  getHero(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get(`http://localhost:2727/url`)
        .pipe(
          tap(_ => {                    
                    this.log('http.get(http://localhost:2727/url)' ),
                    this.log(`KP : KPMongoDB http.get() has been called with hero id=${id}`)       
        }),
          catchError( this.handleError<any>('KP : `http://localhost:2727/url : Errors' ) )         
        );
     
    // return this.http.get<Hero>(url).pipe(
    //   tap(_ => { 
    //              this.log(`fetched hero id=${id}`),
    //              ///this.log(this.http.get(`localhost:27017/KPMongoDB`)),
    //              this.log('http.get(`localhost:27017/KPMongoDB)' ),
    //              this.log(`KP : KPMongoDB http.get() has been called with hero id=${id}`)
    //            }      
    //   ),
    //   catchError(this.handleError<Hero>(`getHero id=${id}`))
    // );
  }

  /** GET hero by id. Will 404 if id not found */
  /** GET hero by id. Will 404 if id not found */
  //getMongoDB(id: number): Observable<Hero> {
    getMongoDB(id: number): Observable<any> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => { 
                 this.log(`fetched hero id=${id}`),
                 this.http.get(`localhost:27017/KPMongoDB`)
               }      
      ),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }


  /* GET heroes whose name contains search term */
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_ => this.log(`found heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }
 

  //////// Save methods //////////
 
  /** POST: add a new hero to the server */
  addHero (hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, httpOptions).pipe(
      tap((hero: Hero) => this.log(`added hero w/ id=${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }
 
  /** DELETE: delete the hero from the server */
  deleteHero (hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
 
    return this.http.delete<Hero>(url, httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
 
  /** PUT: update the hero on the server */
  updateHero (hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, httpOptions).pipe(
      tap(_ => this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }
 
  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
 
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
 
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
 
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
 
  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

    /** Log a HeroService message with the MessageService */
    //private CallMongoService() {
      ////KP : I need to call this CallMongoService inside the HeroService
      //console.log("KP : HeroService - MongodbService for MongoDB Access...");
      //this.messageService.add(`HeroService: ${message}`);
      //this.mongodbService.kptest();
    //}

}