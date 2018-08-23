import { SocketCredentials } from "@horwood/socket-server";
import { Observable } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { AuthenticationService } from "./authentication-service";
import { Authentication } from "../schema/authentication";
import { UserService } from "./user-service";
import { User } from "../schema/user";
import { Session } from "../model/session";

export class SessionService {
  static create(credentials: SocketCredentials): Observable<string> {
    return AuthenticationService.get(credentials).pipe(
      mergeMap((authentication: Authentication) => UserService.get(authentication.username)),
      map((user: User) => new Session(user).token)
    );
  }

  /*
   * The token isn't stored anywhere so cannot be destroyed unless some kind of whitelisting/blacklisting is integrated.
   * For now, fail if the given token is invalid.
   */
  static destroy(token: string): Observable<void> {
    return SessionService.validate(token).pipe(map(() => {
    }));
  }

  static register(credentials: SocketCredentials): Observable<string> {
    return AuthenticationService.create(credentials).pipe(
      mergeMap((authentication: Authentication) => UserService.create(authentication.username)),
      map((user: User) => new Session(user).token)
    );
  }

  static validate(token: string): Observable<string> {
    return Session.validate(token);
  }
}
