import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

export interface InvitationData {
  coupleName: string;
  brideName: string;
  groomName: string;
  youtubeUrl: string;
  eventDetails: any;
  gallery: string[];
  bridePhotoUrl: string; // <-- BARU
  groomPhotoUrl: string; // <-- BARU,
  theme: string
}

const DUMMY_DATA: { [key: string]: InvitationData } = {
  'rizki-pearly': {
    coupleName: 'rizki-pearly',
    brideName: 'Pearly',
    groomName: 'Rizki',
    youtubeUrl: 'https://www.youtube.com/embed/vZYMI7BeOAg', // Ganti dengan ID lagu
    eventDetails: { date: '2025-12-25T09:00:00', location: 'Gedung A' },
    gallery: ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg', 'images/6.jpg'],
    bridePhotoUrl: 'images/5.jpg',
    groomPhotoUrl: 'images/4.jpg',
    theme: 'instagram'
  },
  'pearly-rizki': {
    coupleName: 'rizki-pearly',
    brideName: 'Pearly',
    groomName: 'Rizki',
    youtubeUrl: 'https://www.youtube.com/embed/vZYMI7BeOAg', // Ganti dengan ID lagu
    eventDetails: { date: '2025-12-25T09:00:00', location: 'Gedung A' },
    gallery: ['images/1.jpg', 'images/2.jpg', 'images/3.jpg', 'images/4.jpg', 'images/5.jpg', 'images/6.jpg'],
    bridePhotoUrl: 'images/5.jpg',
    groomPhotoUrl: 'images/4.jpg',
    theme: 'netflix'
  },
};

@Injectable({
  providedIn: 'root',
})
export class WeddingData {
  constructor() { }

  getInvitationByCouple(coupleName: string): Observable<InvitationData | null> {
    const data = DUMMY_DATA[coupleName];
    if (data) {
      return of(data);
    } else {
      return of(null);
    }
  }
}
