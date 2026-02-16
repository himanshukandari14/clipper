from pytubefix import YouTube
from pytubefix.cli import on_progress

url1="https://youtu.be/E3oG313_kps?si=rD1VHazCe91A1crr"
url2="https://youtu.be/_l0vXqaoMnE?si=qyuhk9FPa8SkOlXz"


yt = YouTube(url2,on_progress_callback=on_progress)
print(yt.title)

ys = yt.streams.get_highest_resolution()
ys.download()

