import { SocketAuthenticator, SocketCredentials } from '@horwood/socket-server';
import { Observable } from 'rxjs';
import { SessionService } from './service/session-service';

export class MongoSocketAuthenticator implements SocketAuthenticator {
  login(credentials: SocketCredentials): Observable<string> {
    return SessionService.create(credentials);
  }

  logout(token: string): Observable<void> {
    return SessionService.destroy(token);
  }

  register(credentials: SocketCredentials): Observable<string> {
    return SessionService.register(credentials);
  }

  validate(token: string): Observable<string> {
    return SessionService.validate(token);
  }
}
