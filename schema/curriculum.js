const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const { CompositeKey } = require('./utils');

// Curriculum Models
const CurricSearchType = new GraphQLObjectType({
  name: 'CurriculumSearch',
  fields: () => ({
    TotalCount: { type: GraphQLInt },
    Curricula: { type: new GraphQLList(CurricType) },
  })
});

const CurricType = new GraphQLObjectType({
  name: 'Curriculum',
  description: 'Curriculum for a Year,Quarter',
  fields: () => ({
    CurriculumAbbreviation: { type: GraphQLString },
    CurriculumFullName: { type: GraphQLString },
    CurriculumName: { type: GraphQLString },
    Year: { type: GraphQLInt },
    Quarter: { type: GraphQLString },
    Href: { 
      type: GraphQLString,
      deprecationReason: "GetCurriculum is not implemented."
    },
    Term: {
      type: require('./term').TermType,
      resolve: (curric, args, {loaders}) => loaders.term.load(CompositeKey(curric.Year, curric.Quarter))
    },
    Courses: {
      type: new GraphQLList(require('./course').BaseCourseType),
      args: {
        PageSize: {type: GraphQLInt},
        PageStart: {type: GraphQLInt},
        CourseNumber: {type: GraphQLInt}
      },
      resolve: (curric, args) => {
        args.Year = curric.Year;
        args.Quarter = curric.Quarter;
        args.CurriculumAbbr = curric.CurriculumAbbreviation;
        return require('./resolvers').CourseSearch(args).then(res => res.Courses);
      }
    }
  })
});

module.exports = { CurricSearchType, CurricType };