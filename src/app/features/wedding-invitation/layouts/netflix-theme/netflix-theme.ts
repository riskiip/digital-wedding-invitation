import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InvitationData} from '../../../../core/services/wedding-data';
import {RsvpForm} from '../../components/rsvp-form/rsvp-form';
import {DatePipe} from '@angular/common';
import {Guestbook} from '../../components/guestbook/guestbook';
import {DigitalAngpao} from '../../components/digital-angpao/digital-angpao';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-netflix-theme',
  imports: [
    RsvpForm,
    Guestbook,
    DigitalAngpao,
    DatePipe
  ],
  templateUrl: './netflix-theme.html',
  styleUrl: './netflix-theme.scss',
})
export class NetflixTheme implements OnInit, OnDestroy {

  // Data dari komponen induk
  @Input() invitation!: InvitationData;
  @Input() guest: string | null = null;

  // State untuk kontrol UI
  public isCoverActive: boolean = true;
  public isContentActive: boolean = false;

  // Properti YouTube Player
  public youtubeEmbedUrl: SafeResourceUrl | null = null;
  @ViewChild('youtubePlayer') youtubePlayerRef!: ElementRef<HTMLIFrameElement>;

  // Properti Carousel Background
  public currentBgIndex: number = 0;
  private bgCarouselInterval: any;

  // BARU: ViewChild untuk kontainer scroll utama
  @ViewChild('contentContainer') contentContainer!: ElementRef<HTMLElement>;

  constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit(): void {
    if (this.invitation.youtubeUrl) {
      const safeUrl = this.buildYoutubeUrl(this.invitation.youtubeUrl);
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
    }
  }

  /**
   * (Fungsi ini tidak berubah)
   * Membangun URL YouTube yang benar untuk kontrol JavaScript (JS API).
   */
  private buildYoutubeUrl(url: string): string {
    const urlObj = new URL(url);
    const videoId = this.getYouTubeVideoId(url);

    urlObj.searchParams.delete('autoplay');
    urlObj.searchParams.set('mute', '1'); // Mulai dengan mute
    urlObj.searchParams.set('enablejsapi', '1');
    urlObj.searchParams.set('origin', window.location.origin);
    urlObj.searchParams.set('controls', '0');
    urlObj.searchParams.set('showinfo', '0');
    urlObj.searchParams.set('modestbranding', '1');
    urlObj.searchParams.set('loop', '1');
    urlObj.searchParams.set('playlist', videoId);

    return urlObj.toString();
  }

  /**
   * (Fungsi ini tidak berubah)
   * Helper untuk mengambil ID video dari URL YouTube.
   */
  private getYouTubeVideoId(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|\/(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  /**
   * (Fungsi ini tidak berubah)
   * Dipanggil saat tombol "Open Invitation" diklik.
   */
  openInvitation(): void {
    this.isCoverActive = false;
    this.isContentActive = true;

    // Putar dan un-mute musik (dipicu oleh klik)
    this.playAndUnmuteVideo();

    window.scrollTo({top: 0, behavior: 'smooth'});
    this.startBgCarousel();
  }

  /**
   * (Fungsi ini tidak berubah)
   * Mengirim DUA perintah: 'playVideo' DAN 'unMute'
   */
  playAndUnmuteVideo(): void {
    const contentWindow = this.youtubePlayerRef?.nativeElement?.contentWindow;
    if (contentWindow) {
      // 1. Perintah untuk PUTAR VIDEO
      contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        'https://www.youtube.com'
      );
      // 2. Perintah untuk UNMUTE VIDEO
      contentWindow.postMessage(
        '{"event":"command","func":"unMute","args":""}',
        'https://www.youtube.com'
      );
    } else {
      console.warn('Referensi YouTube Player tidak ditemukan.');
    }
  }

  /**
   * (Fungsi ini tidak berubah)
   * Memulai interval untuk mengganti background image di hero section.
   */
  startBgCarousel(): void {
    if (this.invitation.gallery.length > 1 && !this.bgCarouselInterval) {
      this.bgCarouselInterval = setInterval(() => {
        this.currentBgIndex = (this.currentBgIndex + 1) % this.invitation.gallery.length;
      }, 5000);
    }
  }

  /**
   * FUNGSI BARU: Untuk navigasi navbar.
   * Fungsi ini akan men-scroll KONTENER, bukan 'window'.
   */
  scrollToSection(sectionId: string): void {
    if (!this.contentContainer) return;

    const container = this.contentContainer.nativeElement;
    const section = container.querySelector(`#${sectionId}`) as HTMLElement;

    if (section) {
      const headerOffset = 60; // Tinggi navbar kita
      const sectionTop = section.offsetTop;

      container.scrollTo({
        top: sectionTop - headerOffset,
        behavior: 'smooth'
      });
    }
  }

  /**
   * (Fungsi ini tidak berubah)
   * Bersihkan interval saat komponen dihancurkan.
   */
  ngOnDestroy(): void {
    if (this.bgCarouselInterval) {
      clearInterval(this.bgCarouselInterval);
    }
  }
}
