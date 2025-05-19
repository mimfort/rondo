import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_SERVER = "smtp.majordomo.ru"
SMTP_PORT = 465
SMTP_USERNAME = "notification@skkrondo.ru"
SMTP_PASSWORD = "SKKrondo2025"
EMAIL_FROM = "notification@skkrondo.ru"
EMAIL_TO = "echohub-social-network@yandex.com"  # Замените на ваш email для теста

try:
    # Создаем сообщение
    msg = MIMEMultipart()
    msg["From"] = EMAIL_FROM
    msg["To"] = EMAIL_TO
    msg["Subject"] = "Тестовое письмо"

    body = "Это тестовое письмо для проверки SMTP-сервера."
    msg.attach(MIMEText(body, "plain"))

    # Подключаемся к SMTP-серверу и отправляем письмо
    with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as server:
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)

    print("Письмо успешно отправлено!")

except Exception as e:
    print(f"Ошибка при отправке письма: {e}")