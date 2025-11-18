import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InvitationData } from '../../../../core/services/wedding-data';
import { RsvpForm } from '../../components/rsvp-form/rsvp-form';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Guestbook } from '../../components/guestbook/guestbook';
import { DigitalAngpao } from '../../components/digital-angpao/digital-angpao';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-netflix-theme',
  standalone: true, // Pastikan ini true
  imports: [
    RsvpForm,
    Guestbook,
    DigitalAngpao,
    DatePipe,
    TitleCasePipe
  ],
  templateUrl: './netflix-theme.html',
  styleUrl: './netflix-theme.scss',
})
export class NetflixTheme implements OnInit, OnDestroy {

  @Input() invitation!: InvitationData;
  @Input() guest: string | null = null;

  public isCoverActive: boolean = true;
  public isContentActive: boolean = false;
  public isMusicPlaying: boolean = false; // State musik

  public youtubeEmbedUrl: SafeResourceUrl | null = null;

  @ViewChild('youtubePlayer') youtubePlayerRef!: ElementRef<HTMLIFrameElement>;

  public currentBgIndex: number = 0;
  private bgCarouselInterval: any;

  @ViewChild('contentContainer') contentContainer!: ElementRef<HTMLElement>;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.invitation.youtubeUrl) {
      const safeUrl = this.buildYoutubeUrl(this.invitation.youtubeUrl);
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
    }
  }

  // --- PERBAIKAN 1: Regex Video ID ---
  private getYouTubeVideoId(url: string): string {
    // Regex ini lebih fleksibel untuk berbagai format URL YouTube
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    const id = match ? match[1] : '';
    console.log('Video ID:', id); // Cek di console apakah ID muncul (vZYMI7BeOAg)
    return id;
  }

  // --- PERBAIKAN 2: Domain & Parameter ---
  private buildYoutubeUrl(url: string): string {
    const videoId = this.getYouTubeVideoId(url);

    // Gunakan domain nocookie untuk menghindari Error 153
    const baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const urlObj = new URL(baseUrl);

    urlObj.searchParams.set('enablejsapi', '1');
    urlObj.searchParams.set('origin', window.location.origin);

    // SET Autoplay=1 (Jangan di-delete!)
    urlObj.searchParams.set('autoplay', '1');
    // Mute=1 Wajib agar autoplay jalan di Chrome
    urlObj.searchParams.set('mute', '1');

    urlObj.searchParams.set('controls', '0');
    urlObj.searchParams.set('showinfo', '0');
    urlObj.searchParams.set('rel', '0');
    urlObj.searchParams.set('loop', '1');
    urlObj.searchParams.set('playlist', videoId);

    return urlObj.toString();
  }

  get formattedGuestName(): string {
    if (!this.guest) return '';
    return this.guest.replace(/-/g, ' ');
  }

  openInvitation(): void {
    this.isCoverActive = false;
    this.isContentActive = true;
    this.isMusicPlaying = true;

    // Trigger Play
    this.playAndUnmuteVideo();

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);

    this.startBgCarousel();
  }

  toggleMusic(): void {
    if (!this.youtubePlayerRef) return;

    const contentWindow = this.youtubePlayerRef.nativeElement.contentWindow;
    if (!contentWindow) return;

    if (this.isMusicPlaying) {
      contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }), '*');
      this.isMusicPlaying = false;
    } else {
      contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*');
      this.isMusicPlaying = true;
    }
  }

  playAndUnmuteVideo(): void {
    if (!this.youtubePlayerRef) return;

    const iframe = this.youtubePlayerRef.nativeElement;
    const contentWindow = iframe.contentWindow;

    if (contentWindow) {
      // Play (dalam keadaan mute)
      contentWindow.postMessage(
        JSON.stringify({ event: 'command', func: 'playVideo', args: [] }), '*'
      );

      // Unmute setelah sedikit delay
      setTimeout(() => {
        contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'unMute', args: [] }), '*'
        );
        contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*'
        );
      }, 500);
    }
  }

  startBgCarousel(): void {
    if (this.invitation.gallery.length > 1 && !this.bgCarouselInterval) {
      this.bgCarouselInterval = setInterval(() => {
        this.currentBgIndex = (this.currentBgIndex + 1) % this.invitation.gallery.length;
      }, 5000);
    }
  }

  scrollToSection(sectionId: string): void {
    if (!this.contentContainer) return;

    const container = this.contentContainer.nativeElement;
    const section = container.querySelector(`#${sectionId}`) as HTMLElement;

    if (section) {
      const headerOffset = 60;
      const sectionTop = section.offsetTop;
      container.scrollTo({
        top: sectionTop - headerOffset,
        behavior: 'smooth'
      });
    }
  }

  ngOnDestroy(): void {
    if (this.bgCarouselInterval) {
      clearInterval(this.bgCarouselInterval);
    }
  }
}
