from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.conf import settings
from groq import Groq
from .models import Favorite
from .serializers import FavoriteSerializer
import re
import json

# ── REGISTER ──────────────────────────────────────────
@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response({'error': 'Username and password required'}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=400)

    user = User.objects.create_user(username=username, password=password, email=email)
    return Response({'message': 'User created successfully'}, status=201)


# ── RECIPE GENERATION ─────────────────────────────────
@api_view(['POST'])
def search_recipes(request):
    ingredients = request.data.get('ingredients', [])

    if not ingredients:
        return Response({'error': 'No ingredients provided'}, status=400)

    client = Groq(api_key=settings.GROQ_API_KEY)

    prompt = f"""
    You are a recipe generator. Given these ingredients: {', '.join(ingredients)}
    Return ONLY a valid JSON array with 3 recipes. No explanation, no extra text.
    Format:
    [
      {{
        "title": "Recipe Name",
        "ingredients": ["item1", "item2"],
        "steps": ["step1", "step2"]
      }}
    ]
    """

    chat = client.chat.completions.create(
        messages=[{"role": "user", "content": prompt}],
        model="llama-3.1-8b-instant",
    )

    raw = chat.choices[0].message.content

    # Extract JSON from response
    match = re.search(r'\[.*\]', raw, re.DOTALL)
    if not match:
        return Response({'error': 'AI response parsing failed'}, status=500)

    recipes = json.loads(match.group())

    # Attach dummy image
    for i, recipe in enumerate(recipes):
        recipe['image'] = f"https://dummyimage.com/400x300/{'8B4513' if i%2==0 else 'FF6347'}/fff&text={recipe['title'].replace(' ', '+')}"
    return Response(recipes)


# ── SAVE FAVORITE ─────────────────────────────────────
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_favorite(request):
    serializer = FavoriteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)


# ── GET FAVORITES ─────────────────────────────────────
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_favorites(request):
    favorites = Favorite.objects.filter(user=request.user)
    serializer = FavoriteSerializer(favorites, many=True)
    return Response(serializer.data)


# ── DELETE FAVORITE ───────────────────────────────────
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_favorite(request, pk):
    try:
        favorite = Favorite.objects.get(pk=pk, user=request.user)
        favorite.delete()
        return Response({'message': 'Deleted'}, status=204)
    except Favorite.DoesNotExist:
        return Response({'error': 'Not found'}, status=404)