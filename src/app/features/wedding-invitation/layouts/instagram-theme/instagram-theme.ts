import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {InvitationData} from '../../../../core/services/wedding-data';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {DigitalAngpao} from '../../components/digital-angpao/digital-angpao';
import {RsvpForm} from '../../components/rsvp-form/rsvp-form';
import {Guestbook} from '../../components/guestbook/guestbook';

@Component({
  selector: 'app-instagram-theme',
  standalone: true,
  imports: [
    TitleCasePipe,
    DatePipe,
    DigitalAngpao,
    RsvpForm,
    Guestbook
  ],
  templateUrl: './instagram-theme.html',
  styleUrl: './instagram-theme.scss',
})
export class InstagramTheme implements OnInit, OnDestroy {

  @Input() invitation!: InvitationData;
  @Input() guest: string | null = null;

  public isStoryActive: boolean = true;
  public isMusicPlaying: boolean = false;
  public youtubeEmbedUrl: SafeResourceUrl | null = null;

  public storyProgress = 0;
  private storyInterval: any;

  // Variabel untuk melacak slide aktif di carousel
  public activeGalleryIndex: number = 0;

  @ViewChild('youtubePlayer') youtubePlayerRef!: ElementRef<HTMLIFrameElement>;
  @ViewChild('contentContainer') contentContainer!: ElementRef<HTMLElement>;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    if (this.invitation?.youtubeUrl) {
      const safeUrl = this.buildYoutubeUrl(this.invitation.youtubeUrl);
      this.youtubeEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(safeUrl);
    }
    this.startStoryProgress();
  }

  // --- Carousel Scroll Logic ---
  onGalleryScroll(event: any) {
    const element = event.target;
    // Hitung index berdasarkan posisi scroll horizontal
    const index = Math.round(element.scrollLeft / element.offsetWidth);
    this.activeGalleryIndex = index;
  }

  // --- Story Logic ---
  startStoryProgress() {
    this.storyInterval = setInterval(() => {
      if (this.storyProgress < 100) {
        this.storyProgress += 1;
      } else {
        clearInterval(this.storyInterval);
      }
    }, 50);
  }

  openInvitation() {
    this.isStoryActive = false;
    this.isMusicPlaying = true;
    this.playMusic();
    clearInterval(this.storyInterval);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Music Logic ---
  private buildYoutubeUrl(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
    const match = url.match(regex);
    const videoId = match ? match[1] : '';

    const baseUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    const urlObj = new URL(baseUrl);

    urlObj.searchParams.set('enablejsapi', '1');
    urlObj.searchParams.set('origin', window.location.origin);
    urlObj.searchParams.set('autoplay', '1');
    urlObj.searchParams.set('mute', '1');
    urlObj.searchParams.set('controls', '0');
    urlObj.searchParams.set('loop', '1');
    urlObj.searchParams.set('playlist', videoId);

    return urlObj.toString();
  }

  toggleMusic() {
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

  playMusic() {
    if (!this.youtubePlayerRef) return;
    const player = this.youtubePlayerRef.nativeElement.contentWindow;
    if (!player) return;

    player.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
    setTimeout(() => {
      player.postMessage(JSON.stringify({ event: 'command', func: 'unMute' }), '*');
      player.postMessage(JSON.stringify({ event: 'command', func: 'setVolume', args: [100] }), '*');
    }, 500);
  }

  // --- Navigation Logic ---
  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 60;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  }

  get formattedGuestName(): string {
    return this.guest ? this.guest.replace(/-/g, ' ') : 'Tamu Undangan';
  }

  ngOnDestroy(): void {
    clearInterval(this.storyInterval);
  }
}
