var canvasDiv = document.getElementById('bg');
var options = {
  particleColor: '#888',
  background: 'https://wallpaper.wiki/wp-content/uploads/2017/04/wallpaper.wiki-Robot-1080p-Wallpaper-PIC-WPD005143.jpg',
  interactive: true,
  speed: 'medium',
  density: 'high'
};
var particleCanvas = new ParticleNetwork(canvasDiv, options);
