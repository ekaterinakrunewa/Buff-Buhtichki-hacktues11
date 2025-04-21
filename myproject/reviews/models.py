from django.db import models

class Review(models.Model):
    name = models.CharField(max_length=100)
    rating = models.IntegerField()
    review_type = models.CharField(max_length=10, choices=[('Helper', 'Helper'), ('Receiver', 'Receiver')])
    text = models.TextField(max_length=500)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.name} ({self.rating} stars)"
