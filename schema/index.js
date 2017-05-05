const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const Resolvers = require('./resolvers');
const { CompositeKey } = require('./utils');

// Load the various types the schema will use
const { CurricSearchType, CurricType } = require('./curriculum');
const { TermType, BaseTermType } = require('./term');
const { CourseType, CourseSearchType } = require('./course');
const { SectionType, SectionSearchType, BaseSectionType } = require('./section');

// Main GraphQL Schema Object
const QueryType = new GraphQLObjectType({ 
  name: 'SWS',
  description: 'Student Web Service',
  fields: () => ({
    GetTerm: {
      type: TermType,
      args: {
        Year: { type: new GraphQLNonNull(GraphQLInt) },
        Quarter: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (root, args, {loaders}) => loaders.term.load(CompositeKey(args.Year,args.Quarter))
    },
    GetTermCurrent: {
      type: TermType,
      resolve: (root, args, {loaders}) => loaders.term.load("current")
    }, 
    CurriculumSearch: {
      type: CurricSearchType,
      args: {
        Year: { type: new GraphQLNonNull(GraphQLInt) },
        Quarter: { type: new GraphQLNonNull(GraphQLString) },
        FutureTerms: { type: GraphQLInt },
        CollegeAbbr: { type: GraphQLString },
        DeptAbbr: { type: GraphQLString }
      },
      resolve: (root, args) => Resolvers.SearchCurriculum(args)
    },
    GetCurriculum: {
      type: CurricType,
      args: {
        Year: { type: new GraphQLNonNull(GraphQLInt) },
        Quarter: { type: new GraphQLNonNull(GraphQLString) },
        DeptAbbr: { type: GraphQLString }
      },
      resolve: (root, args) => Resolvers.GetCurriculum(args)
    },
    CourseSearch: {
        type: CourseSearchType,
        args: {
            ChangedSinceDate: { type: GraphQLString },
            CourseNumber: { type: GraphQLString },
            CourseTitleContains: { type: GraphQLString },
            CourseTitleStartsWith: { type: GraphQLString },
            CurriculumAbbr: { type: GraphQLString },
            FutureTerms: { type: GraphQLString },
            PageSize: { type: GraphQLString },
            PageStart: { type: GraphQLString },
            Quarter:  { type: new GraphQLNonNull(GraphQLString) },
            TranscriptableCourse:  { type: GraphQLString },
            Year:  { type: new GraphQLNonNull(GraphQLInt) },
            ExcludeCoursesWithoutSections: { type: GraphQLString }
        },
        resolve: (root, args) => Resolvers.CourseSearch(args)
    },
    GetCourse: {
        type: CourseType,
        args: {
            Year: { type: new GraphQLNonNull(GraphQLInt) },
            Quarter: { type: new GraphQLNonNull(GraphQLString) },
            Curriculum: { type: new GraphQLNonNull(GraphQLString) },
            CourseNumber: { type: new GraphQLNonNull(GraphQLInt) },
        },
        resolve: (root, args, {loaders}) => loaders.course.load(CompositeKey(args.Year, args.Quarter, args.Curriculum, args.CourseNumber)).then(res => {
            return Object.assign({}, res, {Key: args})
        })
    },
    GetSection: {
        type: SectionType,
        args: {
            Year: { type: new GraphQLNonNull(GraphQLInt) },
            Quarter: { type: new GraphQLNonNull(GraphQLString) },
            CurriculumAbbr: { type: new GraphQLNonNull(GraphQLString) },
            CourseNumber: { type: new GraphQLNonNull(GraphQLInt) },
            SectionId: { type: new GraphQLNonNull(GraphQLString) },
        },
        resolve: (root, args, {loaders}) => loaders.section.load(CompositeKey(args.Year,args.Quarter,args.CurriculumAbbr,args.CourseNumber + '/' + args.SectionId)).then(res => {
            return Object.assign({}, res, {Key: args})
        })
    },
    SectionSearch: {
        type: SectionSearchType,
        args: {
            Year:  { type: new GraphQLNonNull(GraphQLInt) },
            Quarter: { type: new GraphQLNonNull(GraphQLString) },
            CourseNumber: { type: new GraphQLNonNull(GraphQLInt) },
            CurriculumAbbr: { type: new GraphQLNonNull(GraphQLString) },
            FutureTerms: { type: GraphQLString },
            RegId: { type: GraphQLString },
            SearchBy: { type: GraphQLString },
            IncludeSecondaries: { type: GraphQLString },
            ChangedSinceDate: { type: GraphQLString },
            TranscriptableCourse: { type: GraphQLString },
            PageStart: { type: GraphQLInt },
            PageSize: { type: GraphQLInt },
            FacilityCode: { type: GraphQLString },
            RoomNumber: { type: GraphQLString },
            Sln: { type: GraphQLString },
        },
        resolve: (root, args) => Resolvers.SectionSearch(args)
    }
  })
});

module.exports = new GraphQLSchema({
  query: QueryType, 
});
