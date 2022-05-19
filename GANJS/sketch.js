const SIZE = 512; //设置左边图片的画布大小

//变量
let inputlist,uploadBtn,imgroute, inputImg, currentImg, inputCanvas, output, statusMsg, pix2pix, clearBtn, transferBtn, currentColor, currentStroke,label;

//shapes_coord的前两个点是start和圆形按钮的点击
var shapes_coord = []
var shapes_colors = []

function setup() {
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);  //画布大小
  inputCanvas.class('border-box').parent('input');

  // Selcect output div container
  output = select('#output');
  statusMsg = select('#status');

  // Get the buttons，设置当前颜色为白色
  currentColor = color(255, 255, 255);
  currentStroke = 0;

  //这里必须先设置一个currentimg，作为后面draw函数的输入
  //这里不是很明白，因为只要upload了，理论上就有currentImg了啊
  inputImg = loadImage('images/blank.png', drawImage);
  currentImg = inputImg;


 //设置圆形按钮的点击动作
  select('#color_0').mousePressed(function () {
    currentColor = color(13,56,230,100);
    label = '砖墙_Brick wall';
    route = 'images/testimg/0.png';
    thick = 2;
    transZ = 0;
  });
  select('#color_1').mousePressed(function () {
    currentColor = color(127,172,239,100);
    label = '木墙_Wooden wall';
    route = 'images/testimg/1.png';
    thick = 2;
    transZ = 0;
  });
  select('#color_2').mousePressed(function () {
    currentColor = color(153,0,2,100);
    label = '门_Door';
    route = 'images/testimg/2.png';
    thick = 1;
    transZ = 0;
  });
  select('#color_3').mousePressed(function () {
    currentColor = color(0,107,235,100);
    label = '窗_Window';
    route = 'images/testimg/3.png';
    thick = 1;
    transZ = -1; //设定窗户往后缩1个Z坐标
  });
  select('#color_4').mousePressed(function () {
    currentColor = color(27,235,203,100);
    label = '窗沿_Window head';
    route = 'images/testimg/4.png';
    thick = 2;
    transZ = 0;
  });
  select('#color_5').mousePressed(function () {
    currentColor = color(235,134,4,100);
    label = '层间线条_Layer';
    route = 'images/testimg/5.png';
    thick = 2;
    transZ = 1;
  });
  select('#color_6').mousePressed(function () {
    currentColor = color(235,63,1,100);
    label = '屋顶_Roof';
    route = 'images/testimg/6.png';
    thick = 1;
    transZ = 0;
  });
  select('#color_7').mousePressed(function () {
    currentColor = color(224,0,0,100);
    label = '柱子_Column';
    route = 'images/testimg/7.png';
    thick = 2;
    transZ = 1;
  });
  select('#color_8').mousePressed(function () {
    currentColor = color(0,184,234,100);
    label = '洞口_Opening';
    route = 'images/testimg/8.png';
    thick = 1;
    transZ = 0;
  });
  select('#color_9').mousePressed(function () {
    currentColor = color(136,79,192,100);
    label = '商店_Shop window';
    route = 'images/testimg/9.png';
    thick = 1;
    transZ = -1;//设定窗户往后缩1个Z坐标
  });
  select('#color_10').mousePressed(function () {
    currentColor = color(238,169,188,100);
    label = '山墙_Gable';
    route = 'images/testimg/10.png';
    thick = 5;
    transZ = 0;
  });
  select('#color_11').mousePressed(function () {
    currentColor = color(218,216,37,100);
    label = '装饰_decorate';
    route = 'images/testimg/11.png';
    thick = 1;
    transZ = 0;
  });
  select('#color_12').mousePressed(function () {
    currentColor = color(141,132,175,100);
    label = '牌匾_Billboard';
    route = 'images/testimg/12.png';
    thick = 1;
    transZ = 0.5;
  });
  select('#color_13').mousePressed(function () {
    currentColor = color(255, 255, 255,100);
    label = '背景_Background';
    route = 'images/testimg/13.png';
    thick = 0.5;
    transZ = -5;
  });





  transferBtn = select('#transferBtn');
  clearBtn = select('#clearBtn');
  cancelBtn = select('#cancelBtn');
  startBtn = select('#startBtn');
  //点击上传图片（描绘的底图）的按钮功能
  uploadBtn = select('#uploadBtn');

  // Attach a mousePressed event to the 'clear' button
  clearBtn.mousePressed(function () {
    clearCanvas();
    clear3Dcanvas();
  });

  //取消点击圆色块的操作
  cancelBtn.mousePressed(function () {
    shapes_colors.pop()
    shapes_coord.pop()
  });

  // 开始绘图的botton
  startBtn.mousePressed(function () {

    // pix2pix = ml5.pix2pix('../pixmodel/maps.pict', modelLoaded);

    $("#screen").fadeOut("slow", function () {
      // Animation complete.
    });
    $("#status").animate({
      opacity: 1
    }, 1500, function () {
      // Animation complete.
    });

//     const session = await ort.InferenceSession.create(
//         "../pixmodel/pix2pix.onnx",
//   {
//     executionProviders: ["webgl"],
//       }
// );
//     console.log(session)
//     // modelLoaded()

  });

  //设置一个手动上传描绘底图的功能，路径需要修改
  uploadBtn.mousePressed(function () {
     imgroute = 'images/ACT (49).jpg';
     inputImg = loadImage(imgroute, drawImage);
     currentImg = inputImg;
  });

  transferBtn.mousePressed(function () {
   // 抓取到inputcanvas里面的图片参数，base64
    getimage();
    //执行后面的transfer函数
   transfer();

  });





} //setup结束的地方




let painting = false;
let x_a
let y_a

// Draw on the canvas when mouse is pressed
function draw(){
  strokeWeight(0);
  background(currentImg);

  //每次画下一步的时候，就把之前所有画过的重画一遍，最后一次输入的是不重新画的
  for(i = 0; i < shapes_coord.length; i++){
    fill(shapes_colors[i]);
    //rect( x, y, w, h, detailX, detailY ) x坐标、y坐标、矩形宽度、矩形高度
    rect(shapes_coord[i][0],shapes_coord[i][1],shapes_coord[i][2],shapes_coord[i][3])
    }


  //再画正在画的这个
  if(painting == true) {
    strokeWeight(currentStroke);
    fill(currentColor);
    rect(x_a, y_a, mouseX - x_a, mouseY - y_a);


    if (0 <= x_a && x_a <= 512 && 0 <= y_a && y_a <= 512 && 0 <= mouseX && mouseX <= 512) {
      //对角坐标点
      inputlist = [x_a, y_a, mouseX, mouseY];
      //label是砖墙的时候，才做布尔运算
      if (label != '砖墙_Brick wall') {
        drawBoxGeometry(inputlist, route, thick, transZ, label);
      }
    }
  }else{
   if (0 <= x_a && x_a <= 512 && 0 <= y_a && y_a <= 512 && 0 <= mouseX && mouseX <= 512) {
      //对角坐标点
      inputlist = [x_a, y_a, mouseX, mouseY];
        if (label == '砖墙_Brick wall') {
        if(cutdraw == false){
            // console.log(cutdraw);--false
          shapecutted(inputlist,shapes_coord);
          console.log(shapes_coord)
            // console.log(cutdraw);--true
        }
      }
  }
}




  //这里好像是绘制画矩形的范围
  strokeWeight(0.2) //线粗0.2
  //vertical line
  line(mouseX,0,mouseX,512)
  //horizontal line
  line(0,mouseY,512,mouseY)

}

//mousePressed()的时候painting函数才激活，P5JS自带函数
function mousePressed(){
  painting = true;
  cutdraw = true;
  x_a = mouseX;
  y_a = mouseY;

}

//mouseReleased的时候painting函数结束，P5JS自带函数
function mouseReleased(){
  shapes_coord.push([x_a,y_a,mouseX-x_a,mouseY-y_a])
  shapes_colors.push(currentColor);
  painting = false;
  cutdraw = false;
  redraw();

}

// A function to be called when the models have loaded
function modelLoaded() {
  // Show 'Model Loaded!' message，先标注掉了
  // statusMsg.html('模型加载成功');
  // Call transfer function after the model is loaded
  // transfer();
  // Attach a mousePressed event to the transfer button
  transferBtn.mousePressed(function() {
    transfer();
  });
}

// drawimage到canvas画布里，在upload里调用
function drawImage() {
  image(inputImg, 0, 0,SIZE, SIZE);
}


// 清除画布，2D/3D
function clearCanvas() {
  //background(255);
  currentImg = inputImg;
  shapes_coord = []
  shapes_colors = []
}


//transfer，包含了加载模型-tensor转换-run onnxmodel
async function transfer() {
      // 加载模型
      const session = await ort.InferenceSession.create('../pixmodel/pix2pix.onnx');
      console.log(session)

      // 把labelImage转化为tensor，这里用了TensorFlow;dummy_input=(1,3,256,256)
      const imageTensor = tf.browser.fromPixels(labelImage,4)
      console.log(imageTensor.shape)

      const DIMS = [1,3,256,256];
      const inputTensor = imageDataToTensor(imageTensor, DIMS);
      run(inputTensor);


      // feed inputs and run
      const feeds = {input_1:inputTensor};
      console.log(feeds)
      const results = await session.run(feeds);


      // read from results
      const dataC = results.c.data;
      document.write(`data of result tensor 'c': ${dataC}`);

}


//转换图片格式为model的tensor格式[1,3,256,256]
function imageDataToTensor(data, dims) {
  // 1a. Extract the R, G, and B channels from the data
  const [R, G, B] = [[], [], []]
  for (let i = 0; i < data.length; i += 4) {
    R.push(data[i]);
    G.push(data[i + 1]);
    B.push(data[i + 2]);
    // 2. skip data[i + 3] thus filtering out the alpha channel
  }
  // 1b. concatenate RGB ~= transpose [224, 224, 3] -> [3, 224, 224]
  const transposedData = R.concat(G).concat(B);

  // 3. convert to float32
  let i, l = transposedData.length; // length, we need this for the loop
  const float32Data = new Float32Array(3 * 224 * 224); // create the Float32Array for output
  for (i = 0; i < l; i++) {
    float32Data[i] = transposedData[i] / 255.0; // convert to float
  }

  const inputTensor = new ort.Tensor("float32", float32Data, dims);
  return inputTensor;
}


//压缩图片
function processImage(img, width) {

  // resize image
  canvas.width = width;
  canvas.height = canvas.width * (img.height / img.width);

  // draw scaled image
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  document.getElementById("scaled-image").src = canvas.toDataURL();

  // return data
  return ctx.getImageData(0, 0, width, width).data;
}

function getimage(){

   const labelcanvas = document.getElementById("defaultCanvas0");
   const labelbase64 = labelcanvas.toDataURL("image/jpeg");
  // set image.src这个好像不是必须的，后面tranfer调取
   const labelimg = new Image();
   labelimg.src = labelbase64;
   labelImage = document.body.appendChild(labelimg);



}