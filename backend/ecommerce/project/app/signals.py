from django.contrib.auth.models import User
from django.db.models.signals import post_migrate
from django.dispatch import receiver

@receiver(post_migrate)
def create_superuser(sender, **kwargs):
    if not User.objects.filter(username="priyankapandiyan07@gmail.com").exists():
        User.objects.create_superuser(
            username="priyankapandiyan07@gmail.com",
            email="priyankapandiyan07@gmail.com",
            password="Priyanka@123"
        )