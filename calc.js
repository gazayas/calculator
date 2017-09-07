window.onload = function () {
  $current_val = "";
  $prev_val = "";
  $operator = "";
  $need_to_renew = false;
  $screen = document.getElementById('screen');
  $last_button_pressed = "";

  var buttons = document.getElementsByTagName('button');

  // Add onclick to all the buttons
  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', input, false);
  }

  // Set value for all number buttons
  var num_counter = 1;
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].className == "num") {
      buttons[i].value = num_counter < 10 ? num_counter : 0;
      num_counter++;
    }
  }
}

function input() {
  var button = window.event.target;
  var key_code = window.event.keyCode;

  // If a key is pressed instead of a button
  if (button.tagName != "BUTTON") {
    button = document.createElement("BUTTON");

    console.log("Key code: " + key_code);

    // Make into switch(){}
    if (key_code > 47 && key_code < 58) {
      button.value = key_code - 48;
      button.className = "num";
      button.id = "";
    } else if (key_code == 13) {
      button.id = "equals"
    } else if (key_code == 8 || key_code == 67) {
      button.id = "clear";
    } else if (key_code == 188) {
      button.className = "delete";
      button.id = "delete";
    } else if (key_code == 187) {
      button.className = "operator";
      button.id = "add";
    } else if (key_code == 189) {
      button.className = "operator";
      button.id = "subtract";
    } else if (key_code == 186 || key_code == 88) {
      button.className = "operator";
      button.id = "multiply";
    } else if (key_code == 191) {
      button.className = "operator";
      button.id = "divide";
    } else if (key_code == 190) {
      button.id = "decimal";
    } else if (key_code == 77) {
      button.id = "memory";
      button.class = "mem";
    }
  }

  if ($need_to_renew) {
    $screen.innerHTML = "";
    $need_to_renew = false;
  }

  if(button.className == "num") {
    console.log("number call");
    $screen.innerHTML += button.value;
    $current_val = $screen.innerHTML;
    // console.log("Current value: " + $current_val);
    // console.log("Previous value: " + $prev_val);
  } else if (button.className == "operator"){
    if ($last_button_pressed == "num" && $prev_val != "") {
      calculate();
      $prev_val = $current_val;
      $need_to_renew = true;
    } else {
      $prev_val = $current_val;
      $current_val = "";

      // TODO: Instead of clearing the screen, do $need_to_renew = true and just put the operator on the screen
      $screen.innerHTML = $current_val;
    }
    $operator = button.id;
  } else if (button.id == "decimal") {
    if (!$current_val.match(/\./)) {
      $current_val += ".";
      $screen.innerHTML = $current_val;
    }
  } else if (button.id == "plus_minus") {
    if ($current_val.match(/^\-/)) {
      $current_val = $current_val.split('').splice(1);
      $current_val = $current_val.join('');
      console.log("current: " + $current_val);
    } else {
      $current_val = "-" + $current_val;
    }
    $screen.innerHTML = $current_val;
  } else if (button.id == "equals") {
    calculate();
  } else if (button.id == "clear"){
    $screen.innerHTML = "";
    $current_val = "";
    $prev_val = "";
    $operator = "";
  } else if (button.id == "delete") {
    $current_val = $current_val.split('');
    $current_val.splice(-1, 1);
    $current_val = $current_val.join('');
    $screen.innerHTML = $current_val;
  } else if (button.className == "mem") {
    if (button.id == "memory") {
      $current_val = $memory;
      $screen.innerHTML = $current_val;
    } else if (button.id == "memory_plus") {
      $memory = $current_val;
      $screen.innerHTML = "";

      var marker = document.getElementById('memory_marker');
      marker.innerHTML = "M";
    } else if (button.id == "memory_clear") {
      $memory = "";
      var marker = document.getElementById('memory_marker');
      marker.innerHTML = "";
    }
  }

  $last_button_pressed = button.className;

  // Take focus off button after pressing it.
  // Without this, if you press a button and then go to type a key,
  // the BUTTONS action will get triggered instead.
  button.blur();
}

function calculate() {
  $need_to_renew = true;

  // Cast values to integers
  $current_val = Number($current_val);
  $prev_val = Number($prev_val);

  switch($operator) {
    case "add":
      $current_val += $prev_val;
      break;
    case "subtract":
      $current_val = $prev_val - $current_val;
      break;
    case "multiply":
      $current_val *= $prev_val;
      break;
    case "divide":
      $current_val = $prev_val / $current_val;
      break;
  }

  $current_val = String($current_val);
  $screen.innerHTML = $current_val;
}

// Run #input whenever a key is pressed
document.onkeyup = function(e) {
  input();
}

function check_length() {
  // TODO: Limit the number of digits you can add.
  // when a num is called, if ($current_val.length <= 20) then dont concat.
  // Do the same when a decimal point is called. Not a big deal for plus_minus, but consider it
}

// TODO: Bug - $need_to_renew isn't applied to all the necessary places,
//             so sometimes digits can be added to numbers that they shouldnt be added to.

// TODO: Add modulo operator
