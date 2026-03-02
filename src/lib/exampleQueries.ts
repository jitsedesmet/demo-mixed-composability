interface QueryDescription {
  name: string;
  query: string;
}

export const exampleQueries: QueryDescription[] = [{
  name: "adjust",
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
  BIND( ADJUST ("2010-06-21Z"^^xsd:date, "-PT10H"^^xsd:dayTimeDuration) as ?none) .
}`
},
  {
    name: "lateral as union - staring Brad Pitt or Leonardo DiCaprio",
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
}`
  },
  {
    name: "Triple Creator",
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
  BIND( TRIPLE( ?movie, rdfs:type , ex:BradPitMovie) as ?typer) .
}`
  }]
