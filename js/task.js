/**
 *
 * task.js
 * William Xiang Quan Ngiam
 *
 * task script for animal-farm
 * examines 'chunking' in infants
 * briefly display 4 animals that are paired
 * then test memory for animals
 *
 * started coding: 4/7/24
 **/

// TASK SET-UP
var jsPsych = initJsPsych({show_progress_bar: true});

// DEFINE EXPERIMENT VARIABLES
let animals = [
  "stim/doggo_1.png",
  "stim/doggo_2.png",
  "stim/doggo_3.png",
  "stim/doggo_4.png",
  "stim/doggo_5.png",
  "stim/doggo_6.png",
  "stim/doggo_7.png",
  "stim/doggo_8.png"
]

let background = ["background.png"]
let n_animals = 8 // how many animals
let n_pairs = n_animals/2 // how many pairs
let n_trials = 20 // number of trials

let canvas_width = 920 // sets canvas width
let canvas_height = 500 // sets canvas height
let canvas_offset_left = 130 // auto computed canvas offset from left
let canvas_offset_top = 115 // auto computed canvas offset from top
let canvas_offset_diff = 54 // change when adding response buttons below

let item_size = 100
let item_locs = [
  [canvas_width/2 + item_size * -3, canvas_height/2 - item_size * .5],
  [canvas_width/2 + item_size * -2, canvas_height/2 - item_size * .5],
  [canvas_width/2 + item_size * 1, canvas_height/2 - item_size * .5],
  [canvas_width/2 + item_size * 2, canvas_height/2 - item_size*.5]
]; // draws from the top-left

// RANDOMIZATION
let animal_pairs = createAnimalPairs() // create ordered list of animals

// DEFINE TRIALS

/* create timeline */
var timeline = [];

/* connect to pavlovia */
var pavlovia_init = {
  type: 'pavlovia',
  command: 'init'
}
//timeline.push(pavlovia_init);

/* preload images */
var preload = {
    type: jsPsychPreload,
    images: animals,
    max_load_time: 10000,
  };
  timeline.push(preload);

/* define welcome message trial */
var welcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Welcome to the experiment.</p>
    <br>
  `,
  choices: [">>"]
};
timeline.push(welcome);

/* define instructions trial */
var instructions = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <p>Instructions go here.</p>
    <p>Press the button below when you are ready.</p>
  `,
  choices: ["OK"],
  post_trial_gap: 1000
};
timeline.push(instructions);

/* define fixation and test trials */

var fixation = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '<div style="font-size:60px;">+</div>',
  choices: "NO_KEYS",
  trial_duration: 1000,
  data: {
    task: 'fixation'
  }
};

/* show stimulus */
var stimulus = {
  type: jsPsychCanvasButtonResponse,
  stimulus: draw_stimulus,
  choices: ['x'],
  button_html: '<button class="jspsych-btn" style = "position:absolute; left:0px; top: 0px">%choice%</button>',
  trial_duration: 2500,
  canvas_size: [canvas_height, canvas_width], // height x width
  on_finish: function(data){
    if(jsPsych.pluginAPI.compareKeys(data.response, null)){
    } else (
      jsPsych.endCurrentTimeline()
    )
  },
  data: {
    task: 'stimulus'
  }
}

function draw_stimulus(c) {
  let ctx = c.getContext("2d");
  var rand_images = jsPsych.randomization.sampleWithoutReplacement(animal_pairs,2);

  for (var i = 0; i < 2; i++) {
    var img = new Image();
    img.src = rand_images[i][0];
    ctx.drawImage(img, x = item_locs[2*i][0], y = item_locs[2*i][1] - canvas_offset_diff, width = item_size, height = item_size)

    var img = new Image();
    img.src = rand_images[i][1];
    ctx.drawImage(img, x = item_locs[2*i+1][0], y = item_locs[2*i+1][1] - canvas_offset_diff, width = item_size, height = item_size)
  }
}

var blank = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: '',
  choices: "NO_KEYS",
  trial_duration: 0,
  data: {
    task: 'retention'
  }
};

/* show test */
function draw_test_rect(c) {
	let ctx = c.getContext("2d");

  for (var i = 0; i < 2; i++) {
    ctx.strokeRect(x = item_locs[2*i][0], y = item_locs[2*i][1], item_size, item_size);
    ctx.strokeRect(x = item_locs[2*i+1][0], y = item_locs[2*i+1][1], item_size, item_size);
  }
	}

var trial = {
  type: jsPsychCanvasButtonResponse,
  stimulus: draw_test_rect,
  prompt: "Which animal was there?",
  button_html: '<img src=%choice% width="100" height="100"></img>',
  choices: animals,
  canvas_size: [canvas_height, canvas_width],
  data: {
    task: 'response'
    }
};

/* define test procedure */
var test_procedure = {
  timeline: [fixation, stimulus, blank, trial],
  repetitions: n_trials,
  randomize_order: true
};
timeline.push(test_procedure);

/* define awareness test */
var awareness_test = {
  timeline: [fixation, stimulus, blank, trial],
  repetitions: 1
}
timeline.push(awareness_test)

/* start the experiment */
jsPsych.run(timeline);

/* end the experimeent */
var pavlovia_finish = {
  type: 'pavlovia',
  command: 'finish'
}

//timeline.push(pavlovia_finish); // save data

// FUNCTIONS
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function createAnimalPairs() {
    var animal_list = shuffleArray(Array.from(animals));
    var pair_list = [];
    for (var i = 0; i < n_pairs; i++) {
        var pair = [animal_list[2*i], animal_list[2*i+1]];
        pair_list.push(pair);
    };
    return pair_list;
}

function get_test_location() {

}