import asyncio
import logging
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.court_reservation.dao import CourtReservationDAO
from app.tasks.celery_app import celery
from app.tasks.service import SpecialConvert
from app.users.auth import generate_confirmation_token
from celery import shared_task
from asgiref.sync import async_to_sync

logger = logging.getLogger(__name__)

link_api = "https://api.skkrondo.ru"
link_front = "https://skkrondo.ru"

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
        <h1 style='font-size: 24px; color: #4F46E5;'>Привет, {username}!</h1>
        <p style='font-size: 16px; color: #333;'>Спасибо за регистрацию на платформе <strong>Рондо</strong>.</p>
        <p style='font-size: 16px; color: #333;'>Мы рады приветствовать вас в нашем сообществе.</p>
        <p style='font-size: 16px; color: #333;'>С уважением,<br>Команда Рондо</p>
        <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #666;'>Если у вас есть вопросы, напишите нам на почту <a href='mailto:sport@skkrondo.ru' style='color: #4F46E5;'>sport@skkrondo.ru</a>.</p>
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
        <br>Команда Рондо</p>
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
        <h1 style='font-size: 24px; color: #4F46E5;'>Привет, {username}!</h1>
        <p style='font-size: 16px; color: #333;'>Вы записались на мероприятие: <strong>{event_name}</strong>.</p>
        <p style='font-size: 16px; color: #333;'>Начало: <strong>{SpecialConvert.format_datetime_moscow(time_start)}</strong>.</p>
        <p style='font-size: 16px; color: #333;'>С уважением,<br>Команда Рондо</p>
        <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #666;'>Если у вас есть вопросы, напишите нам на почту <a href='mailto:sport@skkrondo.ru' style='color: #4F46E5;'>sport@skkrondo.ru</a>.</p>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Ошибка {str(e)}")
        return {"status": "error", "message": str(e)}

@celery.task(name="send_about_registration_on_court")
def send_about_registration_on_court(
    to: str, name: str, last_name:str, court: str, time_start: str
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
        msg["Subject"] = "Аренда корта"

        body = f"""
        <h1 style='font-size: 24px; color: #4F46E5;'>Здравствуйте, {name} {last_name}!</h1>
        <p style='font-size: 16px; color: #333;'>Вы успешно оплатили аренду корта: <strong>{court}</strong>.</p>
        <p style='font-size: 16px; color: #333;'>Начало аренды: <strong>{time_start}:00</strong>.</p>
        <p style='font-size: 16px; color: #333;'>Пожалуйста, приходите в спортклуб заранее, но не раньше чем за 30 минут до начала аренды.</p>
        <p style='font-size: 16px; color: #333;'>Не забудьте взять с собой паспорт, он может понадобиться.</p>
        <p style='font-size: 16px; color: #333;'>Открыть в <a href='https://yandex.ru/maps/org/sportklub/223304769850?si=v7e134bvyxheyktxjcp8a29rwr' target='_blank' style='color: #4F46E5;'>Яндекс.Картах</a>.</p>
        <p style='font-size: 16px; color: #333;'>Координаты спортклуба: 60.054253, 30.476051</p>
        <p style='font-size: 16px; color: #333;'>С уважением,<br>Команда Рондо</p>
        <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #666;'>Пожалуйста, не отвечайте на это письмо, оно отправлено автоматически. Если у вас есть вопросы, напишите нам на почту <a href='mailto:sport@skkrondo.ru' style='color: #4F46E5;'>sport@skkrondo.ru</a>.</p>
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
        <h1 style='font-size: 24px; color: #4F46E5;'>Привет, {username}!</h1>
        <p style='font-size: 16px; color: #333;'>Появилось новое мероприятие: <strong>{event_name}</strong>.</p>
        <p style='font-size: 16px; color: #333;'>Начало: <strong>{SpecialConvert.format_datetime_moscow(time_start)}</strong>.</p>
        <p style='font-size: 16px; color: #333;'>С уважением,<br>Команда Рондо</p>
        <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #666;'>Если у вас есть вопросы, напишите нам на почту <a href='mailto:sport@skkrondo.ru' style='color: #4F46E5;'>sport@skkrondo.ru</a>.</p>
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
        confirm_url = f"{link_api}/users/confirm/{token}"
        body = f"""
        <h1 style='font-size: 24px; color: #4F46E5;'>Привет, {username}!</h1>
        <p style='font-size: 16px; color: #333;'>Подтвердите свою почту, перейдя по ссылке ниже:</p>
        <p style='font-size: 16px; color: #4F46E5;'><a href='{confirm_url}' target='_blank' style='color: #4F46E5;'>Подтвердить почту</a></p>
        <p style='font-size: 16px; color: #333;'>С уважением,<br>Команда Рондо</p>
        <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #666;'>Если у вас есть вопросы, напишите нам на почту <a href='mailto:sport@skkrondo.ru' style='color: #4F46E5;'>sport@skkrondo.ru</a>.</p>
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
        confirm_url = f"{link_front}/reset-password?token={token}"
        body = f"""
        <h1 style='font-size: 24px; color: #4F46E5;'>Привет, {username}!</h1>
        <p style='font-size: 16px; color: #333;'>Вы запросили сброс пароля. Для продолжения перейдите по ссылке ниже:</p>
        <p style='font-size: 16px;'><a href='{confirm_url}' target='_blank' style='color: #4F46E5;'>Сбросить пароль</a></p>
        <p style='font-size: 16px; color: #333;'>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
        <p style='font-size: 16px; color: #333;'>С уважением,<br>Команда Рондо</p>
        <hr style='border: none; border-top: 1px solid #ddd; margin: 20px 0;'>
        <p style='font-size: 14px; color: #666;'>Если у вас есть вопросы, напишите нам на почту <a href='mailto:sport@skkrondo.ru' style='color: #4F46E5;'>sport@skkrondo.ru</a>.</p>
        """
        msg.attach(MIMEText(body, "html"))
        with smtplib.SMTP_SSL(smtp_server, smtp_port) as server:
            server.login(smtp_username, smtp_password)
            server.send_message(msg)
        return {"status": "success"}
    except Exception as e:
        logger.error(f"Ошибка {str(e)}")
        return {"status": "error", "message": str(e)}
@celery.task(name="cancel_if_not_confirmed")
def cancel_if_not_confirmed(reservation_id: int) -> str:
    asyncio.run(inner(reservation_id))


async def inner(reservation_id: int):
    reservation = await CourtReservationDAO.find_one_or_none(id=reservation_id)
    if reservation:
        if not reservation.is_confirmed:
            await CourtReservationDAO.delete(reservation_id)
            return True

