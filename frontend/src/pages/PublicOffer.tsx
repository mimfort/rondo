import React from 'react';

const PublicOffer = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Публичная оферта</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Настоящий документ является официальным предложением (офертой)
                <strong> Муниципального казенного учреждения культуры «Спортивно-культурный комплекс «Рондо» МО Новодевяткинское сельское поселение Всеволожского муниципального района Ленинградской области</strong>,
                именуемого в дальнейшем «Исполнитель», и содержит все существенные условия договора на оказание услуг по бронированию и аренде кортов (далее — «Услуги»).
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">1. Общие положения</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                1.1. Настоящая оферта является публичным договором.<br />
                1.2. Принятие (акцепт) условий оферты осуществляется путем регистрации и/или оплаты услуг на сайте <strong>https://skkrondo.ru</strong>.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">2. Предмет договора</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                2.1. Исполнитель предоставляет Заказчику услуги по бронированию и аренде кортов через веб-интерфейс.<br />
                2.2. Конкретные параметры аренды (дата, время, площадка) определяются Заказчиком при оформлении заказа.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. Порядок оказания услуг</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                3.1. Заказ оформляется на сайте.<br />
                3.2. Оплата осуществляется онлайн через платёжный шлюз (например, ЮKassa).<br />
                3.3. После подтверждения оплаты Заказчику направляется подтверждение бронирования.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Стоимость и оплата</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                4.1. Актуальная стоимость услуг указывается на сайте.<br />
                4.2. Оплата считается подтверждением согласия с настоящей офертой.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Условия отмены и возврата</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                5.1. Отмена брони возможна не позднее чем за 24 часа до начала аренды.<br />
                5.2. Возврат осуществляется на ту же карту в течение 7 рабочих дней.
            </p>

 

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Персональные данные</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                6.1. Заказчик соглашается на обработку своих персональных данных в соответствии с
                <a href="/privacy-policy" target="_blank" className="text-indigo-600 hover:underline"> Политикой конфиденциальности</a> и Федеральным законом от 27 июля 2006 г. № 152-ФЗ «О персональных данных».
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Заключительные положения</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
                Оферта может быть изменена Исполнителем в одностороннем порядке. Все изменения вступают в силу с момента публикации на сайте.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Обязанности сторон</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Обязанности Исполнителя</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                <li>Организовать и обеспечить надлежащее исполнение услуг в соответствии с календарным планом и расписанием занятий.</li>
                <li>Обеспечить площадку, соответствующую санитарным и гигиеническим требованиям.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Обязанности Потребителя</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                <li>Своевременно произвести оплату услуг.</li>
                <li>Проявлять уважение к персоналу Исполнителя.</li>
                <li>Бережно относиться к имуществу Исполнителя.</li>
                <li>Соблюдать Правила посещения теннисных кортов.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Права сторон</h2>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Права Исполнителя</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                <li>Отказать в возврате денежных средств при необоснованных претензиях или форс-мажоре.</li>
                <li>Прекратить оказание услуг при нарушении Потребителем Правил посещения теннисных кортов.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Права Потребителя</h3>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                <li>Запрашивать информацию об услугах и порядке их оказания.</li>
                <li>При недостатках услуг требовать:
                    <ul className="list-disc list-inside ml-6">
                        <li>безвозмездного устранения недостатков,</li>
                        <li>уменьшения стоимости,</li>
                        <li>возмещения расходов, связанных с устранением недостатков своими силами или через третьих лиц.</li>
                    </ul>
                </li>
                <li>Обращаться к персоналу по всем вопросам, связанным с деятельностью учреждения.</li>
                <li>Пользоваться помещением (раздевалка, туалеты) за 15 минут до и после времени оказания услуги.</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Ответственность и порядок урегулирования споров</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">Стороны несут ответственность в соответствии с законодательством РФ. Споры разрешаются путем переговоров, либо в судебном порядке.</p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Особые условия</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">На территории учреждения действует система обеспечения безопасности (охранная сигнализация, пожарная сигнализация, аварийное освещение).</p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Правила посещения теннисных кортов</h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                <li>Запрещено курить, употреблять алкоголь, наркотики, использовать электронные сигареты.</li>
                <li>Запрещено находиться на кортах в состоянии опьянения или с противопоказаниями по здоровью.</li>
                <li>Запрещено нарушать общественный порядок и грубить другим посетителям.</li>
                <li>Запрещено использовать звуковое оборудование, приносить опасные предметы и вещества.</li>
                <li>Посетители обязаны соблюдать чистоту и бережно относиться к имуществу.</li>
                <li>На одном корте допускается пребывание не более 4 человек одновременно.</li>
                <li>Потребитель несёт ответственность за своих гостей.</li>
            </ul>

            <hr className="my-6 border-gray-300 dark:border-gray-600" />

            <p className="text-gray-700 dark:text-gray-300">
                <strong>Реквизиты исполнителя:</strong><br />
                Наименование: МКУК «Спортивно-культурный комплекс «Рондо»<br />
                ИНН: 4706084754 &nbsp;&nbsp;КПП: 470601001<br />
                ОГРН: 1244700035744<br />
                Юридический адрес: 188673, Ленинградская область, Всеволожский район, дер. Новое Девяткино, ул. Школьная, д.6<br />
                Email: info@skkrondo.ru
            </p>
        </div>
    );
};

export default PublicOffer;