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

            {/* Contact Section */}
            <motion.div
                className="bg-indigo-900 text-white py-20 px-4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
            >
                <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-4xl font-bold mb-8">Как нас найти?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Адрес</h3>
                            <p className="text-indigo-100">
                                ул. Школьная, дом 6, СКК "Рондо"<br />
                                Новое Девяткино, Всеволожский район<br />
                                Ленинградская область
                            </p>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Контакты</h3>
                            <p className="text-indigo-100">
                                (812) 679-79-05<br />
                                molodnd@mail.ru
                            </p>
                            <div className="mt-6 flex justify-center space-x-6">
                                <a
                                    href="https://vk.com/ndsoty"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-indigo-200 transition-colors duration-300"
                                >
                                    <img src={vkIcon} alt="ВКонтакте" className="w-8 h-8" />
                                </a>
                                <a
                                    href="https://t.me/molodnd"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-indigo-200 transition-colors duration-300"
                                >
                                    <img src={telegramIcon} alt="Telegram" className="w-8 h-8" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12 flex justify-center">
                        <div id="map" className="w-[400px] h-[250px] rounded-lg shadow-lg overflow-hidden"></div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Main; 