const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('./utils');

// Course Models
const GeneralEducationRequirementsType = new GraphQLObjectType({
    name: "GeneralEducationReqs",
    description: "Course General Education Requirements",
    fields: () => ({
        Diversity: { type: GraphQLBoolean },
        EnglishComposition: { type: GraphQLBoolean },
        IndividualsAndSocieties: { type: GraphQLBoolean },
        NaturalWorld: { type: GraphQLBoolean },
        QuantitativeAndSymbolicReasoning: { type: GraphQLBoolean },
        VisualLiteraryAndPerformingArts: { type: GraphQLBoolean },
        Writing: { type: GraphQLBoolean },
    })
});
const BaseCourseType = new GraphQLObjectType({
    name: "BaseCourseType",
    description: "Base Course Type",
    fields: () => ({
        Href: { type: GraphQLString },
        Year: { type: GraphQLInt },
        Quarter: { type: GraphQLString },
        CourseTitle: { type: GraphQLString },
        CourseTitleLong: { type: GraphQLString },
        CurriculumAbbreviation: { type: GraphQLString },
        CourseNumber: { type: GraphQLString },
        Sections: {
            type: new GraphQLList(require('./section').BaseSectionType),
            args: {
                PageSize: {type: GraphQLInt},
                PageStart: {type: GraphQLInt},
                SectionId: { type: GraphQLString }
            },
            resolve: (course, args, {loaders}) => 
            { 
                return require('./resolvers').SectionSearch(Object.assign({}, args, {Year: course.Year, Quarter: course.Quarter, CurriculumAbbr: course.CurriculumAbbreviation, CourseNumber: course.CourseNumber}))
                .then(res => res.Sections)
                .then(sections => { 
                    if(args.SectionId) { 
                        return sections.filter(s => s.SectionID == args.SectionId)
                    } 
                    return sections;
                });
            }
        }
    })
});
const CourseType = new GraphQLObjectType({
    name: "CourseType",
    description: "SWS Course Model",
    fields: () => ({
        CourseCampus: { type: GraphQLString },
        CourseCollege: { type: GraphQLString },
        CourseNumber: { type: GraphQLString },
        CourseTitle: { type: GraphQLString },
        CourseDescription: { type: GraphQLString },
        Curriculum: { type: require('./curriculum').CurricType },
        FirstEffectiveTerm: {type: require('./term').BaseTermType},
        GeneralEducationRequirements: { type: GeneralEducationRequirementsType },
        GradingSystem: { type: GraphQLString },
        LastEffectiveTerm: { type: new require('./term').BaseTermType },
        MaximumCredit: { type: GraphQLInt },
        MaximumTermCredit: { type: GraphQLInt },
        Metadata: { type: GraphQLString },
        MinimumTermCredit: { type: GraphQLInt },
        RepositoryTimeStamp: { type: GraphQLString },
        Sections: {
            type: new GraphQLList(require('./section').BaseSectionType),
            args: {
                PageSize: {type: GraphQLInt},
                PageStart: {type: GraphQLInt}
            },
            resolve: (course, args, {loaders}) => 
            { 
                return require('./resolvers').SectionSearch(Object.assign({}, args, {Year: course.Key.Year, Quarter: course.Key.Quarter, CurriculumAbbr: course.Key.Curriculum, CourseNumber: course.Key.CourseNumber}))
                .then(res => res.Sections)
            }
        },
        Section: {
            type: require('./section').SectionType,
            args: {
                SectionId: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (course, args, {loaders}) => 
                loaders.section.load(CompositeKey(course.Key.Year, course.Key.Quarter, course.Key.Curriculum, course.Key.CourseNumber + "/" + args.SectionId))
        }
    })
});

const CourseSearchType = new GraphQLObjectType({
  name: "CourseSearch",
  description: "SWS Course Search",
  fields: () => ({
    Courses: { type: new GraphQLList(BaseCourseType) },
    Current: { type: BaseCourseType },
    Next: { type: BaseCourseType },
    PageSize: { type: GraphQLString },
    PageStart: { type: GraphQLString },
    Previous: { type: BaseCourseType },
    TotalCount: { type: GraphQLInt },
  })
});

module.exports = { CourseType, CourseSearchType, BaseCourseType };