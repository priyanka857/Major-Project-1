from app import views
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('', views.getRoutes, name='getRoutes'),

    # Products
    path('products/', views.getProducts, name='getProducts'),
    path('product/<int:pk>/', views.getProduct, name='getProduct'),

    # User auth
    path('users/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('users/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/register/', views.registerUser, name='registerUser'),
    path('users/profile/', views.getUserProfile, name='getUserProfile'),
    path('users/profile/update/', views.updateUserProfile, name='updateUserProfile'),

    # Email Activation
    path('activate/<uidb64>/<token>/', views.ActivateAccountView.as_view(), name='activate'),

    # Orders
    path('orders/add/', views.addOrderItems, name='addOrderItems'),
    path('orders/myorders/', views.getMyOrders, name='getMyOrders'),
    path('orders/<int:pk>/', views.getOrderById, name='getOrderById'),
    path('orders/', views.getOrders, name='getOrders'),

    # Admin Product management
    path('products/create/', views.createProduct, name='createProduct'),
     path('products/update/<int:pk>/', views.updateProduct, name='updateProductAlt'),
    path('products/delete/<int:pk>/', views.deleteProduct, name='deleteProductAlt'),
    path('products/upload/', views.uploadImage, name='uploadImage'),
    # Extra alias for frontend calls
    path('upload/', views.uploadImage, name='uploadImageAlias'),
    # Admin user management
    path('users/getallusers/', views.getUsers, name='getAllUsers'),  # new path for get all users
    path('users/', views.getUsers, name='getUsers'),
    path('users/<int:pk>/update/', views.updateUser, name='updateUser'),
    path('users/<int:pk>/delete/', views.deleteUser, name='deleteUser'),
    path('users/delete/<int:pk>/', views.deleteUser, name='deleteUserAlias'),
    path('users/<int:pk>/', views.getUserById, name='getUserById'),
    # Aliases for frontend calls
    path('users/update/<int:pk>/', views.updateUser, name='updateUserAlias'),   
    path('users/delete/<int:pk>/', views.deleteUser, name='deleteUserAlias'),
]

