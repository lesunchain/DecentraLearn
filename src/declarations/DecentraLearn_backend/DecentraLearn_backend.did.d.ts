import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Course {
  'course_estimated_time_in_hours' : number,
  'course_desc' : string,
  'course_name' : string,
  'course_image_link' : string,
  'course_topics' : Array<string>,
}
export interface CourseEntry { 'course_id' : number, 'course' : Course }
export interface _SERVICE {
  'add_course' : ActorMethod<[Course], number>,
  'edit_course' : ActorMethod<[number, Course], boolean>,
  'get_course' : ActorMethod<[number], [] | [Course]>,
  'get_courses' : ActorMethod<[], Array<CourseEntry>>,
  'greet' : ActorMethod<[string], string>,
  'remove_course' : ActorMethod<[number], boolean>,
  'whoami' : ActorMethod<[], Principal>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
