from kokoro_onnx import Kokoro
k=Kokoro('dl/models/kokoro-v1.0.onnx','dl/models/voices-v1.0.bin')
for w in ["Tuh-WAH-sun","tuhWAHsun","Tuhwahsun","Tawahsun","Tuh wahsen","Tsuhwahsen","Tswahsen"]:
    print(f"{w:25s}", k.tokenizer.phonemize(w,'en-us'))
