/**
 * 顶部横幅视频控制：静音自动播放 + 结尾淡出 + 循环淡入
 * 由 _config.butterfly.yml inject.bottom 以 <script defer> 引入
 */
window.addEventListener('load', function () {
  const video = document.getElementById('banner-video');
  if (!video) return;

  video.muted = true;
  const fadeTime = 800;
  let fadeTriggerTime = 0;

  // 视频加载完成后获取时长
  video.addEventListener('loadedmetadata', function () {
    fadeTriggerTime = this.duration - 2;
  });

  // 结尾淡出
  video.addEventListener('timeupdate', function () {
    if (fadeTriggerTime && this.currentTime >= fadeTriggerTime) {
      this.style.opacity = 0;
    }
  });

  // 循环淡入
  video.addEventListener('ended', function () {
    setTimeout(() => {
      this.currentTime = 0;
      this.style.opacity = 1;
      this.play();
    }, fadeTime);
  });

  video.play().catch(err => console.log('自动播放兼容:', err));
});
