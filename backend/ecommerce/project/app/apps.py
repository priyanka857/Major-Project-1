from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        from .views import create_superuser_if_not_exists
        try:
            create_superuser_if_not_exists()
        except:
            pass