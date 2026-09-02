from django.core.management.base import BaseCommand
from app.models import Product


class Command(BaseCommand):
    help = "Seed the 8 default products"

    def handle(self, *args, **kwargs):
        products = [
            {
                "name": "Luxury Leather Handbag",
                "image": "products/handbag.png",
                "description": "Elegant leather handbag with gold-tone hardware and spacious interior.",
                "brand": "Gucci",
                "category": "Handbags",
                "price": 249.99,
                "countInStock": 12,
                "rating": 4.7,
                "numReviews": 670,
            },
            {
                "name": "Matte Finish Lipstick - Cherry Red",
                "image": "products/lipstick.jpg",
                "description": "Long-lasting lipstick with a rich matte cherry red tone.",
                "brand": "MAC",
                "category": "Cosmetics",
                "price": 19.99,
                "countInStock": 100,
                "rating": 4.5,
                "numReviews": 450,
            },
            {
                "name": "Men's Running Shoes",
                "image": "products/shoes.jpg",
                "description": "Comfortable and durable shoes for everyday running and training.",
                "brand": "Nike",
                "category": "Shoes",
                "price": 89.99,
                "countInStock": 40,
                "rating": 4.6,
                "numReviews": 380,
            },
            {
                "name": "Smartwatch Series 7",
                "image": "products/smartwatch.jpg",
                "description": "Advanced smartwatch with health tracking and customizable faces.",
                "brand": "Apple",
                "category": "Electronics",
                "price": 399.99,
                "countInStock": 25,
                "rating": 4.8,
                "numReviews": 520,
            },
            {
                "name": "Girls Floral Frock",
                "image": "products/frock.png",
                "description": "Beautiful floral frock for girls, perfect for parties and casual wear.",
                "brand": "Zara Kids",
                "category": "Kids Fashion",
                "price": 29.99,
                "countInStock": 75,
                "rating": 4.4,
                "numReviews": 610,
            },
            {
                "name": "Hydrating Face Cream",
                "image": "products/facecream.jpg",
                "description": "Daily face moisturizer with hyaluronic acid for all skin types.",
                "brand": "Neutrogena",
                "category": "Skincare",
                "price": 14.99,
                "countInStock": 150,
                "rating": 4.3,
                "numReviews": 430,
            },
            {
                "name": "Polarized Sunglasses for Women",
                "image": "products/sunglases.png",
                "description": "Stylish polarized sunglasses that block UV rays and reduce glare.",
                "brand": "Ray-Ban",
                "category": "Accessories",
                "price": 129.99,
                "countInStock": 35,
                "rating": 4.7,
                "numReviews": 500,
            },
            {
                "name": "iPhone 14 Pro Max",
                "image": "products/electric.png",
                "description": "Apple's latest iPhone with A16 Bionic chip and ProMotion display.",
                "brand": "Apple",
                "category": "Phones",
                "price": 1199.99,
                "countInStock": 15,
                "rating": 4.8,
                "numReviews": 1200,
            },
        ]

        for data in products:
            Product.objects.update_or_create(
                name=data["name"],
                defaults=data
            )

        self.stdout.write(
            self.style.SUCCESS("8 products seeded successfully!")
        )