const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const { CompositeKey } = require('./utils');

// Term Models
const BaseTermType = new GraphQLObjectType({
  name: "TermBase",
  description: "Basic Term Info",
  fields: () => ({
    Year: { type: GraphQLInt },
    Quarter: { type: GraphQLString },
    Href: { type: GraphQLString }
  })
});

const TermType = new GraphQLObjectType({
  name: 'Term',
  description: 'term stuff',
  fields: () => ({
    Year: { type: GraphQLInt },
    Quarter: { type: GraphQLString },
    AcademicCatalog: { type: GraphQLString },
    CensusDay: { type: GraphQLString },
    NextTerm: { type: BaseTermType },
    PreviousTerm: { type: BaseTermType },
    NextTermFull: {
      type: TermType,
      resolve: (term, args, {loaders}) => loaders.term.load(CompositeKey(term.NextTerm.Year, term.NextTerm.Quarter))
    },
    PreviousTermFull: {
      type: TermType,
      resolve: (term, args, {loaders}) => loaders.term.load(CompositeKey(term.PreviousTerm.Year, term.PreviousTerm.Quarter))
    },
    Curricula: {
      type: new GraphQLList(require('./curriculum').CurricType),
      args: {
        PageSize: {type: GraphQLInt},
        PageStart: {type: GraphQLInt},
        CollegeAbbr: { type: GraphQLString },
        DeptAbbr: { type: GraphQLString }
      },
      resolve: (term, args) => {
        args = Object.assign({}, args, {
          Year: term.Year,
          Quarter: term.Quarter
        });
        return require('./resolvers').SearchCurriculum(args).then(res => res.Curricula);
      }
    }
  }),
});

module.exports = { BaseTermType, TermType };