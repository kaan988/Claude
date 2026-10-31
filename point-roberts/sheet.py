import glob, sys
from PIL import Image, ImageDraw
fs = sorted(glob.glob('frames/still_*.jpg')); cols = 6; tw, th = 480, 270
sheet = Image.new('RGB', (cols*tw, ((len(fs)+cols-1)//cols)*th), 'black'); d = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    im = Image.open(f).resize((tw, th)); sheet.paste(im, ((i % cols)*tw, (i//cols)*th))
    d.text(((i % cols)*tw+6, (i//cols)*th+4), f"{int(f[-8:-4])/30:.2f}s", fill='yellow')
sheet.save(sys.argv[1], quality=85)
