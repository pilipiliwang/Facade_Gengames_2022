![](https://github.com/pilipiliwang/Facade_Gengames_2022/blob/main/FacadewebGIF_.gif)

# Facade_Gengames_2022
这是一个基于 [pix2pix脚本](https://github.com/junyanz/pytorch-CycleGAN-and-pix2pix) 进行立面生成的测试demo，基于pytorch进行模型训练。建议使用**chrome**浏览器运行。
## Installation
- clone 这个repo到本地:

       git clone https://github.com/junyanz/pytorch-CycleGAN-and-pix2pixhttps://github.com/pilipiliwang/Facade_Gengames_2022.git
 
  
- 安装必要的库：
  - 包括pytorch\flask\numpy\json\PIL等基于python的库
  - 由于用JavaScript写threejs和Web的命令，因此会在运行后自动下载一些js文件。建议再用美国的服务器，否则容易报错
## 运行程序
- pix2pix推理模型下载
  - 由于github上传受限，需要第一级目录下建立‘checkpoints’文件夹，并下载pix2pix的推理模型到文件夹下。推理模型可以从[baidu网盘](链接：https://pan.baidu.com/s/1RMM093Jv-E8Xo7v9kf52sw 提取码：ogyj )下载
- 请在static/images下面建立labelcanvas文件夹，用来存放opencv在后端的裁剪文件。也可以自行创建文件夹，那么需要修改flask.app里面有关 def piximagecutted() 的相关代码：
 
        cropArea = img[y0:y1,x0:x1]
        route = 'static/images/labelcanvas/imgcutted_'+str(i)+'.png' 
        print(route)
        cv2.imwrite(route,cropArea)
        
   值得注意的是，labelcanvas里的裁剪图片，应该在clear画布的时候，同时被清空，这段代码我这次的repo里是没有写的，所以在运行代码的时候，需要每次手动删除labelcanvas里生成的图片，否则3D模型上的贴图会混乱。
## 代码说明
- 有关pix2pix模型load&run的代码在flask.app里面，一般只需要修改.pth的路径即可，.pth是pytorch模型文件
- 有关3D模型的代码，在static/test3D.js里面；有关2D绘图的代码，在static/sketch.js里面。如果需要修改绘图方式，或者是label的特征，需要同时修改这两个文件，并且重新训练模型
- 有关web界面的代码在templates/home.html里面，CSS样式在static/style.css里面
## 尚未解决的bug
- 现在点击trasfer两次，才会在outputcanvas里面出现pix2pix生成的图片，而此时3Dcanvas里面已经被贴上了pix2pix生成图片。这应该是因为点击操作的问题，暂时没有去解决
- THREEJS关于窗洞布尔运算没有实现，原因是toshapes命令在进行多次扣洞的布尔运算的时候，旋转方向出现了错误。目前用墙体后退的方式从视觉效果上解决这个问题，后续可以优化
