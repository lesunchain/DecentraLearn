use candid::{CandidType, Deserialize};
use candid::Principal;
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub enum Category {
    Technology,
    Business,
    Design,
    Marketing,
    Development,
    Other
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Course {
    pub creator: Principal,
    pub course_name: String,
    pub course_topics: Vec<String>,
    pub course_category: Category,
    pub course_slug: String,
    pub course_desc: String,
    pub course_image_link: String,
    pub course_estimated_time_in_hours: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CourseEntry {
    pub course_id: u32,
    pub course: Course,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CourseInput {
    pub course_name: String,
    pub course_topics: Vec<String>,
    pub course_category: Category,
    pub course_slug: String,
    pub course_desc: String,
    pub course_image_link: String,
    pub course_estimated_time_in_hours: u32,
}
