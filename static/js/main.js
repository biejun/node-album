/*change some */

//change again

function id(id) {
  return document.getElementById(id);
}

function find(el, query) {
  return el.querySelector(query);
}

function on(el, event, handle) {
  if('addEventListener' in document) {
    el.addEventListener(event, handle, false);
  }else{
    el.attachEvent('on'+event, handle);
  }
}

function off(el, event, handle) {
  if('removeEventListener' in document) {
    el.removeEventListener(event, handle, false);
  }else{
    el.detachEvent('on'+event, handle);
  }
}

function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
}

function removeClass(el, className) {
  if (hasClass(el, className)) {
    let newClass = el.className.split(' ')
    newClass.splice(newClass.indexOf(className),1)
    el.className = newClass.join(' ')
  }
}

function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)'+className+'(\\s|$)')
  return reg.test(el.className)
}

(function () {

  var app = id('app');

  var render = app.dataset.render;

  if(!render) return;

  switch (render) {
    case 'index':
      upload();
      imageZoom();
      return;
    case 'album':
      imageZoom();
  }

  function upload() {
    var uploadBox = id('upload-box');
    var uploadButton = id('upload-button');

    uploadButton.onclick = function () {
      uploadBox.style.display = 'block';
      addClass(app, 'blur');
    };

    on(find(uploadBox, '.upload-btn'), 'click', function() {
      var $input = find(this, '.select-files');
      $input.click();
      $input.onchange = function() {
        // 暂不支持多次选择文件上传, 每次点击会清空之前选择
        var images = [];
        var renderImages = function() {
          var html = '';
          images.forEach(function (v) {
            html +='<div class="image-preview"><img src="'+v+'"/></div>';
          });
          return html;
        };
        var files = this.files;
        var URL = window.URL || window.webkitURL;
        var img, len = files.length;
        if (files && files.length) {
          while (len--) {
            if (/^image\/png$|jpeg$|jpg$/.test(files[len].type)) {
              img = URL.createObjectURL(files[len]);
              if(images.indexOf(img) === -1) images.push(img);
            }
          }

          find(uploadBox, '.files-list').innerHTML = renderImages();
        }
      }
    });

    on(find(uploadBox, '.upload-submit'), 'click', function() {
      var val = find(uploadBox, '.select-files').value;
      if(!val) return false;
			var self = this;
      self.innerText = '上传中';
			var formdata=new FormData(id("upload-form"));
			var xhr = new XMLHttpRequest();
			xhr.open("post","/upload");
			xhr.upload.onprogress = function(ev) {
					var percent = 0;
					if(ev.lengthComputable) {
						percent = 100 * ev.loaded / ev.total;
						percent = parseInt(percent);
						self.innerText = '正在上传 '+percent+'%';
					}
			};
			xhr.send(formdata);
			xhr.onload=function(){
				if(xhr.status === 200){
					window.location.reload();
				}else{
          alert('Error Code: ' + xhr.status);
        }
			}
    });

    on(find(uploadBox, '.close'), 'click', function () {
      uploadBox.style.display = 'none';
      removeClass(app, 'blur');
    });
  }
	
	function preLoadImg(src, success, error) {
		var img = new Image();
		img.onload = function() {
			success(img);
		};
		img.onerror = function() {
			error(img)
		};
		img.src = src;
	}
		
	function setImageSize(img) {
		var ratio = Math.max(img.width / img.height, 1);
		var width = 1000;
		var height = 800;
		if (height * ratio > width) {
			height = width / ratio;
		} else {
			width = height * ratio;
		}
		width = Math.min(width * 0.9, img.width);
		height = Math.min(height * 0.9, img.height);
		return {
			width: width,
			height: height
		}
	}
	
  function imageZoom() {
    var images = document.querySelectorAll('.image-zoom');
    images.length && images.forEach(function (el) {
      on(el, 'click', function (e) {
        var img, nodes = this.childNodes, i = 0;
        while (img = nodes[i++]) {
          if (img.nodeType === 1) {
            break;
          }
        }
        var src = img.src.replace('_thumb', '');
        var text = img.alt || '未添加图片描述';
        var div = document.createElement('div');
        var mask = document.createElement('div');
        var wrap = document.createElement('div');
				div.className = 'image-zoom';
				mask.className = 'image-zoom-mask';
				wrap.className = 'image-zoom-wrap';
				var imageBox = document.createElement('div');
				imageBox.className = 'image-box is-loading';
				imageBox.innerHTML = '<div class="image-src"><img class="image" src="'+img.src+'"/></div>'+
				'<div class="image-text">'+text+'</div>';
				var loading = document.createElement('div');
				loading.className = 'image-loading';
				loading.innerHTML = '<div class="loading-text">高清大图玩命加载中...</div>';
				
				preLoadImg(src, function(img) {
					var size = setImageSize(img);
					imageBox.style.width = size.width+'px';
					find(imageBox, '.image').src = src;
					removeClass(imageBox, 'is-loading');
					imageBox.removeChild(loading)
				});
				wrap.innerHTML = '<div class="close" role="button"><svg class="icon" viewBox="0 0 1024 1024">' +
				'<path d="M810.666667 273.493333L750.506667 213.333333 512 451.84 273.493333 213.333333 213.333333 273.493333 451.84 512 213.333333 750.506667 273.493333 810.666667 512 572.16 750.506667 810.666667 810.666667 750.506667 572.16 512z"></path>\n' +
				'</svg></div>';
				imageBox.appendChild(loading);
				wrap.appendChild(imageBox);
        div.appendChild(mask);
        div.appendChild(wrap);
        document.body.style.overflow = 'hidden';
        document.body.appendChild(div);
				find(wrap, '.close').onclick = function () {
				  document.body.style.overflow = '';
				  document.body.removeChild(div);
				  removeClass(app, 'blur');
				}
        addClass(app, 'blur');
      });
    });
  }
})();