use candid::{CandidType, Deserialize};
use serde::Serialize;

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct Module {
    pub title: String,
    pub description: String,
    pub order: u32,
    pub course_id: u32,
}

#[derive(CandidType, Serialize, Deserialize, Clone, Debug)]
pub struct ModuleEntry {
    pub module_id: u32,
    pub module: Module,
}