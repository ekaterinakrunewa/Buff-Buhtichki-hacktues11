from django.urls import path
from . import views

urlpatterns = [
    path('', views.review_list, name='review_page'),  # Access at /reviews/
    path('api/', views.review_list, name='review_list_api'), # Access at /reviews/api/
    path('api/create/', views.create_review, name='create_review_api'), # Access at /reviews/api/create/
]