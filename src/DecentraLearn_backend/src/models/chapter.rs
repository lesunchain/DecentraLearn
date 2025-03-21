use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Chapter {
    pub course_id: u32,          // The course this chapter belongs to
    pub chapter_name: String,    // Name of the chapter
    pub chapter_number: u32,     // Chapter number (e.g., 1, 2, 3...)
    pub chapter_file_link: String,  // URL to chapter file (e.g., PDF, Video)
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ChapterEntry {
    pub chapter_id: u32,
    pub chapter: Chapter,
}