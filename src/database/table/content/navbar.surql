DEFINE TABLE navbar SCHEMALESS;

DEFINE FIELD language ON TABLE navbar TYPE string DEFAULT ALWAYS "en-US";
DEFINE FIELD name ON TABLE navbar TYPE string;

DEFINE FIELD menu ON navbar TYPE array;
DEFINE FIELD menu.* ON TABLE navbar TYPE object;
DEFINE FIELD menu.*.label ON TABLE navbar TYPE string;
DEFINE FIELD menu.*.order ON TABLE navbar TYPE int;
DEFINE FIELD menu.*.route ON TABLE navbar TYPE string;