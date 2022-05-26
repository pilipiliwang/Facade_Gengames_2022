const SIZE = 256; //设置左边图片的画布大小
let responseString;

//变量
let outputCanvas,inputlist,uploadBtn,imgroute, inputImg, currentImg, inputCanvas, output, statusMsg, pix2pix, clearBtn, transferBtn, currentColor, currentStroke,label;

//shapes_coord的前两个点是start和圆形按钮的点击
var shapes_coord = []
var shapes_colors = []
var routelist = []
var labellist = []
var thicklist = []
var transZlist = []

function setup() {
  // Create a canvas
  inputCanvas = createCanvas(SIZE, SIZE);  //画布大小
  inputCanvas.class('border-box').parent('input');


  // Selcect output div container
  // output = select('#output');
  statusMsg = select('#status');

  // Get the buttons，设置当前颜色为白色
  currentColor = color(255, 255, 255);
  currentStroke = 0;

  //这里必须先设置一个currentimg，作为后面draw函数的输入
  //这里不是很明白，因为只要upload了，理论上就有currentImg了啊
  inputImg = loadImage('static/images/blank.png', drawImage);
  currentImg = inputImg;


 //设置圆形按钮的点击动作
  select('#color_0').mousePressed(function () {
    currentColor = color(13,56,230,255);
    label = '砖墙_Brick wall';
    route = 'static/images/testimg/0.png';
    // route = 'static/images/testimg/'+i; //route和画的label相关
    thick = 1;
    transZ = -0.3;
  });
  select('#color_1').mousePressed(function () {
    currentColor = color(127,172,239,255);
    label = '木墙_Wooden wall';
    route = 'static/images/testimg/1.png';
    thick = 2;
    transZ = 0;
  });
  select('#color_2').mousePressed(function () {
    currentColor = color(153,0,2,255);
    label = '门_Door';
    route = 'static/images/testimg/2.png';
    thick = 1;
    transZ = 0;
  });
  select('#color_3').mousePressed(function () {
    currentColor = color(0,107,235,255);
    label = '窗_Window';
    route = 'static/images/testimg/3.png';
    thick = 1;
    transZ = 0.5; //设定窗户往后缩1个Z坐标
  });
  select('#color_4').mousePressed(function () {
    currentColor = color(27,235,203,255);
    label = '窗沿_Window head';
    route = 'static/images/testimg/4.png';
    thick = 2;
    transZ = 0;
  });
  select('#color_5').mousePressed(function () {
    currentColor = color(235,134,4,255);
    label = '层间线条_Layer';
    route = 'static/images/testimg/5.png';
    thick = 2;
    transZ = 1;
  });
  select('#color_6').mousePressed(function () {
    currentColor = color(235,63,1,255);
    label = '屋顶_Roof';
    route = 'static/images/testimg/6.png';
    thick = 0.5;
    transZ = 0;
  });
  select('#color_7').mousePressed(function () {
    currentColor = color(224,0,0,255);
    label = '柱子_Column';
    route = 'static/images/testimg/7.png';
    thick = 2;
    transZ = 1;
  });
  select('#color_8').mousePressed(function () {
    currentColor = color(0,184,234,255);
    label = '洞口_Opening';
    route = 'static/images/testimg/8.png';
    thick = 1;
    transZ = 0;
  });
  select('#color_9').mousePressed(function () {
    currentColor = color(136,79,192,255);
    label = '商店_Shop window';
    route = 'static/images/testimg/9.png';
    thick = 1;
    transZ = 0;//设定窗户往后缩1个Z坐标
  });
  select('#color_10').mousePressed(function () {
    currentColor = color(238,169,188,255);
    label = '山墙_Gable';
    route = 'static/images/testimg/10.png';
    thick = 5;
    transZ = 0;
  });
  select('#color_11').mousePressed(function () {
    currentColor = color(218,216,37,255);
    label = '装饰_decorate';
    route = 'static/images/testimg/11.png';
    thick = 1;
    transZ = 0;
  });
  select('#color_12').mousePressed(function () {
    currentColor = color(141,132,175,255);
    label = '牌匾_Billboard';
    route = 'static/images/testimg/12.png';
    thick = 1;
    transZ = 0.5;
  });
  select('#color_13').mousePressed(function () {
    currentColor = color(255, 255, 255,255);
    label = '背景_Background';
    route = 'static/images/testimg/13.png';
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

    //pop all lists
    labellist.pop()
    routelist.pop()

    thicklist.pop()
    transZlist.pop()

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
     imgroute = 'static/images/labelinput.jpg';
     inputImg = loadImage(imgroute, drawImage);
     currentImg = inputImg;
  });

  transferBtn.mousePressed(function () {

    //执行后面的transfer函数
    transfer();

   // //裁剪图片和贴图
    pixTex3Dpush();

  });


} //setup结束的地方




let painting = false;
let x_a
let y_a

// Draw on the canvas when mouse is pressed
function draw() {
  strokeWeight(0);
  background(currentImg);

  //每次画下一步的时候，就把之前所有画过的重画一遍，最后一次输入的是不重新画的
  for (i = 0; i < shapes_coord.length; i++) {
    fill(shapes_colors[i]);
    //rect( x, y, w, h, detailX, detailY ) x坐标、y坐标、矩形宽度、矩形高度
    rect(shapes_coord[i][0], shapes_coord[i][1], shapes_coord[i][2], shapes_coord[i][3])
  }


  //再画正在画的这个
  if (painting == true) {
    strokeWeight(currentStroke);
    fill(currentColor);
    rect(x_a, y_a, mouseX - x_a, mouseY - y_a);

  }else
    if (0 <= x_a && x_a <= 256 && 0 <= y_a && y_a <= 256 && 0 <= mouseX && mouseX <= 256) {
      //对角坐标点
      console.log(stop3Ddraw)
      inputlist = [x_a, y_a, mouseX, mouseY];
      if (stop3Ddraw == false) {
        drawBoxGeometry(inputlist, route, thick, transZ, label);
        stop3Ddraw  = true;
      }
    }



//       //label是砖墙的时候，才做布尔运算
//       if (label != '砖墙_Brick wall') {
//         drawBoxGeometry(inputlist, route, thick, tsransZ, label);
//       }
//     }
//   }else{
//    if (0 <= x_a && x_a <= 256 && 0 <= y_a && y_a <= 256 && 0 <= mouseX && mouseX <= 256) {
//       //对角坐标点
//       inputlist = [x_a, y_a, mouseX, mouseY];
//         if (label == '砖墙_Brick wall') {
//         if(stop3Ddraw == false){
//             // console.log(stop3Ddraw);--false
//           shapecutted(inputlist,shapes_coord);
//           console.log(shapes_coord)
//             // console.log(stop3Ddraw);--true
//         }
//       }
//   }
// }




  //这里好像是绘制画矩形的范围
  strokeWeight(0.2) //线粗0.2
  //vertical line
  line(mouseX,0,mouseX,256)
  //horizontal line
  line(0,mouseY,256,mouseY)

}


//mousePressed()的时候painting函数才激活，P5JS自带函数
function mousePressed(){
  painting = true;
  stop3Ddraw = true;
  x_a = mouseX;
  y_a = mouseY;

}

//mouseReleased的时候painting函数结束，P5JS自带函数
function mouseReleased(){

   if( 0 <= x_a && x_a <= 256 && 0 <= y_a && y_a <= 256 && 0 <= mouseX && mouseX <= 256) {
  shapes_coord.push([x_a,y_a,mouseX-x_a,mouseY-y_a])
  shapes_colors.push(currentColor);

  routelist.push(route);
  labellist.push(label);

  thicklist.push(thick);
  transZlist.push(transZ)
  }
  painting = false;
  stop3Ddraw = false;
  redraw();
}

// // A function to be called when the models have loaded
// function modelLoaded() {
//   // Show 'Model Loaded!' message，先标注掉了
//   // statusMsg.html('模型加载成功');
//   // Call transfer function after the model is loaded
//   // transfer();
//   // Attach a mousePressed event to the transfer button
//   transferBtn.mousePressed(function() {
//     transfer();
//   });
// }

// drawimage到canvas画布里，在upload里调用
function drawImage() {
  image(inputImg, 0, 0,SIZE, SIZE);
}


// 清除画布，2D/3D
function clearCanvas() {
  //background(255);
  currentImg = inputImg;
  shapes_coord = [];
  shapes_colors = [];

  routelist = [];
  labellist = [];

  thicklist = [];
  transZlist = [];
}

function transfer() {
  const p5canvas = document.getElementById("defaultCanvas0");

  var base64StringIn = p5canvas.toDataURL('image/jpeg',1.0).split(';base64,')[1];

  var outString;
  var outImInf = inference(base64StringIn);
  // window.console.log(responseString);

  const outIm = document.getElementById("output");

  var ctx = outIm.getContext("2d");

  var image = new Image();
  image.onload = function() {
      ctx.drawImage(image, 0, 0, SIZE, SIZE*2, 0, 0, 300, 300);
  };
  image.src = "data:image/jpeg;base64,"+responseString;



}

async function inference(baseString) {
  // construct url for GET /solve/definition.gh?name=value(&...)

  var imgData = {image: baseString,shapes_coord:shapes_coord};
  const url = new URL('/generate/', window.location.origin);
  //Object.keys(data.inputs).forEach(key => url.searchParams.append(key, data.inputs[key]))
  var bodydata = JSON.stringify(imgData);
  //console.log(bodydata.toString());
  //console.log(bodydata);
  
  try {
    const response = await fetch(url,{method:"POST",
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodydata
    });

    //console.log(response);
    if(!response.ok) {
      // TODO: check for errors in response json
      throw new Error(response.statusText)
    }

    const responseJson = await response.json()
    //console.log(responseJson);

    responseString = JSON.parse(responseJson).predicted;
    //console.log(responseString);

  } catch(error) {
    console.error(error)
  }
}


//在javascript里面用canvas裁剪
// function piximagecutted(x,y,width,height,download_name) {
//
//     function base64Img2Blob(code){
//           var parts = code.split(';base64,');
//           var contentType = parts[0].split(':')[1];
//           var raw = window.atob(parts[1]);
//           var rawLength = raw.length;
//           var uInt8Array = new Uint8Array(rawLength);
//           for (var i = 0; i < rawLength; ++i) {
//           uInt8Array[i] = raw.charCodeAt(i);
//           }
//           return new Blob([uInt8Array], {type: contentType});
//     }
//
//     function downloadFile(fileName, content){
//           var aLink = document.createElement('a');
//           var blob = base64Img2Blob(content); //new Blob([content]);
//       console.log(blob)
//
//           var evt = document.createEvent("MouseEvents");
//
//           // 这个地方不确定是否可以，有些web不接受这个方法的协议
//           evt.initEvent("click", false, false);//initEvent 不加后两个参数在FF下会报错
//           aLink.download = fileName;
//           aLink.href = URL.createObjectURL(blob);
//           aLink.dispatchEvent(evt);
//     }
//
//     //抓output canvas
//    const labelcanvas = document.getElementById("output");
//    const ctx = labelcanvas.getContext('2d');
//     // x， y这里是鼠标的起点坐标， width， height是我们截图的长宽
//     let startX = x;
//     let startY = y;
//
//     // x， y这里是鼠标的起点坐标， w， h是我们截图的长宽
//     const data = ctx.getImageData(startX, startY, width, height);
//     // console.log(data)
//
//   // 创建一个新的canvas
//     const canvasElement = document.createElement("canvas");
//     const canvasContext = canvasElement.getContext('2d');
//     canvasElement.width = width;
//     canvasElement.height = height;
//     canvasContext.putImageData(data, 0, 0)
//
//     //存储到浏览器路径
//     downloadFile( download_name , canvasElement.toDataURL('image/png', 1));
//
// }



function pixTex3Dpush(){

//clear 3Dcanvas先把画布清除，重新画上去
  clear3Dcanvas();
  for(i = 0; i < shapes_coord.length; i++){
//不知道为什么所有的coord对象都出现了两次，可能是点击的时候也有release的动作。。。所以貌似得设置i+2,或者i = 1，i+2?

    //由于实时画3D的时候需要用inputlist，所以这里就做一个inputlist和shapecoord坐标转换
    inputlist = [shapes_coord[i][0],shapes_coord[i][1],shapes_coord[i][2]+shapes_coord[i][0],shapes_coord[i][3]+shapes_coord[i][1]];
    route = routelist[i];
    thick = thicklist[i];
    transZ = transZlist[i];
    label = labellist[i];
    const pixImg_name = 'imgcutted_'+str(i)+'.png';
    route = 'static/images/labelcanvas/'+ pixImg_name;//用chrome web server做的本地服务器

    // const width = shapes_coord[i][2];
    // const height = shapes_coord[i][3];
   // piximagecutted(x=shapes_coord[i][0],y=shapes_coord[i][1],width,height,download_name=pixImg_name);



    drawBoxGeometry(inputlist,route,thick,transZ,label);
    console.log(route)
    }
}


