import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
// Data Fake Reviews
  reviews = [
    {
      name: 'Sarah & Dimas',
      date: 'Januari 2025',
      comment: 'Tema Netflix-nya unik banget! Tamu undangan banyak yang kaget dan bilang keren. Fitur RSVP-nya juga sangat membantu pendataan catering.',
      avatar: 'https://i.pravatar.cc/150?img=5',
      rating: 5
    },
    {
      name: 'Rina & Budi',
      date: 'Desember 2024',
      comment: 'Suka banget sama tema Instagram-nya. Mirip banget sama aslinya, smooth, dan fotonya bisa di-slide. Recommended!',
      avatar: 'https://i.pravatar.cc/150?img=3',
      rating: 5
    },
    {
      name: 'Reza Rahardian',
      date: 'Februari 2025',
      comment: 'Proses pembuatannya cepat, adminnya ramah. Harganya sangat worth it untuk fitur sekomplit ini.',
      avatar: 'https://i.pravatar.cc/150?img=11',
      rating: 4
    }
  ];

  // Data Paket Harga
  packages = [
    {
      id: 1,
      name: 'Basic',
      price: '149K',
      period: '/ event',
      desc: 'Cukup untuk acara sederhana.',
      features: [
        '1 Tema Pilihan (Standard)',
        'Masa Aktif 3 Bulan',
        'Musik Background (Default)',
        'Kuota 300 Tamu',
        'Tidak Ada RSVP'
      ],
      isPopular: false,
      buttonText: 'Pilih Basic'
    },
    {
      id: 2,
      name: 'Premium',
      price: '299K',
      period: '/ event',
      desc: 'Paling diminati pasangan.',
      features: [
        'Semua Tema (Netflix/IG)',
        'Masa Aktif 1 Tahun',
        'Custom Musik (YouTube)',
        'RSVP & Ucapan Realtime',
        'Kuota Tamu Unlimited',
        'Peta Lokasi Interaktif'
      ],
      isPopular: true, // Highlight card ini
      buttonText: 'Pilih Premium'
    },
    {
      id: 3,
      name: 'Exclusive',
      price: '499K',
      period: '/ event',
      desc: 'Fitur lengkap + Domain sendiri.',
      features: [
        'Semua Fitur Premium',
        'Custom Domain (.com)',
        'Masa Aktif Selamanya',
        'Galeri Video',
        'Prioritas Support 24/7',
        'Revisi Sepuasnya'
      ],
      isPopular: false,
      buttonText: 'Hubungi Kami'
    }
  ];

}
