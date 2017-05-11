# UW Student Web Service GraphQL Inteface

This is a work in progress GraphQL interface for UW SWS REST API.  Currently supports: Term, Curriculum, Course and Section public resources (access token required).

### Installation

Requires an access token from UW Enterprise Web Services Team; UWNetID required. [SWS Wiki](https://wiki.cac.washington.edu/display/studentservices/Student+Web+Service)


#### Docker Compose

```
sws-graphql:
  image: gvnmccld/sws-graphql
  environment:
    - CONFIGFILE=/config/config.env
  volumes:
    - /path/to/config-folder:/config
  ports:
    - "3009:3009"
```

#### Docker Run

```
docker run -d --name="sws-graphql" -v /path/to/config-folder:/config -p "3009:3009" gvnmccld/sws-graphql
```

#### Cloning Repo 

- Clone repo
- Copy config.env.example to config.env and add Bearer Token
- npm install
- npm start
- Visit http://localhost:3009/graphql

### Config

Application expects a config.env file (see config.env.example) in /path/to/config-folder or in the application root.  A valid token from SWS support is required to make calls to the public APIs. See the [SWS Wiki](https://wiki.cac.washington.edu/display/studentservices/Student+Web+Service) for more information.

### Sample Query - Get Current Term

```
{
  GetTermCurrent {
    Year
    Quarter
    AcademicCatalog
    CensusDay
  }
}
```

### Persisted Queries (Work in Progress)

Ability to persist queries to a data store, optionally with variables, and execute them via a POST. Example code is storing in a .json file but could easily be remixed to store anywhere.

#### Routes

- POST /query/new -> save a new query
- POST /query/:id -> Execute a persisted query
- PUT /query/:id -> Update existing query
- GET /query/:id -> Get query by ID
- GET /queries -> Get all queries
- GET /queries/:username -> Get all queries by username
- DELETE /query/:id -> Delete query by ID

#### Sample Persisted Query
```
POST /query/1
{
  "variables": { "year": 2017, "quarter": "spring" }
}
```
