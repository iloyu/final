function initPointerLock() {
        var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
        if ( havePointerLock ) {
            var element = document.body;
            var pointerlockchange = function ( event ) {
                if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
                    pointcontrolsEnabled = true;
                    pointcontrols.enabled = true;
                    blocker.style.display = 'none';
                } else {
                    pointcontrols.enabled = false;
                    blocker.style.display = 'block';
                    instructions.style.display = '';
                }
            };
            var pointerlockerror = function ( event ) {
                instructions.style.display = '';
            };
            // 监听变动事件
            document.addEventListener( 'pointerlockchange', pointerlockchange, false );
            document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );
            document.addEventListener( 'pointerlockerror', pointerlockerror, false );
            document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
            document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );
            instructions.addEventListener( 'click', function ( event ) {
                instructions.style.display = 'none';
                //全屏
               if (/Firefox/i.test(navigator.userAgent)) {
                        var fullscreenchange = function(event) {

                            if (document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {

                                document.removeEventListener('fullscreenchange', fullscreenchange);
                                document.removeEventListener('mozfullscreenchange', fullscreenchange);
                                 element.requestPointerLock();
                            }

            }
            document.addEventListener('fullscreenchange', fullscreenchange, false);
            document.addEventListener('mozfullscreenchange', fullscreenchange, false);
            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();
          }
          else{
             // 锁定鼠标光标
                element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
                element.requestPointerLock();
          }
              }, false );
        }
        else {
            instructions.innerHTML = '你的浏览器不支持相关操作，请更换浏览器';
        }
    }

