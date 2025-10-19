

// ---------- GLOBAL VARIABLES ----------
let mic;
let micLevel = 0;
let micMultiplier = 10; // Adjust to increase mic sensitivity
let threshold = 0.20;  // Sound level threshold for showing corgi

let puppyGif;
let puppyX, puppyY;
let targetX, targetY;
let baseSpeed = 0.02; // Minimum movement speed
let puppyRotation = 0;
let puppyScale = 1.2;
let backgroundColorQuiet, backgroundColorLoud;
let showpuppy = false;

// ---------- PRELOAD ----------
function preload() {
  // Load your corgi GIF (ensure correct file path)
  puppyGif = loadImage('gifs/puppy.gif');
}

// ---------- SETUP ----------
function setup() {
  createCanvas(windowWidth, windowHeight);

  // Initialize mic input
  mic = new p5.AudioIn();
  mic.start();

  // Colors for quiet/loud states
  backgroundColorQuiet = color(30, 30, 40);
  backgroundColorLoud = color(30, 30, 40);

  // Start corgi in the center
  puppyX = width / 2;
  puppyY = height / 2;
  targetX = puppyX;
  targetY = puppyY;

  textAlign(CENTER, CENTER);
  textSize(22);
  lockGestures();
}

// ---------- DRAW ----------
function draw() {
  // Read mic level (scaled)
  micLevel = mic.getLevel() * micMultiplier;

  // Update background color based on mic level
  if (micLevel > threshold) {
    background(backgroundColorLoud);
    showpuppy = true;
  } else {
    background(backgroundColorQuiet);
    showpuppy = false;
  }

  // If loud enough, move & display the corgi
  if (showpuppy) {
    // Map micLevel to speed: louder → faster
    let moveSpeed = map(micLevel, threshold, 1, baseSpeed, 0.20, true);

    // Pick random target positions occasionally for organic movement
    if (frameCount % 60 === 0) {
      targetX = random(width);
      targetY = random(height);
    }

    // Calculate direction
    let angleToTarget = atan2(targetY - puppyY, targetX - puppyX);

    // Smooth movement toward target
    puppyX = lerp(puppyX, targetX, moveSpeed);
    puppyY = lerp(puppyY, targetY, moveSpeed);
    puppyRotation = angleToTarget;

    // Draw GIF
    push();
    translate(puppyX, puppyY);
    rotate(puppyRotation);
    imageMode(CENTER);
    image(puppyGif, 0, 0, 200 * puppyScale, 200 * puppyScale);
    pop();

    // Play GIF when visible
    puppyGif.play();
  } else {
    // Hide GIF and pause animation
    puppyGif.pause();

    // Optional text prompt
    fill(200);
    text("Make noise to wake the puppy!", width / 2, height / 2);
  }

  // Display mic info (debug / helpful)
  fill(255);
  textSize(18);
  text("Mic Level: " + nf(micLevel, 1, 3), width / 2, height - 40);
  text("Threshold: " + threshold, width / 2, height - 20);
}

// ---------- RESIZE ----------
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
