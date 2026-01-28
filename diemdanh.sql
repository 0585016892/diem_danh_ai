-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: localhost
-- Thời gian đã tạo: Th1 28, 2026 lúc 02:42 PM
-- Phiên bản máy phục vụ: 10.4.28-MariaDB
-- Phiên bản PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `diemdanh`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendances`
--

CREATE TABLE `attendances` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `class_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `status` enum('present','absent','late') DEFAULT 'present',
  `image_capture` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `attendances`
--

INSERT INTO `attendances` (`id`, `student_id`, `class_id`, `date`, `status`, `image_capture`, `created_at`) VALUES
(82, 25, 1, '2026-01-28', 'late', 'att-25-1769606617148.jpg', '2026-01-28 13:23:37'),
(83, 24, 1, '2026-01-28', 'late', 'att-24-1769607336523.jpg', '2026-01-28 13:35:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `attendance_logs`
--

CREATE TABLE `attendance_logs` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `class_id` int(11) DEFAULT NULL,
  `event` varchar(50) DEFAULT NULL,
  `data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`data`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `grade` varchar(20) DEFAULT NULL,
  `school_year` varchar(20) DEFAULT NULL,
  `homeroom_teacher_id` int(11) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `max_students` int(11) DEFAULT 50,
  `description` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `start_time` time NOT NULL DEFAULT '07:30:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `classes`
--

INSERT INTO `classes` (`id`, `name`, `grade`, `school_year`, `homeroom_teacher_id`, `room`, `max_students`, `description`, `status`, `created_at`, `updated_at`, `start_time`) VALUES
(1, 'Lớp 1A', '1', '2025', 2, '101', 40, 'Lớp 1A của cô giáo Trang', 'active', '2026-01-27 10:14:23', '2026-01-27 10:20:19', '07:30:00'),
(2, 'Lớp 2A', '2', '2025-2026', 4, '201', 40, 'Lớp 2A', 'active', '2026-01-27 10:23:07', '2026-01-27 10:23:07', '07:30:00'),
(3, 'Lớp 3A', '3', '2025-2026', 5, '301', 40, 'Lớp 3a', 'active', '2026-01-28 09:38:09', '2026-01-28 09:44:50', '07:30:00'),
(4, 'Lớp 4A', '4', '2025-2026', 6, '401', 30, 'Alo', 'active', '2026-01-28 09:38:30', '2026-01-28 09:44:54', '07:30:00'),
(5, 'Lớp 5A', '5', '2025-2026', 7, '501', 40, '1', 'active', '2026-01-28 09:38:53', '2026-01-28 09:44:58', '07:30:00');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `class_id` int(11) NOT NULL,
  `type` varchar(255) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `is_read` tinyint(4) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `student_id`, `class_id`, `type`, `title`, `content`, `is_read`, `created_at`) VALUES
(1, 25, 1, 'attendance', 'Điểm danh', 'Trần Hưng đã điểm danh', 1, '2026-01-28 15:14:00'),
(2, 25, 1, 'attendance', 'Điểm danh', 'Trần Hưng đã điểm danh', 1, '2026-01-28 15:14:43'),
(3, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 16:59:04'),
(4, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 17:22:46'),
(5, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 17:24:48'),
(6, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 17:26:50'),
(7, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 17:28:11'),
(8, 24, 1, 'attendance', 'Điểm danh muộn', 'Nguyễn Thị Trang đến muộn', 0, '2026-01-28 19:05:32'),
(9, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 20:05:33'),
(10, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 20:08:20'),
(11, 25, 1, 'attendance', 'Điểm danh muộn', 'Trần Hưng đến muộn', 0, '2026-01-28 20:08:36');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `students`
--

CREATE TABLE `students` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `student_code` varchar(50) NOT NULL,
  `class_id` int(11) NOT NULL,
  `face_encoding` longtext DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `gender` enum('male','female','other') DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `face_image` varchar(255) DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `note` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `students`
--

INSERT INTO `students` (`id`, `name`, `student_code`, `class_id`, `face_encoding`, `created_at`, `gender`, `date_of_birth`, `phone`, `email`, `address`, `face_image`, `status`, `note`, `updated_at`) VALUES
(24, 'Nguyễn Thị Trang', 'Trang01', 1, '[-0.07907035201787949,0.10045632719993591,0.07372898608446121,-0.08784500509500504,-0.13836026191711426,-0.011467437259852886,-0.07878319919109344,-0.10744193196296692,0.1457969695329666,-0.1782056838274002,0.2770005166530609,-0.08330056071281433,-0.2945481538772583,-0.057268187403678894,-0.05962855741381645,0.1772666573524475,-0.20375128090381622,-0.10465145111083984,-0.010931440629065037,0.049951426684856415,0.1234334409236908,-0.01999402418732643,0.04000956565141678,-0.036830004304647446,-0.09570036828517914,-0.4265599548816681,-0.11840807646512985,-0.07593350112438202,-0.031508900225162506,-0.06380710005760193,-0.06677218526601791,-0.022367853671312332,-0.20404471457004547,-0.043804507702589035,-0.01292333658784628,0.03481483459472656,-0.08540278673171997,-0.10163115710020065,0.15011073648929596,-0.01717539317905903,-0.25309714674949646,-0.0323835052549839,0.024393074214458466,0.22397930920124054,0.1497613936662674,0.06877195835113525,0.030608344823122025,-0.1475759744644165,0.1324795037508011,-0.21326157450675964,0.07472549378871918,0.10555566102266312,0.02462136372923851,0.04847116768360138,0.030963828787207603,-0.11796853691339493,0.05189935863018036,0.1309879869222641,-0.15335792303085327,0.016669083386659622,0.1406862884759903,-0.11490371078252792,-0.040062759071588516,-0.09769175201654434,0.2746995985507965,0.09460172802209854,-0.11391851305961609,-0.19820256531238556,0.11066649109125137,-0.11976930499076843,-0.040001608431339264,0.07648331671953201,-0.16379626095294952,-0.18110720813274384,-0.30202198028564453,-0.010335439816117287,0.3793889284133911,0.07843109220266342,-0.11677344888448715,-0.006891390308737755,-0.07416393607854843,0.018126990646123886,0.16471146047115326,0.14056585729122162,0.03945222124457359,0.02481915056705475,-0.1364397406578064,0.0144291827455163,0.24857445061206818,-0.1581987738609314,-0.0388527549803257,0.23484428226947784,-0.04987308382987976,0.04411222040653229,0.012540110386908054,0.021840794011950493,-0.12762343883514404,0.024809276685118675,-0.11708051711320877,-0.009986484423279762,0.06217573210597038,-0.061106953769922256,-0.06850045174360275,0.11016824096441269,-0.14513754844665527,0.07343317568302155,-0.03945592790842056,0.03329366818070412,0.043381478637456894,-0.13664156198501587,-0.11504669487476349,-0.08861321955919266,0.10379257053136826,-0.235573872923851,0.19852882623672485,0.15323352813720703,0.09514691680669785,0.12641304731369019,0.09918539971113205,0.03751759231090546,-0.03674842044711113,-0.049207303673028946,-0.2609643340110779,-0.011984649114310741,0.10061702132225037,0.02831791527569294,0.07629524916410446,-0.05473853275179863]', '2026-01-28 02:28:42', 'female', '2025-12-31', '0987654321', 'trang@gmail.com', 'Hà nội', '1769567322246.jpeg', 'active', NULL, '2026-01-28 02:28:42'),
(25, 'Trần Hưng', 'Hưng01', 1, '[-0.1424318253993988,0.13208313286304474,0.0530477911233902,-0.046055905520915985,-0.09145650267601013,-0.09831074625253677,-0.05981402471661568,-0.15250733494758606,0.1850292831659317,-0.08124835044145584,0.3212910592556,-0.0006188325933180749,-0.19186308979988098,-0.21322672069072723,0.019097592681646347,0.1786394864320755,-0.22308632731437683,-0.13300901651382446,0.016095662489533424,-0.08746550977230072,0.05750510096549988,-0.07911281287670135,0.05106842890381813,0.12302915006875992,-0.0874621644616127,-0.29217174649238586,-0.0585266537964344,-0.12780632078647614,0.0800696313381195,-0.06191248446702957,-0.11071702837944031,0.02592233382165432,-0.171727254986763,-0.14170828461647034,0.026565134525299072,0.09728850424289703,-0.05310196429491043,-0.04117904230952263,0.20622193813323975,-0.09084395319223404,-0.19191165268421173,0.015080937184393406,0.013788019306957722,0.2574141323566437,0.19997072219848633,0.034105245023965836,0.01864926889538765,-0.09874758124351501,0.13840831816196442,-0.12215473502874374,0.07014822959899902,0.16293519735336304,0.17733678221702576,-0.010811494663357735,0.0552048496901989,-0.2117719203233719,-0.04899980127811432,0.16406431794166565,-0.17323645949363708,-0.007649559993296862,-0.0013224490685388446,-0.08423545211553574,-0.015034720301628113,-0.11505372077226639,0.2519136071205139,0.1501547247171402,-0.12079080939292908,-0.15920895338058472,0.1565239429473877,-0.07852767407894135,-0.06041613966226578,0.11044378578662872,-0.18169978260993958,-0.19204872846603394,-0.2806611657142639,0.02548394724726677,0.36222466826438904,0.09123826771974564,-0.20920740067958832,0.00868221651762724,-0.038581009954214096,-0.03839721530675888,0.08165530115365982,0.15747545659542084,-0.04018617421388626,0.010803647339344025,-0.0860433503985405,-0.026255281642079353,0.09673018008470535,-0.04484789818525314,-0.04903293028473854,0.1800258606672287,-0.013796249404549599,0.07980606704950333,-0.0012179656187072396,-0.02285304293036461,-0.08596716076135635,0.08028551936149597,-0.1528092324733734,-0.05523678660392761,0.004560563713312149,-0.02802901342511177,0.0179911982268095,0.07577487826347351,-0.15307852625846863,0.029232067987322807,0.04474809765815735,0.05404265969991684,-0.055320799350738525,-0.0050326157361269,-0.06080673635005951,-0.06362421810626984,0.10427365452051163,-0.2739925980567932,0.2697289288043976,0.18933634459972382,0.06300228089094162,0.1629830002784729,0.07331438362598419,0.013359772972762585,0.03715375438332558,-0.08358168601989746,-0.1416526585817337,0.030150776728987694,0.11235868185758591,-0.08543827384710312,0.13855873048305511,0.00783019419759512]', '2026-01-28 02:29:14', 'male', '2025-12-29', '0585016892', 'hungtk1807@gmail.com', 'Hà nội', '1769587365593.jpeg', 'active', NULL, '2026-01-28 08:02:45'),
(26, 'Nguyễn Long', 'HS001', 2, NULL, '2026-01-28 09:42:01', 'male', '2008-02-15', '0925117097', 'hs1@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(27, 'Đặng Trang', 'HS002', 2, NULL, '2026-01-28 09:42:01', 'male', '2008-01-29', '0960569598', 'hs2@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(28, 'Phạm Bình', 'HS003', 4, NULL, '2026-01-28 09:42:01', 'female', '2007-01-04', '0915077785', 'hs3@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(29, 'Đặng Hà', 'HS004', 2, NULL, '2026-01-28 09:42:01', 'female', '2008-11-11', '0912625475', 'hs4@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(30, 'Lê Minh', 'HS005', 2, NULL, '2026-01-28 09:42:01', 'female', '2008-03-24', '0971084178', 'hs5@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(31, 'Phan Trang', 'HS006', 4, NULL, '2026-01-28 09:42:01', 'male', '2007-12-07', '0975603202', 'hs6@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(32, 'Hoàng Vy', 'HS007', 3, NULL, '2026-01-28 09:42:01', 'female', '2006-03-28', '0928749094', 'hs7@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(33, 'Phan Minh', 'HS008', 5, NULL, '2026-01-28 09:42:01', 'female', '2007-05-30', '0953002731', 'hs8@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(34, 'Nguyễn Vy', 'HS009', 1, NULL, '2026-01-28 09:42:01', 'female', '2007-01-31', '0922428811', 'hs9@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(35, 'Đặng Châu', 'HS010', 3, NULL, '2026-01-28 09:42:01', 'male', '2008-07-07', '0942832653', 'hs10@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(36, 'Phạm Hùng', 'HS011', 2, NULL, '2026-01-28 09:42:01', 'female', '2006-09-25', '0979775886', 'hs11@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(37, 'Hoàng Long', 'HS012', 4, NULL, '2026-01-28 09:42:01', 'female', '2008-08-27', '0923238181', 'hs12@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(38, 'Lê Bình', 'HS013', 4, NULL, '2026-01-28 09:42:01', 'male', '2006-11-07', '0988866791', 'hs13@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(39, 'Lê Quân', 'HS014', 4, NULL, '2026-01-28 09:42:01', 'female', '2006-04-20', '0944839381', 'hs14@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(40, 'Đặng Hà', 'HS015', 1, NULL, '2026-01-28 09:42:01', 'female', '2006-01-01', '0974238055', 'hs15@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(41, 'Đặng Hà', 'HS016', 3, NULL, '2026-01-28 09:42:01', 'female', '2008-03-24', '0990841690', 'hs16@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(42, 'Trần Long', 'HS017', 1, NULL, '2026-01-28 09:42:01', 'female', '2007-02-23', '0989240050', 'hs17@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(43, 'Lê Hà', 'HS018', 2, NULL, '2026-01-28 09:42:01', 'female', '2006-09-08', '0928237295', 'hs18@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(44, 'Huỳnh Vy', 'HS019', 3, NULL, '2026-01-28 09:42:01', 'female', '2006-10-18', '0962170873', 'hs19@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(45, 'Lê Trang', 'HS020', 2, NULL, '2026-01-28 09:42:01', 'male', '2007-08-26', '0937972570', 'hs20@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(46, 'Nguyễn Dũng', 'HS021', 2, NULL, '2026-01-28 09:42:01', 'female', '2007-04-01', '0954393271', 'hs21@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(47, 'Vũ Bình', 'HS022', 4, NULL, '2026-01-28 09:42:01', 'male', '2006-12-09', '0992561627', 'hs22@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(48, 'Đặng Minh', 'HS023', 1, NULL, '2026-01-28 09:42:01', 'female', '2006-11-29', '0992066472', 'hs23@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(49, 'Đặng Hà', 'HS024', 4, NULL, '2026-01-28 09:42:01', 'male', '2007-09-13', '0924128425', 'hs24@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(50, 'Đặng Hà', 'HS025', 2, NULL, '2026-01-28 09:42:01', 'male', '2007-03-22', '0912805135', 'hs25@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(51, 'Vũ Châu', 'HS026', 1, NULL, '2026-01-28 09:42:01', 'male', '2007-06-13', '0963042062', 'hs26@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(52, 'Hoàng Vy', 'HS027', 5, NULL, '2026-01-28 09:42:01', 'male', '2006-12-31', '0990083378', 'hs27@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(53, 'Trần Hải', 'HS028', 1, NULL, '2026-01-28 09:42:01', 'male', '2008-01-28', '0937244035', 'hs28@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(54, 'Đặng Dũng', 'HS029', 1, NULL, '2026-01-28 09:42:01', 'male', '2006-02-20', '0985451666', 'hs29@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(55, 'Lê Hà', 'HS030', 1, NULL, '2026-01-28 09:42:01', 'male', '2006-11-10', '0988097770', 'hs30@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(56, 'Phạm Trang', 'HS031', 5, NULL, '2026-01-28 09:42:01', 'male', '2007-07-27', '0918506513', 'hs31@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(57, 'Huỳnh Hà', 'HS032', 2, NULL, '2026-01-28 09:42:01', 'female', '2008-07-03', '0981188705', 'hs32@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(58, 'Huỳnh Khánh', 'HS033', 2, NULL, '2026-01-28 09:42:01', 'male', '2008-09-29', '0949261111', 'hs33@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(59, 'Lê Long', 'HS034', 3, NULL, '2026-01-28 09:42:01', 'male', '2008-07-19', '0966946283', 'hs34@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(60, 'Hoàng Hải', 'HS035', 3, NULL, '2026-01-28 09:42:01', 'male', '2008-11-13', '0931477227', 'hs35@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(61, 'Phạm Khánh', 'HS036', 5, NULL, '2026-01-28 09:42:01', 'male', '2007-10-01', '0945622140', 'hs36@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(62, 'Phạm Nam', 'HS037', 2, NULL, '2026-01-28 09:42:01', 'female', '2007-04-14', '0935538312', 'hs37@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(63, 'Nguyễn Trang', 'HS038', 2, NULL, '2026-01-28 09:42:01', 'male', '2008-05-01', '0940671224', 'hs38@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(64, 'Trần Dũng', 'HS039', 1, NULL, '2026-01-28 09:42:01', 'male', '2008-01-23', '0917231446', 'hs39@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(65, 'Phạm Nam', 'HS040', 2, NULL, '2026-01-28 09:42:01', 'female', '2006-03-13', '0987607117', 'hs40@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(66, 'Nguyễn Nam', 'HS041', 1, NULL, '2026-01-28 09:42:01', 'female', '2008-09-14', '0989091313', 'hs41@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(67, 'Trần Phong', 'HS042', 3, NULL, '2026-01-28 09:42:01', 'female', '2006-03-25', '0966580343', 'hs42@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(68, 'Trần Long', 'HS043', 3, NULL, '2026-01-28 09:42:01', 'female', '2006-04-22', '0986291508', 'hs43@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(69, 'Đặng Châu', 'HS044', 1, NULL, '2026-01-28 09:42:01', 'female', '2008-06-28', '0961109646', 'hs44@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(70, 'Trần Dũng', 'HS045', 3, NULL, '2026-01-28 09:42:01', 'female', '2007-08-14', '0973776551', 'hs45@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(71, 'Nguyễn Hà', 'HS046', 1, NULL, '2026-01-28 09:42:01', 'male', '2006-09-04', '0923917943', 'hs46@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(72, 'Võ Hải', 'HS047', 2, NULL, '2026-01-28 09:42:01', 'female', '2006-08-06', '0920045680', 'hs47@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(73, 'Lê Vy', 'HS048', 2, NULL, '2026-01-28 09:42:01', 'female', '2006-09-29', '0943535491', 'hs48@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(74, 'Huỳnh Vy', 'HS049', 3, NULL, '2026-01-28 09:42:01', 'male', '2008-08-12', '0985188269', 'hs49@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(75, 'Phạm Dũng', 'HS050', 2, NULL, '2026-01-28 09:42:01', 'male', '2006-03-21', '0944161246', 'hs50@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(76, 'Hoàng Khánh', 'HS051', 3, NULL, '2026-01-28 09:42:01', 'female', '2006-07-08', '0962808331', 'hs51@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(77, 'Hoàng Phong', 'HS052', 3, NULL, '2026-01-28 09:42:01', 'male', '2008-11-24', '0982707120', 'hs52@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(78, 'Đặng Hùng', 'HS053', 3, NULL, '2026-01-28 09:42:01', 'female', '2007-07-13', '0934003152', 'hs53@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(79, 'Vũ Khánh', 'HS054', 5, NULL, '2026-01-28 09:42:01', 'female', '2006-05-08', '0948118417', 'hs54@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(80, 'Võ Hải', 'HS055', 2, NULL, '2026-01-28 09:42:01', 'female', '2006-11-13', '0972199996', 'hs55@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(81, 'Võ Quân', 'HS056', 2, NULL, '2026-01-28 09:42:01', 'female', '2008-03-31', '0936759434', 'hs56@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(82, 'Trần Khánh', 'HS057', 3, NULL, '2026-01-28 09:42:01', 'male', '2006-12-11', '0965085516', 'hs57@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(83, 'Trần Khánh', 'HS058', 2, NULL, '2026-01-28 09:42:01', 'male', '2008-09-22', '0960351511', 'hs58@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(84, 'Lê Phong', 'HS059', 1, NULL, '2026-01-28 09:42:01', 'female', '2008-11-08', '0986244875', 'hs59@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(85, 'Võ Minh', 'HS060', 4, NULL, '2026-01-28 09:42:01', 'female', '2008-09-10', '0939343367', 'hs60@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(86, 'Đặng Minh', 'HS061', 1, NULL, '2026-01-28 09:42:01', 'male', '2008-07-12', '0980354404', 'hs61@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(87, 'Trần Long', 'HS062', 1, NULL, '2026-01-28 09:42:01', 'female', '2006-09-28', '0971758717', 'hs62@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(88, 'Hoàng An', 'HS063', 1, NULL, '2026-01-28 09:42:01', 'male', '2006-06-27', '0935431204', 'hs63@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(89, 'Phan Minh', 'HS064', 2, NULL, '2026-01-28 09:42:01', 'male', '2007-05-19', '0918200392', 'hs64@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(90, 'Lê Khánh', 'HS065', 5, NULL, '2026-01-28 09:42:01', 'male', '2006-07-24', '0954732016', 'hs65@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(91, 'Võ Minh', 'HS066', 2, NULL, '2026-01-28 09:42:01', 'male', '2007-12-01', '0948728963', 'hs66@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(92, 'Phan Hùng', 'HS067', 2, NULL, '2026-01-28 09:42:01', 'male', '2007-05-07', '0997761447', 'hs67@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(93, 'Trần Phong', 'HS068', 5, NULL, '2026-01-28 09:42:01', 'female', '2006-02-12', '0966902534', 'hs68@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(94, 'Phạm An', 'HS069', 1, NULL, '2026-01-28 09:42:01', 'female', '2006-10-29', '0959845850', 'hs69@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(95, 'Hoàng Long', 'HS070', 3, NULL, '2026-01-28 09:42:01', 'male', '2006-07-16', '0995272559', 'hs70@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(96, 'Hoàng Châu', 'HS071', 3, NULL, '2026-01-28 09:42:01', 'female', '2007-03-11', '0913960115', 'hs71@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(97, 'Trần Khánh', 'HS072', 5, NULL, '2026-01-28 09:42:01', 'male', '2007-02-24', '0975470125', 'hs72@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(98, 'Võ An', 'HS073', 4, NULL, '2026-01-28 09:42:01', 'female', '2006-01-08', '0914798119', 'hs73@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(99, 'Đặng Châu', 'HS074', 4, NULL, '2026-01-28 09:42:01', 'female', '2008-01-27', '0952423146', 'hs74@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(100, 'Phạm An', 'HS075', 2, NULL, '2026-01-28 09:42:01', 'female', '2008-07-09', '0983696096', 'hs75@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(101, 'Đặng Hải', 'HS076', 5, NULL, '2026-01-28 09:42:01', 'female', '2006-01-04', '0944290484', 'hs76@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(102, 'Vũ Bình', 'HS077', 2, NULL, '2026-01-28 09:42:01', 'female', '2006-08-31', '0928251443', 'hs77@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(103, 'Nguyễn Bình', 'HS078', 2, NULL, '2026-01-28 09:42:01', 'male', '2008-09-26', '0998680118', 'hs78@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(104, 'Phan Minh', 'HS079', 5, NULL, '2026-01-28 09:42:01', 'male', '2007-02-20', '0948337437', 'hs79@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(105, 'Trần Hải', 'HS080', 5, NULL, '2026-01-28 09:42:01', 'female', '2006-08-26', '0989905273', 'hs80@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(106, 'Trần Dũng', 'HS081', 3, NULL, '2026-01-28 09:42:01', 'female', '2007-09-23', '0924002453', 'hs81@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(107, 'Trần Vy', 'HS082', 5, NULL, '2026-01-28 09:42:01', 'female', '2006-05-26', '0957613172', 'hs82@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(108, 'Đặng Nam', 'HS083', 2, NULL, '2026-01-28 09:42:01', 'male', '2007-05-15', '0951805914', 'hs83@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(109, 'Lê Long', 'HS084', 1, NULL, '2026-01-28 09:42:01', 'female', '2008-10-29', '0928327900', 'hs84@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(110, 'Hoàng Hà', 'HS085', 1, NULL, '2026-01-28 09:42:01', 'male', '2006-02-17', '0918035059', 'hs85@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(111, 'Huỳnh An', 'HS086', 1, NULL, '2026-01-28 09:42:01', 'female', '2007-03-12', '0951895467', 'hs86@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(112, 'Đặng Phong', 'HS087', 5, NULL, '2026-01-28 09:42:01', 'male', '2006-07-02', '0946230132', 'hs87@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(113, 'Lê Vy', 'HS088', 2, NULL, '2026-01-28 09:42:01', 'male', '2006-03-20', '0996559735', 'hs88@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(114, 'Nguyễn Quân', 'HS089', 4, NULL, '2026-01-28 09:42:01', 'female', '2006-01-28', '0950140262', 'hs89@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(115, 'Phạm Khánh', 'HS090', 3, NULL, '2026-01-28 09:42:01', 'male', '2007-05-12', '0931926259', 'hs90@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(116, 'Phan Minh', 'HS091', 2, NULL, '2026-01-28 09:42:01', 'female', '2007-02-17', '0937282412', 'hs91@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(117, 'Vũ Phong', 'HS092', 1, NULL, '2026-01-28 09:42:01', 'female', '2006-10-08', '0930903226', 'hs92@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(118, 'Vũ Khánh', 'HS093', 4, NULL, '2026-01-28 09:42:01', 'female', '2007-04-22', '0950735364', 'hs93@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(119, 'Huỳnh Nam', 'HS094', 5, NULL, '2026-01-28 09:42:01', 'male', '2006-04-28', '0955445182', 'hs94@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(120, 'Võ Vy', 'HS095', 2, NULL, '2026-01-28 09:42:01', 'male', '2007-01-29', '0965822179', 'hs95@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(121, 'Phan An', 'HS096', 2, NULL, '2026-01-28 09:42:01', 'male', '2006-04-04', '0951042266', 'hs96@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(122, 'Nguyễn Hùng', 'HS097', 4, NULL, '2026-01-28 09:42:01', 'female', '2006-01-05', '0997232403', 'hs97@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(123, 'Phạm Vy', 'HS098', 5, NULL, '2026-01-28 09:42:01', 'male', '2008-02-29', '0986867245', 'hs98@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(124, 'Phan An', 'HS099', 1, NULL, '2026-01-28 09:42:01', 'male', '2006-04-10', '0983517025', 'hs99@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01'),
(125, 'Phan Phong', 'HS100', 3, NULL, '2026-01-28 09:42:01', 'male', '2008-12-10', '0910088314', 'hs100@school.edu.vn', 'Hà Nội', NULL, 'active', 'active', '2026-01-28 09:42:01');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `system_settings`
--

CREATE TABLE `system_settings` (
  `id` int(11) NOT NULL,
  `camera_enabled` tinyint(1) DEFAULT 0,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `system_settings`
--

INSERT INTO `system_settings` (`id`, `camera_enabled`, `updated_at`) VALUES
(1, 0, '2026-01-28 02:51:34');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','teacher','pending') DEFAULT 'teacher',
  `class_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','inactive','pending') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `class_id`, `created_at`, `status`) VALUES
(1, 'Trần Khánh Hưng', 'admin@gmail.com', '$2b$10$3pRZwBPVO/xHWUTo/0SXZevu21LM4jf7WZF3o84ePJ1z48aHC/MXC', 'admin', NULL, '2026-01-27 08:25:44', 'active'),
(2, 'Giáo viên 1', 'giaovien1@edu.net', '$2b$10$ULOWiAXeemir2qYT3XaGSOZ1TazpvW8H7WuFPgyil6zYC1VTZKvZG', 'teacher', 1, '2026-01-27 08:26:10', 'active'),
(4, 'Giáo viên 2', 'giaovien2@edu.net', '$2b$10$yAMD5V/jtDAtK0YBh.m0I.f7RU6OTWAzlc1GYywvUAhwsYR.1lXO.', 'teacher', NULL, '2026-01-27 10:04:03', 'active'),
(5, 'Giáo viên 3', 'giaovien3@edu.net', '$2b$10$9SH7qifAkYQ/.lyp97WxE.5r3DWv/eHhSJp5g.wz.HPEpcVzATQ6i', 'teacher', NULL, '2026-01-28 09:44:05', 'active'),
(6, 'Giáo viên 4', 'giaovien4@edu.net', '$2b$10$6Jl91Ni7t/F5/9LbUL5M4OwBN2URbjA5KcLvkM9O.fvcZZhIC9C3.', 'teacher', NULL, '2026-01-28 09:44:26', 'active'),
(7, 'Giáo viên 5', 'giaovien5@edu.net', '$2b$10$/G0ptphzfmG6pAwVcZ814uB/e0YEq6dnW/uyhsnDdtArc.RaEzQFW', 'teacher', NULL, '2026-01-28 09:44:38', 'active'),
(9, 'Trần Hưng 1', 'b@gmail.com', '$2b$10$gSOPg5rrjjc89R3C2w3WXeXLcKsIzcd33tLMxR4IP0DtdRgy2hGOW', 'teacher', NULL, '2026-01-28 13:33:38', 'active');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `attendances`
--
ALTER TABLE `attendances`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_id` (`student_id`,`date`),
  ADD UNIQUE KEY `unique_att` (`student_id`,`date`),
  ADD KEY `idx_attendance_class_date` (`class_id`,`date`);

--
-- Chỉ mục cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `class_id` (`class_id`);

--
-- Chỉ mục cho bảng `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `student_code` (`student_code`),
  ADD KEY `idx_students_class` (`class_id`),
  ADD KEY `idx_student_code` (`student_code`),
  ADD KEY `idx_class_id` (`class_id`);

--
-- Chỉ mục cho bảng `system_settings`
--
ALTER TABLE `system_settings`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `attendances`
--
ALTER TABLE `attendances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `students`
--
ALTER TABLE `students`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;

--
-- AUTO_INCREMENT cho bảng `system_settings`
--
ALTER TABLE `system_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `attendances`
--
ALTER TABLE `attendances`
  ADD CONSTRAINT `attendances_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendances_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;

--
-- Các ràng buộc cho bảng `attendance_logs`
--
ALTER TABLE `attendance_logs`
  ADD CONSTRAINT `attendance_logs_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`),
  ADD CONSTRAINT `attendance_logs_ibfk_2` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`);

--
-- Các ràng buộc cho bảng `students`
--
ALTER TABLE `students`
  ADD CONSTRAINT `students_ibfk_1` FOREIGN KEY (`class_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
