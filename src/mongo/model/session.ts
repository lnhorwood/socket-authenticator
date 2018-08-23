import { sign, verify, VerifyCallback } from 'jsonwebtoken';
import { bindNodeCallback, Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  static validate(token: string): Observable<string> {
    return bindNodeCallback((token: string, secret: string, callback: VerifyCallback) =>
      verify(token, secret, callback)
    )(token, Session._secret).pipe(
      catchError(() => throwError('Invalid Token.')),
      map((session: { user: User }) => new Session(session.user).token)
    );
  }

  private get secondsSinceEpoch(): number {
    return Math.round(new Date().getTime() / 1000);
  }
}
