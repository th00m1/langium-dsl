grammar Scheduler

// Scheduler language grammar, like gantt chart, but with tasks and precedences

entry Model:
    (tasks+=Task | precedences+=Precedence)*;

Task: // ex task("A", duration=3) with a withespace after the comma
    'task' '(' name=ID (',' ' duration' '=' duration=INT)? ')';

Precedence: //
    'precedence' '(' task=[Task:ID] ',' require=[Task:ID] ')';


hidden terminal WS: /\s+/;
terminal ID: /[_a-zA-Z][\w_]*/;
terminal INT returns number: /[0-9]+/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
