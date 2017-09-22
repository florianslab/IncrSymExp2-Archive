var Parameters = {},
    URLParameters = window.location.search.replace("?", "").split("&");

for (parameter in URLParameters) Parameters[URLParameters[parameter].split("=")[0]] = URLParameters[parameter].split("=")[1];

var shuffleSequence = seq("instruction", "practice", rshuffle("test"), "postExp");

if (Parameters.hasOwnProperty("Home")) shuffleSequence = seq("home");

//var practiceItemTypes = ["practice"];
var showProgressBar = false;
var manualSendResults = true;
var counterOverride = 3;

var defaults = [
    "DynamicQuestion", {
        answers: {Yes: ["F", "Yes"], No: ["J", "No"]}
    },
    "Form", {
        hideProgressBar: true,
        continueOnReturn: true,
        saveReactionTime: true
    }
];

function get_sentence(sentence){
    return $("<p id='sentence' style='font-family: Sans serif; font-size: 1.6em; margin-bottom: 30px;'>"+sentence+".</p>");
}

function get_inference(inference){
    return $("<p>").append($("<p style='font-family: Sans serif; font-style: italic; font-size: 1.3em; margin-bottom: 20px;'>This leads me to conclude</p>"))
                   .append($("<p id='inference' style='font-style: Sans serif; font-size: 1.5em;'>"+inference+".</p>"));
}

var items = [

    ["home", "Message", {
        html: "<div style='text-align:center;'>"+
              "<p style='font-weight:bold;'>Please select which version of the experiment you want to access.</p>"+
              "<table style='margin: auto;'>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0000'>Group 1</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0002'>Group 3</a></td></tr>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0001'>Group 2</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0003'>Group 4</a></td></tr>"+
              "</table>"+
              "<p>Debug version (showing condition label):</p>"+
              "<table style='margin: auto;'>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0000&Debug=T'>Group 1</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0002&Debug=T'>Group 3</a></td></tr>"+
              "<tr><td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0001&Debug=T'>Group 2</a></td>"+
              "    <td><a href='http://spellout.net/ibexexps/SchwarzLabArchive/IncrSymExp2/server.py?withsquare=0003&Debug=T'>Group 4</a></td></tr>"+
              "</table>"+
              "(You can enter whatever as a Prolific ID on the first page)"+
              "</div>",
        transfer: null
    }],

    //["instruction", "__SetCounter__", {}],
    
    ["instruction", "Form", {html: {include: "ProlificConsentForm.html"}}],
    
    ["instruction", "DynamicQuestion", {
        legend: "instruction",
        sentence: get_sentence("A sentence that your interlocutor said"),
        inference: get_inference("some information"),
        enabled: false,
        sequence: [
            TT("#bod", "In this experiment, you will see several sentences.", "Press Space", "mc"),
            {pause: "key\x01"},            
            {this: "sentence"},
            TT("#sentence", "The first sentence on the page corresponds to what your (fictional) interlocutor said.", "Press Space", "bc"),
            {pause: "key\x01"},
            {this: "inference"},
            TT("#inference", "Your role is to indicate, based on what your interlocutor said, whether you would conclude some information.", "Press Space", "bc"),
            {pause: "key\x01"},
            TT("#bod", "Let's practice a bit so that you get a better idea of the task.", "Press Space", "mc"),
            {pause: "key\x01"},
            function(t){ t.finishedCallback(); }
        ]
    }],
    
    ["practice", "DynamicQuestion", {
        legend: "practice1",
        sentence: get_sentence("Natalie both lives in New York and likes to run"),
        inference: get_inference("Natalie lives in the USA"),
        enabled: false,
        sequence: [
            {this: "sentence"},
            TT("#sentence", "Here your interlocutor said that Natalie lives in New York and likes to run.", "Press Space", "bc"),
            {pause: "key\x01"},
            {this: "inference"},
            TT("#inference", "You have to tell whether this leads you to conclude that Natalie lives in the USA.", "Press Space", "bc"),
            {pause: "key\x01"},
            {this: "answers", showKeys: "top"},
            TT("#Yes", "Simply press the <b>F</b> key if you conclude that Natalie lives in the USA...", "Press Space", "bc"),
            {pause: "key\x01"},
            TT("#No", "... or press the <b>J</b> key if you do not conclude that.", "Press Space", "bc"),
            {pause: "key\x01"},
            function(t){
                t.feedbackKey = true;
                t.safeBind($(document),"keydown", function(e) {
                    if (t.feedbackKey == false) return;
                    if (e.keyCode == 70)
                        TT("#Yes", "Right: your interlocutor said that Natalie <b>lives in New York</b> and likes to run, so you can conclude that she lives in the USA.", 
                           "Press Space", "bc", "feedback-right")(t);
                    else if (e.keyCode == 74)
                        TT("#No", "Wrong: your interlocutor said that Natalie <b>lives in New York</b> and likes to run, so you can conclude that she lives in the USA.",
                           "Press Space", "bc", "feedback-wrong")(t);
                    else return;
                    t.feedbackKey = false;
                });
            },
            {pause: "key\x01"},
            function(t){ t.finishedCallback(); }
        ]
    }],
    
    ["practice", "DynamicQuestion", {
        legend: "practice2",
        sentence: get_sentence("Either Ryan studied economics or he is a self-made man"),
        inference: get_inference("Ryan studied economics"),
        enabled: false,
        sequence: [
            {this: "sentence"},
            {this: "inference"},
            {this: "answers", showKeys: "top"},
            function(t){
                t.feedbackKey = true;
                t.safeBind($(document),"keydown", function(e) {
                    if (t.feedbackKey == false) return;
                    if (e.keyCode == 74)
                        TT("#No", "Right: your interlocutor said that Ryan studied economics <b>or is a self-made man</b>, so you cannot conclude for sure that he studied economics.",
                           "Press Space", "bc", "feedback-right")(t);
                    else if (e.keyCode == 70)
                        TT("#Yes", "Wrong: your interlocutor said that Ryan studied economics <b>or is a self-made man</b>, so you cannot conclude for sure that he studied economics.",
                           "Press Space", "bc", "feedback-wrong")(t);
                    else return;
                    t.feedbackKey = false;
                });
            },
            {pause: "key\x01"},
            function(t){ t.finishedCallback(); }
        ]
    }],
    
   ["postExp", "Form", {html: {include:"ProlificFeedbackPreConfirmation.html"}}],
    
   ["postExp", "__SendResults__", {}],
   
   ["postExp", "Message", {html: {include: "ProlificConfirmation.html"}, transfer: null}]
    
    ].concat(
      GetItemsFrom(data, null,
        {
          ItemGroup: ["item", "group"],
          Elements: [
                      "test",                       // Label of the item
                      "DynamicQuestion",            // Controller
                      {
                        legend: function(x){ return [x.item,x.group,x.condition,x.inference_about,x.trigger,x.sentence,x.inference].join("+"); },
                        sentence: function(x){ return get_sentence(x.sentence); },
                        inference: function(x){ return get_inference(x.inference); },
                        sequence:function(x){
                            var debug = "";
                            if (Parameters.hasOwnProperty("Debug")) 
                                debug = "Condition: "+x.condition+" ('TrF' = Test Ps in First conjunct, 'TrL' = Test Ps in Last conjunct, '(n)P' = (non-)Ps control, 'F...' = fillers)";
                            return [
                              debug,
                              {this: "sentence"},
                              {this: "inference"},
                              {this: "answers", showKeys: "top"}
                            ];
                        }
                      }
                    ]
        }        
      )
);
