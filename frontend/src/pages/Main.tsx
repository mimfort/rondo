import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import VkIcon from '../assets/icons/vk.svg';
import TelegramIcon from '../assets/icons/telegram.svg';

declare global {
    interface Window {
        ymaps: any;
    }
}

const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY;

// Функция для определения мобильного устройства
const isMobile = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const Main = () => {
    const [mapError, setMapError] = useState<string | null>(null);
    const [isMobileDevice] = useState(isMobile());
    const { scrollY } = useScroll({
        layoutEffect: false
    });

    // Упрощенные эффекты для мобильных устройств
    const heroOpacity = useTransform(scrollY,
        [0, 200],
        [1, isMobileDevice ? 0.3 : 0]
    );

    const heroY = useTransform(scrollY,
        [0, 200],
        [0, isMobileDevice ? 0 : 30]
    );
    const featuresY = useTransform(scrollY, [200, 400], [30, 0]);
    const featuresOpacity = useTransform(scrollY, [200, 300], [0, 1]);

    useEffect(() => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        // Удаляем все предыдущие карты
        while (mapContainer.firstChild) {
            mapContainer.removeChild(mapContainer.firstChild);
        }

        // Создаем новый контейнер для карты
        const mapElement = document.createElement('div');
        mapElement.style.width = '100%';
        mapElement.style.height = '100%';
        mapContainer.appendChild(mapElement);

        const loadMap = () => {
            try {
                window.ymaps.ready(() => {
                    const map = new window.ymaps.Map(mapElement, {
                        center: [60.061644, 30.476057],
                        zoom: 15,
                        controls: []
                    });

                    const placemark = new window.ymaps.Placemark(
                        [60.061644, 30.476057],
                        {
                            balloonContent: 'СКК "Рондо"<br>ул. Школьная, дом 6',
                        },
                        {
                            preset: 'islands#redDotIcon',
                        }
                    );

                    map.geoObjects.add(placemark);
                });
            } catch (error) {
                console.error('Ошибка при загрузке карты:', error);
                setMapError('Не удалось загрузить карту');
            }
        };

        // Проверяем, загружен ли уже API и скрипт
        if (window.ymaps) {
            loadMap();
        } else {
            // Проверяем, не добавлен ли уже скрипт
            const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
            if (!existingScript) {
                const script = document.createElement('script');
                script.src = `https://api-maps.yandex.ru/2.1/?apikey=${YANDEX_MAPS_API_KEY}&lang=ru_RU`;
                script.onload = loadMap;
                script.onerror = () => {
                    console.error('Ошибка при загрузке API Яндекс.Карт');
                    setMapError('Не удалось загрузить API Яндекс.Карт');
                };
                document.head.appendChild(script);
            } else {
                // Если скрипт уже добавлен, просто ждем загрузки API
                existingScript.addEventListener('load', loadMap);
            }
        }

        return () => {
            // Очищаем контейнер при размонтировании
            while (mapContainer.firstChild) {
                mapContainer.removeChild(mapContainer.firstChild);
            }
        };
    }, []);

    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
            {/* Hero Section с параллаксом */}
            <motion.div
                className="relative h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
                style={isMobileDevice ? undefined : { opacity: heroOpacity, y: heroY }}
                transition={{ type: "tween", duration: 0.1 }}
            >
                {/* Анимированный фон - отключаем на мобильных */}
                {!isMobileDevice && (
                    <motion.div
                        className="absolute inset-0 w-full h-full opacity-30"
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                    />
                )}

                {/* Декоративные элементы - статичные на мобильных */}
                <div
                    className="absolute inset-0 opacity-40"
                >
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl" />
                    <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl" />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full blur-3xl opacity-30" />
                </div>

                {/* Основной контент */}
                <div className="relative z-10 text-center">
                    <div className="flex flex-col items-center px-6">
                        <motion.div
                            className="mb-8 relative"
                            whileHover={isMobileDevice ? undefined : { scale: 1.02 }}
                            transition={{ type: "tween", duration: 0.2 }}
                        >
                            <h1
                                className="text-8xl font-black tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-[#e0e7ff]"
                            >
                                РОНДО
                            </h1>
                        </motion.div>

                        <p className="text-2xl font-medium text-gray-200 mb-12 max-w-2xl">
                            Спортивно-культурный комплекс
                        </p>
                    </div>
                </div>
            </motion.div>

            {/* Features Section с параллаксом */}
            <motion.div
                className="py-20 px-4 transform-gpu"
                style={{ opacity: featuresOpacity, y: featuresY }}
                transition={{ type: "tween", duration: 0.1 }}
            >
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        className="text-4xl font-bold text-center text-indigo-900 dark:text-white mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        О нас
                    </motion.h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                        <motion.div
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                                    <path d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2" strokeWidth={2} strokeLinecap="round" />
                                    <path d="M12 2v20M2 12h20" strokeWidth={2} strokeLinecap="round" />
                                    <path d="M12 7c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5" strokeWidth={2} strokeLinecap="round" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Спорт и активность</h3>
                            <p className="text-gray-600 dark:text-gray-300">Спортивные секции и кружки для всех возрастов. Теннисный корт с профессиональным покрытием доступен для аренды. Создайте свою идеальную тренировку!</p>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Место отдыха</h3>
                            <p className="text-gray-600 dark:text-gray-300">Устраивайся поудобнее для спокойного отдыха или развлечений: настольные, командные, компьютерные игры, караоке, квиз-игры и дискотеки.</p>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Место вдохновения</h3>
                            <p className="text-gray-600 dark:text-gray-300">Кинопоказы, творческие вечера, выступление музыкантов, выставки. Большой киноэкран и лазерный проектор, превосходный звук, сценический свет.</p>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Место развития</h3>
                            <p className="text-gray-600 dark:text-gray-300">Мастер-классы, лекции, круглые столы и семинары на актуальные темы, а также библиотека с литературой по психологии, бизнесу, дизайну и искусству.</p>
                        </motion.div>

                        <motion.div
                            className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 dark:text-indigo-400 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Место работы</h3>
                            <p className="text-gray-600 dark:text-gray-300">Современные ноутбуки, высокоскоростной интернет, удобная мебель - все, что тебе нужно для продуктивной работы. Бесплатный кофе и чай для бодрого настроения!</p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Контакты */}
            <section id="contacts" className="py-16 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                            Свяжитесь с нами
                        </h2>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Контактная информация */}
                        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 relative overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20"></div>
                            <div className="relative space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Организация</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Муниципальное казенное учреждение культуры «Спортивно-культурный комплекс «Рондо» МО Новодевяткинское сельское поселение Всеволожского муниципального района Ленинградской области
                                    </p>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        ИНН: 4706084754 | ОГРН: 1244700035744
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Адрес</h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-300">
                                        Школьная улица, 6, Новое Девяткино
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Контакты</h3>
                                    <div className="mt-2 space-y-2">
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Тел.: 8 (812) 679-79-05
                                        </p>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Email: info@skkrondo.ru
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Социальные сети</h3>
                                    <div className="mt-4 flex space-x-6">
                                        <a
                                            href="https://vk.com/skkrondo"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 transition-colors duration-200"
                                        >
                                            <span className="sr-only">ВКонтакте</span>
                                            <img src={VkIcon} alt="ВКонтакте" className="h-8 w-8" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Карта */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                            <div id="map" className="h-[400px] w-full">
                                {mapError && (
                                    <div className="h-full flex items-center justify-center text-red-500">
                                        {mapError}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Contact Section */}
            <motion.div
                className="py-16 bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <a
                            href="https://t.me/neloh074"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block group"
                        >
                            <div className="flex flex-col items-center space-y-4">
                                <div className="relative w-16 h-16 transition-transform duration-300 group-hover:scale-110">
                                    <img
                                        src={TelegramIcon}
                                        alt="Telegram"
                                        className="w-full h-full object-contain dark:invert dark:brightness-200 transition-all duration-200"
                                    />
                                </div>
                                <div className="text-gray-600 dark:text-gray-400">
                                    <p className="text-sm font-medium">По вопросам работы сайта</p>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Main; 