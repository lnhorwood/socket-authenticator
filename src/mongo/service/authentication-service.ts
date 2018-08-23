import { SocketCredentials } from '@horwood/socket-server';
import { bindNodeCallback, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { compareSync, hashSync } from 'bcrypt';
import { Authentication, authenticationModel } from '../schema/authentication';

export class AuthenticationService {
  static create(credentials: SocketCredentials): Observable<Authentication> {
    return AuthenticationService.find(credentials.username).pipe(
      tap((authentication: Authentication) => {
        if (authentication) {
          throw 'User already exists.';
        }
        return authentication;
      }),
      mergeMap(() => {
        const authentication: Authentication = new authenticationModel();
        authentication.username = credentials.username;
        authentication.hash = hashSync(credentials.password, 10);
        return bindNodeCallback<Authentication>((callback?: (err: Error, res: Authentication) => void) =>
          authentication.save(callback)
        )();
      })
    );
  }

  static get(credentials: SocketCredentials): Observable<Authentication> {
    return AuthenticationService.find(credentials.username).pipe(
      tap((authentication: Authentication) => {
        if (!authentication || !compareSync(credentials.password, authentication.hash)) {
          throw 'Invalid credentials.';
        }
        return authentication;
      })
    );
  }

  private static find(username: string): Observable<Authentication> {
    return bindNodeCallback<string, Authentication>(
      (username: string, callback?: (err: Error, res: Authentication) => void) =>
        authenticationModel.findOne(
          {
            username
          },
          callback
        )
    )(username);
  }
}
