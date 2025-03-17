use std::cell::RefCell;
use std::collections::HashMap;
use crate::models::course::{Course, CourseEntry};

thread_local! {
    static COURSES: RefCell<HashMap<u32, Course>> = RefCell::new(HashMap::new());
    static NEXT_COURSE_ID: RefCell<u32> = RefCell::new(1);
}

// Get all courses
#[ic_cdk::query] 
pub fn get_courses() -> Vec<CourseEntry> {
    COURSES.with(|courses| {
        courses.borrow()
            .iter()
            .map(|(&id, course)| CourseEntry { course_id: id, course: course.clone() })
            .collect()
    })
}

// Get a course by ID
#[ic_cdk::query]
pub fn get_course(course_id: u32) -> Option<Course> {
    COURSES.with(|courses| courses.borrow().get(&course_id).cloned())
}

// Add a new course with auto-incrementing course_id
#[ic_cdk::update] 
pub fn add_course(course: Course) -> u32 {
    NEXT_COURSE_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let course_id = *next_id;
        
        COURSES.with(|courses| {
            courses.borrow_mut().insert(course_id, course);
        });

        *next_id += 1;
        course_id
    })
}

// Edit an existing course (without changing course_id)
#[ic_cdk::update] 
pub fn edit_course(course_id: u32, updated_course: Course) -> bool {
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
pub fn remove_course(course_id: u32) -> bool {
    COURSES.with(|courses| courses.borrow_mut().remove(&course_id).is_some())
}
