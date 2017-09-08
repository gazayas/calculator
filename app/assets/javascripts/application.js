// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require_tree .

window.onload = function () {
  $current_val = "";
  $prev_val = "";
  $operator = "";
  $need_to_renew = false;
  $screen = document.getElementById('output'); // should probz change this
  $last_button_pressed = "";
  $last_button_pressed_html = "";

  var buttons = document.getElementsByTagName('button');

  // Add onclick to all the buttons
  for (var i = 0; i < buttons.length; i++) { buttons[i].addEventListener('click', input, false); }

  // Set value for all number buttons
  for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].className.match(/num/)) {
      buttons[i].value = buttons[i].innerHTML;
    }
  }
}

function input() {
  // reset operator from black background if it was pressed last
  if ($last_button_pressed == "operator") { $last_button_pressed_html.style.background = ""; }

  var button = window.event.target;
  var key_code = window.event.keyCode;

  // If a key is pressed instead of a button
  if (button.tagName != "BUTTON") {
    button = document.createElement("BUTTON");

    console.log("Key code: " + key_code);

    if (key_code > 47 && key_code < 58) {
      button.value = key_code - 48;
      button.className = "num";
      button.id = "";
    }

    switch(key_code) {
      case 13: // Enter key
        button.id = "equals";
        break;
      case 8: // Backspace
      case 67: // C
        button.id = "clear";
        break;
      case 188: // <
        button.className = "delete";
        button.id = "delete";
        break;
      case 187: // +
        button.className = "operator";
        button.id = "add";
        break;
      case 189: // -
        button.className = "operator";
        button.id = "subtract";
        break;
      case 222: // *
      case 88: // x
        button.className = "operator";
        button.id = "multiply";
        break;
      case 191: // /
        button.className = "operator";
        button.id = "divide";
        break;
      case 190: // .
        button.id = "decimal";
        break;
      case 77: // M
        button.id = "memory";
        button.class = "mem";
        break;
    }
  }

  if ($need_to_renew) {
    $screen.innerHTML = "";
    $need_to_renew = false;
  }

  // TODO: ２つのswitch文(button.classNameとbutton.idを調べるやつ)に変えなさい。ここら辺はかなり汚いから綺麗にしてください
  // Limit 入力 length to 20
  if(button.className.match(/num/) && $screen.innerHTML.length < 20) {
    $screen.innerHTML += button.value;
    $current_val = $screen.innerHTML;
  } else if (button.className.match(/operator/)){
    button.style.background = "black"; // TODO: doesnt happen on keyboard press. get element and 実装してください
    if ($last_button_pressed.match(/num/) && $prev_val != "") {
      console.log($last_button_pressed)
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
  } else if (button.className.match(/mem/)) {
    if (button.id == "memory") {
      $current_val = $memory;
      $screen.innerHTML = $current_val;
    } else if (button.id == "memory_plus") {
      if ($current_val != "" && $current_val != ".") {
        $memory = $current_val;
        $screen.innerHTML = "";
        var marker = document.getElementById('memory_marker');
        marker.innerHTML = "M";
        $prev_val = "";
      }
    } else if (button.id == "memory_clear") {
      $memory = "";
      var marker = document.getElementById('memory_marker');
      marker.innerHTML = "";
    }
  }

  // TODO: $last_button_pressed should be html object instead of string
  $last_button_pressed = button.className.split(' ').pop();
  $last_button_pressed_html = button;

  // Take focus off button after pressing it so same action doesn't occur with different button
  // Without this, if you press a button and then go to type a key, the BUTTONS action will get triggered instead.
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
