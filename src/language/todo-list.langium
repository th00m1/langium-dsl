grammar TodoList

entry Model:
    (stmts+=Stmt)*;

Stmt: 
    Add | Complete | Update;

Add:
    'add' name=WORD content=STRING;

Complete:
    'complete' todoName=WORD;

Update:
    'update' todoName=WORD newContent=STRING;


terminal STRING: /"(\\.|[^"\\])*"|'(\\.|[^'\\])*'/;
terminal WORD: /\b[\w'-]+\b/;

hidden terminal WS: /\s+/;
hidden terminal ML_COMMENT: /\/\*[\s\S]*?\*\//;
hidden terminal SL_COMMENT: /\/\/[^\n\r]*/;
