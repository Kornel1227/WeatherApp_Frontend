-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Okt 18. 21:58
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `weather_app`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` char(40) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `last_login` timestamp NULL DEFAULT NULL,
  `login_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`, `last_login`, `login_count`, `is_active`) VALUES
(1, 'admin', 'admin@gmail.com', 'c8c92403974357694c59febc9967aa7699a3dc12', 'admin', '2026-10-17 09:04:19', '2026-10-18 19:52:17', '2026-10-18 19:21:41', 3, 1),
(2, 'Belaaaaa', 'belaaaaa@gmail.com', 'a69f0ee7b4980c04068525096b7f6b0569958b2c', 'user', '2026-10-17 09:04:19', '2026-10-18 19:51:37', NULL, 0, 1),
(3, 'Tóth Kornél', 'tothkornel2008@gmail.com', 'c43745ddf10ad8ebe92df129599d58b8cb49df0e', 'user', '2026-10-18 16:28:21', '2026-10-18 19:53:51', '2026-10-18 19:53:51', 8, 1),
(5, 'Test Guest', 'guesttest@gmail.com', '4bd074cf429ab454cd7bee74be51083a93cd8aa9', 'user', '2026-10-18 19:55:49', '2026-10-18 19:55:54', '2026-10-18 19:55:54', 1, 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `weather_forecasts`
--

CREATE TABLE `weather_forecasts` (
  `ID` int(10) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `location` varchar(150) NOT NULL,
  `temp_min` decimal(5,2) NOT NULL,
  `temp_max` decimal(5,2) NOT NULL,
  `weather_type` varchar(50) NOT NULL,
  `precipitation_probability` tinyint(3) UNSIGNED NOT NULL DEFAULT 0,
  `wind_speed` decimal(6,2) NOT NULL DEFAULT 0.00,
  `uv_index` decimal(4,2) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ;

--
-- A tábla adatainak kiíratása `weather_forecasts`
--

INSERT INTO `weather_forecasts` (`ID`, `date`, `location`, `temp_min`, `temp_max`, `weather_type`, `precipitation_probability`, `wind_speed`, `uv_index`, `created_at`, `updated_at`) VALUES
(1, '2026-10-19', 'Baja', 11.00, 21.00, 'Cloudy', 20, 15.00, 2.00, '2026-10-15 20:18:48', '2026-10-18 21:39:41'),
(2, '2026-10-15', 'Baja', 12.00, 21.00, 'Napos', 5, 10.00, 4.00, '2026-10-15 20:18:48', '2026-10-15 20:18:48'),
(3, '2026-10-17', 'Baja', 10.00, 20.00, 'Sunny', 33, 60.00, 70.00, '2026-10-18 18:52:07', '2026-10-18 18:52:07'),
(4, '2026-10-13', 'Baja', 11.00, 21.00, 'Cloudy', 20, 15.00, 2.00, '2026-10-18 19:06:32', '2026-10-18 21:41:00'),
(6, '2026-10-12', 'Baja', 10.00, 20.00, 'Sunny', 10, 12.00, 3.00, '2026-10-18 21:38:04', '2026-10-18 21:38:04');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `unique_email` (`email`);

--
-- A tábla indexei `weather_forecasts`
--
ALTER TABLE `weather_forecasts`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `weather_forecasts`
--
ALTER TABLE `weather_forecasts`
  MODIFY `ID` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
