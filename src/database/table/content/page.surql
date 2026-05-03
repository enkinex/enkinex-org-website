DEFINE TABLE page SCHEMALESS;

DEFINE FIELD route ON TABLE page TYPE string;

DEFINE FIELD metadata ON TABLE page TYPE object;
DEFINE FIELD metadata.language ON TABLE page TYPE string DEFAULT ALWAYS "en-US";
DEFINE FIELD metadata.title ON TABLE page TYPE string;
