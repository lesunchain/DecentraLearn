use candid::Principal;
use ic_cdk_macros::{query, update};
use std::cell::RefCell;
use std::collections::HashMap;
use candid::{CandidType, Deserialize};
use serde::Serialize;

#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::query]
fn whoami() -> Principal {
    ic_cdk::caller()
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct Course {
    course_id: u32,
    course_name: String,
    course_topics: Vec<String>,
    course_desc: String,
    course_image_link: String,
    course_estimated_time_in_hours: u32,
}

thread_local! {
    static COURSES: RefCell<HashMap<u32, Course>> = RefCell::new(HashMap::new());
}

// Get all courses
#[ic_cdk::query] 
fn get_courses(_: ()) -> Vec<Course> {  // Explicit empty argument
    COURSES.with(|courses| courses.borrow().values().cloned().collect())
}

// Get a course by ID
#[ic_cdk::query]
fn get_course(course_id: u32) -> Option<Course> {
    COURSES.with(|courses| courses.borrow().get(&course_id).cloned())
}

// Add a new course
#[ic_cdk::update] 
fn add_course(course: Course) -> () {  // Explicit return type ()
    COURSES.with(|courses| courses.borrow_mut().insert(course.course_id, course));
}

// Edit an existing course
#[ic_cdk::update] 
fn edit_course(course_id: u32, updated_course: Course) -> bool {
    COURSES.with(|courses| {
        let mut courses = courses.borrow_mut();
        if let Some(course) = courses.get_mut(&course_id) {
            *course = updated_course;
            return true;
        }
        false
    })
}

// Delete a course
#[ic_cdk::update] 
fn remove_course(course_id: u32) -> () {  // Explicit return type ()
    COURSES.with(|courses| courses.borrow_mut().remove(&course_id));
}

// Export candid interface
ic_cdk::export_candid!();
