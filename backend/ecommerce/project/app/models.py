from django.db import models
from django.contrib.auth.models import User


# 🛒 Product Model
class Product(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    image = models.ImageField(upload_to='products/', null=True, blank=True)
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    countInStock = models.IntegerField(default=0)
    rating = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    numReviews = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name or "Unnamed Product"


# 🌟 Review Model
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Review {self.rating} by {self.name or "Anonymous"}'


# 📦 Order Model
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    shippingPrice = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    totalPrice = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    isPaid = models.BooleanField(default=False)
    paidAt = models.DateTimeField(null=True, blank=True)
    isDelivered = models.BooleanField(default=False)
    deliveredAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Order {self.id} by {self.user}'


# 📋 Order Item Model
class OrderItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='orderItems')
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name or "Unnamed Order Item"


# 🏠 Shipping Address Model
class ShippingAddress(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='shippingAddress')
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=200)
    postalCode = models.CharField(max_length=20)
    country = models.CharField(max_length=100)
    shippingPrice = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.address}, {self.city}'
