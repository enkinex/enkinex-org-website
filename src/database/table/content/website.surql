DEFINE TABLE website SCHEMALESS;

DEFINE FIELD status ON TABLE website TYPE "draft" | "published" DEFAULT ALWAYS "draft";

DEFINE FIELD languages ON TABLE website TYPE array<object>;
DEFINE FIELD languages.*.name ON TABLE website TYPE string;
DEFINE FIELD languages.*.code ON TABLE website TYPE string;
