use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Lesson {
    pub id: u32,
    pub module_id: u32,
    pub title: String,
    pub content: String,
    pub order: u32,
}
