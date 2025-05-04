use std::cell::RefCell;
use std::collections::HashMap;
use crate::models::lesson::{Lesson, LessonEntry};

thread_local! {
    static LESSONS: RefCell<HashMap<u32, Lesson>> = RefCell::new(HashMap::new());
    static NEXT_LESSON_ID: RefCell<u32> = RefCell::new(1);
}

// Get all lessons
#[ic_cdk::query]
pub fn get_lessons() -> Vec<LessonEntry> {
    LESSONS.with(|lessons| {
        lessons.borrow()
            .iter()
            .map(|(&id, lesson)| LessonEntry { lesson_id: id, lesson: lesson.clone() })
            .collect()
    })
}

// Get all lessons for a specific module
#[ic_cdk::query]
pub fn get_module_lessons(module_id: u32) -> Vec<LessonEntry> {
    LESSONS.with(|lessons| {
        lessons.borrow()
            .iter()
            .filter(|(_, lesson)| lesson.module_id == module_id)
            .map(|(&id, lesson)| LessonEntry { lesson_id: id, lesson: lesson.clone() })
            .collect()
    })
}

// Get a specific lesson by ID
#[ic_cdk::query]
pub fn get_lesson(lesson_id: u32) -> Option<Lesson> {
    LESSONS.with(|lessons| lessons.borrow().get(&lesson_id).cloned())
}

// Add a new lesson with auto-incrementing lesson_id
#[ic_cdk::update]
pub fn add_lesson(lesson: Lesson) -> u32 {
    NEXT_LESSON_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let lesson_id = *next_id;
        
        LESSONS.with(|lessons| {
            lessons.borrow_mut().insert(lesson_id, lesson);
        });

        *next_id += 1;
        lesson_id
    })
}

// Edit an existing lesson
#[ic_cdk::update]
pub fn edit_lesson(lesson_id: u32, updated_lesson: Lesson) -> bool {
    LESSONS.with(|lessons| {
        let mut lessons = lessons.borrow_mut();
        if lessons.contains_key(&lesson_id) {
            lessons.insert(lesson_id, updated_lesson);
            return true;
        }
        false
    })
}

// Delete a lesson
#[ic_cdk::update]
pub fn remove_lesson(lesson_id: u32) -> bool {
    LESSONS.with(|lessons| lessons.borrow_mut().remove(&lesson_id).is_some())
}

// Get the number of lessons in a module
#[ic_cdk::query]
pub fn get_lesson_count(module_id: u32) -> u32 {
    LESSONS.with(|lessons| {
        lessons.borrow()
            .iter()
            .filter(|(_, lesson)| lesson.module_id == module_id)
            .count() as u32
    })
}