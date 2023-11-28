grammar Scheduler

entry Model:
    (tasks+=Task | precedences+=Precedence)*;

Task:
    'task' '(' name=ID ',' 'duration' '=' duration=INT ')';


Precedence: //
    'precedence' '(' task=[Task:ID] ',' require=[Task:ID] ')';


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
