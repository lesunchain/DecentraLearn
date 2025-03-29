use std::cell::RefCell;
use std::collections::HashMap;

use crate::models::lesson::Lesson;

thread_local! {
    static LESSONS: RefCell<HashMap<u32, Lesson>> = RefCell::new(HashMap::new());
    static MODULE_LESSONS: RefCell<HashMap<u32, Vec<u32>>> = RefCell::new(HashMap::new());
    static NEXT_LESSON_ID: RefCell<u32> = RefCell::new(1);
}

#[ic_cdk::update]
pub fn add_lesson(module_id: u32, title: String, content: String, order: u32) -> u32 {
    NEXT_LESSON_ID.with(|next| {
        let id = *next.borrow();

        let lesson = Lesson {
            id,
            module_id,
            title,
            content,
            order,
        };

        // Insert into main map
        LESSONS.with(|lessons| {
            lessons.borrow_mut().insert(id, lesson.clone());
        });

        // Map lesson to module
        MODULE_LESSONS.with(|map| {
            map.borrow_mut().entry(module_id).or_default().push(id);
        });

        *next.borrow_mut() += 1;
        id
    })
}

#[ic_cdk::query]
pub fn get_lessons_by_module(module_id: u32) -> Vec<Lesson> {
    let ids = MODULE_LESSONS.with(|map| {
        map.borrow().get(&module_id).cloned().unwrap_or_default()
    });

    let mut lessons = Vec::new();
    LESSONS.with(|lesson_map| {
        for id in ids {
            if let Some(lesson) = lesson_map.borrow().get(&id) {
                lessons.push(lesson.clone());
            }
        }
    });

    lessons.sort_by(|a, b| a.order.cmp(&b.order));
    lessons
}
