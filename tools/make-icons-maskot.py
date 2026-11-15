"""Buat semua ikon aplikasi + favicon dari gambar maskot di tools/ikon-sumber/.
Jalankan: python3 tools/make-icons-maskot.py   (butuh: pip install pillow)
  ikon-utama.jpg    wajah maskot memenuhi kotak (gaya OCTO) -> icon-192/512, apple-touch-icon, favicon-48, favicon.svg,
                    dan maskable-kepala-512/192 (nama baru agar cache lama tidak terpakai; ikon yang terpasang di HP): kepala yang sama dalam lingkaran 82% di tengah (zona aman Android)
Setelah itu jalankan: node tools/make-sw.js"""
import base64,io,os
from PIL import Image,ImageDraw
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")
S=os.path.join(R,"tools","ikon-sumber"); O=os.path.join(R,"icons")
main=Image.open(os.path.join(S,"ikon-utama.jpg")).convert("RGB")
def rounded(img,r=0.22):
    img=img.convert("RGBA"); n=img.width*4
    m=Image.new("L",(n,n),0); ImageDraw.Draw(m).rounded_rectangle((0,0,n-1,n-1),radius=int(n*r),fill=255)
    img.putalpha(m.resize(img.size,Image.LANCZOS)); return img
def sq(img,n): return img.resize((n,n),Image.LANCZOS)
rounded(sq(main,512)).save(os.path.join(O,"icon-512.png"),optimize=True)
rounded(sq(main,192)).save(os.path.join(O,"icon-192.png"),optimize=True)
rounded(sq(main,48)).save(os.path.join(O,"favicon-48.png"),optimize=True)
sq(main,180).convert("RGB").save(os.path.join(O,"apple-touch-icon.png"),optimize=True)   # iOS memotong sudut sendiri; jangan transparan
# maskable (ikon PWA yang terpasang): kepala yang sama, dipotong lingkaran yang memuat jambul + wajah, diameter 82% kanvas = di dalam zona aman 80%
bg=main.getpixel((6,6)); N=512; d=round(N*0.82); cx,cy,r=520,540,480
head=main.crop((cx-r,cy-r,cx+r,cy+r)).resize((d,d),Image.LANCZOS).convert("RGBA")
mk=Image.new("L",(d*4,d*4),0); ImageDraw.Draw(mk).ellipse((0,0,d*4-1,d*4-1),fill=255); head.putalpha(mk.resize((d,d),Image.LANCZOS))
m=Image.new("RGBA",(N,N),bg+(255,)); m.alpha_composite(head,((N-d)//2,(N-d)//2)); m=m.convert("RGB"); m.save(os.path.join(O,"maskable-kepala-512.png"),optimize=True); m.resize((192,192),Image.LANCZOS).save(os.path.join(O,"maskable-kepala-192.png"),optimize=True)
# favicon.svg: gambar kecil di dalam SVG bersudut bulat
buf=io.BytesIO(); sq(main,96).save(buf,"PNG",optimize=True)
b64=base64.b64encode(buf.getvalue()).decode()
open(os.path.join(O,"favicon.svg"),"w").write(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><clipPath id="c"><rect width="64" height="64" rx="14"/></clipPath><image clip-path="url(#c)" width="64" height="64" xlink:href="data:image/png;base64,{b64}"/></svg>\n')
print("ikon dibuat di icons/")
