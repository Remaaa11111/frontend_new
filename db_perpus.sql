-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 03, 2025 at 06:52 AM
-- Server version: 8.0.30
-- PHP Version: 8.4.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_perpus`
--

-- --------------------------------------------------------

--
-- Table structure for table `books`
--

CREATE TABLE `books` (
  `id_buku` int NOT NULL,
  `judul` varchar(200) NOT NULL,
  `penulis` varchar(200) NOT NULL,
  `status` varchar(20) DEFAULT 'Tersedia',
  `tanggal_pinjam` date DEFAULT NULL,
  `tanggal_kembali` date DEFAULT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `books`
--

INSERT INTO `books` (`id_buku`, `judul`, `penulis`, `status`, `tanggal_pinjam`, `tanggal_kembali`, `cover_image`, `genre`) VALUES
(5, 'belajar coding\n', 'Teguh Dermawan', 'tersedia', '2025-06-24', '2024-06-27', 'https://th.bing.com/th/id/OSK.56824888c78d672aece69be7be5d66a2?w=120&h=168&c=7&rs=1&qlt=80&o=6&cb=ircwebp1&dpr=1.5&pid=SANGAM', NULL),
(6, 'cara menjadi sigma', 'amaragita', 'tersedia', '2025-06-24', '2024-06-27', 'https://th.bing.com/th/id/OSK.56824888c78d672aece69be7be5d66a2?w=120&h=168&c=7&rs=1&qlt=80&o=6&cb=ircwebp1&dpr=1.5&pid=SANGAM', NULL),
(7, 'cara menjadi sigma', 'Dyan', 'tersedia', '2025-06-24', '2024-06-27', 'https://th.bing.com/th/id/OSK.56824888c78d672aece69be7be5d66a2?w=120&h=168&c=7&rs=1&qlt=80&o=6&cb=ircwebp1&dpr=1.5&pid=SANGAM', NULL),
(11, 'Mariposa', 'SiapaYa', 'tersedia', '2025-06-24', '2024-06-27', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1547083836i/43526083.jpg', NULL),
(12, 'kita bahagia', 'Amaragita Tiarani Wicaya', 'tidak tersedia', '2025-07-03', '2024-07-06', 'https://th.bing.com/th/id/OSK.56824888c78d672aece69be7be5d66a2?w=120&h=168&c=7&rs=1&qlt=80&o=6&cb=ircwebp1&dpr=1.5&pid=SANGAM', 'fiction');

-- --------------------------------------------------------

--
-- Table structure for table `loans`
--

CREATE TABLE `loans` (
  `id` int NOT NULL,
  `id_buku` int NOT NULL,
  `id_anggota` int NOT NULL,
  `tanggal_pinjam` date DEFAULT NULL,
  `tanggal_kembali` date DEFAULT NULL,
  `denda` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `loans`
--

INSERT INTO `loans` (`id`, `id_buku`, `id_anggota`, `tanggal_pinjam`, `tanggal_kembali`, `denda`) VALUES
(9, 5, 2, '2025-06-21', '2025-06-28', 0);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id_anggota` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id_anggota`, `nama`, `telepon`, `email`) VALUES
(2, 'Amaragita', '+62 897-7217-561', 'amaragita@student.undiksha.ac.id'),
(3, 'Amaragitaaaa', '+62 897-7217-562', 'amaragita@student.undiksha.ac.id'),
(4, 'Amaragitaaa', '+62 897-7217-561', 'amaragita@student.undiksha.ac.id');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'rema', '$2b$12$N2SaqapcvIu40zhxQvCyduFUmCK4rKoLO4bjZAnDES8MEQF7oxReK'),
(2, 'Amaragita', '$2b$12$KmpMbK8B14nndZY2JcNsbO3Arlz.yztfvc37k8oHhM2qGQWcztTES'),
(3, 'amaragitaa', '$2b$12$7rU9apzY3CKWhN4Cwft81./CkFihHNDsjQpMamAK6qum9XXNcMi/m');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id_buku`);

--
-- Indexes for table `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_buku` (`id_buku`),
  ADD KEY `id_anggota` (`id_anggota`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id_anggota`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `books`
--
ALTER TABLE `books`
  MODIFY `id_buku` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `loans`
--
ALTER TABLE `loans`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id_anggota` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`id_buku`) REFERENCES `books` (`id_buku`),
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`id_anggota`) REFERENCES `members` (`id_anggota`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
