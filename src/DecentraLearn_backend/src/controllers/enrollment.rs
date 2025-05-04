use std::cell::RefCell;
use std::collections::HashMap;
use candid::Principal;
use ic_cdk::caller;
use crate::models::enrollment::{Enrollment, ModuleProgress};

thread_local! {
    static ENROLLMENTS: RefCell<Vec<Enrollment>> = RefCell::new(Vec::new());
}

#[ic_cdk::query]
pub fn get_enrollments() -> Vec<Enrollment> {
    ENROLLMENTS.with(|enrollments| enrollments.borrow().clone())
}

#[ic_cdk::query]
pub fn get_enrollment_count() -> u32 {
    ENROLLMENTS.with(|enrollments| enrollments.borrow().len() as u32)
}

#[ic_cdk::update]
pub fn enroll_student(course_id: u32) -> bool {
    let user_id = caller();
    
    ENROLLMENTS.with(|enrollments| {
        let mut enrollments = enrollments.borrow_mut();
        
        if enrollments.iter().any(|e| e.user_id == user_id && e.course_id == course_id) {
            return false;
        }
        
        let now = ic_cdk::api::time();
        
        let enrollment = Enrollment {
            user_id,
            course_id,
            enrolled_date: now,
            last_accessed_date: now,
            current_module_id: 1,
            modules_progress: Vec::new(),
            completed: false,
        };
        
        enrollments.push(enrollment);
        true
    })
}

#[ic_cdk::query]
pub fn get_course_enrollments(course_id: u32) -> Vec<Enrollment> {
    ENROLLMENTS.with(|enrollments| {
        enrollments.borrow()
            .iter()
            .filter(|e| e.course_id == course_id)
            .cloned()
            .collect()
    })
}