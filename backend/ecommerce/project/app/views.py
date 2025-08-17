from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from rest_framework.response import Response
# from .products import products
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.permissions import AllowAny

from .models import Product, ShippingAddress, Order, OrderItem
from app.serializer import ProductSerializer, UserSerializer, UserSerializerWithToken, OrderSerializer

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.urls import reverse
from rest_framework.views import APIView
from .utils import generate_token


def home(request):
    return HttpResponse("Welcome to the API Homepage!")


@api_view(['GET'])
def getRoutes(request):
    myapi = [
        {
            "products": '/api/products/',
            "product": '/api/product/<id>/',
            "login": '/api/users/login/',
            "signup": '/api/users/register/',
            "verify_email": '/api/activate/<uidb64>/<token>/',
            "place_order": '/api/orders/add/',
            "order_details": '/api/orders/<id>/',
            "all_orders": '/api/orders/'
        }
    ]
    return Response(myapi)


# ✅ Products

@api_view(['GET'])
@permission_classes([AllowAny])
def getProducts(request):
    products = Product.objects.all()
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def getProduct(request, pk):
    try:
        product = Product.objects.get(id=pk)
        serializer = ProductSerializer(product, many=False)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'detail': 'Product not found'}, status=404)


# ✅ Auth Token Serializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# ✅ User Registration

@api_view(['POST'])
@permission_classes([AllowAny])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['fname'],
            last_name=data['lname'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False
        )

        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = generate_token.make_token(user)
        activation_link = request.build_absolute_uri(
            reverse('activate', kwargs={'uidb64': uid, 'token': token})
        )

        return Response({
            "details": "Please activate your account using the link below.",
            "activation_link": activation_link
        })

    except Exception as e:
        return Response({'detail': f"Signup failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


# ✅ Email Activation

class ActivateAccountView(APIView):
    permission_classes = [AllowAny]  # ✅ Make it public
    
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if user and generate_token.check_token(user, token):
                user.is_active = True
                user.save()
                return HttpResponse("<h1 style='text-align:center;margin-top:50px;'>✅ Account activated successfully. You can now log in.</h1>")
            else:
                return HttpResponse("<h1 style='text-align:center;margin-top:50px;color:red;'>❌ Invalid activation link.</h1>")
        except Exception:
            return HttpResponse("<h1 style='text-align:center;margin-top:50px;color:red;'>❌ Activation failed. Please try again.</h1>")

# ✅ Order APIs

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    print("request.user:", request.user)
    print("request.auth:", request.auth)
    user = request.user
    data = request.data
    orderItems = data.get('orderItems')

    if not orderItems or len(orderItems) == 0:
        return Response({'detail': 'No order items'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        order = Order.objects.create(
            user=user,
            paymentMethod=data.get('paymentMethod', ''),
            taxPrice=data.get('taxPrice', 0),
            shippingPrice=data.get('shippingPrice', 0),
            totalPrice=data.get('totalPrice', 0)
        )

        shipping = data.get('shippingAddress', {})
        ShippingAddress.objects.create(
            order=order,
            address=shipping.get('address', ''),
            city=shipping.get('city', ''),
            postalCode=shipping.get('postalCode', ''),
            country=shipping.get('country', ''),
            shippingPrice=data.get('shippingPrice', 0)
        )

        for item in orderItems:
            product = get_object_or_404(Product, id=item['product'])

            order_item = OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                qty=item['qty'],
                price=item['price'],
                image=product.image.url if product.image else ''
            )

            product.countInStock -= order_item.qty
            product.save()

        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

    except Exception as e:
        return Response({'detail': f"Order creation failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'},
                            status=status.HTTP_403_FORBIDDEN)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    orders = Order.objects.filter(user=user)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrders(request):
    user = request.user
    if user.is_staff:
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)
    else:
        return Response({'detail': 'Not authorized'}, status=status.HTTP_403_FORBIDDEN)


# ✅ Admin Product Management

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user = request.user
    product = Product.objects.create(
        user=user,
        name='Sample Product',
        price=0,
        brand='Sample Brand',
        countInStock=0,
        category='Sample Category',
        description=''
    )
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request, pk):
    data = request.data
    product = Product.objects.get(id=pk)
    product.name = data['name']
    product.price = data['price']
    product.brand = data['brand']
    product.countInStock = data['countInStock']
    product.category = data['category']
    product.description = data['description']
    product.save()
    serializer = ProductSerializer(product, many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request, pk):
    product = Product.objects.get(id=pk)
    product.delete()
    return Response({'detail': 'Product deleted'})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def uploadImage(request):
    image = request.FILES.get('image')
    product_id = request.data.get('product_id')

    if image and product_id:
        try:
            product = Product.objects.get(id=product_id)
            product.image = image
            product.save()
            return Response({'detail': 'Image uploaded successfully'})
        except Product.DoesNotExist:
            return Response({'detail': 'Product not found'}, status=404)
    return Response({'detail': 'Invalid data'}, status=400)


# ✅ User Profile & Admin User CRUD

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data['fname']
    user.last_name = data['lname']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)  # ✅ Always return response

    


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserById(request, pk):
        user = User.objects.get(id=pk)
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        data = request.data
        user.first_name = data.get('name', user.first_name)
        user.username = data.get('email', user.username)
        user.email = data.get('email', user.email)
        user.is_staff = data.get('isAdmin', user.is_staff)
        user.save()
        serializer = UserSerializer(user, many=False)
        return Response(serializer.data)
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteUser(request, pk):
    try:
        user = User.objects.get(id=pk)
        if user.is_superuser:
            return Response({'detail': 'Cannot delete superuser'}, status=400)
        user.delete()
        return Response({'detail': 'User deleted successfully'})
    except User.DoesNotExist:
        return Response({'detail': 'User not found'}, status=404)
