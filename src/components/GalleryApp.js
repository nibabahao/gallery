'use strict';

var React = require('react/addons');


// CSS
require('normalize.css');
require('../styles/main.scss');
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



var GalleryApp = React.createClass({
	render: function() {
		return	(
			<section className="stage">
				<section className="img-sec">
				</section>
				<nav className="controller-nav">
				</nav>
			</section>
		);
  }
});
React.render(<GalleryApp />, document.getElementById('content')); // jshint ignore:line

module.exports = GalleryApp;
