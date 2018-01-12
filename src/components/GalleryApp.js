'use strict';

var React = require('react/addons');


// CSS
require('normalize.css');
require('../styles/main.scss');

var ImgFigure = React.createClass({
	/*
	* imgFigure的点击事件
	*/
	handleClick: function(e){
		if (this.props.arrange.isCenter) {
			this.props.inverse();
		} else{
			this.props.center();
		}

		e.stopPropagation();
		e.preventDefault();
	},
	render: function(){
		var styleObj = {};
		//如果props 属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}
		// 如果图片的选择角度有值并且不为0， 添加旋转角度
		if (this.props.arrange.rotate) {
			['-moz-', '-ms-', '-webkit-', ''].forEach(function(value){
				styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this));
		}
		if (this.props.arrange.isCenter) {
			styleObj.zIndex = 11;
		}
		var imgFigureClassName = 'img-figure';
			imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL} alt={this.props.data.title}/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back">
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}
});

//获取图片相关的信息
var imageDatas = require('../data/imageDatas.json');
//利用自执行函数，讲图片名信息转成图片URL路径信息
imageDatas = (function(imageDatasArr) {
	for (var i = 0, j = imageDatasArr.length; i < j; i++){
		var singleImageData = imageDatasArr[i];

		singleImageData.imageURL = require('../images/' + singleImageData.fileName);

		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

/***获取区间范围的随机数**/
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high - low) + low);
}
//获取 0 -30之间的一个任意正负数值
function get30DegRandom(){
  return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

var GalleryApp = React.createClass({
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {//水平方向的取值范围
			leftSecx: [0, 0],//左分区取值范围
			rightSecx: [0, 0],//有分区取值范围
			y: [0, 0]//左右分区取值范围一样
		},
		vPosRange: {//垂直方向的取值范围
			x: [0, 0],//上分区x取值范围
			topY: [0, 0]//上分区y取值范围
		}
	},
	// 反转图片
	// @param inde 输入当前被执行inverse操作的图片对应的图片信息数组的index值
	// @return {Function} 这是一个闭包函数, 其内return一个真正待被执行的函数
	// 闭包最简单的解析就是可以读出其他函数的内部变量
	inverse: function(index){
		return function(){
			var imgsArrangeArr = this.state.imgsArrangeArray;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArray: imgsArrangeArr
			});
		}.bind(this);
	},
	//用来重新布局所有图片@param centerIndex 指定居中排布那个图片,执行函数
	rearrange: function(centerIndex){
		var imgsArrangeArr = this.state.imgsArrangeArray,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecx = hPosRange.leftSecx,
			hPosRangeRightSecx = hPosRange.rightSecx,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2), //取一个或者两个
			topImgSpliceIndex = 0,///从上册图片拿出来的图片暂定0
			//拿到要居中的图片
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
			//首先居中 centerIndex 的图片 图片不需要旋转
			imgsArrangeCenterArr[0] = {
				pos: centerPos,
				rotate: 0,
				isCenter: true
			};
			//取出要布局上册的图片的状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));	//从数组后面取出
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
			//布局位于上册的图片
			imgsArrangeTopArr.forEach(function(value, index){
				imgsArrangeTopArr[index] = {
					pos: {
						pos: {
							top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
							left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
						}
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			});

			// 布局左右两侧图片的信息
			for (var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				var hPosRangeLORX = null;

				//前半部分布局左边， 右半部分布局右边
				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecx;
				} else{
					hPosRangeLORX = hPosRangeRightSecx;
				}
				imgsArrangeArr[i] = {
					pos: {
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			}
			//把上则图片的信息放回进去
			//合并所有数组
			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}
			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
			this.setState({
				imgsArrangeArray: imgsArrangeArr
			});
	},
	// 利用 rearrange函数， 居中对应index的图片
	// @param index, 需要被居中的图片对应的图片信息数组的index值
	// @retrun {Function}
	center: function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},
	getInitialState: function(){
		return {
			imgsArrangeArray: [
				/*{
					pos: {
						left: '0',
						top: '0'
					},
					rotate: 0 ,//旋转角度
					isInverse: false, //图片正反面
					isCenter: false //图片是否居中
				}*/
			]
		};
	},
	//组件加载后，为每张图片计算其位置大少
	//首先拿到舞台大少
	//scrollWidth：对象的实际内容的宽度，不包边线宽度，会随对象中内容超过可视区后而变大。
	//clientWidth：对象内容的可视区的宽度，不包滚动条等边线，会随对象显示大小的变化而改变。
	//offsetWidth：对象整体的实际宽度，包滚动条等边线，会随对象显示大小的变化而改变
	//具体参考https://www.cnblogs.com/kongxianghai/p/4192032.html
	componentDidMount: function(){
		var stageDOM = React.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//拿到一个imageFigure的大少
		var imgFigureDOM = React.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.ceil(imgW / 2),
			halfImgH = Math.ceil(imgH / 2);
		//计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		};
		//所有图片的取值范围
		//范围选择水平方向 计算左侧右侧图片排布的取值范围
		this.Constant.hPosRange.leftSecx[0]	= -halfImgW;//左边范围图片的一半出屏
		this.Constant.hPosRange.leftSecx[1] = halfStageW - halfImgW * 3;//左边最大范围
		this.Constant.hPosRange.rightSecx[0] = halfStageW + halfImgW;//右边得最少范围半张图片空格
		this.Constant.hPosRange.rightSecx[1] = stageW - halfImgW;//右边最大范围一张图片的宽度
		this.Constant.hPosRange.y[0] = -halfImgH; //上面出屏半张图片
		this.Constant.hPosRange.y[1] = stageH - halfImgH;//上面最大距离
		//计算上册区域图片排布的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgW;//出屏一半
		this.Constant.vPosRange.x[1] = halfStageW;//最大距离半张图的距离

		this.rearrange(0);
	},
	render: function() {
		var controllerUnits = [],
			imgFigures = [];
		imageDatas.forEach(function(value, index){
			if (!this.state.imgsArrangeArray[index]) {
				this.state.imgsArrangeArray[index] = {
					pos: {
						left: 0,
						top: 0
					},
					rotate: 0,
					isInverse: false,
					isCenter: false
				};
			}
			imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArray[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));
		return	(
			<section className="stage" ref="stage">
				<section className="img-sec">
					{imgFigures}
				</section>
				<nav className="controller-nav">
					{controllerUnits}
				</nav>
			</section>
		);
  }
});
React.render(<GalleryApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryApp;
