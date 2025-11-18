import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {InvitationData, WeddingData} from '../../core/services/wedding-data';
import {ActivatedRoute, Router} from '@angular/router';
import {NetflixTheme} from './layouts/netflix-theme/netflix-theme';
import {InstagramTheme} from './layouts/instagram-theme/instagram-theme';

@Component({
  selector: 'app-wedding-invitation',
  imports: [
    NetflixTheme,
    InstagramTheme
  ],
  templateUrl: './wedding-invitation.html',
  styleUrl: './wedding-invitation.scss',
})
export class WeddingInvitation implements OnInit {

  // Status untuk mengontrol UI
  public isLoading: boolean = true;
  public isNotFound: boolean = false;

  // Data yang akan di-pass ke komponen tema
  public invitationData: InvitationData | null = null;
  public guestName: string | null = null;
  public themeName: string | undefined = 'instagram'; // Tema fallback

  constructor(
    private route: ActivatedRoute,      // Untuk membaca parameter URL
    private router: Router,            // Untuk navigasi (jika error)
    private weddingService: WeddingData // Untuk mengambil data
  ) {}

  ngOnInit(): void {
    // 1. Ambil nama tamu dari Query Param (?to=pak-dito)
    // Kita gunakan 'snapshot' karena ini hanya dibaca sekali saat load
    this.guestName = this.route.snapshot.queryParamMap.get('to');

    const queryTheme = this.route.snapshot.queryParamMap.get('theme');

    if (queryTheme === 'netflix') {
      this.themeName = 'netflix';
    } else if (queryTheme === 'instagram') {
      this.themeName = 'instagram';
    } else {
      // 2. Jika tidak ada query param, baru cek Subdomain (Logic lama Anda)
      const host = window.location.host;
      if (host.startsWith('tema1.')) {
        this.themeName = 'netflix';
      } else if (host.startsWith('tema2.')) {
        this.themeName = 'instagram';
      }
      // else default theme
    }

    // 3. Ambil data berdasarkan Path Param (:coupleName)
    // Kita pakai .pipe() dan .subscribe() untuk mengelola alur data
    this.route.paramMap.pipe(
      // switchMap akan membatalkan request lama jika ada param baru
      switchMap(params => {
        const coupleName = params.get('coupleName');

        if (!coupleName) {
          // Jika tidak ada nama pasangan di URL, tandai sebagai Not Found
          this.isLoading = false;
          this.isNotFound = true;
          this.router.navigate(['/']); // Opsional: redirect ke home
          return []; // Hentikan alur
        }

        // Panggil service untuk ambil data. Ini me-return Observable.
        return this.weddingService.getInvitationByCouple(coupleName);
      })
    ).subscribe({
      next: (data) => {
        if (data) {
          // Data berhasil ditemukan
          this.invitationData = data;
          this.themeName = this.invitationData?.theme;
          console.log('tema ', this.themeName)
          this.isNotFound = false;
        } else {
          // Data tidak ditemukan (service mengembalikan null)
          this.isNotFound = true;
        }
        // Apapun hasilnya, loading selesai
        this.isLoading = false;
      },
      error: (err) => {
        // Jika terjadi error saat fetch (misal: API down)
        console.error('Gagal mengambil data undangan:', err);
        this.isLoading = false;
        this.isNotFound = true;
      }
    });
  }
}
