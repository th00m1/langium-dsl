grammar TodoList

entry Model:
    (stmts+=Stmt)*;

Stmt: 
    Add | Complete | 'list';


Add:
    'add' content=STRING;

Complete:
    'complete' todoId=INT;

hidden terminal WS: /\s+/;
terminal INT returns number: /[0-9]+/;
terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;

hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
