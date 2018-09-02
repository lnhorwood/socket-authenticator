import { sign, verify } from 'jsonwebtoken';
import { Observable, of } from "rxjs";
import { map, tap } from "rxjs/operators";
import hat from 'hat';
import { User } from '../schema/user';
import { TimeInSeconds } from './time-in-seconds';

export class Session {
  private static readonly _secret: string = hat();
  private readonly _exp: number;

  constructor(private _user: User, expiresIn: TimeInSeconds = TimeInSeconds.HOUR) {
    this._exp = this.secondsSinceEpoch + expiresIn;
  }

  toJSON() {
    return {
      user: this._user,
      exp: this._exp
    };
  }

  get token(): string {
    return sign(this.toJSON(), Session._secret);
  }

  get user(): User {
    return this._user;
  }

  static restore(token: string): Session {
    try {
      const session: object | string = verify(token, Session._secret);
      return new Session((<{user: User}> session).user);
    } catch {
      return null;
    }
  }

  static validate(token: string): Observable<string> {
    return of(Session.restore(token)).pipe(
      tap(session => {
        if (!session) {
          throw 'Invalid Token.';
        }
      }),
      map(session => session.token)
    );
  }

  private get secondsSinceEpoch(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
