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
                    "class": 'jspsych-survey-text jspsych-survey-text-body'
                }));

                // add the text
                $("#jspsych-survey-text-body").append(trial.instructions);
            }
            
            if (trial.numbered) { 
                display_element.append($('<ol>', {
                "id": 'jspsych-survey-text-questions',
                "class": 'jspsych-survey-text'
            }));
            } else {
                display_element.append($('<ol>', {
                "id": 'jspsych-survey-text-questions',
                "class": 'list-unstyled'
            }));
            }
            
            // add questions, depending on the type
            for (var i = 0; i < trial.noQuestions; i++) {
                // create div
                $("#jspsych-survey-text-questions").append($('<li>', {
                    "id": 'jspsych-survey-text-' + i,
                    "class": 'jspsych-survey-text-question'
                }));


                // add question text
                $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i].questText + '</p>');

                // add text box     
                if (trial.questions[i].questType[0] === "text") {
                    
                    // single or multiline
                    if (trial.questions[i].questType[1] === "single") {
                        $("#jspsych-survey-text-" + i).append('<input type="text" class="form-control" name="#jspsych-survey-text-response-' + i + '"></input>');
                    } else if (trial.questions[i].questType[1] === "multi") {
                        $("#jspsych-survey-text-" + i).append('<textarea class="form-control" rows="3" name="#jspsych-survey-text-response-' + i + '"></textarea>');
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
                $("ol.jspsych-survey-text-question").each(function(index) {
                    var id = "Q" + index;

                    // get input value if text box     
                    if (trial.questions[i].questType[0] === "text") {
                        // single or multiline
                        if (trial.questions[i].questType[1] === "single") {
                            var val = $(this).children('input').val();         
                        } else if (trial.questions[i].questType[1] === "multi") {
                            var val = $(this).children('textarea').val();
                        }
                    }
                    console.log(val)
                    //var val = $(this).children('input').val();
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
