from datetime import datetime

import pytz


class SpecialConvert:
    @classmethod
    def format_datetime_moscow(dt: datetime) -> str:
        # Переводим дату в московский часовой пояс
        moscow_tz = pytz.timezone("Europe/Moscow")
        dt_msk = dt.astimezone(moscow_tz)

        # Форматируем дату в нужный вид
        months = {
            1: "января",
            2: "февраля",
            3: "марта",
            4: "апреля",
            5: "мая",
            6: "июня",
            7: "июля",
            8: "августа",
            9: "сентября",
            10: "октября",
            11: "ноября",
            12: "декабря",
        }

        day = dt_msk.day
        month = months[dt_msk.month]
        time = dt_msk.strftime("%H:%M")  # Часы и минуты

        return f"{day} {month} в {time} МСК"
