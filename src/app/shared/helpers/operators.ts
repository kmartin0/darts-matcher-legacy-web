import {defer, Observable, Subject} from 'rxjs';
import {finalize} from 'rxjs/operators';

/**
 * Creates an operator that invokes a callback function when the source Observable is subscribed to.
 *
 * @template T - The type of the Observable emissions.
 * @param onSubscribe - A callback function to run on subscription.
 * @returns An RxJS operator function that calls `onSubscribe` upon subscription.
 */
export const doOnSubscribe = (onSubscribe: () => void) =>
  <T>(source: Observable<T>) => defer(() => {
    onSubscribe();
    return source;
  });

/**
 * RxJS operator that manages a loading indicator by emitting `true` on subscription
 * and `false` when the Observable completes or errors.
 *
 * If no indicator Subject is provided, the source Observable is returned unchanged.
 *
 * @template T - The type of the Observable's emissions.
 * @param indicator - A Subject<boolean> that signals loading state: `true` when loading, `false` when done.
 * @returns An RxJS operator function that manages loading state around the source Observable.
 */
export function withLoading<T>(indicator: Subject<boolean>): (source: Observable<T>) => Observable<T> {
  if (!indicator) {
    return (source: Observable<T>) => source;
  }

  return (source: Observable<T>): Observable<T> => source.pipe(
    doOnSubscribe(() => indicator.next(true)),
    finalize(() => indicator.next(false))
  );
}
