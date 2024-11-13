-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 13, 2024 at 03:13 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uts_iot`
--

-- --------------------------------------------------------

--
-- Table structure for table `sensor_data`
--

CREATE TABLE `sensor_data` (
  `id` int NOT NULL,
  `temperature` float NOT NULL,
  `humidity` float NOT NULL,
  `brightness` int NOT NULL,
  `timestamp` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `sensor_data`
--

INSERT INTO `sensor_data` (`id`, `temperature`, `humidity`, `brightness`, `timestamp`) VALUES
(1, 36.5, 45, 20, '2024-11-12 11:00:06'),
(2, 32.2, 65, 15, '2024-11-12 11:09:15'),
(3, 29.8, 60, 10, '2024-11-12 12:00:00'),
(4, 32.2, 65, 15, '2024-11-12 12:21:15'),
(5, 34.8, 50, 22, '2024-11-12 13:50:37'),
(7, 20.2, 40, 61, '2024-11-13 13:16:53'),
(8, 20.2, 40, 58, '2024-11-13 13:16:55'),
(10, 20.2, 40, 75, '2024-11-13 13:17:02'),
(12, 39.3, 68, 62, '2024-11-13 13:29:57'),
(15, 39.3, 68, 20, '2024-11-13 13:32:06'),
(19, 39.3, 68, 56, '2024-11-13 13:32:14'),
(20, 39.3, 68, 83, '2024-11-13 13:32:14'),
(21, 52, 40, 66, '2024-11-13 15:01:20'),
(22, 52, 40, 63, '2024-11-13 15:02:25'),
(23, 52, 40, 85, '2024-11-13 15:02:37');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sensor_data`
--
ALTER TABLE `sensor_data`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sensor_data`
--
ALTER TABLE `sensor_data`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
