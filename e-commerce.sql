-- phpMyAdmin SQL Dump
-- version 4.0.4.1
-- http://www.phpmyadmin.net
--
-- Inang: 127.0.0.1
-- Waktu pembuatan: 09 Feb 2016 pada 00.22
-- Versi Server: 5.6.11
-- Versi PHP: 5.5.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Basis data: `e-commerce`
--
CREATE DATABASE IF NOT EXISTS `e-commerce` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `e-commerce`;

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `id_admin` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  PRIMARY KEY (`id_admin`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1 ;

-- --------------------------------------------------------

--
-- Struktur dari tabel `blogg`
--

CREATE TABLE IF NOT EXISTS `blogg` (
  `id_blogg` int(11) NOT NULL,
  `judul` varchar(50) NOT NULL,
  `subjudul` varchar(50) NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deskripsi` text NOT NULL,
  PRIMARY KEY (`id_blogg`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Struktur dari tabel `cekout`
--

CREATE TABLE IF NOT EXISTS `cekout` (
  `id_cekout` varchar(100) NOT NULL,
  `id_customer` int(11) NOT NULL,
  `metode` varchar(50) NOT NULL,
  `ship` varchar(50) NOT NULL,
  `nama_ship` varchar(50) NOT NULL,
  `alamat_ship` text NOT NULL,
  `telephone_ship` varchar(20) NOT NULL,
  `tanggal` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '1:belum bayar 2: sudah bayar 3: sedang dikirim 4:studah diterima',
  `nama_bill` varchar(50) NOT NULL,
  `alamat_bill` text NOT NULL,
  `telephone_bill` varchar(20) NOT NULL,
  `keterangan` text NOT NULL,
  PRIMARY KEY (`id_cekout`),
  KEY `id_customer` (`id_customer`),
  KEY `id_metode` (`metode`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `cekout`
--

INSERT INTO `cekout` (`id_cekout`, `id_customer`, `metode`, `ship`, `nama_ship`, `alamat_ship`, `telephone_ship`, `tanggal`, `status`, `nama_bill`, `alamat_bill`, `telephone_bill`, `keterangan`) VALUES
('090220160539505304', 1, 'Bank Transfer', 'JNE', 'M Octaviano', 'Kopo', '1453636', '2016-02-08 22:39:50', 1, 'M Octaviano Pratama', 'Kopo', '081315535', ''),
('09022016054323863', 1, 'Kartu Kredit', 'Tiki', 'M Octaviano', 'Kopo', '1453636', '2016-02-08 22:43:23', 3, 'M Octaviano Pratama', 'Kopo', '081315535', 'kirimin gan'),
('090220160618396969', 4, 'Bank Transfer', 'JNE', 'Miftah', 'Kopo', '97753535', '2016-02-08 23:18:39', 1, 'Miftahul Madya', 'Komplek Taman Kopo Asri No.33', '09742424', 'Test Kirim');

-- --------------------------------------------------------

--
-- Struktur dari tabel `customer`
--

CREATE TABLE IF NOT EXISTS `customer` (
  `id_customer` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `jenis_kelamin` char(1) NOT NULL,
  `email` varchar(50) NOT NULL,
  `hp` varchar(20) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(100) NOT NULL,
  PRIMARY KEY (`id_customer`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data untuk tabel `customer`
--

INSERT INTO `customer` (`id_customer`, `nama`, `jenis_kelamin`, `email`, `hp`, `username`, `password`) VALUES
(1, 'M Octaviano Pratama', 'P', 'tavgreen008@gmail.com', '081286116407', 'tavgreen', 'e10adc3949ba59abbe56e057f20f883e'),
(3, 'intan kusumadewi', 'W', 'intan@gmail.com', '08174712818', 'intan', '25d55ad283aa400af464c76d713c07ad'),
(4, 'Miftahul Madyaa', 'P', 'miftah@gmail.com', '0814717313', 'miftah', '0860dfc81a442d5c56230c8f5cebf1d5');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kategori`
--

CREATE TABLE IF NOT EXISTS `kategori` (
  `id_kategori` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `deskripsi` text NOT NULL,
  PRIMARY KEY (`id_kategori`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data untuk tabel `kategori`
--

INSERT INTO `kategori` (`id_kategori`, `nama`, `deskripsi`) VALUES
(1, 'Mainan', 'Kategori Mainan Anak\r\n'),
(2, 'Buku', 'Kategori Buku'),
(3, 'Elektronik', 'Kategori Elektronika');

-- --------------------------------------------------------

--
-- Struktur dari tabel `metode`
--

CREATE TABLE IF NOT EXISTS `metode` (
  `id_metode` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `deskripsi` text NOT NULL,
  `logo` varchar(50) NOT NULL,
  PRIMARY KEY (`id_metode`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data untuk tabel `metode`
--

INSERT INTO `metode` (`id_metode`, `nama`, `deskripsi`, `logo`) VALUES
(1, 'Bank Transfer', 'Transfer Bank Antara Rekening', 'bank.jpg'),
(2, 'Kartu Kredit', 'Transfer bank antara kartu kredit', 'kredit.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `pembelian`
--

CREATE TABLE IF NOT EXISTS `pembelian` (
  `id_customer` int(11) NOT NULL,
  `id_produk` int(11) NOT NULL,
  `qty` int(5) NOT NULL DEFAULT '1',
  `tanggal` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `id_cekout` varchar(100) NOT NULL,
  `status` int(1) NOT NULL DEFAULT '1' COMMENT '1: keranjang 2: completed',
  PRIMARY KEY (`id_customer`,`id_produk`,`tanggal`),
  KEY `id_produk` (`id_produk`),
  KEY `id_cekout` (`id_cekout`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data untuk tabel `pembelian`
--

INSERT INTO `pembelian` (`id_customer`, `id_produk`, `qty`, `tanggal`, `id_cekout`, `status`) VALUES
(0, 1, 1, '2016-02-06 15:27:31', '0', 1),
(0, 2, 1, '2016-02-06 15:27:35', '0', 1),
(1, 1, 1, '2016-02-08 01:55:10', '90220160539505304', 2),
(1, 2, 2, '2016-02-08 01:55:12', '90220160539505304', 2),
(1, 2, 2, '2016-02-08 22:41:02', '9022016054323863', 2),
(1, 3, 1, '2016-02-08 01:55:05', '90220160539505304', 2),
(1, 4, 3, '2016-02-08 01:55:17', '90220160539505304', 2),
(1, 4, 4, '2016-02-08 22:41:04', '9022016054323863', 2),
(3, 3, 1, '2016-02-06 15:35:19', '0', 1),
(4, 3, 1, '2016-02-08 23:17:58', '90220160618396969', 2);

-- --------------------------------------------------------

--
-- Struktur dari tabel `produk`
--

CREATE TABLE IF NOT EXISTS `produk` (
  `id_produk` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `deskripsi_singkat` text NOT NULL,
  `harga` int(11) NOT NULL,
  `harga_coret` int(11) NOT NULL,
  `deskripsi_lengkap` text NOT NULL,
  `status` int(1) NOT NULL COMMENT '1:top rate 2:promo 3:reguler',
  `stok` int(11) NOT NULL,
  `rate` int(5) NOT NULL,
  `id_kategori` int(11) NOT NULL,
  `gambar` varchar(50) NOT NULL,
  PRIMARY KEY (`id_produk`),
  KEY `id_kategori` (`id_kategori`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data untuk tabel `produk`
--

INSERT INTO `produk` (`id_produk`, `nama`, `deskripsi_singkat`, `harga`, `harga_coret`, `deskripsi_lengkap`, `status`, `stok`, `rate`, `id_kategori`, `gambar`) VALUES
(1, 'Mouse', 'Mouse untuk komputer', 50000, 70000, 'mouse untuk komputer', 1, 5, 5, 3, 'img-product1.jpg'),
(2, 'Laptop', 'Laptop toshiba', 3000000, 3500000, 'Laptop Good', 2, 10, 5, 3, 'img-product2.jpg'),
(3, 'Android Studio Programming Book', 'Buku mengenai pemrograman android', 300000, 400000, 'Buku Android Studio Lengkap', 2, 30, 5, 2, 'img-product2.jpg'),
(4, 'PC', 'Personal Computer', 4500000, 5000000, 'Personal Computer Spek Tinggi', 3, 10, 4, 3, 'product-detail-1.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `ship`
--

CREATE TABLE IF NOT EXISTS `ship` (
  `id_ship` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` varchar(50) NOT NULL,
  PRIMARY KEY (`id_ship`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data untuk tabel `ship`
--

INSERT INTO `ship` (`id_ship`, `nama`, `deskripsi`, `gambar`) VALUES
(1, 'Tiki', 'Transfer dengan Tiki', 'tiki.jpg'),
(2, 'JNE', 'Transfer dengan JNE', 'jne.jpg');

-- --------------------------------------------------------

--
-- Struktur dari tabel `slide`
--

CREATE TABLE IF NOT EXISTS `slide` (
  `id_slide` int(11) NOT NULL AUTO_INCREMENT,
  `nama` varchar(50) NOT NULL,
  `deskripsi` text NOT NULL,
  `gambar` varchar(50) NOT NULL,
  `status` int(1) NOT NULL COMMENT '1: tampil 2:tidak',
  `kode` int(2) NOT NULL COMMENT '1: save 50% 2: save 75%',
  PRIMARY KEY (`id_slide`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3 ;

--
-- Dumping data untuk tabel `slide`
--

INSERT INTO `slide` (`id_slide`, `nama`, `deskripsi`, `gambar`, `status`, `kode`) VALUES
(1, 'Express Yourself', 'Meet the bright of hapiness', 'img-banner1.jpg', 1, 1),
(2, 'Winter 50% Sale', 'in winter, you can get stuff with 50% discount', 'img-banner2.jpg', 1, 2);

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `cekout`
--
ALTER TABLE `cekout`
  ADD CONSTRAINT `cekout_ibfk_1` FOREIGN KEY (`id_customer`) REFERENCES `customer` (`id_customer`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `pembelian`
--
ALTER TABLE `pembelian`
  ADD CONSTRAINT `pembelian_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `produk` (`id_produk`);

--
-- Ketidakleluasaan untuk tabel `produk`
--
ALTER TABLE `produk`
  ADD CONSTRAINT `produk_ibfk_1` FOREIGN KEY (`id_kategori`) REFERENCES `kategori` (`id_kategori`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
