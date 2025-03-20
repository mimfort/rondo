import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import vkIcon from '../assets/icons/vk.svg';
import telegramIcon from '../assets/icons/telegram.svg';

declare global {
    interface Window {
        ymaps: any;
    }
}

const Main = () => {
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
        };

        // Проверяем, загружен ли уже API
        if (window.ymaps) {
            loadMap();
        } else {
            const script = document.createElement('script');
            script.src = `https://api-maps.yandex.ru/2.1/?apikey=${import.meta.env.VITE_YANDEX_MAPS_API_KEY}&lang=ru_RU`;
            script.onload = loadMap;
            document.head.appendChild(script);
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
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            {/* Hero Section */}
            <motion.div
                className="relative h-[600px] flex items-center justify-center overflow-hidden bg-indigo-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
            >
                <div className="relative z-10 text-center text-white px-4">
                    <motion.h1
                        className="text-6xl font-bold mb-6"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        СОТЫ
                    </motion.h1>
                    <motion.p
                        className="text-xl mb-8 max-w-2xl mx-auto"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Молодежное пространство в Новом Девяткино
                    </motion.p>
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <Link
                            to="/events"
                            className="bg-white text-indigo-900 px-8 py-3 rounded-full font-semibold hover:bg-indigo-50 transition-colors duration-300"
                        >
                            Смотреть события
                        </Link>
                    </motion.div>
                </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
                className="py-20 px-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
            >
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center text-indigo-900 mb-16">О пространстве</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        <motion.div
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Место отдыха</h3>
                            <p className="text-gray-600">Устраивайся поудобнее для спокойного отдыха или развлечений: настольные, командные, компьютерные игры, караоке, квиз-игры и дискотеки.</p>
                        </motion.div>

                        <motion.div
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Место вдохновения</h3>
                            <p className="text-gray-600">Кинопоказы, творческие вечера, выступление музыкантов, выставки. Большой киноэкран и лазерный проектор, превосходный звук, сценический свет.</p>
                        </motion.div>

                        <motion.div
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Место развития</h3>
                            <p className="text-gray-600">Мастер-классы, лекции, круглые столы и семинары на актуальные темы, а также библиотека с литературой по психологии, бизнесу, дизайну и искусству.</p>
                        </motion.div>

                        <motion.div
                            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                            variants={fadeIn}
                        >
                            <div className="text-indigo-600 mb-4">
                                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Место работы</h3>
                            <p className="text-gray-600">Современные ноутбуки, высокоскоростной интернет, удобная мебель - все, что тебе нужно для продуктивной работы. Бесплатный кофе и чай для бодрого настроения!</p>
                        </motion.div>
                    </div>
                </div>
            </motion.div>

            {/* Контакты */}
            <section id="contacts" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Контакты
                        </h2>
                        <p className="mt-4 text-lg text-gray-500">
                            Свяжитесь с нами любым удобным способом
                        </p>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
                        {/* Контактная информация */}
                        <div className="bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.05)] p-8 relative overflow-hidden border border-gray-100">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50"></div>
                            <div className="relative space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Адрес</h3>
                                    <p className="mt-2 text-gray-600">
                                        Школьная улица, 6, Новое Девяткино
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Социальные сети</h3>
                                    <div className="mt-4 flex space-x-6">
                                        <a
                                            href="https://vk.com/ndsoty"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            <span className="sr-only">ВКонтакте</span>
                                            <img src={vkIcon} alt="VK" className="h-8 w-8" />
                                        </a>
                                        <a
                                            href="https://t.me/molodnd"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                                        >
                                            <span className="sr-only">Telegram</span>
                                            <img src={telegramIcon} alt="Telegram" className="h-8 w-8" />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Карта */}
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div id="map" className="h-[400px] w-full"></div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Main; 