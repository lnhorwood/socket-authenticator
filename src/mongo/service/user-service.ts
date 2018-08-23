import { bindNodeCallback, Observable } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { User, userModel } from '../schema/user';

export class UserService {
  static create(username: string): Observable<User> {
    return UserService.get(username).pipe(
      tap((user: User) => {
        if (user) {
          throw 'User already exists.';
        }
        return user;
      }),
      mergeMap(() => {
        const user: User = new userModel();
        user.username = username;
        return bindNodeCallback<User>((callback?: (err: Error, res: User) => void) => user.save(callback))();
      })
    );
  }

  static get(username: string): Observable<User> {
    return bindNodeCallback<string, User>((username: string, callback?: (err: Error, res: User) => void) =>
      userModel.findOne(
        {
          username
        },
        callback
      )
    )(username);
  }
}
