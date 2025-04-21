from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Review

def review_list(request):
    if request.method == 'GET':
        reviews = Review.objects.all().order_by('-date_created')
        data = [{
            'id': review.id,
            'name': review.name,
            'rating': review.rating,
            'type': review.review_type,
            'review': review.text,
            'date': review.date_created.isoformat()
        } for review in reviews]
        return JsonResponse(data, safe=False)
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
def create_review(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            name = data.get('name')
            rating = int(data.get('rating'))
            review_type = data.get('type')
            review_text = data.get('review')

            if all([name, rating, review_type, review_text]):
                review = Review(name=name, rating=rating, review_type=review_type, text=review_text)
                review.save()
                return JsonResponse({'message': 'Review submitted successfully'}, status=201)
            else:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
        except ValueError:
            return JsonResponse({'error': 'Invalid rating'}, status=400)
    return JsonResponse({'error': 'Invalid request method'}, status=400)
