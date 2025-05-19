import uuid

from yookassa import Configuration, Payment
from app.config import settings
import hmac
import hashlib

YOUR_SECRET_KEY = settings.SECRET_KEY

def generate_secure_rental_id(rental_id, secret_key):
    return hmac.new(secret_key.encode(), rental_id.encode(), hashlib.sha256).hexdigest()

Configuration.account_id = settings.shop_idd
Configuration.secret_key = settings.shop_secret


def create_payment(amount: float, rental_id: int, url: str, description: str, email: str):
    rental_signature = generate_secure_rental_id(str(rental_id), YOUR_SECRET_KEY)

    payment = Payment.create({
        "amount": {
            "value": f"{amount:.2f}",
            "currency": "RUB"
        },
        "receipt": {
            "customer": {
                "email": email
        },
        "items": [
            {
                "description": description,
                "quantity": 1,
                "amount": {
                    "value": f"{amount:.2f}",
                    "currency": "RUB"
                },
                "vat_code": 1,
                "measure": "hour",
                "payment_mode": "full_payment",
                "payment_subject": "service",
                
               
            }
        ]
        },
    #     "payment_method_data": {
    #   "type": "bank_card"
    #     },
        "confirmation": {
            "type": "redirect",
            "return_url": url
        },
        "capture": True,
        "description": description,
        "metadata": {
            "rental_id": rental_id,
            "rental_signature": rental_signature
        }
    }, rental_id)
    return payment.confirmation.confirmation_url, payment.id


def verify_rental_signature(rental_id: int, signature: str, secret_key: str) -> bool:
    expected = hmac.new(secret_key.encode(), str(rental_id).encode(), hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)

