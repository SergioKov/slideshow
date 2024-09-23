-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-09-2024 a las 17:36:46
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_slideshow`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `slides`
--

CREATE TABLE `slides` (
  `id_slide` int(10) NOT NULL,
  `id_user` int(10) DEFAULT NULL,
  `id_tema` int(10) NOT NULL,
  `slide_actual` int(3) NOT NULL,
  `is_shown` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `slides`
--

INSERT INTO `slides` (`id_slide`, `id_user`, `id_tema`, `slide_actual`, `is_shown`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 3, 1, NULL, '2024-09-23 17:35:47');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temas`
--

CREATE TABLE `temas` (
  `id_tema` int(10) NOT NULL,
  `id_user` int(10) DEFAULT NULL,
  `titulo` varchar(255) NOT NULL,
  `contenido` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `autor` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `temas`
--

INSERT INTO `temas` (`id_tema`, `id_user`, `titulo`, `contenido`, `autor`, `created_at`, `updated_at`) VALUES
(1, 1, 'la fé ... ¿qué es?', '{\n    \"titulo\": \"de_bd_un_tema\",\n    \"slides\": [\n        {\n            \"slide_number\": \"1\",\n            \"content\": \"1) <b>dfsdfgh</b>es <h1>sdsdfhdh</h1> contenido de slide aki.. djdfjd fjdfghj dfgj j111111111111111111111\"\n        },\n        {\n            \"slide_number\": \"2\",\n            \"content\": \"2) es contenido de slide aki.. dfjfgjdfgj dfgj 2222222222222222222222\"\n        },\n        {\n            \"slide_number\": \"3\",\n            \"content\": \"3) es contenido de slide aki.. dfgj dfgjdfgj  333333333333333333\"\n        },\n        {\n            \"slide_number\": \"4\",\n            \"content\": \"4) es contenido de slide aki.. dfgj dfgjdfgj 444444444444444\"\n        },\n        {\n            \"slide_number\": \"5\",\n            \"content\": \"5) es contenido de slide aki.. dfgj dfgjdfgj 555555555555555\"\n        }\n    ]\n}', 'the autor', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `slides`
--
ALTER TABLE `slides`
  ADD PRIMARY KEY (`id_slide`);

--
-- Indices de la tabla `temas`
--
ALTER TABLE `temas`
  ADD PRIMARY KEY (`id_tema`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `slides`
--
ALTER TABLE `slides`
  MODIFY `id_slide` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `temas`
--
ALTER TABLE `temas`
  MODIFY `id_tema` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
