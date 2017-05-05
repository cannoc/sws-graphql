# UW Student Web Service GraphQL Inteface

This is a work in progress GraphQL interface for UW SWS REST API.  Currently supports: Term, Curriculum, Course and Section public resources (access token required).

## Usage
Requires an access token from UW Enterprise Web Services Team; UWNetID required. [SWS Wiki](https://wiki.cac.washington.edu/display/studentservices/Student+Web+Service)
- Copy .env.example to .env and add Bearer Token
- npm install
- npm start
- Visit http://localhost:3009/graphql

## Sample Query - Get Current Term

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