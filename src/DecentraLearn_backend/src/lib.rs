use candid::Principal;
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
    course_name: String,
    course_topics: Vec<String>,
    course_desc: String,
    course_image_link: String,
    course_estimated_time_in_hours: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
struct CourseEntry {
    course_id: u32,
    course: Course,
}

thread_local! {
    static COURSES: RefCell<HashMap<u32, Course>> = RefCell::new(HashMap::new());
    static NEXT_COURSE_ID: RefCell<u32> = RefCell::new(1);
}

// Get all courses
#[ic_cdk::query] 
fn get_courses() -> Vec<CourseEntry> {
    COURSES.with(|courses| {
        courses.borrow()
            .iter()
            .map(|(&id, course)| CourseEntry { course_id: id, course: course.clone() })
            .collect()
    })
}

// Get a course by ID
#[ic_cdk::query]
fn get_course(course_id: u32) -> Option<Course> {
    COURSES.with(|courses| courses.borrow().get(&course_id).cloned())
}

// Add a new course with auto-incrementing course_id
#[ic_cdk::update] 
fn add_course(course: Course) -> u32 {
    NEXT_COURSE_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let course_id = *next_id;  // Assign the next available course_id
        
        COURSES.with(|courses| {
            courses.borrow_mut().insert(course_id, course);
        });

        *next_id += 1;  // Increment for the next course
        course_id  // Return the new course ID
    })
}

#[ic_cdk::update] 
fn edit_course(course_id: u32, updated_course: Course) -> bool {
    COURSES.with(|courses| {
        let mut courses = courses.borrow_mut();
        if courses.contains_key(&course_id) {
            courses.insert(course_id, updated_course);
            return true;
        }
        false
    })
}

// Delete a course
#[ic_cdk::update] 
fn remove_course(course_id: u32) -> bool {
    COURSES.with(|courses| courses.borrow_mut().remove(&course_id).is_some())
}

// Export candid interface
ic_cdk::export_candid!();
