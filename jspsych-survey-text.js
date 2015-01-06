/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 * 
 * documentation: https://github.com/jodeleeuw/jsPsych/wiki/jspsych-survey-text
 *
 */

(function($) {
    jsPsych['survey-text'] = (function() {

        var plugin = {};

        plugin.create = function(params) {
            
            params = jsPsych.pluginAPI.enforceArray(params, ['data']);
            
            var trials = [];
            for (var i = 0; i < params.questions.length; i++) {
                trials.push({
                    type: "survey-text",
                    instructions: params.instructions[i],
                    noQuestions: Object.keys(params.questions[i]).length,
                    numbered: params.numbered[i],
                    questions: params.questions[i],
                    data: (typeof params.data === 'undefined') ? {} : params.data[i]
                });
            }
            return trials;
        };

        plugin.trial = function(display_element, block, trial, part) {
            
            // if any trial variables are functions
            // this evaluates the function and replaces
            // it with the output of the function
            trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);


            // add optional text above the questions
            if (trial.instructions) {
                // create div
                display_element.append($('<div>', {
                    "id": 'jspsych-survey-text-body',
                    "class": 'jspsych-survey-text-body'
                }));

                // add the text
                $("#jspsych-survey-text-body").append(trial.instructions);
            }
            
            // add questions, depending on the type
            for (var i = 0; i < trial.noQuestions; i++) {
                // create div
                display_element.append($('<div>', {
                    "id": 'jspsych-survey-text-' + i,
                    "class": 'jspsych-survey-text-question'
                }));

                // add question text
                if (trial.numbered) { 
                    var numbering = (i+1) + '. ';
                } else {
                    var numbering = "";
                }
                $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">'+ numbering + trial.questions[i].questText + '</p>');

                // add text box     
                if (trial.questions[i].questType[0] === "text") {
                    
                    // single or multiline
                    if (trial.questions[i].questType[1] === "single") {
                        $("#jspsych-survey-text-" + i).append('<input type="text" name="#jspsych-survey-text-response-' + i + '"></input>');
                    } else if (trial.questions[i].questType[1] === "multi") {
                        $("#jspsych-survey-text-" + i).append('<textarea cols="40" rows="5" name="#jspsych-survey-text-response-' + i + '"></textarea>');
                    }

                // multiple choice, radio, checkbox or dropdown
                } else if (trial.questions[i].questType[0] === "multiple choice") {
                    
                    // radio buttons
                    if (trial.questions[i].questType[1]==="radio") {
                        // adding as many radio buttons as there are options
                        for (var j=0; j<trial.questions[i].questChoice.length; j++) {
                            $("#jspsych-survey-text-" + i).append('<label class="radio-inline"><input type="radio" name="#jspsych-survey-text-response-' + i + '" value="option-' + j + '"></input>' + trial.questions[i].questChoice[j] + '</label>');
                        }
                    
                    // checkboxes
                    } else if (trial.questions[i].questType[1]==="checkbox") {
                        for (var j=0; j<trial.questions[i].questChoice.length; j++) {
                            $("#jspsych-survey-text-" + i).append('<label class="radio-inline"><input type="checkbox" name="#jspsych-survey-text-response-' + i + '" value="option-' + j + '"></input>' + trial.questions[i].questChoice[j] + '</label>');
                        }

                    // or dropdown
                    } else if (trial.questions[i].questType[1]==="dropdown") {
                        var choices = '';
                        for (var j=0; j<trial.questions[i].questChoice.length; j++) {
                            choices = choices + '<option name="#jspsych-survey-text-response-' + i + '" value="option-' + j + '">' + trial.questions[i].questChoice[j] + '</option>';
                        }
                        $("#jspsych-survey-text-" + i).append('<select>' + choices + '</select>');
                    }
                }
            }

            // add submit button
            display_element.append($('<button>', {
                'id': 'jspsych-survey-text-next',
                'class': 'jspsych-survey-text btn btn-default'
            }));
            $("#jspsych-survey-text-next").html('Submit');
            $("#jspsych-survey-text-next").click(function() {
                // measure response time
                var endTime = (new Date()).getTime();
                var response_time = endTime - startTime;

                // create object to hold responses
                var question_data = {};
                $("div.jspsych-survey-text-question").each(function(index) {
                    var id = "Q" + index;
                    var val = $(this).children('input').val();
                    var obje = {};
                    obje[id] = val;
                    $.extend(question_data, obje);
                });

                // save data
                block.writeData($.extend({}, {
                    "trial_type": "survey-text",
                    "trial_index": block.trial_idx,
                    "rt": response_time
                }, question_data, trial.data));

                display_element.html('');

                // next trial
                block.next();
            });

            var startTime = (new Date()).getTime();
        };

        return plugin;
    })();
})(jQuery);
