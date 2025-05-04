use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Lesson {
    pub title: String,
    pub description: String,
    pub pdf_file: String,
    pub module_id: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct LessonEntry {
    pub lesson_id: u32,
    pub lesson: Lesson,
}