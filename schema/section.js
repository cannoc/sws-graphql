const { GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLBoolean } = require('graphql');
const { CompositeKey } = require('./utils');

// Section Models
const SectionSearchType = new GraphQLObjectType({
  name: 'SectionSearch',
  description: 'SWS Section Search',
  fields: () => ({
    Sections: { type: new GraphQLList(BaseSectionType)}
  })
});

const SectionType = new GraphQLObjectType({
  name: 'SectionType',
  description: 'SWS Section Model',
  fields: () => ({
    AddCodeRequired: { type: GraphQLBoolean },
    Auditors: { type: GraphQLInt },
    ClassWebsiteUrl: { type: GraphQLString },
    Curriculum: {
      type: require('./curriculum').CurricType
    },
    Course: {
      type: require('./course').BaseCourseType,
      resolve: (section, args, {loaders}) => loaders.course.load(CompositeKey(section.Course.Year, section.Course.Quarter, section.Course.CurriculumAbbreviation, section.Course.CourseNumber))
    },
    CourseTitle: { type: GraphQLString },
    SectionID: { type: GraphQLString },
  })
});

const BaseSectionType = new GraphQLObjectType({
  name: 'BaseSectionType',
  description: 'SWS Section Base',
  fields: () => ({
      Href: { type: GraphQLString },
      CourseNumber: { type: GraphQLInt },
      CurriculumAbbreviation: { type: GraphQLString },
      Quarter: { type: GraphQLString },
      SectionID: { type: GraphQLString },
      Year: { type: GraphQLInt },
      Course: {
        type: require('./course').BaseCourseType,
        resolve: (section, args, {loaders}) => loaders.course.load(CompositeKey(section.Year, section.Quarter, section.CurriculumAbbreviation, section.CourseNumber))
      },
  })
});

module.exports = { SectionSearchType, SectionType, BaseSectionType };