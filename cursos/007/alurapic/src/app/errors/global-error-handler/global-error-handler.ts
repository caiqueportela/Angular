import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import * as StackTrace from 'stacktrace-js';

import { environment } from 'src/environments/environment';

import { UserService } from 'src/app/core/user/user.service';
import { ServerLogService } from 'src/app/errors/global-error-handler/server-log.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor(
    private injector: Injector
  ) { }

  handleError(error: any): void {
    const location = this.injector.get(LocationStrategy);
    const userService = this.injector.get(UserService);
    const serverLogService = this.injector.get(ServerLogService);
    const router = this.injector.get(Router);

    const url = location instanceof PathLocationStrategy
      ? location.path()
      : '';

    const message = error.message
      ? error.message
      : error.toString();

    if (environment.production) {
      router.navigate(['/error']);
    }

    StackTrace
      .fromError(error)
      .then(stackFrames => {
        const stackAsString = stackFrames
          .map(sf => sf.toString())
          .join('\n');

        serverLogService.log({
          message,
          url,
          userName: userService.getUserName(),
          stack: stackAsString,
        }).subscribe();
      });
  }

}
