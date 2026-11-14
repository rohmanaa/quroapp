"""Buat semua ikon aplikasi + favicon dari gambar maskot di tools/ikon-sumber/.
Jalankan: python3 tools/make-icons-maskot.py   (butuh: pip install pillow)
  ikon-utama.jpg    wajah maskot memenuhi kotak (gaya OCTO) -> icon-192/512, apple-touch-icon, favicon-48, favicon.svg
  ikon-maskable.jpg maskot lebih kecil di tengah           -> icon-maskable-512 (aman dipotong bulat oleh Android)
Setelah itu jalankan: node tools/make-sw.js"""
import base64,io,os
from PIL import Image,ImageDraw
R=os.path.join(os.path.dirname(os.path.abspath(__file__)),"..")
S=os.path.join(R,"tools","ikon-sumber"); O=os.path.join(R,"icons")
main=Image.open(os.path.join(S,"ikon-utama.jpg")).convert("RGB")
mask=Image.open(os.path.join(S,"ikon-maskable.jpg")).convert("RGB")
def rounded(img,r=0.22):
    img=img.convert("RGBA"); n=img.width*4
    m=Image.new("L",(n,n),0); ImageDraw.Draw(m).rounded_rectangle((0,0,n-1,n-1),radius=int(n*r),fill=255)
    img.putalpha(m.resize(img.size,Image.LANCZOS)); return img
def sq(img,n): return img.resize((n,n),Image.LANCZOS)
rounded(sq(main,512)).save(os.path.join(O,"icon-512.png"),optimize=True)
rounded(sq(main,192)).save(os.path.join(O,"icon-192.png"),optimize=True)
rounded(sq(main,48)).save(os.path.join(O,"favicon-48.png"),optimize=True)
sq(main,180).convert("RGB").save(os.path.join(O,"apple-touch-icon.png"),optimize=True)   # iOS memotong sudut sendiri; jangan transparan
# maskable: latar penuh sampai tepi, maskot 92% di tengah agar aman di lingkaran 80%
bg=mask.getpixel((4,4)); m=Image.new("RGB",(512,512),bg); k=round(512*0.92)
m.paste(sq(mask,k),((512-k)//2,(512-k)//2)); m.save(os.path.join(O,"icon-maskable-512.png"),optimize=True)
# favicon.svg: gambar kecil di dalam SVG bersudut bulat
buf=io.BytesIO(); sq(main,96).save(buf,"PNG",optimize=True)
b64=base64.b64encode(buf.getvalue()).decode()
open(os.path.join(O,"favicon.svg"),"w").write(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><clipPath id="c"><rect width="64" height="64" rx="14"/></clipPath><image clip-path="url(#c)" width="64" height="64" xlink:href="data:image/png;base64,{b64}"/></svg>\n')
print("ikon dibuat di icons/")
