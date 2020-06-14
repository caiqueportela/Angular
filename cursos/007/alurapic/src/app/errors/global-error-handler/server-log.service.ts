import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { ServerLog } from 'src/app/errors/global-error-handler/server-log';

const API_URL = environment.apiLogUrl;

@Injectable({
  providedIn: 'root'
})
export class ServerLogService {

  constructor(
    private http: HttpClient
  ) { }

  log(serverLog: ServerLog) {
    return this.http.post(`${API_URL}/infra/log`, serverLog);
  }

}
