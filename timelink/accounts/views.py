from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .forms import SignUpForm, CustomLoginForm
import json

@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        if request.headers.get('Content-Type') == 'application/json':
            # ajax req
            data = json.loads(request.body)
            form = SignUpForm({
                'first_name': data.get('first_name'),
                'last_name': data.get('last_name'),
                'email': data.get('email'),
                'phone': data.get('phone'),
                'password1': data.get('password'),
                'password2': data.get('password'), 
            })
            
            if form.is_valid():
                user = form.save()
                # dont log after signup
                return JsonResponse({'success': True, 'userId': user.id, 'name': f"{user.first_name} {user.last_name}"})
            else:
                errors = dict(form.errors.items())
                return JsonResponse({'error': "Validation failed", 'errors': errors}, status=400)
        else:
            # Handle regular form submission
            form = SignUpForm(request.POST)
            if form.is_valid():
                user = form.save()
                login(request, user)
                return redirect('index')
    else:
        form = SignUpForm()
    
    return render(request, 'accounts/signup.html', {'form': form})

@csrf_exempt
def login_view(request):
    if request.method == 'POST':
        if request.headers.get('Content-Type') == 'application/json':
            #ajax req handler
            data = json.loads(request.body)
            user = authenticate(request, username=data.get('email'), password=data.get('password'))
            
            if user is not None:
                login(request, user)
                return JsonResponse({'success': True, 'userId': user.id, 'name': f"{user.first_name} {user.last_name}"})
            else:
                return JsonResponse({'error': 'Invalid email or password'}, status=400)
        else:
            form = CustomLoginForm(data=request.POST)
            if form.is_valid():
                user = form.get_user()
                login(request, user)
                return redirect('index')
    else:
        form = CustomLoginForm()
    
    return render(request, 'accounts/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('index')

def index_view(request):
    return render(request, 'index.html')