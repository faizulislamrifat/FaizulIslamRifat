import os
import requests

# Load TELEGRAM_BOT_TOKEN from .env
env_path = r'C:\Users\hallo\AppData\Local\hermes\.env'
token = ''
with open(env_path, 'r', encoding='utf-8') as f:
    for line in f:
        if line.startswith('TELEGRAM_BOT_TOKEN='):
            token = line.strip().split('=', 1)[1]

channel_username = '@iamfaizulislamrifat'
video_path = r'D:\OpenCode\hf-unlimited\renders\hf-unlimited_2026-11-12_21-41-31.mp4'

url = f'https://api.telegram.org/bot{token}/sendVideo'

print(f'Sending video to {channel_username} using bot token...')
with open(video_path, 'rb') as video_file:
    response = requests.post(
        url,
        data={
            'chat_id': channel_username,
            'caption': '🚀 GurGari & HyperFrames Video Showcase | Created by AI OS (grurgari.com)'
        },
        files={
            'video': video_file
        }
    )

print('Response status:', response.status_code)
print('Response body:', response.text)
