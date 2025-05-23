# Generated by Django 5.2 on 2025-04-13 21:13

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cliente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(max_length=100)),
                ('telefone', models.CharField(max_length=20)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('endereco', models.TextField(blank=True, null=True)),
                ('data_cadastro', models.DateField(auto_now_add=True)),
            ],
        ),
    ]
