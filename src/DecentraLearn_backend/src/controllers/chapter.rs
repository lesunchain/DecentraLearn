use crate::models::chapter::{Chapter, ChapterEntry};
use std::cell::RefCell;
use std::collections::HashMap;

thread_local! {
    static CHAPTERS: RefCell<HashMap<u32, Chapter>> = RefCell::new(HashMap::new());
    static NEXT_CHAPTER_ID: RefCell<u32> = RefCell::new(1);
}

// 📌 Add a new chapter
#[ic_cdk::update]
pub fn add_chapter(course_id: u32, chapter_name: String, chapter_number: u32, chapter_file_link: String) -> u32 {
    NEXT_CHAPTER_ID.with(|next_id| {
        let mut next_id = next_id.borrow_mut();
        let chapter_id = *next_id;

        let chapter = Chapter {
            course_id,
            chapter_name,
            chapter_number,
            chapter_file_link,
        };

        CHAPTERS.with(|chapters| {
            chapters.borrow_mut().insert(chapter_id, chapter);
        });

        *next_id += 1;
        chapter_id
    })
}

// 📌 Get chapters by course ID
#[ic_cdk::query]
pub fn get_chapters_by_course(course_id: u32) -> Vec<ChapterEntry> {
    CHAPTERS.with(|chapters| {
        chapters.borrow()
            .iter()
            .filter(|(_, chapter)| chapter.course_id == course_id)  // Filter by course_id
            .map(|(&id, chapter)| ChapterEntry { chapter_id: id, chapter: chapter.clone() })
            .collect()
    })
}

// 📌 Get all chapters
#[ic_cdk::query]
pub fn get_chapters() -> Vec<(ChapterEntry)> {
    CHAPTERS.with(|chapters| {
        chapters.borrow()
            .iter()
            .map(|(&id, chapter)| ChapterEntry { chapter_id: id, chapter: chapter.clone() })
            .collect()
    })
}

// 📌 Get a single chapter by ID
#[ic_cdk::query]
pub fn get_chapter(chapter_id: u32) -> Option<Chapter> {
    CHAPTERS.with(|chapters| chapters.borrow().get(&chapter_id).cloned())
}

// 📌 Edit an existing chapter
#[ic_cdk::update]
pub fn edit_chapter(chapter_id: u32, updated_chapter: Chapter) -> bool {
    CHAPTERS.with(|chapters| {
        let mut chapters = chapters.borrow_mut();
        if chapters.contains_key(&chapter_id) {
            chapters.insert(chapter_id, updated_chapter);
            return true;
        }
        false
    })
}

// 📌 Remove a chapter
#[ic_cdk::update]
pub fn remove_chapter(chapter_id: u32) -> bool {
    CHAPTERS.with(|chapters| chapters.borrow_mut().remove(&chapter_id).is_some())
}
