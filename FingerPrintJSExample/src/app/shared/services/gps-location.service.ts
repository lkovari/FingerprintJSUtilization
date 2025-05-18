import { DestroyRef, inject, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpsLocationService {
  readonly lat = signal<number | null>(null);
  readonly lon = signal<number | null>(null);
  readonly error = signal<string | null>(null);

  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    if (!('geolocation' in navigator)) {
      this.error.set('Geolocation is not supported by this browser.');
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.lat.set(position.coords.latitude);
        this.lon.set(position.coords.longitude);
        this.error.set(null);
      },
      (err) => {
        this.error.set(err.message);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    this.destroyRef.onDestroy(() => {
      navigator.geolocation.clearWatch(watchId);
    });
  }
}
