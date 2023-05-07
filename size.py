from PIL import Image
import os

# 指定目录路径和缩放比例
dir_path = 'assets'
scales = [2, 4, 8, 16]

# 遍历目录下的所有PNG图片
for filename in os.listdir(dir_path):
    if filename.endswith('.png'):
        filepath = os.path.join(dir_path, filename)
        with Image.open(filepath) as img:
            # 计算缩放后的尺寸
            width, height = img.size
            new_heights = [height // scale for scale in scales]
            # 缩放并保存图片
            for i, new_height in enumerate(new_heights):
                new_size = (int(width * new_height / height), new_height)
                new_filename = filename.split('.png')[0] + f'@{scales[i]}.png'
                new_filepath = os.path.join(dir_path, new_filename)
                img.resize(new_size).save(new_filepath)