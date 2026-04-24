from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView
from . import views

urlpatterns = [
    # Auth
    path('auth/register/', views.register),
    path('auth/login/', TokenObtainPairView.as_view()),

    # Recipes
    path('recipes/search/', views.search_recipes),

    # Favorites
    path('favorites/', views.get_favorites),
    path('favorites/save/', views.save_favorite),
    path('favorites/<int:pk>/', views.delete_favorite),
]