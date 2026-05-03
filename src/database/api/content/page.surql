DEFINE FUNCTION fn::getPageHome($language: string) {
    RETURN (
        SELECT *,
            (SELECT * FROM ONLY navbar WHERE language == $language AND name == "landing" LIMIT 1) AS navbar
        FROM ONLY page
        WHERE route == "home" AND metadata.language == $language
        LIMIT 1
    );
};

DEFINE FUNCTION fn::getPageOther($route: string, $language: string) {
    RETURN (
        SELECT *,
            (SELECT * FROM ONLY navbar WHERE language == $language AND name == "landing" LIMIT 1) AS navbar
        FROM ONLY page
        WHERE route == $route AND metadata.language == $language
        LIMIT 1
    );
};

DEFINE FUNCTION fn::getPage($request: object, $next: function) -> object {
    LET $language = $request.params.language;
    LET $route = $request.params.route;
    LET $response = $next($request);

    LET $page =
        IF $route == "home" { fn::getPageHome($language) }
        ELSE { fn::getPageOther($route, $language) };

    $response + { body: { $page } };
};

DEFINE API "/page/:route/:language" FOR get
    MIDDLEWARE
        api::res::body("json"),
        fn::getPage()
    THEN {
        {
            status: 200,
            body: { route: $request.params.route }
        };
    };
