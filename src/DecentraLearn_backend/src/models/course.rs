use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum CourseTopic {
    Technology,
    Business,
    Design,
    Marketing,
    Development,
    Other,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Course {
    pub course_name: String,
    pub course_topics: CourseTopic,
    pub course_slug: String,
    pub course_desc: String,
    pub course_image_link: String,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CourseEntry {
    pub course_id: u32,
    pub course: Course,
}
