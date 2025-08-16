from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product

from .models import Product, OrderItem, Order, ShippingAddress


# 🔐 USER SERIALIZER
class UserSerializer(serializers.ModelSerializer):
    first_name = serializers.SerializerMethodField(read_only=True)
    last_name = serializers.SerializerMethodField(read_only=True)
    _id = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'first_name','last_name', 'isAdmin']

    def get_first_name(self, obj):
        return obj.first_name
    
    def get_last_name(self, obj):
        return obj.last_name
    
    def get__id(self, obj):
        return obj.id

    def get_isAdmin(self, obj):
        return obj.is_staff


# 🔐 USER SERIALIZER WITH TOKEN
class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', '_id', 'username', 'email', 'first_name','last_name' ,'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)


# 🛒 PRODUCT SERIALIZER
class ProductSerializer(serializers.ModelSerializer):
    _id = serializers.ReadOnlyField(source='id')

    class Meta:
        model = Product
        fields = '__all__'


# 📦 ORDER ITEM SERIALIZER
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


# 🏠 SHIPPING ADDRESS SERIALIZER
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


# 🧾 ORDER SERIALIZER
class OrderSerializer(serializers.ModelSerializer):
    orderItems = serializers.SerializerMethodField()
    shippingAddress = serializers.SerializerMethodField()
    user = serializers.SerializerMethodField()
    deliveredAt = serializers.DateTimeField(source='delivered_at', read_only=True)


    class Meta:
        model = Order
        fields = '__all__'

    def get_orderItems(self, obj):
        items = obj.orderItems.all()  # related_name must be set to 'orderItems' in OrderItem model
        return OrderItemSerializer(items, many=True).data

    def get_shippingAddress(self, obj):
        address = getattr(obj, 'shippingAddress', None)
        if address:
            return ShippingAddressSerializer(address).data
        return None

    def get_user(self, obj):
        user = obj.user
        if user is not None:
         return {
            "id": user.id,
            "name": user.first_name or user.email,
            "email": user.email,
        }
        return {
        "id": None,
        "name": "Unknown",
        "email": "N/A",
    }

    