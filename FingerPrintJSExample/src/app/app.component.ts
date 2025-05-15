import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

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

  ngOnInit() {
    this.listenForChanges();
    this.getFingerprint();
  }

  async getFingerprint(): Promise<void> {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    this.fingerprint.set(result.visitorId);
  }

  listenForChanges() {
    // React when language or userAgent changes (manually simulate or use real-time APIs)
    window.addEventListener('languagechange', () => this.getFingerprint());
    window.addEventListener('resize', () => this.getFingerprint());
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.getFingerprint();
      }
    });
  }
}
