use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Module {
    pub id: u32,
    pub title: String,
    pub description: String,
    pub order: u32,
    pub content: String,
    pub course_id: u32,
}