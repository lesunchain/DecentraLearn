export const idlFactory = ({ IDL }) => {
  const Course = IDL.Record({
    'course_estimated_time_in_hours' : IDL.Nat32,
    'course_desc' : IDL.Text,
    'course_name' : IDL.Text,
    'course_image_link' : IDL.Text,
    'course_topics' : IDL.Vec(IDL.Text),
  });
  const CourseEntry = IDL.Record({
    'course_id' : IDL.Nat32,
    'course' : Course,
  });
  return IDL.Service({
    'add_course' : IDL.Func([Course], [IDL.Nat32], []),
    'edit_course' : IDL.Func([IDL.Nat32, Course], [IDL.Bool], []),
    'get_course' : IDL.Func([IDL.Nat32], [IDL.Opt(Course)], ['query']),
    'get_courses' : IDL.Func([], [IDL.Vec(CourseEntry)], ['query']),
    'greet' : IDL.Func([IDL.Text], [IDL.Text], ['query']),
    'remove_course' : IDL.Func([IDL.Nat32], [IDL.Bool], []),
    'whoami' : IDL.Func([], [IDL.Principal], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
