import { Component, effect, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { GpsLocationService } from './shared/services/gps-location.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FingerprintJS Example';
  fingerprint = signal<string>('Loading...');
  language = navigator.language;
  userAgent = navigator.userAgent;
  previousFingerprint: string | null = null;
  changeIx: number = 0;
  colors: string[] = ['red', 'blue', 'green', 'brown', 'purple', 'orange', 'pink', 'cyan', 'magenta', 'lime'];
  nextColor: string = this.colors[this.changeIx];

  constructor(public gpsLocationService: GpsLocationService) {
    effect(() => {
      const lat = this.gpsLocationService.lat();
      const lon = this.gpsLocationService.lon();
      if (lat !== null && lon !== null) {
        console.log('Latitude:', lat, 'Longitude:', lon);
        this.getFingerprint();
      }
    });
  }

  ngOnInit() {
    this.listenForChanges();
    this.getFingerprint();
  }

  async getFingerprint(): Promise<void> {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    if (this.previousFingerprint !== result.visitorId) {
      this.previousFingerprint = result.visitorId;
      this.fingerprint.set(result.visitorId);
      this.changeIx = (this.changeIx + 1) % this.colors.length;
      this.nextColor = this.colors[this.changeIx];
    }
  }

  generateColor(): string {
    return this.nextColor;
  }

  listenForChanges() {
    window.addEventListener('languagechange', () => this.getFingerprint());
    window.addEventListener('resize', () => this.getFingerprint());
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.getFingerprint();
      }
    });
  }
}
