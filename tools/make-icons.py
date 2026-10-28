"""Buat ikon aplikasi (icons/*.png) dari huruf ق dengan font Amiri. Jalankan: python3 tools/make-icons.py
Butuh: pip install pillow fonttools brotli"""
import io,os
from fontTools.ttLib import TTFont
from PIL import Image,ImageDraw,ImageFont
root=os.path.join(os.path.dirname(__file__),"..")
f=TTFont(os.path.join(root,"assets/fonts/amiri-arabic-700-normal.woff2"));f.flavor=None
buf=io.BytesIO();f.save(buf);buf.seek(0)
def draw(size,rounded):
    S=1024
    top,bot=(0x4C,0xC3,0x5A),(0x2B,0x8F,0x39)
    bg=Image.new("RGB",(S,S));px=bg.load()
    for y in range(S):
        t=y/(S-1);c=tuple(round(top[i]+(bot[i]-top[i])*t) for i in range(3))
        for x in range(S):px[x,y]=c
    img=bg.convert("RGBA")
    font=ImageFont.truetype(io.BytesIO(buf.getvalue()),int(S*0.78),layout_engine=ImageFont.Layout.RAQM)
    box=font.getbbox("ق");gw,gh=box[2]-box[0],box[3]-box[1]
    ox,oy=(S-gw)//2-box[0],int(S*0.47)-gh//2-box[1]
    sh=Image.new("RGBA",(S,S),(0,0,0,0));ImageDraw.Draw(sh).text((ox,oy+int(S*0.03)),"ق",font=font,fill=(31,107,43,255))
    img=Image.alpha_composite(img,sh)
    fg=Image.new("RGBA",(S,S),(0,0,0,0));ImageDraw.Draw(fg).text((ox,oy),"ق",font=font,fill=(255,255,255,255))
    img=Image.alpha_composite(img,fg)
    if rounded:
        m=Image.new("L",(S,S),0);ImageDraw.Draw(m).rounded_rectangle([0,0,S-1,S-1],radius=int(S*0.22),fill=255);img.putalpha(m)
    return img.resize((size,size),Image.LANCZOS)
out=os.path.join(root,"icons")
draw(192,True).save(out+"/icon-192.png");draw(512,True).save(out+"/icon-512.png")
draw(512,False).save(out+"/icon-maskable-512.png");draw(180,False).save(out+"/apple-touch-icon.png");draw(48,True).save(out+"/favicon-48.png")
print("ikon dibuat")
