interface QueryDescription {
  name: string;
  query: string;
  /** Comma-separated parser features to enable, e.g. 'Built-in Adjust,Lateral operation' */
  parserConfig?: string;
  /** Comma-separated engine features to enable, e.g. 'Built-in Adjust,Lateral operation' */
  engineConfig?: string;
}

export const exampleQueries: QueryDescription[] = [
  {
    name: "Brad Pitt movies (default)",
    query: `PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?movie ?title ?name
WHERE {
  ?movie dbpedia-owl:starring [ rdfs:label "Brad Pitt"@en ];
         rdfs:label ?title;
         dbpedia-owl:director [ rdfs:label ?name ].
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?name),  "EN")
}`,
    parserConfig: '',
    engineConfig: '',
  },
  {
    name: "ADJUST – timezone-adjusted date constant",
    query: `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT *
WHERE {
  ?movie dbpedia-owl:starring [ rdfs:label "Brad Pitt"@en ];
         rdfs:label ?title;
         dbpedia-owl:director [ rdfs:label ?name ].
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?name),  "EN")
  BIND( ADJUST ("2010-06-21Z"^^xsd:date, "-PT10H"^^xsd:dayTimeDuration) as ?adjustedDate) .
}`,
    parserConfig: 'Built-in Adjust',
    engineConfig: 'Built-in Adjust',
  },
  {
    name: "ADJUST – actor birth dates shifted by 5 hours",
    query: `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?name ?birthDate ?birthDateShifted
WHERE {
  ?person a dbpedia-owl:Actor ;
          rdfs:label ?name ;
          dbpedia-owl:birthDate ?birthDate .
  FILTER LANGMATCHES(LANG(?name), "EN")
  BIND(ADJUST(?birthDate, "-PT5H"^^xsd:dayTimeDuration) AS ?birthDateShifted)
} LIMIT 20`,
    parserConfig: 'Built-in Adjust',
    engineConfig: 'Built-in Adjust',
  },
  {
    name: "LATERAL – movies starring Brad Pitt or Leonardo DiCaprio",
    query: `PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT *
WHERE {
  ?movie dbpedia-owl:starring [ rdfs:label "Brad Pitt"@en ];
         rdfs:label ?title;
         dbpedia-owl:director [ rdfs:label ?name ].
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?name),  "EN")

  LATERAL {
    ?movie dbpedia-owl:starring [ rdfs:label "Leonardo DiCaprio"@en ];
           rdfs:label ?title;
           dbpedia-owl:director [ rdfs:label ?name ].
    FILTER LANGMATCHES(LANG(?title), "EN")
    FILTER LANGMATCHES(LANG(?name),  "EN")
  }
}`,
    parserConfig: 'Lateral operation',
    engineConfig: 'Lateral operation',
  },
  {
    name: "LATERAL – directors who also starred in a film",
    query: `PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT DISTINCT ?personName ?directedTitle ?starredTitle
WHERE {
  ?directedFilm dbpedia-owl:director ?person ;
                rdfs:label ?directedTitle .
  ?person rdfs:label ?personName .
  FILTER LANGMATCHES(LANG(?personName), "EN")
  FILTER LANGMATCHES(LANG(?directedTitle), "EN")

  LATERAL {
    ?starredFilm dbpedia-owl:starring ?person ;
                 rdfs:label ?starredTitle .
    FILTER LANGMATCHES(LANG(?starredTitle), "EN")
    FILTER (?directedFilm != ?starredFilm)
  }
} LIMIT 20`,
    parserConfig: 'Lateral operation',
    engineConfig: 'Lateral operation',
  },
  {
    name: "SPARQL 1.2 – TRIPLE() term creator",
    query: `PREFIX ex: <http://example.org/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT *
WHERE {
  ?movie dbpedia-owl:starring [ rdfs:label "Brad Pitt"@en ];
         rdfs:label ?title;
         dbpedia-owl:director [ rdfs:label ?name ].
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?name),  "EN")
  BIND( TRIPLE( ?movie, rdfs:type , ex:BradPittMovie) as ?typer) .
}`,
    parserConfig: 'SPARQL 1.2',
    engineConfig: 'SPARQL 1.2',
  },
  {
    name: "SPARQL 1.2 + LATERAL – annotated triples for co-starring actors",
    query: `PREFIX ex: <http://example.org/>
PREFIX dbpedia-owl: <http://dbpedia.org/ontology/>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

SELECT ?movie ?title ?actor1Name ?actor2Name ?annotated
WHERE {
  ?movie rdfs:label ?title ;
         dbpedia-owl:starring ?actor1 .
  ?actor1 rdfs:label ?actor1Name .
  FILTER LANGMATCHES(LANG(?title), "EN")
  FILTER LANGMATCHES(LANG(?actor1Name), "EN")

  LATERAL {
    ?movie dbpedia-owl:starring ?actor2 .
    ?actor2 rdfs:label ?actor2Name .
    FILTER LANGMATCHES(LANG(?actor2Name), "EN")
    FILTER (?actor1 != ?actor2)
    BIND(TRIPLE(?actor1, ex:coStarredWith, ?actor2) AS ?annotated)
  }
} LIMIT 10`,
    parserConfig: 'SPARQL 1.2,Lateral operation',
    engineConfig: 'SPARQL 1.2,Lateral operation',
  },
]
