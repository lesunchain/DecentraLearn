use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Course {
    pub course_name: String,
    pub course_topics: Vec<String>,
    pub course_desc: String,
    pub course_image_link: String,
    pub course_estimated_time_in_hours: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct CourseEntry {
    pub course_id: u32,
    pub course: Course,
}
