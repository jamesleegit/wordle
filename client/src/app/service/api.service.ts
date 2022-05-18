import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ApiService {
    constructor(public _http: HttpClient) {}
    getWordInformation(data: {word: string;}) {
        return this._http.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(data.word)}`).toPromise();
    }
}