import logging
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.tasks.celery_app import celery
from app.tasks.service import SpecialConvert
from app.users.auth import generate_confirmation_token

logger = logging.getLogger(__name__)

link = "http://api.rondo.scvnotready.ru"

@celery.task(name="send_welcome_email")
def send_welcome_email(to: str, username: str):
    try:
        smtp_server = celery.conf.smtp_server
        smtp_port = celery.conf.smtp_port
        smtp_username = celery.conf.smtp_username
        smtp_password = celery.conf.smtp_password
        email_from = celery.conf.email_from

        msg = MIMEMultipart()

        msg["From"] = email_from
        msg["To"] = to
        msg["Subject"] = "Добро пожаловать!"

        body = f"""
        <h1>Привет, {username}!</h1>
        <p>Спасибо за регистрацию.</p>
        <p>С уважением,  
        <br>Команда Соты</p>
        """
        msg.attach(MIMEText(body, "html"))

        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)

        return {"status": "success"}

    except Exception as e:
        logger.error(f"Ошибка: {str(e)}")
        return {"status": "error", "message": str(e)}


@celery.task(name="send_login_email")
def send_login_email(to: str, username: str):
    try:
        smtp_server = celery.conf.smtp_server
        smtp_port = celery.conf.smtp_port
        smtp_username = celery.conf.smtp_username
        smtp_password = celery.conf.smtp_password
        email_from = celery.conf.email_from

        msg = MIMEMultipart()
        msg["From"] = email_from
        msg["To"] = to
        msg["Subject"] = "Вход в ваш аккаунт!"

        body = f"""
        <h1>Привет, {username}!</h1>  
        <p>Вход в ваш аккаунт выполнен успешно! Если это были не вы, рекомендуем немедленно сменить пароль.</p>  
        <p>С уважением,  
        <br>Команда Соты</p>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Ошибка {str(e)}")
        return {"status": "error", "message": str(e)}


@celery.task(name="send_about_registration")
def send_about_registration(
    to: str, username: str, event_name: str, time_start: datetime
):
    try:
        smtp_server = celery.conf.smtp_server
        smtp_port = celery.conf.smtp_port
        smtp_username = celery.conf.smtp_username
        smtp_password = celery.conf.smtp_password
        email_from = celery.conf.email_from

        msg = MIMEMultipart()
        msg["From"] = email_from
        msg["To"] = to
        msg["Subject"] = "Регистрация на ивент"

        body = f"""
        <h1>Привет, {username}!</h1>  
        <p>Вы записались на ивент: {event_name}</p>  
        <p>Начало: {SpecialConvert.format_datetime_moscow(time_start)}</p>
        <p>С уважением,  
        <br>Команда Соты</p>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Ошибка {str(e)}")
        return {"status": "error", "message": str(e)}

@celery.task(name="send_about_new_event")
def send_about_new_event(
    to: str, username: str, event_name: str, time_start: datetime
):
    try:
        smtp_server = celery.conf.smtp_server
        smtp_port = celery.conf.smtp_port
        smtp_username = celery.conf.smtp_username
        smtp_password = celery.conf.smtp_password
        email_from = celery.conf.email_from

        msg = MIMEMultipart()
        msg["From"] = email_from
        msg["To"] = to
        msg["Subject"] = "Появилось новое мероприятие"

        body = f"""
        <h1>Привет, {username}!</h1>  
        <p>Появилось новое мероприятие: {event_name}</p>  
        <p>Начало: {SpecialConvert.format_datetime_moscow(time_start)}</p>
        <p>С уважением,  
        <br>Команда Соты</p>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Ошибка {str(e)}")
        return {"status": "error", "message": str(e)}
    
@celery.task(name="send_confirm_email")
def send_confirm_email(
    to: str, username: str
):
    try:
        smtp_server = celery.conf.smtp_server
        smtp_port = celery.conf.smtp_port
        smtp_username = celery.conf.smtp_username
        smtp_password = celery.conf.smtp_password
        email_from = celery.conf.email_from

        msg = MIMEMultipart()
        msg["From"] = email_from
        msg["To"] = to
        msg["Subject"] = "Подтвердите свою почту"
        token = generate_confirmation_token(to)
        confirm_url = f"{link}/users/confirm/{token}"
        body = f"""
        <h1>Привет, {username}!</h1>  
        <p>Подтвердите свою почту, перейдя по ссылке: {confirm_url}</p>  
        <p>С уважением,  
        <br>Команда Соты</p>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Ошибка {str(e)}")
        return {"status": "error", "message": str(e)}

@celery.task(name="send_forgot_password_email")
def send_forgot_password_email(
    to: str, username: str, token: str
):
    try:
        smtp_server = celery.conf.smtp_server
        smtp_port = celery.conf.smtp_port
        smtp_username = celery.conf.smtp_username
        smtp_password = celery.conf.smtp_password
        email_from = celery.conf.email_from

        msg = MIMEMultipart()
        msg["From"] = email_from
        msg["To"] = to
        msg["Subject"] = "Сброс пароля"
        confirm_url = f"{link}/reset-password?token={token}"
        body = f"""
        <h1>Привет, {username}!</h1>  
        <p>Сброс пароля, перейдите по ссылке: {confirm_url}</p>  
        <p>С уважением,  
        <br>Команда Соты</p>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Ошибка {str(e)}")
        return {"status": "error", "message": str(e)}