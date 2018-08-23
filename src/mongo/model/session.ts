import { sign, verify, VerifyCallback } from 'jsonwebtoken';
import { bindNodeCallback, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { User } from '../schema/user';
import { TimeInSeconds } from './time-in-seconds';

export class Session {
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
    return sign(this.toJSON(), 'potatoes');
  }

  static validate(token: string): Observable<string> {
    return bindNodeCallback((token: string, secret: string, callback: VerifyCallback) =>
      verify(token, secret, callback)
    )(token, 'potatoes').pipe(
      catchError(() => throwError('Invalid Token.')),
      map((session: { user: User }) => new Session(session.user).token)
    );
  }

  private get secondsSinceEpoch(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
