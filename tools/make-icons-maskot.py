"""Buat semua ikon aplikasi + favicon dari gambar maskot di tools/ikon-sumber/.
Jalankan: python3 tools/make-icons-maskot.py   (butuh: pip install pillow)
  ikon-utama.jpg    wajah maskot memenuhi kotak (gaya OCTO) -> icon-192/512, apple-touch-icon, favicon-48, favicon.svg,
                    dan maskable-kepala-v3-512/192 (nama baru agar cache lama tidak terpakai; ikon yang terpasang di HP): gambar yang sama diperkecil, badan sampai tepi bawah tanpa garis lengkung. (komentar lama: lingkaran (aman untuk HP yang memotong banyak)
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
# maskable (ikon PWA yang terpasang): gambar penuh diperkecil (skala 0,40 dari 1024 px), menempel ke tepi bawah, sehingga badan burung terus sampai bawah
# (tanpa potongan lingkaran = tanpa garis lengkung di bawah burung). Jambul dan wajah tetap di dalam jendela yang terlihat (HP Xiaomi sekitar 70%).
# Sisa kanvas (atas dan samping) diisi dengan menyambung piksel tepi gambar, jadi hijau latar mulus dan sayap yang menyentuh tepi tetap berlanjut.
N=512; SZ=round(1024*0.40); X=(N-SZ)//2; DY=N-SZ   # gambar sumber 1024 px dikali 0,40 = 410 px
body=main.resize((SZ,SZ),Image.LANCZOS)
m=Image.new("RGB",(N,N)); m.paste(body,(X,DY))
m.paste(body.crop((0,0,1,SZ)).resize((X,SZ),Image.NEAREST),(0,DY))
m.paste(body.crop((SZ-1,0,SZ,SZ)).resize((N-X-SZ,SZ),Image.NEAREST),(X+SZ,DY))
m.paste(m.crop((0,DY,N,DY+1)).resize((N,DY),Image.NEAREST),(0,0))
m.save(os.path.join(O,"maskable-kepala-v3-512.png"),optimize=True); m.resize((192,192),Image.LANCZOS).save(os.path.join(O,"maskable-kepala-v3-192.png"),optimize=True)
# favicon.svg: gambar kecil di dalam SVG bersudut bulat
buf=io.BytesIO(); sq(main,96).save(buf,"PNG",optimize=True)
b64=base64.b64encode(buf.getvalue()).decode()
open(os.path.join(O,"favicon.svg"),"w").write(f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 64 64"><clipPath id="c"><rect width="64" height="64" rx="14"/></clipPath><image clip-path="url(#c)" width="64" height="64" xlink:href="data:image/png;base64,{b64}"/></svg>\n')
print("ikon dibuat di icons/")
